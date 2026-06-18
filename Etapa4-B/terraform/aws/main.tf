terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.30"
    }
  }

  backend "s3" {
    bucket         = "tfi-terraform-state"
    key            = "prod/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "tfi-terraform-locks"
    encrypt        = true
  }
}

provider "aws" {
  region = var.aws_region
}

# ─── Módulo: Red (VPC, subnets, NAT, Internet Gateway) ───
module "vpc" {
  source = "./modules/vpc"

  environment = var.environment
  vpc_cidr    = "10.0.0.0/16"
}

# ─── Módulo: EKS (Kubernetes) ───
module "eks" {
  source = "./modules/eks"

  environment       = var.environment
  vpc_id            = module.vpc.vpc_id
  private_subnet_ids = module.vpc.private_subnet_ids
  node_instance_type = var.eks_node_instance_type
  node_count         = var.eks_node_count
}

# ─── Módulo: RDS PostgreSQL ───
module "rds" {
  source = "./modules/rds-postgres"

  environment        = var.environment
  vpc_id             = module.vpc.vpc_id
  private_subnet_ids = module.vpc.private_subnet_ids
  eks_security_group_id = module.eks.cluster_security_group_id
  instance_class     = var.rds_instance_class
  db_name            = "tfi_${var.environment}"
  db_username        = "tfi_admin"

  create_read_replica = var.environment == "prod"
}

# ─── Módulo: ElastiCache Redis ───
module "redis" {
  source = "./modules/elasticache-redis"

  environment        = var.environment
  vpc_id             = module.vpc.vpc_id
  private_subnet_ids = module.vpc.private_subnet_ids
  eks_security_group_id = module.eks.cluster_security_group_id
  node_type          = var.redis_node_type
}

# ─── Módulo: Amazon MQ (RabbitMQ) ───
module "rabbitmq" {
  source = "./modules/rabbitmq"

  environment        = var.environment
  vpc_id             = module.vpc.vpc_id
  private_subnet_ids = module.vpc.private_subnet_ids
  eks_security_group_id = module.eks.cluster_security_group_id
  instance_type      = var.mq_instance_type
  broker_name        = "tfi-${var.environment}"
}
