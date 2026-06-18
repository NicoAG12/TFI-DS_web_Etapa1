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

## Aclaracion sobre arquitectura e infraestructura

Las fases anteriores no se modifican. La Fase 4/4B ya dejo definida la infraestructura base: Docker, Kubernetes, Terraform, ambientes, RabbitMQ, Redis y PostgreSQL.

La Fase 5 no rehace esa infraestructura. Lo que cambia es la **arquitectura de aplicacion**: se agrega un servicio nuevo dentro del cluster Kubernetes para IA/RAG y se suman workers de soporte para embeddings y notificaciones personalizadas.

En terminos simples:

- Infraestructura base: queda como en `Etapa4-B`.
- Arquitectura Fase 5: agrega `ai-assistant-service` dentro de Kubernetes.
- Soporte asincronico: agrega `embedding-worker` y `notification-ai-worker`.
- Datos IA: agrega una base vectorial o endpoint vectorial.

## Entregables

- `apps/`: esqueleto de servicios IA agregados a la arquitectura.
- `k8s/`: manifests Kubernetes para mostrar como se desplegarian las piezas IA.
- `terraform/`: modulos conceptuales de infraestructura IA.
- `docker-compose.yml`: composicion local de referencia para la extension IA.
- `entregables/documentacion/resumen-fase5.md`: propuesta tecnica completa.
- `entregables/documentacion/revision-documento-word.md`: revision critica del borrador recibido.
- `entregables/documentacion/guia-defensa-fase5.md`: guion breve para defensa oral.
- `entregables/documentacion/checklist-fase5.md`: control final antes de integrar al informe.
- `entregables/diagramas/fase5_arquitectura_ia_rag.mmd`: diagrama editable del flujo IA/RAG.
- `entregables/diagramas/fase5_kubernetes_extension_ia.mmd`: diagrama editable del nuevo servicio dentro de Kubernetes.

## Corte de carpetas de arquitectura

```text
Etapa5/
  apps/
    ai-assistant-service/       # Orquesta consulta RAG + respuesta LLM
    embedding-worker/           # Escucha eventos y actualiza la base vectorial
    notification-ai-worker/      # Personaliza notificaciones sin bloquear matchmaking
  k8s/
    ai-assistant-service/
    embedding-worker/
    notification-ai-worker/
    vector-db/
  terraform/
    aws/
      modules/
        vector-db/
        ai-secrets/
        ai-observability/
```

Este esqueleto no reemplaza la infraestructura de `Etapa4-B`; la extiende. La arquitectura nueva vive en `apps/` y la infraestructura de soporte se muestra en `k8s/` y `terraform/`.
