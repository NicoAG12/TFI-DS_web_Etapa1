output "ai_secret_names" {
  value = module.ai_secrets.secret_names
}

output "vector_db_provider" {
  value = module.vector_db.provider_name
}

