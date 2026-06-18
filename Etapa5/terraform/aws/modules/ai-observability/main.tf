resource "aws_cloudwatch_log_group" "ai_services" {
  name              = "/tfi/${var.environment}/ai-services"
  retention_in_days = 30
}

resource "aws_cloudwatch_metric_alarm" "llm_errors" {
  alarm_name          = "tfi-${var.environment}-llm-errors"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "LLMErrors"
  namespace           = "TFI/AI"
  period              = 300
  statistic           = "Sum"
  threshold           = 10
  treat_missing_data  = "notBreaching"
}

