# Revision del borrador Word para Fase 5

## Lo que esta bien encaminado

- La Fase 5 esta conectada con el dominio real del proyecto: canchas, turnos, jugadores y matchmaking.
- Incluye las dos alternativas pedidas por el enunciado: APIs LLM y RAG.
- Reconoce que las llamadas LLM pueden demorar y propone asincronismo, timeout, fallback y rate limiting.
- Usa el evento `partido.actualizado` como disparador de ingesta vectorial, lo cual es coherente con la arquitectura Event-Driven.

## Problemas a corregir

1. La seccion presenta Opcion A y Opcion B como ideas separadas, pero no toma una decision arquitectonica clara.
2. El LLM queda acoplado al `matchmaking-service`; conviene moverlo a workers o a un `ai-assistant-service` para no bloquear el dominio.
3. Falta explicar que reservas, pagos y liberacion de turnos no dependen de IA.
4. Falta un flujo completo de ingesta: eventos, worker, embedding, upsert vectorial, metadatos y eliminacion de datos vencidos.
5. Falta un flujo completo de consulta RAG: usuario, API Gateway, servicio IA, busqueda vectorial, prompt con contexto, respuesta y confirmacion manual.
6. No aparece una politica de privacidad: que datos se pueden enviar al proveedor LLM y cuales no.
7. No se explica como evitar alucinaciones: respuesta limitada a candidatos recuperados, ids internos y validacion de salida.
8. El costo de base vectorial aparece en tabla de Fase 4, pero deberia justificarse como agregado de Fase 5.
9. Conviene evitar atar la defensa a un modelo puntual como si fuera una decision permanente. Es mejor decir "proveedor LLM configurable" y nombrar ejemplos.
10. Falta un diagrama de arquitectura que muestre asincronismo, embeddings e ingesta de datos.

## Recomendacion de reescritura

La Fase 5 deberia defender una decision principal:

```text
Se adopta una arquitectura RAG para que el sistema pueda responder consultas de jugadores usando datos propios de partidos, turnos, sedes, torneos y preferencias. Las APIs LLM se usan ademas para redactar notificaciones personalizadas, pero siempre de forma asincronica y con fallback.
```

Esta frase deja claro que:

- Se cumple el enunciado.
- No se abandona lo construido de Fase 1 a Fase 4B.
- La IA entra como extension, no como reemplazo del sistema.
- La arquitectura sigue siendo defendible ante un CTO.

## Como integrarla al documento final

Ubicar la Fase 5 despues de costos de Fase 4 y antes de conclusiones finales.

Estructura sugerida:

1. Contexto de negocio.
2. Decision: RAG principal + LLM para notificaciones.
3. Diagrama de arquitectura.
4. Flujo de consulta conversacional.
5. Flujo de ingesta vectorial.
6. Asincronismo, timeouts y fallbacks.
7. Seguridad, privacidad y costos.
8. Justificacion tecnica y de negocio.

