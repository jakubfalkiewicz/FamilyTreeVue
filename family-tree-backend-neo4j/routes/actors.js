const express = require("express");
const router = express.Router({ mergeParams: true });
const driver = require("../config/neo4jDriver");

router.get("/", async (req, res) => {
  const session = driver.session();
  const wynik = await session.run("MATCH (a:Actor) RETURN a LIMIT 25");
  // return res.send(wynik.records.map((el) => el._fields[0].properties));
  return res.send(wynik);
});

router.get("/:id", async (req, res) => {
  const session = driver.session();
  const actorId = req.params.id;
  const wynik = await session.run(
    `MATCH (a)-[r]-(b) WHERE ID(a) = ${actorId} RETURN a,r `
  );
  return res.send(wynik);
});

router.post("/", async (req, res) => {
  const session = driver.session();
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const birthDate = req.body.birthDate;
  const treeId = req.body.treeId;
  if (firstName && lastName && birthDate) {
    await session
      .run(
        `CREATE (a:Actor {firstName : \'${firstName}\', lastName : \'${lastName}\', birthDate : \'${birthDate}\', treeId : \'${treeId}\'}) RETURN a.firstName`
      )
      .subscribe({
        onNext: (record) => {
          console.log("onNext:");
          console.log(record.get("a.firstName"));
        },
        onCompleted: () => {
          session.close();
          return res.send({
            firstName: firstName,
            lastName: lastName,
            birthDate: birthDate,
          });
        },
        onError: (error) => {
          console.log(error);
        },
      });
  } else {
    return res.send(
      `Empty fields: ${!firstName ? "firstName" : ""}${
        !lastName ? ", lastName" : ""
      }${!birthDate ? ", birthDate" : ""}`
    );
  }
});

router.put("/:id", async (req, res) => {
  const session = driver.session();
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const birthDate = req.body.birthDate;
  const actorId = req.params.id;

  await session
    .run(
      `MATCH (a) WHERE ID(a) = ${actorId} SET a.firstName = \'${firstName}\', a.lastName = \'${lastName}\', a.birthDate = \'${birthDate}\' RETURN a`
    )
    .subscribe({
      onCompleted: () => {
        session.close();
        return res.send({
          firstName: firstName,
          lastName: lastName,
          birthDate: birthDate,
        });
      },
      onError: (error) => {
        console.log(error);
      },
    });
});

router.delete("/:id", async (req, res) => {
  const session = driver.session();
  const actorId = req.params.id;
  await session
    .run(`MATCH (a) WHERE ID(a) = ${actorId} DETACH DELETE a`)
    .subscribe({
      onCompleted: () => {
        session.close();
        return res.send("usunieto aktora");
      },
      onError: (error) => {
        console.log(error);
      },
    });
});

router.post("/addFather/:id", async (req, res) => {
  const session = driver.session();
  const parentId = req.body.parentId;
  const childId = req.params.id;
  const wynik = await session.run(
    `MATCH (a:Actor), (b:Actor) WHERE ID(a) = ${parentId} AND ID(b) = ${childId} MERGE (a)-[r:IS_FATHER]->(b) RETURN r`
  );
  return res.send(wynik);
});

router.post("/addMother/:id", async (req, res) => {
  const session = driver.session();
  const parentId = req.body.id;
  const childId = req.params.id;
  const wynik = await session.run(
    `MATCH (a:Actor), (b:Actor) WHERE ID(a) = ${parentId} AND ID(b) = ${childId} MERGE (a)-[r:IS_MOTHER]->(b) RETURN r`
  );
  return res.send(wynik);
});

router.get("/getKids/:id", async (req, res) => {
  const session = driver.session();
  // const parentId = req.body.id;
  const parentId = req.params.id;
  const wynik = await session.run(
    `MATCH (a:Actor)-[r]->(b:Actor) WHERE ID(a) = ${parentId} RETURN b`
  );
  return res.send(wynik);
});

// router.get("/bySurname/:id", async (req, res) => {
//   const session = driver.session();
//   // const parentId = req.body.id;
//   const parentId = req.params.id;
//   const wynik = await session.run(
//     `MATCH (a:Actor)-[r]->(b:Actor) WHERE ID(a) = ${parentId} RETURN b`
//   );
//   return res.send(wynik);
// });

module.exports = router;
