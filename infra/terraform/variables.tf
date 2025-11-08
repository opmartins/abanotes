variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Project name prefix"
  type        = string
  default     = "clinica-autismo"
}

variable "db_username" {
  description = "RDS Postgres username"
  type        = string
}

variable "db_password" {
  description = "RDS Postgres password"
  type        = string
  sensitive   = true
}

variable "db_name" {
  description = "Database name"
  type        = string
  default     = "clinica_autismo"
}

variable "vpc_cidr" {
  description = "VPC CIDR"
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnets" {
  description = "Public subnet CIDRs"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "private_subnets" {
  description = "Private subnet CIDRs"
  type        = list(string)
  default     = ["10.0.3.0/24", "10.0.4.0/24"]
}

variable "desired_count" {
  description = "Desired count for ECS service"
  type        = number
  default     = 1
}

variable "server_image" {
  description = "Container image for server"
  type        = string
}

variable "web_image" {
  description = "Container image for web"
  type        = string
}

variable "s3_bucket_name" {
  description = "S3 bucket name for reports"
  type        = string
  default     = ""
}