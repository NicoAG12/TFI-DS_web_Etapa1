output "dev_ip" {
  description = "IP del servidor de Desarrollo"
  value       = hcloud_server.dev.ipv4_address
}

output "qa_ip" {
  description = "IP del servidor de QA"
  value       = hcloud_server.qa.ipv4_address
}

output "uat_ip" {
  description = "IP del servidor de UAT"
  value       = hcloud_server.uat.ipv4_address
}

output "prod_ip" {
  description = "IP del servidor de Producción"
  value       = hcloud_server.prod.ipv4_address
}

output "prod_k3s_connect" {
  description = "Comando para obtener kubeconfig del nodo prod"
  value       = "ssh root@${hcloud_server.prod.ipv4_address} 'cat /etc/rancher/k3s/k3s.yaml' > ~/.kube/config-tfi-prod"
}
