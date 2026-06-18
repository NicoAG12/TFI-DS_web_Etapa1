# Fase 4 - Infraestructura, DevOps y ambientes

Esta carpeta contiene una version de trabajo de la Fase 4. La idea es reemplazar la version generada por IA por una propuesta alineada al proyecto real: sistema de gestion de canchas, reservas, pagos, ventas, torneos y matchmaking.

## Objetivo de la fase

Disenar la infraestructura necesaria para desplegar la arquitectura de Fase 3 en la nube, contemplando:

- Separacion de ambientes: Desarrollo, Testing/QA, UAT y Produccion.
- Estrategia de branching y relacion con ambientes.
- Automatizacion CI/CD.
- Contenedores Docker y orquestacion Kubernetes.
- Infraestructura como Codigo con Terraform.
- Estimacion de costos cloud.

## Estructura

```text
Etapa4/
  README.md
  fuentes/
  entregables/
    documentacion/
    diagramas/
    documentos/
    renderizados/
```

## Entregables principales

- `entregables/documentacion/resumen-fase4.md`: desarrollo tecnico completo.
- `entregables/documentacion/guia-defensa-fase4.md`: guion para defender la fase oralmente.
- `entregables/documentacion/checklist-fase4.md`: checklist de revision antes de entregar.
- `entregables/diagramas/fase4_infraestructura_aws.mmd`: diagrama de infraestructura.
- `entregables/diagramas/fase4_infraestructura_aws.drawio`: version editable en draw.io del diagrama de infraestructura.
- `entregables/diagramas/fase4_pipeline_ci_cd.mmd`: diagrama del pipeline CI/CD.
- `entregables/diagramas/fase4_pipeline_ci_cd.drawio`: version editable en draw.io del pipeline CI/CD.
- `entregables/documentos/TFI_ArquitecturaWeb_Fase4.docx`: documento Word final.

## Criterio usado

La Fase 4 toma como punto de partida la arquitectura de Fase 3:

- API Gateway escalable.
- Microservicios por dominio.
- RabbitMQ como broker de comandos/eventos.
- Saga Orchestrator para compensaciones.
- Query Service y proyecciones.
- Redis/ElastiCache para cache.
- PostgreSQL primary + read replicas.
- Load Balancer, health checks y auto-scaling.

Sobre esa base se propone una infraestructura AWS con EKS, RDS, ElastiCache, Amazon MQ/RabbitMQ, ECR, S3/CloudFront, CloudWatch y Terraform.
