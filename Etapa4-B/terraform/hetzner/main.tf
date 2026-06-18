terraform {
  required_providers {
    hcloud = {
      source  = "hetznercloud/hcloud"
      version = "~> 1.48"
    }
  }
}

provider "hcloud" {
  token = var.hcloud_token
}

# ─── Red privada entre VPS ───
resource "hcloud_network" "tfi_network" {
  name     = "tfi-network"
  ip_range = "10.0.0.0/16"
}

resource "hcloud_network_subnet" "tfi_subnet" {
  network_id   = hcloud_network.tfi_network.id
  type         = "cloud"
  network_zone = "eu-central"
  ip_range     = "10.0.1.0/24"
}

# ─── VPS DESARROLLO ───
resource "hcloud_server" "dev" {
  name        = "tfi-dev"
  image       = "ubuntu-24.04"
  server_type = "cx22"
  location    = "nbg1"
  ssh_keys    = [var.ssh_key_id]
  user_data   = file("${path.module}/scripts/install-tools.sh")

  network {
    network_id = hcloud_network.tfi_network.id
  }

  labels = {
    environment = "dev"
    managed_by  = "terraform"
  }
}

# ─── VPS QA ───
resource "hcloud_server" "qa" {
  name        = "tfi-qa"
  image       = "ubuntu-24.04"
  server_type = "cx22"
  location    = "nbg1"
  ssh_keys    = [var.ssh_key_id]
  user_data   = file("${path.module}/scripts/install-tools.sh")

  network {
    network_id = hcloud_network.tfi_network.id
  }

  labels = {
    environment = "qa"
    managed_by  = "terraform"
  }
}

# ─── VPS UAT ───
resource "hcloud_server" "uat" {
  name        = "tfi-uat"
  image       = "ubuntu-24.04"
  server_type = "cx22"
  location    = "nbg1"
  ssh_keys    = [var.ssh_key_id]
  user_data   = file("${path.module}/scripts/install-tools.sh")

  network {
    network_id = hcloud_network.tfi_network.id
  }

  labels = {
    environment = "uat"
    managed_by  = "terraform"
  }
}

# ─── VPS PRODUCCIÓN (más grande) ───
resource "hcloud_server" "prod" {
  name        = "tfi-prod"
  image       = "ubuntu-24.04"
  server_type = "cpx31"
  location    = "nbg1"
  ssh_keys    = [var.ssh_key_id]
  user_data   = file("${path.module}/scripts/install-tools.sh")

  network {
    network_id = hcloud_network.tfi_network.id
  }

  labels = {
    environment = "prod"
    managed_by  = "terraform"
  }
}
