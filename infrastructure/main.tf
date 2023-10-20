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

data "azurerm_user_assigned_identity" "cmc-identity" {
 name                = "${var.product}-${var.env}-mi"
 resource_group_name = "managed-identities-${var.env}-rg"
}

module "key-vault" {
  source                  = "git@github.com:hmcts/cnp-module-key-vault?ref=master"
  product                 = var.product
  env                     = var.env
  tenant_id               = var.tenant_id
  object_id               = var.jenkins_AAD_objectId
  resource_group_name     = azurerm_resource_group.rg.name
  product_group_name      = "dcd_ccd"
  common_tags             = var.common_tags
  create_managed_identity = true
  managed_identity_object_ids = [data.azurerm_user_assigned_identity.cmc-identity.principal_id]
}

resource "azurerm_key_vault_secret" "AZURE_APPINSGHTS_KEY" {
  name         = "AppInsightsInstrumentationKey"
  value        = azurerm_application_insights.appinsights.instrumentation_key
  key_vault_id = module.key-vault.key_vault_id
}

resource "azurerm_application_insights" "appinsights" {
  name                = "${var.product}-${var.env}"
  location            = var.location
  resource_group_name = azurerm_resource_group.rg.name
  application_type    = "web"
  tags                = var.common_tags
}

//data "azurerm_subnet" "core_infra_redis_subnet" {
//  name                 = "core-infra-subnet-1-${var.env}"
//  virtual_network_name = "core-infra-vnet-${var.env}"
//  resource_group_name = "core-infra-${var.env}"
//}

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
  source                        = "git@github.com:hmcts/cnp-module-redis?ref=master"
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

////////////////////////////////
// Populate Vault with redis info
////////////////////////////////

resource "azurerm_key_vault_secret" "redis_access_key" {
  name         = "redis-access-key"
  value        = module.redis6-cache.access_key
  key_vault_id = data.azurerm_key_vault.key_vault.id
}