# Guia de defensa - Fase 4

## Idea central

La Fase 4 responde como llevar a produccion la arquitectura de Fase 3. No agrega funcionalidades nuevas al negocio: agrega infraestructura, ambientes, automatizacion, operacion y control de costos.

## Apertura sugerida

"En la Fase 3 dejamos la arquitectura preparada para escalar: API Gateway, microservicios, RabbitMQ, Redis, read replicas, sagas y auto-scaling. En Fase 4 damos el siguiente paso: definimos como desplegar eso en la nube de forma controlada, con ambientes separados, CI/CD, Kubernetes, Terraform, monitoreo y una estimacion de costos."

## Puntos que conviene defender

### 1. Separacion de ambientes

- Desarrollo para trabajo local y features.
- QA para pruebas automaticas.
- UAT para validacion previa con stakeholders.
- Produccion para usuarios reales.

Frase util:

"La separacion reduce riesgo: ningun cambio llega a produccion sin pasar por validaciones tecnicas y funcionales."

### 2. Branching

Se eligio GitFlow:

- `feature/*` para desarrollo.
- `develop` para QA.
- `release/*` para UAT.
- `main` para produccion.

Frase util:

"GitFlow encaja con el esquema de ambientes porque permite tener ramas candidatas antes de promover a produccion."

### 3. CI/CD

Herramienta: GitHub Actions.

Gates:

- Lint.
- Unit tests.
- Integration tests.
- Build Docker.
- Escaneo basico.
- Terraform plan.
- Aprobacion manual para UAT y Produccion.

Frase util:

"El pipeline no solo despliega: funciona como filtro de calidad."

### 4. Docker y Kubernetes

Cada servicio se empaqueta como Docker image y se ejecuta en EKS.

Kubernetes aporta:

- Replicas.
- Rolling updates.
- Health checks.
- Services internos.
- Ingress.
- Auto-scaling.

Frase util:

"Kubernetes es coherente con la arquitectura porque el sistema ya esta separado en servicios independientes."

### 5. Terraform

Terraform define la infraestructura como codigo.

Beneficios:

- Reproducibilidad.
- Auditoria.
- Versionado.
- Separacion por ambientes.
- Menos configuracion manual.

Frase util:

"Terraform permite que QA, UAT y Produccion tengan la misma estructura base, cambiando solo variables de escala y seguridad."

### 6. Costos

Costo estimado de produccion inicial: alrededor de USD 428 mensuales.

Componentes principales:

- EKS.
- EC2 nodes.
- RDS primary + read replica.
- ElastiCache Redis.
- Amazon MQ RabbitMQ.
- ALB.
- CloudWatch.
- S3/CloudFront.

Frase util:

"La estimacion no busca ser exacta al centavo; busca justificar ordenes de magnitud y mostrar que la arquitectura puede crecer de forma progresiva."

## Preguntas probables

### Por que AWS?

Porque ofrece servicios administrados alineados a la arquitectura: EKS, RDS PostgreSQL, ElastiCache Redis, Amazon MQ, ECR, S3, CloudFront y CloudWatch.

### Por que Kubernetes y no EC2 directo?

Porque el proyecto ya evoluciono a microservicios. Kubernetes permite replicas, rolling updates, health checks, service discovery y auto-scaling por servicio.

### Por que GitFlow?

Porque el enunciado pide ambientes separados y UAT. GitFlow ayuda a mapear ramas con ambientes y a controlar la promocion de cambios.

### Que se despliega primero?

Primero infraestructura base con Terraform: red, cluster, base, cache y broker. Luego imagenes Docker en ECR. Por ultimo manifiestos Kubernetes por servicio.

### Que pasa si falla un deploy?

Kubernetes evita enviar trafico a pods que no pasan readiness probes. Si falla el rollout, se revierte a la version anterior.

## Cierre sugerido

"Con Fase 4, el proyecto pasa de tener una arquitectura escalable en papel a tener una estrategia concreta para operarla en cloud. La propuesta cubre ambientes, automatizacion, contenedores, Kubernetes, Terraform, observabilidad y costos; es decir, los elementos necesarios para que el sistema pueda crecer sin perder control operativo."
