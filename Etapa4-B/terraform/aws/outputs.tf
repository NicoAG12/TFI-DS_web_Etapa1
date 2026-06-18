output "vpc_id" {
  description = "ID de la VPC"
  value       = module.vpc.vpc_id
}

output "eks_cluster_name" {
  description = "Nombre del cluster EKS"
  value       = module.eks.cluster_name
}

output "eks_cluster_endpoint" {
  description = "Endpoint del cluster EKS"
  value       = module.eks.cluster_endpoint
  sensitive   = true
}

output "rds_endpoint" {
  description = "Endpoint de RDS PostgreSQL (primary)"
  value       = module.rds.primary_endpoint
}

output "rds_read_replica_endpoint" {
  description = "Endpoint de RDS Read Replica"
  value       = module.rds.read_replica_endpoint
}

output "redis_endpoint" {
  description = "Endpoint de ElastiCache Redis"
  value       = module.redis.endpoint
}

output "rabbitmq_endpoint" {
  description = "Endpoint de Amazon MQ (RabbitMQ)"
  value       = module.rabbitmq.endpoint
}

output "configure_kubectl" {
  description = "Comando para configurar kubectl"
  value       = "aws eks update-kubeconfig --region ${var.aws_region} --name ${module.eks.cluster_name}"
}
