import dotenv from "dotenv";
import { defineConfig } from "cypress";
import { addCucumberPreprocessorPlugin } from "@badeball/cypress-cucumber-preprocessor";
import addTestCoveragePlugin from "@cypress/code-coverage/task";
import addWebpackPreprocessorPlugin from "./cypress/plugins/addWebpackPreprocessorPlugin";
import path from "path";

const configFromEnv = dotenv.config({
  path: path.resolve(__dirname, ".env.local")
});

dotenv.config();

export default defineConfig({
  defaultCommandTimeout: 15000,
  e2e: {
    baseUrl: process.env.CLIENT_URL,
    env: {
      ROLE_ADMIN_EMAIL: process.env.ROLE_ADMIN_EMAIL,
      ROLE_ADMIN_PASSWORD: process.env.ROLE_ADMIN_PASSWORD,
      ROLE_MANAGER_EMAIL: process.env.ROLE_MANAGER_EMAIL,
      ROLE_MANAGER_PASSWORD: process.env.ROLE_MANAGER_PASSWORD,
      ROLE_USER_EMAIL: process.env.ROLE_USER_EMAIL,
      ROLE_USER_PASSWORD: process.env.ROLE_USER_PASSWORD,
    },
    async setupNodeEvents(on, config) {
      addWebpackPreprocessorPlugin(on, config);
      addTestCoveragePlugin(on, config);
      await addCucumberPreprocessorPlugin(on, config);
      return config;
    },
    specPattern: "cypress/features/**/*.feature",
    supportFile: "cypress/support/index.ts"
  },
  env: {
    TAGS: "not @ignore",
    windowMode: "desktop",
    ...configFromEnv.parsed
  },
  execTimeout: 15000,
  pageLoadTimeout: 20000,
  retries: 2,
  screenshotsFolder: "results/screenshots",
  video: false,
  viewportHeight: 850,
  viewportWidth: 1280
});
