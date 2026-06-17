# Fase 3 - Mejora incremental: robustez y escalabilidad

Esta carpeta contiene la entrega de Fase 3 organizada de forma compacta. El objetivo es explicar como evolucionaria la arquitectura de microservicios para soportar alta disponibilidad, tolerancia a fallos y crecimiento de carga.

## Objetivo de la fase

**Fase 3: Mejora Incremental (Robustez y Escalabilidad)**

Optimizar el sistema explicando como cambiaria la arquitectura de microservicios para soportar alta disponibilidad y tolerancia a fallos a gran escala.

Estrategias principales:

- Capas de cache con Redis o Memcached.
- Replicacion de bases de datos mediante read replicas.
- Balanceadores de carga delante de servicios criticos.
- Politicas de auto-scaling para aumentar o reducir instancias segun demanda.

## Entrega

La informacion importante quedo consolidada dentro de:

```text
Etapa3/entregables/documentacion/resumen-fase3.md
```

Ese archivo resume:

- Arquitectura base de microservicios.
- Mejora propuesta para alta disponibilidad.
- Cache Redis/Memcached.
- Read replicas.
- CQRS y proyecciones.
- Eventos y colas.
- Sagas y tolerancia a fallos.
- Circuit Breaker, timeouts y retries.
- Auto-scaling.
- Resultado esperado de la mejora incremental.

## Estructura final

```text
Etapa3/
  README.md
  00-resumen/
  entregables/
    documentacion/
      resumen-fase3.md
    diagramas/
    documentos/
```

## Archivos de apoyo

- `entregables/diagramas/`: version final editable del diagrama de arquitectura.
- `entregables/documentos/`: PDF resumido e imagen principal de arquitectura/robustez.
- `00-resumen/`: notas internas sobre el estado de la rama.
