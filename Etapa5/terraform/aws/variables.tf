variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "prod"
}

variable "vector_db_provider" {
  description = "Vector database provider used by the RAG architecture"
  type        = string
  default     = "pinecone"
}

