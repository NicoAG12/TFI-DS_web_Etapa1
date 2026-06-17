# Fase 4 - Infraestructura, DevOps y ambientes

## 1. Objetivo

La Fase 4 define como desplegar en la nube la arquitectura evolucionada en Fase 3. El foco ya no esta en modificar la logica funcional del sistema, sino en llevarla a un esquema operable: ambientes separados, despliegues automatizados, contenedores, Kubernetes, Terraform, monitoreo y costos estimados.

El sistema parte de una arquitectura de microservicios orientada a eventos:

- `api-gateway`
- `auth-service`
- `core-service`
- `ventas-service`
- `torneos-service`
- `matchmaking-service`
- `query-service`
- `saga-orchestrator`
- RabbitMQ para comandos y eventos
- Redis/ElastiCache para cache
- PostgreSQL primary + read replicas

La propuesta usa AWS como nube de referencia.

## 2. Ambientes

La separacion de ambientes permite validar cambios de forma progresiva antes de afectar usuarios reales.

| Ambiente | Proposito | Fuente de despliegue | Validaciones principales |
| --- | --- | --- | --- |
| Desarrollo | Trabajo local y sandbox por feature. | `feature/*` | Lint, unit tests, build Docker local. |
| Testing/QA | Validacion funcional automatizada. | `develop` | Unit tests, integration tests, Postman/Newman, migraciones en base de prueba. |
| UAT | Prueba de humo y validacion de stakeholders. | `release/*` | Smoke tests, escenarios de reserva/pago/matchmaking, validacion manual controlada. |
| Produccion | Ambiente vivo con usuarios reales. | `main` + tag versionado | Deploy sin downtime, health checks, rollback, monitoreo y alertas. |

## 3. Estrategia de branching

Se propone GitFlow porque el trabajo se organiza en entregas por fases y ambientes progresivos.

Flujo:

```text
feature/*
  -> develop
  -> release/*
  -> main
```

Relacion con ambientes:

- `feature/*`: desarrollo local.
- `develop`: despliegue automatico a Testing/QA.
- `release/*`: despliegue a UAT.
- `main`: despliegue productivo mediante version/tag.

Justificacion:

- Permite separar trabajo en curso de versiones candidatas.
- Encaja con la existencia de UAT antes de produccion.
- Facilita rollback porque produccion queda asociada a tags.
- Da trazabilidad entre ramas, ambientes y versiones.

## 4. CI/CD con GitHub Actions

La herramienta propuesta es GitHub Actions, porque se integra naturalmente con el repositorio y permite definir workflows por rama.

### Pipeline de CI

Se ejecuta ante Pull Request o push a ramas principales.

Pasos:

1. Checkout del codigo.
2. Instalacion de dependencias.
3. Lint.
4. Unit tests.
5. Integration tests para endpoints y eventos criticos.
6. Build de imagen Docker por servicio.
7. Escaneo basico de vulnerabilidades.
8. Publicacion de imagen en ECR si corresponde.

### Pipeline de CD

El despliegue depende del ambiente:

- `develop`: deploy automatico a QA.
- `release/*`: deploy a UAT con aprobacion manual.
- `main`: deploy a Produccion con aprobacion manual, tag y posibilidad de rollback.

### Gates de calidad

Ningun artefacto deberia avanzar si falla:

- Lint.
- Tests unitarios.
- Tests de integracion.
- Build Docker.
- Validacion de manifiestos Kubernetes.
- Plan de Terraform.

## 5. Docker y Kubernetes

Cada microservicio se empaqueta como una imagen Docker independiente.

Servicios contenerizados:

- `api-gateway`
- `auth-service`
- `core-service`
- `ventas-service`
- `torneos-service`
- `matchmaking-service`
- `query-service`
- `saga-orchestrator`

En Kubernetes, cada servicio se representa con:

- `Deployment`: define replicas, imagen y estrategia de rollout.
- `Service`: expone el servicio dentro del cluster.
- `Ingress`: publica entrada HTTP externa hacia el API Gateway.
- `ConfigMap`: configuracion no sensible.
- `Secret`: credenciales y tokens.
- `HorizontalPodAutoscaler`: auto-scaling por CPU, memoria o metricas.

## 6. Infraestructura AWS propuesta

| Capa | Servicio AWS | Uso |
| --- | --- | --- |
| Entrada | Application Load Balancer | Recibe trafico HTTP/HTTPS y lo dirige al Ingress del cluster. |
| Orquestacion | EKS | Ejecuta los microservicios en Kubernetes. |
| Imagenes | ECR | Guarda imagenes Docker versionadas. |
| Base de datos | RDS PostgreSQL | Primary para escrituras y read replica para consultas. |
| Cache | ElastiCache Redis | Cache de disponibilidad, dashboard, sesiones temporales y matchmaking. |
| Mensajeria | Amazon MQ RabbitMQ | Broker de comandos/eventos y DLQ. |
| Estativos | S3 + CloudFront | Assets del frontend React. |
| Observabilidad | CloudWatch | Logs, metricas, alarmas y dashboards. |
| Seguridad | IAM, Security Groups, Secrets Manager | Permisos, red y secretos. |
| IaC state | S3 + DynamoDB | Remote state y bloqueo de Terraform. |

## 7. Terraform

La infraestructura se define como codigo para que los ambientes sean reproducibles.

Estructura propuesta:

```text
infra/
  modules/
    network/
    eks/
    rds-postgres/
    elasticache-redis/
    rabbitmq/
    observability/
    frontend-static/
  envs/
    dev/
      main.tf
      variables.tf
      terraform.tfvars
      backend.tf
    qa/
    uat/
    prod/
```

Cada ambiente usa los mismos modulos, pero con variables distintas:

- Cantidad de nodos.
- Tamanos de instancia.
- Cantidad de replicas.
- Politicas de backup.
- Retencion de logs.
- Dominio y certificados.

El estado remoto se guarda en S3 y se bloquea con DynamoDB para evitar modificaciones concurrentes.

## 8. Estrategia de despliegue

Para QA y UAT alcanza con rolling updates controlados. Para Produccion se propone:

- Rolling update como estrategia inicial.
- Health checks obligatorios antes de recibir trafico.
- Rollback automatico si fallan readiness/liveness probes.
- Versionado por tags Docker.
- Migraciones de base ejecutadas como job controlado.

En servicios criticos como `api-gateway`, `core-service` y `query-service`, se recomienda mantener al menos dos replicas en Produccion.

## 9. Observabilidad

La operacion necesita visibilidad de logs, metricas y errores.

Metricas clave:

- Latencia del API Gateway.
- Tasa de errores 4xx/5xx.
- CPU y memoria por pod.
- Cantidad de mensajes pendientes en RabbitMQ.
- Consumo de conexiones de PostgreSQL.
- Hit rate de Redis.
- Tiempo de respuesta del Query Service.
- Fallos de saga y mensajes enviados a DLQ.

Alertas recomendadas:

- API Gateway con error rate alto.
- Pods reiniciando constantemente.
- Cola de RabbitMQ acumulando mensajes.
- RDS con CPU o conexiones elevadas.
- Redis sin memoria disponible.
- Fallas repetidas de despliegue.

## 10. Estimacion de costos AWS

Estimacion para un ambiente productivo inicial, con escala moderada y posibilidad de crecer.

| Componente | Servicio AWS | Cantidad | Rol | Costo mensual aprox. |
| --- | --- | --- | --- | --- |
| Load Balancer | ALB | 1 | Entrada HTTP/HTTPS | USD 25 |
| Kubernetes control plane | EKS | 1 cluster | Orquestacion | USD 73 |
| Nodos de aplicacion | EC2 t3.medium | 2 nodos | Pods de microservicios | USD 65 |
| Container registry | ECR | 1 repo por servicio | Imagenes Docker | USD 5 |
| Base primaria | RDS PostgreSQL db.t3.medium | 1 | Escrituras | USD 70 |
| Read replica | RDS PostgreSQL db.t3.medium | 1 | Lecturas | USD 70 |
| Cache | ElastiCache Redis t4g.small | 1 | Cache y datos temporales | USD 30 |
| Broker | Amazon MQ RabbitMQ mq.t3.micro/small | 1 | Comandos, eventos y DLQ | USD 35 |
| Frontend estatico | S3 + CloudFront | 1 | React build y CDN | USD 10 |
| Logs y metricas | CloudWatch | 1 | Observabilidad | USD 25 |
| Backups/storage | S3 + snapshots | Segun uso | Respaldo | USD 15 |
| Terraform state | S3 + DynamoDB | 1 | Estado remoto y lock | USD 5 |
| Total estimado | - | - | - | USD 428 |

Notas:

- Los valores son aproximados y dependen de region, trafico, almacenamiento y modalidad On-Demand/Reserved.
- QA y UAT pueden usar tamanos menores o apagado programado para reducir costos.
- El costo puede bajar usando nodos compartidos, instancias reservadas o ambientes efimeros.

## 11. Justificacion tecnica y de negocio

La infraestructura propuesta acompana el crecimiento del sistema sin sobredimensionarlo desde el inicio.

Desde lo tecnico:

- Kubernetes permite ejecutar microservicios con replicas, health checks y escalado.
- Terraform evita configuracion manual irrepetible.
- GitHub Actions automatiza validaciones y despliegues.
- RDS, Redis y RabbitMQ administrados reducen carga operativa.
- CloudWatch centraliza observabilidad.

Desde el negocio:

- Produccion queda protegida por QA y UAT.
- Los despliegues tienen rollback.
- Las reservas, pagos y matchmaking son menos vulnerables a caidas parciales.
- El costo mensual inicial se mantiene razonable para una escala temprana.
- La arquitectura puede crecer por servicio, sin rehacer todo el sistema.

## 12. Resultado esperado

Al finalizar Fase 4, el proyecto deja de ser solo un diseno de microservicios y pasa a tener una estrategia concreta de operacion cloud:

- Ambientes separados.
- Pipeline CI/CD.
- Imagenes Docker por servicio.
- Kubernetes para orquestacion.
- Terraform para infraestructura reproducible.
- Observabilidad y alertas.
- Costos estimados y justificados.
