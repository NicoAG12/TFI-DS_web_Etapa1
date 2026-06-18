resource "aws_elasticache_subnet_group" "main" {
  name       = "tfi-${var.environment}-redis-subnet"
  subnet_ids = var.private_subnet_ids
}

resource "aws_security_group" "redis" {
  name        = "tfi-${var.environment}-redis-sg"
  description = "Security group for ElastiCache Redis"
  vpc_id      = var.vpc_id

  ingress {
    from_port       = 6379
    to_port         = 6379
    protocol        = "tcp"
    security_groups = [var.eks_security_group_id]
    description     = "Allow EKS to access Redis"
  }

  tags = {
    Name = "tfi-${var.environment}-redis-sg"
  }
}

resource "aws_elasticache_cluster" "main" {
  cluster_id           = "tfi-${var.environment}-redis"
  engine               = "redis"
  engine_version       = "7.1"
  node_type            = var.node_type
  num_cache_nodes      = 1
  parameter_group_name = "default.redis7"
  port                 = 6379

  subnet_group_name  = aws_elasticache_subnet_group.main.name
  security_group_ids = [aws_security_group.redis.id]

  tags = {
    Name        = "tfi-${var.environment}-redis"
    Environment = var.environment
  }
}
