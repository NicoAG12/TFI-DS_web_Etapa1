# Apps IA - Fase 5

Esta carpeta muestra la arquitectura logica de la extension con IA.

Servicios agregados:

- `ai-assistant-service`: endpoint para consultas en lenguaje natural. Coordina busqueda vectorial, prompt con contexto y respuesta LLM.
- `embedding-worker`: worker asincronico que escucha eventos de RabbitMQ y mantiene sincronizado el indice vectorial.
- `notification-ai-worker`: worker asincronico que genera notificaciones personalizadas para matchmaking con fallback a plantilla estatica.

Estos servicios no reemplazan a `core-service`, `matchmaking-service` ni `query-service`; se integran a ellos por eventos y HTTP interno.

