terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

module "ai_secrets" {
  source = "./modules/ai-secrets"

  environment = var.environment
}

module "vector_db" {
  source = "./modules/vector-db"

  environment = var.environment
  provider_name = var.vector_db_provider
}

module "ai_observability" {
  source = "./modules/ai-observability"

  environment = var.environment
}

