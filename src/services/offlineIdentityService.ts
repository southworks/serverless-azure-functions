import { spawn, SpawnOptions } from "child_process";
import fs from "fs";
import Serverless from "serverless";
import configConstants from "../config";
import { BaseService } from "./baseService";
import { PackageService } from "./packageService";
import { SecretsClient } from "@azure/keyvault-secrets";
import { AzureKeyVaultConfig } from "../models/serverless";
import { DefaultAzureCredential, ManagedIdentityCredential } from "@azure/identity";

export class OfflineIdentityService extends BaseService {

  public constructor(serverless: Serverless, options: Serverless.Options) {
    super(serverless, options, true);
  }

  public async eval() {
    const url = `https://sevennow-keyvault.vault.azure.net`;
    // const credentials = new DefaultAzureCredential();
    this.log(`CREDENTIALS: ${this.credentials}`);
    const credentials = new ManagedIdentityCredential(this.credentials.clientId);
    const keyVaultClient = new SecretsClient(url, credentials);
    this.log(`CHECK-IN`);

    try {
      const key = "MyCustomSecret";
      const secret = await keyVaultClient.getSecret(key);

      this.log(`[KEY VAULT] Value for ${key}: ${secret.value}`);
    } catch (error) {
      throw Error(error);
    }
  }

  // ===================================================================================================

  // public async eval() {
  //   const url = `https://sevennow-keyvault.vault.azure.net`;
  //   const credentials = new DefaultAzureCredential();
  //   const keyVaultClient = new SecretsClient(url, credentials);

  //   try {
  //     const key = "MyCustomSecret";
  //     const secret = await keyVaultClient.getSecret(key);

  //     this.log(`[KEY VAULT] Value for ${key}: ${secret.value}`);
  //   } catch (error) {
  //     throw Error(error);
  //   }
  // }

  // ===================================================================================================

  // public async eval() {
  //   const keyVaultConfig = this.serverless.service.provider["keyVault"] as AzureKeyVaultConfig;

  //   const url = `https://${keyVaultConfig.name}.vault.azure.net`;
  //   const credentials = new DefaultAzureCredential();

  //   const keyVaultClient = new SecretsClient(url, credentials);
  //   const keys = Object.keys(this.config.provider.environment);
  //   const secrets = keys.filter(x => x.includes("@Microsoft.KeyVault"));

  //   this.log("OfflineIdentityService");

  //   for (const secret of secrets) {
  //     try {
  //       const value = await keyVaultClient.getSecret(this.config.provider.environment[secret]);
  //       this.log(`[KEY VAULT] Value for ${secret}: ${value}`);
  //     } catch (error) {
  //       throw Error(error);
  //     }
  //   }
  // }
}
