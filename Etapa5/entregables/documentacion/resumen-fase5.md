# Fase 5 - Extension de proxima generacion: integracion con IA

## 1. Objetivo

La Fase 5 pide elevar la arquitectura incorporando inteligencia artificial. El enunciado permite dos caminos:

- Consumo de APIs LLM para clasificacion, resumen o agentes.
- Arquitectura RAG con base vectorial, embeddings e ingesta de datos propios.

Para este proyecto se recomienda usar **RAG como arquitectura principal** y **LLM API como soporte para notificaciones personalizadas**. Esta decision mantiene la coherencia con el sistema real: reservas de canchas, partidos incompletos, matchmaking, torneos, pagos y dashboard operativo.

## 2. Decision arquitectonica

La IA no reemplaza la arquitectura existente. Se agrega como una extension desacoplada:

- `ai-assistant-service`: recibe consultas en lenguaje natural y coordina recuperacion + generacion.
- `embedding-worker`: escucha eventos del broker y mantiene actualizado el indice vectorial.
- `notification-ai-worker`: personaliza mensajes de matchmaking de forma asincronica.
- Base vectorial: Pinecone en produccion administrada, o Chroma/Milvus para laboratorio o despliegue autogestionado.
- API LLM externa: proveedor configurable mediante secretos y variables de entorno.

El criterio principal es evitar que una llamada a IA bloquee operaciones criticas como reservar un turno, registrar un pago o liberar una cancha.

## 3. Caso de uso principal: asistente RAG de partidos y turnos

El usuario puede consultar:

```text
Quiero jugar un partido competitivo hoy a la noche cerca del centro.
```

Flujo:

1. El frontend envia la consulta al `api-gateway`.
2. El `api-gateway` deriva la consulta al `ai-assistant-service`.
3. El servicio normaliza la consulta, aplica controles de seguridad y genera una busqueda semantica.
4. La base vectorial recupera partidos incompletos, turnos disponibles o torneos relevantes.
5. El `ai-assistant-service` arma un prompt con contexto acotado.
6. El LLM responde con una explicacion en lenguaje natural.
7. La respuesta incluye opciones concretas, pero no confirma reservas sin accion explicita del usuario.

Este flujo permite que la IA ayude a decidir, pero no tome decisiones transaccionales por cuenta propia.

## 4. Ingesta y sincronizacion del indice vectorial

La arquitectura Event-Driven de Fase 2B facilita mantener el indice actualizado.

Eventos fuente:

- `turno.creado`
- `turno.cancelado`
- `cancha.actualizada`
- `matchmaking.activado`
- `matchmaking.aceptado`
- `matchmaking.expirado`
- `torneo.creado`
- `torneo.actualizado`

Flujo de ingesta:

1. Un servicio de dominio publica un evento en RabbitMQ.
2. El `embedding-worker` consume el evento.
3. El worker construye un documento textual breve con metadatos estructurados.
4. Se genera el embedding con un proveedor de embeddings.
5. Se hace `upsert` en la base vectorial usando una clave idempotente.
6. Si el registro deja de estar disponible, se elimina o marca como inactivo.

Metadatos recomendados:

- `tipo`: turno, partido, torneo, cancha.
- `sede` o ubicacion.
- `fecha` y franja horaria.
- `nivel_competitivo`.
- `jugadores_faltantes`.
- `estado`.
- `precio`.
- `servicio_origen`.
- `updated_at`.

La busqueda semantica debe combinar similitud vectorial con filtros por metadata. Por ejemplo: fecha de hoy, sede cercana, estado activo y nivel competitivo.

## 5. Opcion LLM: notificaciones personalizadas

El borrador del Word propone que Matchmaking llame al LLM para redactar notificaciones. La idea es valida, pero debe ejecutarse asincronicamente.

Flujo recomendado:

1. `matchmaking-service` detecta un candidato para completar partido.
2. Publica `notificacion.personalizar.solicitada`.
3. `notification-ai-worker` consume el evento.
4. Construye un prompt minimo con datos no sensibles.
5. Llama al LLM con timeout corto.
6. Si responde bien, publica `notificacion.generada`.
7. Si falla, usa una plantilla estatica y envia el mensaje igual.

De esta forma, la experiencia mejora cuando la IA esta disponible, pero el negocio no se detiene si el proveedor externo falla.

## 6. Asincronismo, timeouts y fallbacks

La IA debe tratarse como una dependencia externa no deterministica.

Controles obligatorios:

- Timeouts estrictos: 2 a 5 segundos para notificaciones, algo mas flexible para consultas conversacionales.
- Reintentos limitados con backoff exponencial.
- DLQ para eventos que no pudieron procesarse.
- Idempotency key por evento para evitar duplicar notificaciones.
- Rate limiting por usuario y por servicio.
- Circuit breaker para abrir el circuito ante fallas repetidas del proveedor.
- Fallback a respuesta estatica o mensaje de "no pude generar una recomendacion ahora".

Las reservas, pagos y liberacion de turnos deben seguir funcionando sin IA.

## 7. Seguridad, privacidad y control de calidad

Riesgos principales:

- Envio innecesario de datos personales al proveedor LLM.
- Prompt injection en consultas del usuario.
- Respuestas inventadas o no fundamentadas en datos reales.
- Costos variables por tokens.
- Dependencia de un proveedor externo.

Mitigaciones:

- Minimizar PII: enviar edad/rango/nivel/preferencias solo si son necesarias.
- No enviar passwords, JWT, datos de pago ni informacion sensible de caja.
- Usar prompts con instrucciones de no inventar disponibilidad.
- Exigir que la respuesta cite ids internos o candidatos recuperados.
- Validar salida con esquema estructurado cuando haya acciones posteriores.
- Auditar prompts, respuestas, latencia y costo por request.
- Guardar claves en Secrets Manager o Kubernetes Secrets, nunca en codigo.

## 8. Infraestructura necesaria

Sobre Fase 4/4B se agregan:

| Componente | Funcion | Despliegue sugerido |
| --- | --- | --- |
| `ai-assistant-service` | Orquesta consulta RAG y respuesta LLM | Kubernetes Deployment |
| `embedding-worker` | Sincroniza indice vectorial desde eventos | Kubernetes Deployment/Worker |
| `notification-ai-worker` | Genera notificaciones personalizadas | Kubernetes Deployment/Worker |
| Base vectorial | Busqueda semantica | Pinecone administrado o Chroma/Milvus |
| Secretos IA | API keys y configuracion de proveedor | AWS Secrets Manager/K8s Secret |
| Observabilidad IA | Latencia, errores, tokens, costo, DLQ | CloudWatch/Grafana |

En ambiente local se puede usar Chroma o Milvus via Docker Compose. En produccion AWS se puede usar Pinecone administrado para reducir operacion, o un servicio vectorial autogestionado si el costo manda.

## 9. Observabilidad especifica de IA

Metricas recomendadas:

- Latencia p50/p95 de llamadas LLM.
- Errores por proveedor y por modelo.
- Cantidad de tokens de entrada/salida.
- Costo estimado por dia y por caso de uso.
- Tasa de fallback a plantilla estatica.
- Mensajes en DLQ de `embedding-worker` y `notification-ai-worker`.
- Recall de busqueda: cantidad de resultados relevantes recuperados.
- Porcentaje de respuestas sin candidatos validos.

Estas metricas conectan la decision tecnica con la defensa de negocio: la IA debe aportar conversion, velocidad o satisfaccion, no solo complejidad.

## 10. Justificacion tecnica y de negocio

Desde lo tecnico:

- Aprovecha RabbitMQ y eventos existentes.
- Mantiene el core transaccional separado de la IA.
- Encaja con Kubernetes, Terraform y secretos de Fase 4.
- Usa una base vectorial para consultar datos propios y reducir respuestas inventadas.
- Permite escalar workers de IA segun cola, no segun trafico general.

Desde el negocio:

- Mejora la experiencia de usuarios que no saben que turno o partido elegir.
- Aumenta conversion en partidos incompletos con recomendaciones mas claras.
- Personaliza notificaciones sin bloquear reservas ni pagos.
- Controla costos con colas, rate limits, cache y fallback.
- Permite incorporar IA gradualmente sin reescribir el sistema.

## 11. Resultado esperado

La arquitectura final queda como un sistema Event-Driven cloud-ready, enriquecido con IA de forma responsable:

- RAG para busqueda y asistencia conversacional sobre datos propios.
- LLM API para personalizacion de mensajes no criticos.
- Ingesta vectorial sincronizada por eventos.
- Timeouts, rate limits, fallback, DLQ y observabilidad.
- Separacion clara entre decision asistida por IA y transacciones reales del sistema.

## 12. Fuentes tecnicas de apoyo

- Enunciado del TFI: Fase 5 pide APIs LLM o arquitectura RAG con base vectorial, embeddings e ingesta de datos.
- OpenAI API - Embeddings: los embeddings son vectores numericos que pueden almacenarse en una base vectorial para busqueda, clasificacion y recomendacion.
  <https://developers.openai.com/api/docs/guides/embeddings>
- OpenAI API - Retrieval: la busqueda semantica permite recuperar resultados relevantes aunque no coincidan exactamente las palabras clave, y se apoya en vector stores.
  <https://developers.openai.com/api/docs/guides/retrieval>
- OpenAI API - Rate limits: las APIs LLM tienen limites por requests/tokens y conviene manejar rate limiting, colas, backoff y control de costos.
  <https://developers.openai.com/api/docs/guides/rate-limits>
