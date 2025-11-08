output "alb_dns" {
  description = "Public DNS of the Application Load Balancer"
  value       = aws_lb.alb.dns_name
}

output "db_endpoint" {
  description = "RDS Postgres endpoint"
  value       = aws_db_instance.postgres.address
}

output "s3_bucket_name" {
  description = "Reports S3 bucket name"
  value       = aws_s3_bucket.reports.bucket
}