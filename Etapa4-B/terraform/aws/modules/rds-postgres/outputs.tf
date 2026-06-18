output "primary_endpoint" {
  value = aws_db_instance.primary.endpoint
}

output "read_replica_endpoint" {
  value = var.create_read_replica ? aws_db_instance.read_replica[0].endpoint : null
}

output "db_password" {
  value     = random_password.db_pass.result
  sensitive = true
}
