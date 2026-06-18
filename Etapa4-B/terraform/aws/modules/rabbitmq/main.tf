resource "aws_security_group" "mq" {
  name        = "tfi-${var.environment}-mq-sg"
  description = "Security group for Amazon MQ RabbitMQ"
  vpc_id      = var.vpc_id

  ingress {
    from_port       = 5671
    to_port         = 5671
    protocol        = "tcp"
    security_groups = [var.eks_security_group_id]
    description     = "Allow EKS to access RabbitMQ (AMQPS)"
  }

  tags = {
    Name = "tfi-${var.environment}-mq-sg"
  }
}

resource "aws_mq_broker" "main" {
  broker_name        = var.broker_name
  engine_type        = "RabbitMQ"
  engine_version     = "3.12"
  host_instance_type = var.instance_type
  deployment_mode    = "SINGLE_INSTANCE"
  publicly_accessible = false

  subnet_ids  = [var.private_subnet_ids[0]]
  security_groups = [aws_security_group.mq.id]

  user {
    username = "tfi_${var.environment}"
    password = random_password.mq_pass.result
  }

  maintenance_window_start_time {
    day_of_week = "SUNDAY"
    time_of_day = "04:00"
    time_zone   = "UTC"
  }

  tags = {
    Name        = var.broker_name
    Environment = var.environment
  }
}

resource "random_password" "mq_pass" {
  length  = 24
  special = false
}
