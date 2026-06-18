output "secret_names" {
  value = [
    aws_secretsmanager_secret.llm_api_key.name,
    aws_secretsmanager_secret.embedding_api_key.name,
    aws_secretsmanager_secret.vector_db_api_key.name
  ]
}

