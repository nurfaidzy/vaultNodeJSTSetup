const express = require("express");
const nodeVault = require("node-vault");
require('dotenv').config();

const app = express();

const vault = nodeVault({
  apiVersion: "v1",
  endpoint: "http://127.0.0.1:8200",
  token: process.env.VAULT_TOKEN,
});

const getDataFromVault = async () => {
  try {
    const { data } = await vault.read("secret/data/devWeb");
    return data;
  } catch (error) {
    throw error;
  }
};

const startServer = async () => {
  try {
    const data = await getDataFromVault();
    const { port } = data.data;
    if (!data) {
      throw new Error("Cant reach vault");
    }

    app.get("/", (req, res) => {
      res.send("Hello World");
    });

    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
};

startServer();
