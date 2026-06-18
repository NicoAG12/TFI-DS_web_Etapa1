# Etapa4-B: Infraestructura, DevOps y Ambientes

> De la arquitectura de microservicios con eventos (Etapa2-pasoB + Fase3) a una infraestructura operable en la nube con CI/CD, Kubernetes y Terraform.

---

## Índice

1. [¿Qué es esta carpeta?](#1-qué-es-esta-carpeta)
2. [Arquitectura de microservicios](#2-arquitectura-de-microservicios)
3. [Hetzner vs AWS: ¿por qué dos propuestas?](#3-hetzner-vs-aws-por-qué-dos-propuestas)
4. [¿Por qué en Hetzner hay que hacer más cosas a mano?](#4-por-qué-en-hetzner-hay-que-hacer-más-cosas-a-mano)
5. [Estructura de ambientes](#5-estructura-de-ambientes)
6. [Estrategia de Branching (GitFlow)](#6-estrategia-de-branching-gitflow)
7. [CI/CD con GitHub Actions](#7-cicd-con-github-actions)
8. [Docker y Docker Compose](#8-docker-y-docker-compose)
9. [Kubernetes](#9-kubernetes)
10. [Terraform: Hetzner vs AWS](#10-terraform-hetzner-vs-aws)
11. [Resiliencia: ¿qué pasa si algo falla?](#11-resiliencia-qué-pasa-si-algo-falla)
12. [Tabla de costos](#12-tabla-de-costos)
13. [Estructura del directorio](#13-estructura-del-directorio)

---

## 1. ¿Qué es esta carpeta?

`Etapa4-B/` contiene el **código completo de los 8 microservicios** de la Etapa2-pasoB más toda la **infraestructura necesaria para desplegarlos** en dos escenarios:

| Escenario | Proveedor | Costo | Complejidad |
|---|---|---|---|
| **Económico** | Hetzner (VPS) | ~€37/mes | Media (configurás más cosas a mano) |
| **Empresarial** | AWS (servicios gestionados) | ~$428/mes | Baja (AWS administra las piezas por vos) |

Ambos escenarios usan **las mismas herramientas**: Docker, Kubernetes, Terraform y GitHub Actions. Lo que cambia es **dónde** corren y **quién** se encarga de mantener cada pieza.

---

## 2. Arquitectura de microservicios

El sistema se compone de **8 microservicios** que se comunican por RabbitMQ (comandos/eventos) y exponen HTTP REST (vía API Gateway):

```
                     ┌─────────────┐
  Usuario ──────────→│ api-gateway  │  ← Punto de entrada único
                     │  (port 3000) │     WebSocket, Circuit Breaker
                     └──────┬───────┘
                            │
          ┌─────────┬───────┼───────┬─────────┬──────────┐
          ▼         ▼       ▼       ▼         ▼          ▼
    ┌──────────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────────┐
    │  auth    │ │ core │ │ventas│ │torneos│ │match │ │  saga    │
    │ (4201)   │ │(4202)│ │(4203)│ │(4204) │ │making│ │orchestr. │
    └──────────┘ └──────┘ └──────┘ └──────┘ │(4205)│ │  (4301)  │
          │         │       │       │       └──────┘ └──────────┘
          │         │       │       │            │          │
          └─────────┴───────┴───────┴─────┬──────┘          │
                                          ▼                 ▼
                                  ┌──────────────┐  ┌──────────────┐
                                  │  RabbitMQ    │  │  query-svc   │
                                  │  (broker)    │←─│   (4302)     │
                                  └──────────────┘  │  CQRS +      │
                                          ▲          │  proyecciones│
                                          │          └──────┬───────┘
                              ┌───────────┴───────┐         │
                              ▼                   ▼         ▼
                        ┌──────────┐       ┌──────────┐ ┌──────────┐
                        │PostgreSQL│       │  Redis   │ │PostgreSQL│
                        │ Primary  │       │ (cache)  │ │  Read    │
                        └──────────┘       └──────────┘ │ Replica  │
                                                         └──────────┘
```

| Servicio | Puerto | ¿Qué hace? | ¿Usa DB? | ¿Usa Cache? | ¿Usa Broker? |
|---|---|---|---|---|---|
| `api-gateway` | 3000 | Punto de entrada, rutea comandos/queries, WebSocket, Circuit Breaker | Sí | No | Sí |
| `auth-service` | 4201 | Autenticación JWT, gestión de usuarios | Sí | No | Sí |
| `core-service` | 4202 | Canchas, turnos, pagos, cajas, clientes | Sí | No | Sí |
| `ventas-service` | 4203 | Ventas y productos | Sí | No | Sí |
| `torneos-service` | 4204 | Torneos e inscripciones | Sí | No | Sí |
| `matchmaking-service` | 4205 | Esperas, matchmaking, notificaciones | Sí | Sí | Sí |
| `query-service` | 4302 | Lecturas optimizadas (CQRS), proyecciones, dashboard | Sí | Sí | Sí |
| `saga-orchestrator` | 4301 | Coordinación de procesos distribuidos y compensaciones | Sí | No | Sí |

---

## 3. Hetzner vs AWS: ¿por qué dos propuestas?

### ¿Qué es cada proveedor?

| | Hetzner | AWS |
|---|---|---|
| ¿Qué vende? | VPS: "alquilás una computadora virtual" | 200+ servicios en la nube |
| ¿Quién lo usa? | Startups, proyectos chicos, desarrolladores independientes | Empresas de todos los tamaños, Netflix, Spotify |
| ¿Filosofía? | "Te doy una máquina, vos arreglate" | "Te doy el servicio funcionando, no te preocupes por nada" |

### La analogía del restaurante

Imaginá que querés abrir un restaurante:

| | Hetzner | AWS |
|---|---|---|
| **Local** | Alquilás un local vacío | Alquilás un local ya equipado |
| **Cocina** | Comprás e instalás la cocina vos | La cocina ya viene instalada y te la mantienen |
| **Heladera** | Comprás una heladera, la enchufás, la limpiás vos | La heladera tiene servicio técnico 24/7 |
| **Seguridad** | Ponés candado y alarma vos | Viene con guardia de seguridad incluido |
| **Costo** | Barato, pero **todo lo hacés vos** | Caro, pero **no te preocupás por nada** |

### ¿Qué implica cada uno para nuestro proyecto?

**En Hetzner**, cada VPS es una computadora vacía. Tenés que:
- Instalar Docker
- Instalar Kubernetes (k3s)
- Instalar PostgreSQL **en un contenedor**
- Instalar Redis **en un contenedor**
- Instalar RabbitMQ **en un contenedor**
- Configurar backups a mano
- Monitorear si los discos se llenan
- Si la BD se corrompe, arreglarla vos

**En AWS**, cada pieza es un servicio gestionado:
- **EKS**: Kubernetes ya viene funcionando, no instalás nada
- **RDS**: PostgreSQL con backups automáticos, snapshots, réplicas con un clic
- **ElastiCache**: Redis con failover automático, sin mantenimiento
- **Amazon MQ**: RabbitMQ gestionado, con métricas y alarmas
- **CloudWatch**: logs centralizados, alarmas, dashboards sin configurar nada

---

## 4. ¿Por qué en Hetzner hay que hacer más cosas a mano?

La diferencia fundamental es esta:

```
┌─────────────────────────────────────────────────────────────┐
│                    HETZNER (VPS pelado)                      │
│                                                              │
│  Vos alquilás 4 computadoras vacías.                         │
│  Terraform las crea.                                         │
│  Un script de bash instala Docker + k3s en cada una.         │
│                                                              │
│  PostgreSQL → CORRE EN UN CONTENEDOR DOCKER                  │
│    - Vos creás el deployment.yaml                            │
│    - Vos configurás el PersistentVolume para los datos       │
│    - Vos hacés pg_dump para backups                          │
│    - Si necesitás read replica → configurás streaming       │
│      replication a mano en postgresql.conf                   │
│                                                              │
│  Redis → CORRE EN UN CONTENEDOR DOCKER                       │
│    - Vos creás el deployment.yaml                            │
│    - No hay failover automático                              │
│    - Si se llena la memoria → lo manejás vos                 │
│                                                              │
│  RabbitMQ → CORRE EN UN CONTENEDOR DOCKER                    │
│    - Vos creás el deployment.yaml                            │
│    - Vos configurás colas, exchanges, DLQ                    │
│    - Si se cae → Kubernetes lo reinicia (eso es bueno)      │
│                                                              │
│  Kubernetes → k3s (versión ligera)                           │
│    - 1 solo nodo master + workers                            │
│    - Sin auto-scaling de nodos (solo de Pods con HPA)       │
│    - Sin balanceador de carga nativo (usás Nginx Ingress)   │
│                                                              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    AWS (servicios gestionados)               │
│                                                              │
│  Vos le decís a AWS "quiero una BD PostgreSQL".              │
│  Terraform se la pide a AWS.                                 │
│  AWS te la entrega funcionando en 5 minutos.                 │
│                                                              │
│  RDS PostgreSQL → AWS LO ADMINISTRA                          │
│    - Backups automáticos diarios con retención configurable │
│    - Read replica con 1 clic (o 1 línea de Terraform)       │
│    - Auto-scaling de storage                                 │
│    - Multi-AZ (failover automático a otra zona)              │
│    - Maintenance automático (parches, updates)               │
│    - Métricas en CloudWatch sin configurar nada              │
│                                                              │
│  ElastiCache Redis → AWS LO ADMINISTRA                       │
│    - Failover automático con réplicas                        │
│    - Backups automáticos                                     │
│    - Escalado vertical sin downtime                          │
│                                                              │
│  Amazon MQ RabbitMQ → AWS LO ADMINISTRA                      │
│    - Broker gestionado, no mantenés el servidor              │
│    - Métricas nativas en CloudWatch                          │
│    - Multi-AZ para alta disponibilidad                       │
│                                                              │
│  EKS → AWS LO ADMINISTRA                                     │
│    - Control plane gestionado (no pagás master nodes)       │
│    - Auto-scaling de nodos con Cluster Autoscaler            │
│    - Integración nativa con ALB (Load Balancer)              │
│    - IAM roles para service accounts (seguridad integrada)   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Resumen de la diferencia

| Actividad | Hetzner | AWS |
|---|---|---|
| Levantar un servidor | `terraform apply` (30s) | `terraform apply` (15 min) |
| Instalar PostgreSQL | **Vos**: Dockerfile + deployment.yaml + PVC + backups a mano | **AWS**: 1 recurso Terraform. Listo. |
| Read Replica | **Vos**: configurás streaming replication en postgresql.conf | **AWS**: `create_read_replica = true` |
| Backups de BD | **Vos**: cronjob con pg_dump | **AWS**: Automático |
| Si la BD muere | **Vos**: restaurás el backup a mano | **AWS**: Failover automático (Multi-AZ) |
| Redis failover | **Vos**: No hay (1 solo pod) | **AWS**: Automático |
| Monitoreo | **Vos**: Prometheus + Grafana | **AWS**: CloudWatch nativo |
| Cuánto sabés de PostgreSQL | **Mucho** (para operarlo) | **Poco** (AWS lo opera) |
| Costo | Barato | Caro |

### ¿Cuál conviene?

- **TFI / Proyecto chico / Presupuesto ajustado**: Hetzner. Con ~€37/mes tenés 4 ambientes separados, dimensionados para 1.000-5.000 usuarios mensuales.
- **Empresa / Sistema en producción real / Muchos usuarios**: AWS. El costo extra se justifica porque no necesitás un DBA ni un SRE dedicado.
- **Término medio**: Empezar con Hetzner, migrar a AWS cuando la escala lo justifique. Docker y Kubernetes hacen que migrar sea cambiar la URL del registry y poco más.

---

## 5. Estructura de ambientes

| Ambiente | Rama Git | ¿Qué se despliega? | ¿Quién lo activa? | Infraestructura |
|---|---|---|---|---|
| **Desarrollo** | `feature/*` | Solo CI (tests). No se despliega. | Push a feature | PC local del dev |
| **QA** | `develop` | Se despliega automáticamente. | Merge a develop | VPS Hetzner o Namespace EKS `tfi-qa` |
| **UAT** | `release/*` | Se despliega con aprobación manual. | Crear release branch | VPS Hetzner o Namespace EKS `tfi-uat` |
| **Producción** | `main` | Se despliega con aprobación manual y tag. | Merge a main | VPS Hetzner (más grande) o Namespace EKS `tfi-prod` |

---

## 6. Estrategia de Branching (GitFlow)

```
main ─────●────────────●──────────●────── (producción, solo merge de release)
           \          /          /
develop ───●─────────●─────────●──── (QA, acá mergean las features)
            \        / \       /
feature/A ───●──────●   feature/B ─●── (features individuales)
                         \
release/1.0 ──────────────●──── (UAT, candidata a prod)
                           \
                            main (cuando UAT aprueba)
```

| Rama | Dispara | ¿Automático? |
|---|---|---|
| `feature/*` → PR a `develop` | Lint + tests unitarios + integración | Sí |
| Merge a `develop` | Build Docker + Deploy a QA | Sí (automático) |
| Crear `release/*` | Deploy a UAT | No (aprobación manual) |
| Merge a `main` | Deploy a Producción + tag | No (aprobación manual) |
| `hotfix/*` → `main` | Deploy urgente a Producción | No (aprobación manual) |

---

## 7. CI/CD con GitHub Actions

El pipeline completo está en `.github/workflows/deploy.yml`.

### Flujo

```
git push
  │
  ▼
┌─────────────────────────────┐
│  JOB 1: test-and-build      │  ← Corre para CADA microservicio en paralelo
│  ┌─────────────────────────┐│
│  │ npm ci                  ││
│  │ npm run lint            ││
│  │ npm run test            ││  ← Si falla, el pipeline se FRENA
│  │ npm run test:e2e        ││
│  │ npm run build           ││
│  └─────────────────────────┘│
└─────────────┬───────────────┘
              │ (solo si pasó todo)
              ▼
┌─────────────────────────────┐
│  JOB 2: docker              │  ← Corre para CADA microservicio en paralelo
│  ┌─────────────────────────┐│
│  │ docker build            ││
│  │ docker push → GHCR      ││  ← ghcr.io/mi-org/api-gateway:abc123
│  └─────────────────────────┘│
└─────────────┬───────────────┘
              │
     ┌────────┼────────┐
     ▼        ▼        ▼
   dev    release/*   main
     │        │        │
     ▼        ▼        ▼
    QA       UAT      PROD
(docker-compose)  (kubectl)   (kubectl)
```

### Secrets requeridos en GitHub

| Secreto | Descripción |
|---|---|
| `VPS_DEV_IP` | IP del VPS de desarrollo (Hetzner) |
| `VPS_QA_IP` | IP del VPS de QA (Hetzner) |
| `VPS_UAT_IP` | IP del VPS de UAT (Hetzner) |
| `VPS_PROD_IP` | IP del VPS de producción (Hetzner) |
| `SSH_PRIVATE_KEY` | Clave privada SSH del usuario `deploy` |
| `GITHUB_TOKEN` | Automático, para pushear a GHCR |
| `AWS_ACCESS_KEY_ID` | Solo si usás AWS |
| `AWS_SECRET_ACCESS_KEY` | Solo si usás AWS |

---

## 8. Docker y Docker Compose

### Dockerfiles

Cada uno de los 8 microservicios tiene su `Dockerfile` en su carpeta (`apps/<servicio>/Dockerfile`).

Todos usan el mismo patrón **multi-stage build**:

```dockerfile
# Etapa 1: Construir (con TypeScript, Prisma, dependencias dev)
FROM node:22-alpine AS builder
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

# Etapa 2: Imagen final (solo producción)
FROM node:22-alpine AS runner
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
EXPOSE <puerto>
CMD ["node", "dist/main.js"]
```

**Beneficio**: La imagen final pesa ~150MB en vez de ~600MB porque excluye TypeScript, dependencias de desarrollo y código fuente.

### Docker Compose (desarrollo local)

```bash
# Levantar todo en tu PC (8 servicios + PostgreSQL + Redis + RabbitMQ)
docker compose up -d

# Ver logs
docker compose logs -f api-gateway

# Frenar todo
docker compose down
```

El archivo `docker-compose.yml` construye las imágenes desde el código fuente (ideal para desarrollo). El archivo `docker-compose.prod.yml` usa imágenes pre-construidas del registry (ideal para CI/CD en Hetzner sin Kubernetes).

---

## 9. Kubernetes

### ¿Qué hay en `k8s/`?

```
k8s/
├── namespace.yaml           ← tfi-prod, tfi-qa, tfi-uat
├── configmap.yaml           ← URLs de servicios, variables NO secretas
├── secrets.yaml             ← DATABASE_URL, JWT_SECRET, contraseñas
├── ingress.yaml             ← Entrada HTTP: api.mi-complejo.com → api-gateway
├── postgres/                ← Deployment + Service + PVC
├── redis/                   ← Deployment + Service + PVC
├── rabbitmq/                ← Deployment + Service + PVC
├── api-gateway/             ← Deployment + Service + HPA (auto-escalado)
├── auth-service/            ← Deployment + Service
├── core-service/            ← Deployment + Service + HPA
├── ventas-service/          ← Deployment + Service
├── torneos-service/         ← Deployment + Service
├── matchmaking-service/     ← Deployment + Service
├── query-service/           ← Deployment + Service + HPA
└── saga-orchestrator/       ← Deployment + Service
```

### Objetos de Kubernetes usados

| Objeto | ¿Qué hace? | Ejemplo en este proyecto |
|---|---|---|
| **Namespace** | Aísla ambientes lógicamente | `tfi-prod`, `tfi-qa`, `tfi-uat` |
| **Deployment** | "Quiero N réplicas de este servicio siempre" | `api-gateway` con 3 réplicas |
| **Service** | DNS interno + IP fija para un grupo de Pods | `auth-service` → balancea entre los Pods de auth |
| **Ingress** | Entrada HTTP desde internet | `api.mi-complejo.com` → Service `api-gateway:3000` |
| **ConfigMap** | Variables de entorno no secretas | URLs de otros servicios |
| **Secret** | Contraseñas y tokens | `DATABASE_URL`, `JWT_SECRET` |
| **HPA** | Auto-escalado por CPU/memoria | `api-gateway`: 2 a 10 réplicas según demanda |
| **PVC** | Disco persistente | Datos de PostgreSQL, Redis, RabbitMQ |

### Comandos útiles

```bash
# Aplicar todos los manifiestos
kubectl apply -f k8s/ --recursive

# Ver todo lo que corre en producción
kubectl get all -n tfi-prod

# Ver logs de un servicio
kubectl logs -n tfi-prod -f deployment/api-gateway

# Actualizar imagen de un servicio (lo hace GitHub Actions)
kubectl set image deployment/api-gateway \
  api-gateway=ghcr.io/mi-org/api-gateway:abc123 \
  -n tfi-prod

# Rollback si algo sale mal
kubectl rollout undo deployment/api-gateway -n tfi-prod
```

### ¿Cómo funciona el autoscaling? (HPA vs Cluster Autoscaler)

Hay dos tipos de autoscaling en Kubernetes, y **no son lo mismo**. Es clave entender la diferencia:

| | HPA (Horizontal Pod Autoscaler) | Cluster Autoscaler |
|---|---|---|
| **¿Qué escala?** | **Pods** (copias del microservicio) | **Nodos** (máquinas VPS/EC2 donde corren los Pods) |
| **¿Cuándo se activa?** | CPU/memoria de los Pods > umbral | No hay espacio para nuevos Pods en los nodos existentes |
| **¿Funciona en k3s (Hetzner)?** | ✅ Sí, igual que en EKS | ⚠️ No nativo, requiere instalación manual |
| **¿Funciona en EKS (AWS)?** | ✅ Sí | ✅ Nativo en el Node Group (ya configurado en Terraform) |
| **¿Dónde se configura?** | `hpa.yaml` en los manifiestos K8s | Terraform: `scaling_config` del `aws_eks_node_group` |

**HPA = crear más réplicas del microservicio (panqueques).**  
**Cluster Autoscaler = crear más VPS/máquinas donde meter esos panqueques (sartenes).**

Si HPA crea más Pods pero el VPS ya está lleno de CPU/RAM, los Pods nuevos quedan en estado **`Pending`** esperando recursos. Para que se cree un VPS nuevo automáticamente y esos Pods tengan dónde vivir, necesitás el **Cluster Autoscaler**.

```
ANTES (sin estrés):
┌──────────────────────────────┐
│         VPS (4 GB RAM)        │
│  api-gateway  api-gateway    │  ← 2 réplicas, CPU al 30%
│  core-service core-service   │
│  auth-service  ...           │
│  RAM usada: 2.5 GB / 4 GB ✅ │
└──────────────────────────────┘

DESPUÉS (pico de tráfico, CPU > 70%):
┌──────────────────────────────┐
│         VPS (4 GB RAM)        │
│  api-gateway  api-gateway    │
│  api-gateway  api-gateway    │  ← HPA creó 2 réplicas MÁS (ahora 4)
│  api-gateway  ⚠️ PENDING     │  ← ¡PERO! No hay RAM suficiente
│  core-service core-service   │  ← Este Pod espera hasta que:
│  ...                         │     a) baje la demanda, o
│  RAM necesaria: 5 GB / 4 GB ❌│    b) el Cluster Autoscaler cree un VPS nuevo
└──────────────────────────────┘

Cluster Autoscaler detecta Pods Pending
  └─→ Crea un VPS NUEVO automáticamente
      └─→ Los Pods Pending se asignan al VPS nuevo ✅
      └─→ Cuando baja la demanda y el VPS queda vacío → lo destruye
```

**El flujo ideal completo:**

```
1. HPA detecta CPU > 70% en api-gateway
   └─→ Crea 2 réplicas nuevas de api-gateway

2. Los Pods nuevos no tienen VPS donde meterse
   └─→ Quedan en estado Pending

3. Cluster Autoscaler detecta Pods Pending
   └─→ Crea un VPS NUEVO automáticamente

4. Los Pods Pending se asignan al VPS nuevo ✅

5. El pico termina, CPU baja del 70%
   └─→ HPA destruye las réplicas extra

6. El VPS nuevo queda vacío
   └─→ Cluster Autoscaler lo destruye (para no pagarlo al pedo)
```

**En nuestro proyecto:**

| | Hetzner (k3s) | AWS (EKS) |
|---|---|---|
| **HPA** | ✅ Incluido en `k8s/*/hpa.yaml`. El metrics-server viene en k3s por defecto, así que funciona sin configurar nada más. | ✅ Incluido en `k8s/*/hpa.yaml`. Funciona idéntico. |
| **Cluster Autoscaler** | ❌ No viene en k3s. Si los VPS se llenan, los Pods nuevos quedan `Pending`. Para habilitarlo hay que instalar `hetzner-cloud-controller-manager` + `cluster-autoscaler` a mano. | ✅ Nativo del Node Group EKS. Configurado en `terraform/aws/modules/eks/main.tf` con `min_size: 1`, `desired_size: 2`, `max_size: 4`. AWS crea/destruye EC2 automáticamente. |

---

## 10. Terraform: Hetzner vs AWS

### Terraform para Hetzner (`terraform/hetzner/`)

```hcl
# Crea 4 VPS directamente
resource "hcloud_server" "dev" {
  name        = "tfi-dev"
  server_type = "cx22"        # 2 vCPU, 4 GB RAM — €3.99/mes
  image       = "ubuntu-24.04"
  user_data   = file("scripts/install-tools.sh")  # Instala Docker + k3s
}
# ... repetido para qa, uat, prod (más grande)
```

**Lo que Terraform crea**: 4 VPS con Ubuntu + Docker + k3s instalado. Nada más. PostgreSQL, Redis, RabbitMQ los crea Kubernetes después.

**Comandos**:
```bash
cd terraform/hetzner
cp terraform.tfvars.example terraform.tfvars  # Editar con tu token
terraform init
terraform plan
terraform apply  # ~30 segundos, 4 VPS listos
```

### Terraform para AWS (`terraform/aws/`)

```hcl
# Arquitectura modular
module "vpc"     { source = "./modules/vpc" }       # Red privada
module "eks"     { source = "./modules/eks" }       # Kubernetes gestionado
module "rds"     { source = "./modules/rds-postgres" }  # BD gestionada
module "redis"   { source = "./modules/elasticache-redis" }  # Cache gestionado
module "rabbitmq" { source = "./modules/rabbitmq" } # Broker gestionado
```

**Lo que Terraform crea**: VPC, EKS, RDS (primary + read replica), ElastiCache, Amazon MQ, Security Groups, IAM roles. Todo gestionado por AWS.

**Comandos**:
```bash
cd terraform/aws
cp terraform.tfvars.example terraform.tfvars
terraform init
terraform plan  # Muestra TODO lo que va a crear (~40 recursos)
terraform apply # ~15 minutos, todo listo
```

### Diferencias en el código Terraform

| | Hetzner | AWS |
|---|---|---|
| **Provider** | `hetznercloud/hcloud` | `hashicorp/aws` + `hashicorp/kubernetes` |
| **Recursos creados** | 5 (4 servers + network) | ~40 (VPC, subnets, NAT, IGW, EKS, IAM, RDS, ElastiCache, MQ, Security Groups...) |
| **Tiempo de apply** | 30 segundos | 15 minutos |
| **Estructura** | Plana (1 archivo main.tf) | Modular (6 submódulos reutilizables) |
| **Estado remoto** | Local por defecto | S3 + DynamoDB (para equipos) |
| **Complejidad del código** | Baja (~50 líneas) | Alta (~300 líneas entre todos los módulos) |

---

## 11. Resiliencia: ¿qué pasa si algo falla?

La gran pregunta: si algo se cae, ¿el sistema sigue funcionando o se cae todo? La respuesta depende de **cuánto estás dispuesto a pagar** y de **cuántos nodos/servicios redundantes tengas**.

### 11.1 ¿Se cae un Pod?

**Sí, Kubernetes levanta otro al instante.** Esto funciona IGUAL en k3s (Hetzner) que en EKS (AWS). El Deployment controller monitorea constantemente: "¿Hay N Pods corriendo? No → creo los que faltan."

```
Pod api-gateway-abc123 muere
  │
  ▼
Deployment controller detecta: "Hay 2/3, falta 1"
  │
  ▼
Crea Pod api-gateway-def456 automáticamente (~2-5 segundos) ✅
```

**PERO** — y este es el punto clave — si tenés 1 solo VPS, el nuevo Pod se crea **en el mismo VPS** donde ya estaban los otros. No hay otro lugar físico donde ponerlo. Si el VPS entero se cae, esto no sirve de nada.

---

### 11.2 ¿Se cae un VPS / nodo entero?

**Esta es la diferencia fundamental entre 1 VPS y 2+ VPS/nodos.**

```
┌─────────────────────────────────────────────────┐
│        HETZNER — 1 solo VPS                      │
│                                                  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐         │
│  │api-gateway│ │  core    │ │  ventas  │         │
│  │   x3      │ │  x3      │ │  x2      │         │
│  └──────────┘ └──────────┘ └──────────┘         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐         │
│  │ auth     │ │ torneos  │ │matchmaking│        │
│  └──────────┘ └──────────┘ └──────────┘         │
│  ┌──────────┐ ┌──────────┐                      │
│  │  query   │ │  saga    │                      │
│  └──────────┘ └──────────┘                      │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐         │
│  │PostgreSQL│ │  Redis   │ │ RabbitMQ │         │
│  │  (pod)   │ │  (pod)   │ │  (pod)   │         │
│  └──────────┘ └──────────┘ └──────────┘         │
│                                                  │
│  ⚡ El VPS se apaga / crashea                    │
│  💀 TODO lo de adentro muere con él              │
│  ⏱️ Recuperación: 2-5 min si es reinicio        │
│     Horas si es outage del datacenter            │
└─────────────────────────────────────────────────┘
```

```
┌─────────────────────────────────────────────────────────────┐
│        HETZNER con 2 VPS o AWS con 2+ nodos                 │
│                                                              │
│  EKS/k3s Cluster                                             │
│  ├── Nodo 1 (eu-central-1) 💀 muere                          │
│  │   ├── Pod api-gateway-1                                   │
│  │   ├── Pod core-service-1                                  │
│  │   └── Pod auth-service-1                                  │
│  │                                                           │
│  ├── Nodo 2 (eu-central-2) ✅ vivo                           │
│  │   ├── Pod api-gateway-2                                   │
│  │   ├── Pod core-service-2                                  │
│  │   └── Pod query-service-1                                 │
│  │                                                           │
│  └── Kubernetes detecta: "Nodo 1 no responde"                │
│      └── Reubica sus Pods en Nodo 2 (~30-60 segundos) ✅     │
│      └── Si hay Cluster Autoscaler: crea Nodo 3 (~3-5 min)   │
└─────────────────────────────────────────────────────────────┘
```

**Esto funciona SOLO si tenés ≥2 nodos en ubicaciones/zonas distintas.** Con 1 solo nodo en AWS, estás exactamente igual que en Hetzner.

---

### 11.3 ¿Se cae PostgreSQL?

Esta es la pieza más crítica. Si la BD se cae, **todo el sistema deja de funcionar** (los 8 microservicios dependen de ella).

| | Hetzner (Pod Docker) | AWS RDS Single-AZ | AWS RDS Multi-AZ |
|---|---|---|---|
| **¿Qué pasa si muere?** | K8s reinicia el Pod (~30s). Datos OK si el PVC persiste. | AWS reinicia la instancia automáticamente. | AWS promueve la standby automáticamente. |
| **Downtime** | ~30 segundos | 5-15 minutos | 60-120 segundos |
| **¿Perdés datos?** | No (si PVC persiste) | No (último backup: ~5 min atrás) | No (sincronización sincrónica) |
| **¿Read replica ayuda?** | No en failover. Solo para lecturas. | No en failover. Solo para lecturas. | La standby TAMPOCO es la read replica. Son cosas distintas. |
| **Costo** | €0 (adentro del VPS) | ~$70/mes | ~$140/mes |
| **¿Quién lo arregla?** | **Vos** (restaurás backup si el disco murió) | AWS (automático) | AWS (automático) |

**Ojo**: la Read Replica **NO es failover**. Si la primaria muere, la réplica NO se promueve automáticamente. Para failover automático necesitás **Multi-AZ**, que es una instancia standby separada sincronizada sincrónicamente (y cuesta el doble). La read replica es para consultas, no para alta disponibilidad.

---

### 11.4 ¿Se cae Redis?

Redis es cache. Si se cae, el sistema **no debería caerse**, solo responder más lento (consultas que iban a Redis van a la BD). Pero si el sistema depende de Redis para sesiones o matchmaking en tiempo real, hay impacto.

| | Hetzner (Pod Docker) | AWS ElastiCache simple | AWS ElastiCache con réplicas |
|---|---|---|---|
| **¿Qué pasa si muere?** | K8s reinicia el Pod (~30s). | AWS recrea el nodo. | Una réplica se promueve automáticamente. |
| **Downtime** | ~30 segundos | 5-10 minutos | <1 minuto |
| **¿Perdés datos de cache?** | ✅ Sí, todo lo que estaba en memoria. | ✅ Sí. | ✅ Sí (pero la réplica tenía copia reciente). |
| **Costo** | €0 (adentro del VPS) | ~$30/mes | ~$60/mes |

El cache por definición es **dato descartable**. Si Redis se cae, se regenera solo con las consultas siguientes. El impacto real es de **rendimiento**, no de pérdida de datos.

---

### 11.5 ¿Se cae RabbitMQ?

RabbitMQ es el sistema nervioso. Si se cae, los eventos entre servicios dejan de fluir. Las sagas quedan colgadas. Los comandos async no se procesan.

| | Hetzner (Pod Docker) | AWS MQ Single | AWS MQ Multi-AZ |
|---|---|---|---|
| **¿Qué pasa si muere?** | K8s reinicia el Pod (~30s). | AWS intenta recuperar (10-20 min). | Standby toma el control automáticamente. |
| **Downtime** | ~30 segundos | 10-20 minutos | <2 minutos |
| **¿Perdés mensajes?** | Sí (salvo colas persistentes con volumen) | Sí (colas no persistentes) | Mínimo (sincronización entre nodos) |
| **¿Sagas inconsistentes?** | ✅ Posible: mensajes en vuelo se pierden | ✅ Posible | Mínimo |
| **Costo** | €0 (adentro del VPS) | ~$35/mes | ~$70/mes |

**Estrategia de mitigación en ambos proveedores**: usar **colas persistentes** (mensajes sobreviven reinicios) y **DLQ (Dead Letter Queue)** para mensajes fallidos que el saga-orchestrator puede reintentar.

---

### 11.6 Tabla resumen: ¿qué pasa si algo falla?

| Falla | Hetzner (1 VPS) | Hetzner (2 VPS) | AWS (mínimo) | AWS (prod real) |
|---|---|---|---|---|
| **Un Pod muere** | ✅ K8s lo recrea (~3s) | ✅ K8s lo recrea (~3s) | ✅ K8s lo recrea (~3s) | ✅ K8s lo recrea (~3s) |
| **Un VPS/nodo muere** | 💀 Todo caído. Recuperación manual. | ✅ Otro nodo toma los Pods (~30s) | 💀 Si es 1 nodo: todo caído | ✅ Nodos en 3 AZs, reubicación inmediata |
| **PostgreSQL muere** | ⚠️ Caído ~30s. Datos OK si PVC persiste. | ⚠️ Ídem (sigue en 1 solo Pod) | 💀 Single-AZ: 5-15 min | ✅ Multi-AZ: failover en 60-120s |
| **Redis muere** | ⚠️ Caído ~30s. Datos de cache perdidos. | ⚠️ Ídem | 💀 ElastiCache simple: 5-10 min | ✅ Con réplicas: <1 min |
| **RabbitMQ muere** | ⚠️ Caído ~30s. Msjs no persistentes perdidos. | ⚠️ Ídem | 💀 MQ Single: 10-20 min | ✅ MQ Multi-AZ: <2 min |
| **Datacenter entero caído** | 💀 Horas de downtime | 💀 Ambos VPS mismo datacenter = horas | 💀 Si todo en 1 AZ = horas | ✅ Multi-AZ: failover automático |

---

### 11.7 ¿Cuánto cuesta la alta disponibilidad REAL?

La resiliencia **se paga**. No hay magia. La diferencia entre Hetzner y AWS no es "Hetzner se cae y AWS no". La diferencia es **cuánto cuesta y qué tan fácil es configurar cada nivel de protección**.

| Proveedor | Básico (si algo falla → downtime) | Alta disponibilidad real |
|---|---|---|
| **Hetzner** | ~€37/mes (1 VPS por ambiente, dimensionado para 5K usuarios) | ~€65-85/mes (2+ VPS en datacenters distintos + replicación manual de BD) |
| **AWS** | ~$428/mes (Single-AZ en todo) | ~$700-900/mes (Multi-AZ en BD, Redis, MQ + 3 AZs + NAT Gateway redundante + ALB) |

**Lo que pagás en AWS no es "mágicamente no se cae nada".** Pagás para que:
1. No necesités un DBA que configure replicación de PostgreSQL a mano
2. No necesités un SRE que configure clustering de Redis y RabbitMQ a mano
3. No necesités guardias 24/7 para levantarte a las 3 AM si algo falla
4. El failover sea **automático y en minutos**, no manual y en horas

---

## 12. Tabla de costos

### Hetzner (~€37/mes para 1.000-5.000 usuarios/mes)

Dimensionamiento realista: 8 microservicios NestJS (~200 MB c/u) + PostgreSQL (~1 GB) + Redis (~300 MB) + RabbitMQ (~400 MB) + k3s/SO (~1 GB) = ~4.5 GB en idle, ~7-8 GB en hora pico. cpx31 (8 GB) tiene margen cero; cpx41 (16 GB) da holgura real para crecer.

| Componente | Tipo | Cantidad | Costo unitario | Subtotal |
|---|---|---|---|---|
| VPS Dev | cx22 (2 vCPU, 4 GB) | 1 | €3.99 | €3.99 |
| VPS QA | cx22 (2 vCPU, 4 GB) | 1 | €3.99 | €3.99 |
| VPS UAT | cx23 (2 vCPU, 8 GB, 80 GB SSD) | 1 | €5.99 | €5.99 |
| VPS Prod | cpx41 (8 vCPU, 16 GB, 240 GB SSD) | 1 | €23.00 | €23.00 |
| PostgreSQL + Redis + RabbitMQ | Docker en VPS (contenedores) | — | €0 | €0 |
| **TOTAL** | | | | **~€37** |

*Nota: Todo corre en contenedores Docker/Kubernetes dentro de los VPS. UAT usa cx23 (8 GB) para simular condiciones más cercanas a producción. Producción usa cpx41 (16 GB) con margen real para picos de 5.000 usuarios/mes. Si la escala crece a 10.000+ usuarios, se recomienda un segundo VPS cpx31 (€13 extra) para distribuir carga.*

### AWS (~$428/mes)

| Componente | Servicio | Cantidad | Costo | Subtotal |
|---|---|---|---|---|
| Load Balancer | ALB | 1 | $25/mes | $25 |
| Kubernetes | EKS control plane | 1 cluster | $73/mes | $73 |
| Nodos (máquinas) | EC2 t3.medium | 2 | $33/mes c/u | $65 |
| Imágenes Docker | ECR | 8 repos | $5/mes | $5 |
| BD Primaria | RDS db.t3.medium | 1 | $70/mes | $70 |
| Read Replica | RDS db.t3.medium | 1 | $70/mes | $70 |
| Cache Redis | ElastiCache t4g.small | 1 | $30/mes | $30 |
| RabbitMQ | Amazon MQ mq.t3.micro | 1 | $35/mes | $35 |
| Frontend | S3 + CloudFront | 1 | $10/mes | $10 |
| Monitoreo | CloudWatch | 1 | $25/mes | $25 |
| Backups | S3 + snapshots | variable | $15/mes | $15 |
| Estado Terraform | S3 + DynamoDB | 1 | $5/mes | $5 |
| **TOTAL** | | | | **~$428** |

*Nota: Solo producción. QA y UAT no están incluidos (sumarían ~$150-200 más cada uno si están siempre encendidos). Los costos pueden reducirse con instancias reservadas (30-50% descuento) o apagado programado de ambientes no productivos.*

### ¿Por qué tanta diferencia?

AWS no es "más caro porque sí". El costo extra paga:

1. **No necesitás un DBA**: RDS hace backups, réplicas, parches y failover solo.
2. **No necesitás un SRE**: ElastiCache, MQ y EKS se autogestionan.
3. **No necesitás guardias 24/7**: CloudWatch te avisa si algo falla.
4. **Escalás sin tocarlo**: Auto-scaling de nodos y Pods bajo demanda.
5. **Cumplimiento normativo**: Encriptación, auditoría, certificaciones ISO/SOC2.

Para un TFI, Hetzner es perfectamente válido y demuestra que entendés los conceptos sin hipotecarte.

---

## 13. Estructura del directorio

```
Etapa4-B/
│
├── apps/                          ← CÓDIGO: 8 microservicios (desde Etapa2-pasoB)
│   ├── api-gateway/
│   │   ├── Dockerfile             ← Multi-stage build Node.js 22
│   │   ├── tsconfig.json          ← Config TypeScript para build
│   │   ├── nest-cli.json          ← Config NestJS CLI
│   │   ├── package.json           ← Dependencias + scripts (build, test, etc.)
│   │   └── src/                   ← Código fuente (gateway, websocket, circuit-breaker...)
│   ├── auth-service/              ← Dockerfile + tsconfig + nest-cli + src (usuarios, events...)
│   ├── core-service/              ← Dockerfile + tsconfig + nest-cli + src (canchas, turnos, pagos...)
│   ├── ventas-service/            ← Dockerfile + tsconfig + nest-cli + src (ventas, productos...)
│   ├── torneos-service/           ← Dockerfile + tsconfig + nest-cli + src (torneos, events...)
│   ├── matchmaking-service/       ← Dockerfile + tsconfig + nest-cli + src (esperas, matchmaking...)
│   ├── query-service/             ← Dockerfile + tsconfig + nest-cli + src (proyecciones, CQRS...)
│   └── saga-orchestrator/         ← Dockerfile + tsconfig + nest-cli + src (sagas definiciones...)
│
├── k8s/                           ← KUBERNETES: manifiestos YAML
│   ├── namespace.yaml             ← tfi-prod, tfi-qa, tfi-uat
│   ├── configmap.yaml             ← URLs de servicios
│   ├── secrets.yaml               ← DATABASE_URL, JWT_SECRET (ejemplo)
│   ├── ingress.yaml               ← Entrada HTTP: api.mi-complejo.com
│   ├── postgres/                  ← Deployment + Service + PVC
│   ├── redis/                     ← Deployment + Service + PVC
│   ├── rabbitmq/                  ← Deployment + Service + PVC
│   ├── api-gateway/               ← Deployment + Service + HPA (3 réplicas, auto-scale)
│   ├── auth-service/              ← Deployment + Service (2 réplicas)
│   ├── core-service/              ← Deployment + Service + HPA
│   ├── ventas-service/            ← Deployment + Service
│   ├── torneos-service/           ← Deployment + Service
│   ├── matchmaking-service/       ← Deployment + Service
│   ├── query-service/             ← Deployment + Service + HPA
│   └── saga-orchestrator/         ← Deployment + Service (1 réplica)
│
├── terraform/                     ← INFRAESTRUCTURA COMO CÓDIGO
│   ├── hetzner/                   ← ECONÓMICO: 4 VPS (~€25/mes)
│   │   ├── main.tf                ← 4 servidores + red privada
│   │   ├── variables.tf           ← Token API, SSH key
│   │   ├── outputs.tf             ← IPs de cada VPS
│   │   ├── terraform.tfvars.example
│   │   └── scripts/
│   │       └── install-tools.sh   ← Instala Docker + k3s + kubectl
│   │
│   └── aws/                       ← EMPRESARIAL: servicios gestionados (~$428/mes)
│       ├── main.tf                ← Orquesta los módulos
│       ├── variables.tf           ← Región, tamaños de instancia
│       ├── outputs.tf             ← Endpoints de cada servicio
│       ├── terraform.tfvars.example
│       └── modules/
│           ├── vpc/               ← Red, subnets, NAT, Internet Gateway
│           ├── eks/               ← Cluster Kubernetes + Node Group
│           ├── rds-postgres/      ← PostgreSQL Primary + Read Replica
│           ├── elasticache-redis/ ← Redis cache gestionado
│           └── rabbitmq/          ← Amazon MQ RabbitMQ gestionado
│
├── .github/
│   └── workflows/
│       └── deploy.yml             ← CI/CD pipeline completo
│
├── docker-compose.yml             ← Desarrollo local (build from source)
├── docker-compose.prod.yml        ← Producción sin K8s (usa imágenes pre-built)
├── .env.example                   ← Variables de entorno de ejemplo
├── .gitignore                     ← node_modules, dist, .env, .terraform
└── README.md                      ← Este archivo
```

---

## Resumen: lo que esta carpeta demuestra

| Concepto | ¿Dónde está implementado? |
|---|---|
| **Microservicios con eventos** | `apps/*/src/events/` (eventos de dominio) |
| **Sagas** | `apps/saga-orchestrator/src/sagas/definiciones/` |
| **CQRS / Proyecciones** | `apps/query-service/src/proyecciones/` |
| **Circuit Breaker** | `apps/api-gateway/src/gateway/circuit-breaker/` |
| **WebSocket** | `apps/api-gateway/src/websocket/` |
| **Docker** | `apps/*/Dockerfile` (8 Dockerfiles multi-stage) |
| **Docker Compose (local)** | `docker-compose.yml` |
| **Docker Compose (prod sin K8s)** | `docker-compose.prod.yml` |
| **Kubernetes** | `k8s/` (Deployments, Services, Ingress, HPA, PVC) |
| **Terraform (Hetzner)** | `terraform/hetzner/` (4 VPS, script auto-install) |
| **Terraform (AWS)** | `terraform/aws/` (VPC, EKS, RDS, ElastiCache, MQ) |
| **CI/CD** | `.github/workflows/deploy.yml` |
| **Estrategia de branching** | GitFlow (feature → develop → release → main) |
| **Ambientes** | Dev, QA, UAT, Producción |
| **Costos** | €28/mes (Hetzner) vs $428/mes (AWS) |
