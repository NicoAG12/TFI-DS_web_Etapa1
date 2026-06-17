# Fase 3 - Mejora incremental: robustez y escalabilidad

## Objetivo

La Fase 3 propone una mejora incremental sobre la arquitectura de microservicios ya trabajada. El objetivo es explicar como el sistema podria soportar mayor disponibilidad, tolerancia a fallos y crecimiento de carga sin reemplazar por completo la solucion existente.

La mejora se apoya en cuatro estrategias principales:

- Cache con Redis o Memcached.
- Replicacion de bases de datos mediante read replicas.
- Balanceadores de carga.
- Politicas de auto-scaling.

## Arquitectura base

La arquitectura parte de una separacion por servicios de dominio:

| Componente | Responsabilidad |
| --- | --- |
| `api-gateway` | Punto de entrada, ruteo de requests, separacion entre comandos y consultas, WebSocket. |
| `auth-service` | Usuarios, autenticacion y autorizacion. |
| `core-service` | Canchas, clientes, turnos, pagos, cajas y turnos fijos. |
| `ventas-service` | Ventas y productos. |
| `torneos-service` | Administracion de torneos. |
| `matchmaking-service` | Esperas, asignacion de turnos, matchmaking y notificaciones. |
| `query-service` | Lecturas optimizadas y proyecciones. |
| `saga-orchestrator` | Coordinacion de procesos distribuidos y compensaciones. |

Flujo conceptual:

```text
Cliente
  -> Load Balancer
  -> API Gateway
  -> Servicios de dominio
  -> Cache / Broker / Bases de datos
  -> Query Service / Proyecciones
```

## Mejora propuesta para alta disponibilidad

El API Gateway no deberia ejecutarse como una unica instancia. Para mejorar disponibilidad, se propone ubicarlo detras de un balanceador de carga y permitir multiples replicas.

```text
Cliente
  -> Load Balancer
  -> API Gateway instancia A
  -> API Gateway instancia B
  -> API Gateway instancia N
```

Esta decision permite:

- Distribuir trafico entre instancias.
- Evitar que la caida de una instancia deje el sistema inaccesible.
- Escalar horizontalmente el punto de entrada.
- Aplicar health checks para sacar instancias defectuosas del trafico.

Los servicios mas criticos tambien pueden replicarse horizontalmente, especialmente:

- `api-gateway`
- `query-service`
- `core-service`
- `matchmaking-service`

## Cache Redis/Memcached

La capa de cache se incorpora para reducir consultas repetidas y acelerar respuestas frecuentes.

Casos recomendados:

- Disponibilidad de canchas por fecha y hora.
- Turnos del dia.
- Dashboard operativo.
- Datos publicos o semiestaticos de productos/torneos.
- Sesiones, tokens o datos temporales de usuario si el diseño lo requiere.
- Ofertas temporales de matchmaking.

Flujo de lectura con cache:

```text
Cliente
  -> API Gateway
  -> Query Service
  -> Cache
      -> si existe dato: responde
      -> si no existe: consulta replica/base, guarda en cache y responde
```

Beneficios:

- Menor carga sobre la base de datos.
- Menor latencia en consultas frecuentes.
- Mejor respuesta ante picos de trafico.

Precauciones:

- Definir TTL para evitar datos viejos.
- Invalidar cache cuando eventos relevantes modifiquen datos.
- No cachear informacion sensible sin una politica clara.

## Read replicas

Las read replicas permiten separar operaciones de lectura y escritura.

La base primaria queda para comandos y escrituras:

```text
POST /turnos
  -> core-service
  -> base primaria
```

Las consultas frecuentes pueden resolverse desde replicas:

```text
GET /turnos/disponibles
  -> query-service
  -> read replica
```

Beneficios:

- Disminuye la carga sobre la base principal.
- Mejora el rendimiento de consultas.
- Permite escalar lecturas sin afectar escrituras.

Punto a considerar:

- Puede existir una demora breve entre la escritura en la primaria y la lectura en la replica. Esto se maneja como consistencia eventual.

## CQRS y proyecciones

CQRS separa comandos y consultas:

- Comandos: modifican estado.
- Queries: leen datos optimizados.

El `query-service` puede exponer proyecciones como:

- `turnos_del_dia`
- `estado_caja`
- `dashboard`

Estas vistas pueden actualizarse por eventos:

| Evento | Proyeccion afectada |
| --- | --- |
| `turno.creado` | `turnos_del_dia` |
| `turno.cancelado` | `turnos_del_dia` |
| `pago.registrado` | `turnos_del_dia` / `estado_caja` |
| `caja.movimiento` | `estado_caja` |
| `venta.realizada` | `dashboard` |

Esta estrategia mejora la escalabilidad porque evita que cada pantalla tenga que reconstruir informacion desde multiples tablas o servicios.

## Eventos y colas

Los eventos desacoplan servicios y permiten procesar acciones asincronas.

Eventos identificados:

- `usuario.creado`
- `turno.creado`
- `turno.cancelado`
- `pago.registrado`
- `venta.realizada`
- `torneo.creado`
- `matchmaking.activado`
- `matchmaking.aceptado`
- `saga.iniciada`
- `saga.completada`
- `saga.fallida`

Uso en Fase 3:

- Actualizar proyecciones sin bloquear al usuario.
- Enviar notificaciones asincronas.
- Absorber picos de carga con colas.
- Reintentar procesos fallidos.
- Evitar cascadas de llamadas sincronas entre servicios.

## Sagas y tolerancia a fallos

Las sagas coordinan procesos que involucran varios servicios. En lugar de depender de una transaccion unica, cada paso ejecuta una accion local y define una compensacion si algo falla.

Saga de reserva de turno:

| Orden | Paso | Comando | Compensacion |
| --- | --- | --- | --- |
| 1 | Reservar turno | `core.reservarTurno` | `core.liberarTurno` |
| 2 | Registrar pago | `core.registrarPago` | `core.anularPago` |
| 3 | Notificar cliente | `notificaciones.enviar` | Sin compensacion |

Saga de asignacion por matchmaking:

| Orden | Paso | Comando | Compensacion |
| --- | --- | --- | --- |
| 1 | Transferir turno | `core.transferirTurno` | `core.revertirTurno` |
| 2 | Marcar espera aceptada | `matchmaking.marcarEsperaAceptada` | `matchmaking.devolverEspera` |
| 3 | Notificar ganador | `notificaciones.notificarGanador` | Sin compensacion |
| 4 | Notificar perdedor | `notificaciones.notificarPerdedor` | Sin compensacion |

Beneficios:

- Evita estados inconsistentes ante fallos parciales.
- Permite compensar operaciones ya ejecutadas.
- Mejora la resiliencia de procesos distribuidos.

## Circuit Breaker, timeouts y retries

Para evitar fallos en cascada, los servicios deberian incorporar:

- Timeouts para no esperar indefinidamente.
- Retries controlados para fallos transitorios.
- Circuit Breaker para cortar temporalmente llamadas a servicios degradados.
- Fallbacks cuando una consulta pueda responderse desde cache o proyeccion.

Ejemplo:

```text
API Gateway
  -> core-service no responde
  -> Circuit Breaker abre circuito
  -> se evita saturar core-service
  -> se responde error controlado o dato cacheado si aplica
```

## Auto-scaling

El auto-scaling permite aumentar o reducir instancias segun demanda.

Criterios posibles:

- CPU.
- Memoria.
- Cantidad de requests.
- Latencia promedio.
- Largo de cola de mensajes.
- Cantidad de conexiones WebSocket.

Servicios candidatos:

| Servicio | Motivo |
| --- | --- |
| `api-gateway` | Recibe todo el trafico externo. |
| `query-service` | Atiende lecturas frecuentes y dashboards. |
| `core-service` | Concentra turnos, pagos, cajas y canchas. |
| `matchmaking-service` | Puede tener picos por ofertas y aceptaciones. |
| Workers de eventos | Pueden crecer segun largo de cola. |

## Resultado esperado

Con estas mejoras, la arquitectura queda mejor preparada para:

- Soportar mayor volumen de usuarios.
- Reducir latencia en consultas frecuentes.
- Evitar que una instancia unica sea punto critico de falla.
- Mantener procesos distribuidos consistentes mediante sagas.
- Absorber picos de trafico con colas, cache y replicas.
- Escalar horizontalmente los servicios mas demandados.

## Resumen final

La Fase 3 no cambia el dominio funcional del sistema. Mejora su comportamiento operativo.

La arquitectura pasa de estar solamente separada por microservicios a estar preparada para crecer:

- Entrada balanceada.
- Servicios replicables.
- Lecturas optimizadas con cache, CQRS y read replicas.
- Procesos asincronicos con eventos.
- Tolerancia a fallos con sagas y circuit breakers.
- Escalado automatico segun demanda.
