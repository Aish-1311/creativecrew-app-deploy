const { SecretManagerServiceClient } = require("@google-cloud/secret-manager");
require("dotenv").config();

const client = new SecretManagerServiceClient();

async function getSecret(name) {
  const [version] = await client.accessSecretVersion({
    name: `projects/${process.env.GCP_PROJECT_ID}/secrets/${name}/versions/latest`,
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  });
  return version.payload.data.toString("utf8");
}

module.exports = { getSecret };
