# Fase 5 - Extension de proxima generacion: integracion con IA

Esta carpeta contiene la revision y propuesta de Fase 5 para el sistema de gestion de canchas, reservas, pagos, torneos y matchmaking.

La Fase 5 parte de las decisiones ya tomadas en las fases anteriores:

- Fase 1: monolito modular MVC con NestJS, PostgreSQL y React.
- Fase 2A: separacion por microservicios de dominio.
- Fase 2B: evolucion Event-Driven con RabbitMQ, API Gateway, Saga Orchestrator y Query Service.
- Fase 3: robustez con Redis, read replicas, load balancing, auto-scaling, timeouts, retries y DLQ.
- Fase 4/4B: despliegue con Docker, Kubernetes, Terraform, ambientes separados, GitFlow y propuesta AWS/Hetzner.

## Decision recomendada

Para la entrega conviene defender una **arquitectura RAG como opcion principal**, complementada por llamadas LLM para notificaciones personalizadas.

Motivo: el sistema ya tiene matchmaking, eventos y datos propios del negocio. Por eso la IA aporta mas valor si busca partidos, turnos y preferencias reales de la plataforma, en lugar de generar texto generico sin contexto.

## Entregables

- `entregables/documentacion/resumen-fase5.md`: propuesta tecnica completa.
- `entregables/documentacion/revision-documento-word.md`: revision critica del borrador recibido.
- `entregables/documentacion/guia-defensa-fase5.md`: guion breve para defensa oral.
- `entregables/documentacion/checklist-fase5.md`: control final antes de integrar al informe.
- `entregables/diagramas/fase5_arquitectura_ia_rag.mmd`: diagrama editable del flujo IA/RAG.

