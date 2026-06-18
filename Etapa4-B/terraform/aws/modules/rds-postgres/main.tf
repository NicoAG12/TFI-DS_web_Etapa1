resource "aws_db_subnet_group" "main" {
  name       = "tfi-${var.environment}-db-subnet"
  subnet_ids = var.private_subnet_ids

  tags = {
    Name = "tfi-${var.environment}-db-subnet"
  }
}

resource "aws_security_group" "rds" {
  name        = "tfi-${var.environment}-rds-sg"
  description = "Security group for RDS PostgreSQL"
  vpc_id      = var.vpc_id

  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [var.eks_security_group_id]
    description     = "Allow EKS to access PostgreSQL"
  }

  tags = {
    Name = "tfi-${var.environment}-rds-sg"
  }
}

resource "aws_db_instance" "primary" {
  identifier           = "tfi-${var.environment}-primary"
  engine               = "postgres"
  engine_version       = "16.3"
  instance_class       = var.instance_class
  allocated_storage    = 20
  storage_encrypted    = true

  db_name              = var.db_name
  username             = var.db_username
  password             = random_password.db_pass.result

  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.rds.id]

  backup_retention_period = var.environment == "prod" ? 7 : 1
  backup_window           = "03:00-04:00"
  maintenance_window      = "sun:04:00-sun:05:00"

  skip_final_snapshot     = var.environment != "prod"

  tags = {
    Name        = "tfi-${var.environment}-rds-primary"
    Environment = var.environment
  }
}

resource "aws_db_instance" "read_replica" {
  count = var.create_read_replica ? 1 : 0

  identifier          = "tfi-${var.environment}-replica"
  replicate_source_db = aws_db_instance.primary.identifier
  instance_class      = var.instance_class
  storage_encrypted   = true

  vpc_security_group_ids = [aws_security_group.rds.id]

  skip_final_snapshot = true

  tags = {
    Name        = "tfi-${var.environment}-rds-replica"
    Environment = var.environment
  }
}

resource "random_password" "db_pass" {
  length  = 32
  special = false
}
