variable "aws_region" {
  description = "Región de AWS"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Ambiente (dev, qa, uat, prod)"
  type        = string
  default     = "prod"

  validation {
    condition     = contains(["dev", "qa", "uat", "prod"], var.environment)
    error_message = "El ambiente debe ser dev, qa, uat o prod."
  }
}

# ─── EKS ───
variable "eks_node_instance_type" {
  description = "Tipo de instancia EC2 para nodos EKS"
  type        = string
  default     = "t3.medium"
}

variable "eks_node_count" {
  description = "Cantidad de nodos en el cluster EKS"
  type        = number
  default     = 2
}

# ─── RDS ───
variable "rds_instance_class" {
  description = "Tipo de instancia RDS PostgreSQL"
  type        = string
  default     = "db.t3.medium"
}

# ─── Redis ───
variable "redis_node_type" {
  description = "Tipo de nodo ElastiCache Redis"
  type        = string
  default     = "cache.t4g.small"
}

# ─── RabbitMQ ───
variable "mq_instance_type" {
  description = "Tipo de instancia Amazon MQ RabbitMQ"
  type        = string
  default     = "mq.t3.micro"
}
