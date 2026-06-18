resource "aws_secretsmanager_secret" "llm_api_key" {
  name = "tfi-${var.environment}-llm-api-key"
}

resource "aws_secretsmanager_secret" "embedding_api_key" {
  name = "tfi-${var.environment}-embedding-api-key"
}

resource "aws_secretsmanager_secret" "vector_db_api_key" {
  name = "tfi-${var.environment}-vector-db-api-key"
}

