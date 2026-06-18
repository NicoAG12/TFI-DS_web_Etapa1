#!/bin/bash
set -e

echo "=== TFI Hetzner VPS Setup ==="
echo "Fecha: $(date)"

# ─── 1. Actualizar sistema ───
apt-get update && apt-get upgrade -y

# ─── 2. Instalar Docker ───
apt-get install -y ca-certificates curl gnupg
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
apt-get update
apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# ─── 3. Instalar k3s (Kubernetes ligero) ───
curl -sfL https://get.k3s.io | INSTALL_K3S_EXEC="--disable=traefik" sh -

# Esperar a que k3s esté listo
sleep 15
until kubectl get nodes 2>/dev/null | grep -q Ready; do
  echo "Esperando que k3s esté listo..."
  sleep 5
done

# ─── 4. Crear usuario deploy para CI/CD ───
useradd -m -s /bin/bash deploy 2>/dev/null || true
usermod -aG docker deploy

# Dar acceso a kubectl al usuario deploy
mkdir -p /home/deploy/.kube
cp /etc/rancher/k3s/k3s.yaml /home/deploy/.kube/config
chown -R deploy:deploy /home/deploy/.kube
chmod 600 /home/deploy/.kube/config

# ─── 5. Directorio de trabajo ───
mkdir -p /opt/tfi
chown -R deploy:deploy /opt/tfi

# ─── 6. Configurar kubectl para root ───
mkdir -p /root/.kube
cp /etc/rancher/k3s/k3s.yaml /root/.kube/config
chmod 600 /root/.kube/config

# ─── 7. Instalar nginx ingress controller ───
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/baremetal/deploy.yaml

echo "=== VPS listo ==="
echo "Docker: $(docker --version)"
echo "k3s: $(k3s --version)"
echo "kubectl: $(kubectl version --client --short 2>/dev/null || kubectl version --client)"
