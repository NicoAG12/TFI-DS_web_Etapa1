output "endpoint" {
  value = aws_mq_broker.main.instances[0].endpoints[0]
}

output "amqps_endpoint" {
  value = "amqps://${aws_mq_broker.main.instances[0].endpoints[0]}:5671"
}

output "mq_password" {
  value     = random_password.mq_pass.result
  sensitive = true
}
