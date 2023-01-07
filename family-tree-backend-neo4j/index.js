const express = require("express");
const app = express();
const actors = require("./routes/actors");
require("dotenv").config();
const cors = require("cors");
app.use(cors());
app.options("*", cors()); // include before other routes

app.use(express.json());

try {
  require("./config/neo4jDriver");

  app.use("/actors", actors);

  console.log(`Connected to Neo4J.`);
  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`API server listening at http://localhost:${port}`);
  });
} catch (ex) {
  console.error("Error connecting to Neo4J", ex);
}
