const express = require("express");
const router = express.Router({ mergeParams: true });
const driver = require("../config/neo4jDriver");

router.get("/", async (req, res) => {
  const session = driver.session();
  const actors = await session.run(
    "MATCH (a:Actor) RETURN { id: toString(ID(a)), firstName: a.firstName , lastName: a.lastName, gender: a.gender, generation: a.generation , birthDate: a.birthDate, treeId: a.treeId } as Actor"
  );
  const actorsList = actors.records
    .map((record) => record._fields[0])
    .reduce((prev, curr) => {
      if (prev.map((el) => el.id).includes(curr.id)) {
        return [...prev];
      } else {
        return [...prev, curr];
      }
    }, [])
    .sort(function (a, b) {
      return b.generation - a.generation;
    });
  const relations = await session.run(
    "MATCH (a:Actor)-[r]-() RETURN { id: toString(ID(r)), type: type(r), from: toString(ID(startNode(r))), to: toString(ID(endNode(r))) } as Relation"
  );
  const relationsList = relations.records
    .map((record) => record._fields[0])
    .reduce((prev, curr) => {
      if (prev.map((el) => el.id).includes(curr.id)) {
        return [...prev];
      } else {
        return [...prev, curr];
      }
    }, []);
  return res.send({ nodes: actorsList, edges: relationsList });
});

router.get("/:id", async (req, res) => {
  const session = driver.session();
  const actorId = req.params.id;
  const wynik = await session.run(
    `MATCH (a) WHERE ID(a) = ${actorId} RETURN { id: toString(ID(a)), firstName: a.firstName , lastName: a.lastName,  birthDate: a.birthDate, gender: a.gender,  generation: a.generation, treeId: a.treeId } as Actor `
  );
  return res.send(wynik.records[0]._fields[0]);
});

router.post("/", async (req, res) => {
  const session = driver.session();
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const gender = req.body.gender;
  const generation = req.body.generation;
  const birthDate = req.body.birthDate;
  const treeId = req.body.treeId;
  if (firstName && lastName && birthDate) {
    await session
      .run(
        `CREATE (a:Actor {firstName : \'${firstName}\', lastName : \'${lastName}\', gender : \'${gender}\', birthDate : \'${birthDate}\', generation : \'${generation}\', treeId : \'${treeId}\'}) RETURN ID(a)`
      )
      .then((response) => {
        return res.send({
          firstName: firstName,
          lastName: lastName,
          birthDate: birthDate,
          generation: generation,
          gender: gender,
          treeId: treeId,
          id: response.records[0]._fields[0].low,
        });
      });
    //   onNext: (record) => {
    //     console.log("onNext:");
    //     console.log(JSON.parse(record.get("ID(a)")));
    //     let id = JSON.parse(record.get("ID(a)"));
    //   },
    //   onCompleted: (data) => {
    //     console.log(id);
    //     session.close();
    //     return res.send({
    //       firstName: firstName,
    //       lastName: lastName,
    //       birthDate: birthDate,
    //       generation: generation,
    //       gender: gender,
    //       treeId: treeId,
    //     });
    //   },
    //   onError: (error) => {
    //     console.log(error);
    //   },
    // });
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
  const generation = req.body.generation;
  const gender = req.body.gender;
  const actorId = req.params.id;

  await session
    .run(
      `MATCH (a) WHERE ID(a) = ${actorId} SET a.firstName = \'${firstName}\', a.lastName = \'${lastName}\', a.birthDate = \'${birthDate}\', a.generation = \'${generation}\', a.gender = \'${gender}\' RETURN a`
    )
    .subscribe({
      onCompleted: () => {
        session.close();
        return res.send({
          ...req.body,
        });
      },
      onError: (error) => {
        console.log(error);
      },
    });
});

router.delete("/delRel", async (req, res) => {
  const session = driver.session();
  const childId = req.body.childId;
  const parentId = req.body.parentId;
  await session
    .run(
      `MATCH (a:Actor)-[r]->(b:Actor) WHERE ID(a)=${parentId} AND ID(b)=${childId} delete r`
    )
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
    `MATCH (a:Actor), (b:Actor) WHERE ID(a) = ${parentId} AND ID(b) = ${childId} MERGE (a)-[r:IS_FATHER {treeId: a.treeId}]->(b) RETURN r`
  );
  return res.send(wynik);
});

router.post("/addMother/:id", async (req, res) => {
  const session = driver.session();
  const parentId = req.body.parentId;
  const childId = req.params.id;
  const wynik = await session.run(
    `MATCH (a:Actor), (b:Actor) WHERE ID(a) = ${parentId} AND ID(b) = ${childId} MERGE (a)-[r:IS_MOTHER {treeId: a.treeId}]->(b) RETURN r`
  );
  return res.send(wynik);
});

router.post("/addPartner/:id", async (req, res) => {
  const session = driver.session();
  const partnerId = req.body.partnerId;
  const partner2Id = req.params.id;
  const wynik = await session.run(
    `MATCH (a:Actor), (b:Actor) WHERE ID(a) = ${partnerId} AND ID(b) = ${partner2Id} MERGE (a)-[r:PARTNER]-(b) RETURN r`
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
