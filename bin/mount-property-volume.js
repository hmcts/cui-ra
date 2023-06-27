const os = require('os');
const path = require('path');
const { AzureCliCredential } = require('@azure/identity');
const { SecretClient } = require('@azure/keyvault-secrets');

const subprocess = require('child_process');
const fs = require('fs');

async function mount(vaultName, nameSpace, outputDir = null) {
  if (!outputDir) {
    throw new Error('mount point is required');
  }

  try {
    // Create an Azure CLI credential
    const credential = new AzureCliCredential();

    // Create a SecretClient
    const vaultUrl = `https://${vaultName}.vault.azure.net/`;
    const client = new SecretClient(vaultUrl, credential);

    // Get all secrets from the Key Vault
    const secrets = client.listPropertiesOfSecrets();

    // Create the output directory if it doesn't exist
    if (outputDir) {
      fs.mkdir(path.join(outputDir, nameSpace), { recursive: true });
    }

    // Loop through the secrets and store them in files
    for await (const secretProperties of secrets) {
      const secretName = secretProperties.name;
      const secretValue = await client.getSecret(secretName);

      // Define the output file path
      const filePath = outputDir ? path.join(outputDir, nameSpace, secretName) : secretName;

      // Write the secret value to the file
      fs.writeFileSync(filePath, secretValue.value);

      console.log(`Secret '${secretName}' stored in '${filePath}'`);
    }
    console.log(
      `Make sure that the folder '${outputDir}' is added to gitignore to prevent secrets from being added to your repository'`
    );
  } catch (error) {
    if (error.name === 'CredentialUnavailableError') {
      throw new Error("Azure CLI credential is not available. Please log in using 'az login'.");
    } else {
      throw new Error(error);
    }
  }
}

const env = process.env.REMOTE_ENV;
if (!env) {
  throw new Error('Environment variable REMOTE_ENV is required');
}
const namespace = process.env.NAMESPACE;
if (!namespace) {
  throw new Error("Namespace is required. for example 'cui'");
}
let mountPoint = process.env.MOUNT_POINT;
if (!mountPoint) {
  mountPoint = './secrets';
}

async function run() {
  const vaultName = env;
  const namseSpace = namespace;
  const outputDir = mountPoint;

  await mount(vaultName, namseSpace, outputDir);
}

run();
