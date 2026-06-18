variable "hcloud_token" {
  description = "Token de API de Hetzner Cloud"
  type        = string
  sensitive   = true
}

variable "ssh_key_id" {
  description = "ID de la clave SSH registrada en Hetzner"
  type        = string
}
