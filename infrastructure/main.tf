provider "azurerm" {
  features {}
}

locals {
  app_full_name = "${var.product}-${var.component}"
  aseName       = "core-compute-${var.env}"
  vaultName     = "${var.product}-${var.env}"
}

resource "azurerm_resource_group" "rg" {
  name     = "${var.product}-shared-${var.env}"
  location = var.location
  tags     = var.common_tags
}

data "azurerm_user_assigned_identity" "jenkins" {
  name                = "jenkins-${var.env}-mi"
  resource_group_name = "managed-identities-${var.env}-rg"
}

data "azurerm_subnet" "core_infra_redis_subnet" {
  name                 = "core-infra-subnet-1-${var.env}"
  virtual_network_name = "core-infra-vnet-${var.env}"
  resource_group_name  = "core-infra-${var.env}"
}

module "key-vault" {
  source                       = "git@github.com:hmcts/cnp-module-key-vault?ref=DTSPO-31965/remove-jenkins-ptl-access"
  product                      = var.product
  env                          = var.env
  tenant_id                    = var.tenant_id
  object_id                    = var.jenkins_AAD_objectId
  jenkins_object_id            = data.azurerm_user_assigned_identity.jenkins.principal_id
  resource_group_name          = azurerm_resource_group.rg.name
  product_group_name           = "dcd_ccd"
  common_tags                  = var.common_tags
  create_managed_identity      = true
  grant_preview_jenkins_access = var.env == "aat"
}

resource "azurerm_key_vault_secret" "app-insights-connection-string" {
  name         = "app-insights-connection-string"
  value        = module.application_insights.connection_string
  key_vault_id = module.key-vault.key_vault_id
}

module "application_insights" {
  source = "git@github.com:hmcts/terraform-module-application-insights?ref=4.x"

  env     = var.env
  product = var.product
  name    = var.product

  resource_group_name = azurerm_resource_group.rg.name

  common_tags = var.common_tags
}

data "azurerm_key_vault" "key_vault" {
  name                = "${var.product}-${var.env}"    # update these values if required
  resource_group_name = azurerm_resource_group.rg.name # update these values if required
}

data "azurerm_key_vault" "s2s_vault" {
  name                = "s2s-${var.env}"
  resource_group_name = "rpe-service-auth-provider-${var.env}"
}

data "azurerm_key_vault_secret" "key_from_vault" {
  name         = "microservicekey-cui-ra" # update key name e.g. microservicekey-your-name
  key_vault_id = data.azurerm_key_vault.s2s_vault.id
}

resource "azurerm_key_vault_secret" "s2s" {
  name         = "s2s-secret"
  value        = data.azurerm_key_vault_secret.key_from_vault.value
  key_vault_id = data.azurerm_key_vault.key_vault.id
}

module "redis6-cache" {
  source                        = "git@github.com:hmcts/cnp-module-redis?ref=4.x"
  product                       = var.product
  name                          = "${var.product}-${var.component}-${var.env}"
  location                      = var.location
  env                           = var.env
  private_endpoint_enabled      = true
  redis_version                 = "6"
  business_area                 = "cft"
  public_network_access_enabled = false
  common_tags                   = var.common_tags
  sku_name                      = var.sku_name
  family                        = var.family
  capacity                      = var.capacity

}

import {
  to = module.cuira-managed-redis.azurerm_managed_redis.redis
  id = "/subscriptions/8999dec3-0104-4a27-94ee-6588559729d1/resourceGroups/cui-ra-prod-rg/providers/Microsoft.Cache/redisEnterprise/cui-ra-prod"
}

module "cuira-managed-redis" {
  source      = "git@github.com:hmcts/terraform-module-azure-managed-redis?ref=main"
  product     = var.product
  location    = var.location
  env         = var.env
  common_tags = var.common_tags
  component   = var.component

  sku_name = var.managed_sku_name

  public_network_access   = "Disabled"
  create_private_endpoint = true
  subnet_id               = data.azurerm_subnet.core_infra_redis_subnet.id
  private_dns_zone_ids    = ["/subscriptions/${var.private_dns_subscription_id}/resourceGroups/core-infra-intsvc-rg/providers/Microsoft.Network/privateDnsZones/privatelink.redis.azure.net"]

  access_keys_authentication_enabled = true
}

////////////////////////////////
// Populate Vault with redis info
////////////////////////////////

resource "azurerm_key_vault_secret" "redis_host" {
  name         = "managed-redis-host"
  value        = module.cuira-managed-redis.hostname
  key_vault_id = data.azurerm_key_vault.key_vault.id
}

resource "azurerm_key_vault_secret" "redis_port" {
  name         = "managed-redis-port"
  value        = module.cuira-managed-redis.port
  key_vault_id = data.azurerm_key_vault.key_vault.id
}

resource "azurerm_key_vault_secret" "managed_redis_access_key" {
  name         = "managed-redis-access-key"
  value        = module.cuira-managed-redis.primary_access_key
  key_vault_id = data.azurerm_key_vault.key_vault.id
}

resource "azurerm_key_vault_secret" "redis_access_key" {
  name         = "redis-access-key"
  value        = module.redis6-cache.access_key
  key_vault_id = data.azurerm_key_vault.key_vault.id
}

resource "azurerm_key_vault_secret" "session_secret" {
  name         = "session-secret"
  value        = random_password.session_secret.result
  key_vault_id = data.azurerm_key_vault.key_vault.id
}

resource "random_password" "session_secret" {
  length           = 32
  override_special = "()-_"

  keepers = {
    rotation = var.session_secret_rotation
  }
}
