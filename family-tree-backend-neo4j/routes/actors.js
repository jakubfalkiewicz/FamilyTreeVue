const express = require("express");
const router = express.Router({ mergeParams: true });
const driver = require("../config/neo4jDriver");

router.get("/", async (req, res) => {
  const session = driver.session();
  const actors = await session.run(
    "MATCH (a:Actor) RETURN { id: toString(ID(a)), firstName: a.firstName , lastName: a.lastName, gender: a.gender, birthDate: a.birthDate, treeId: a.treeId } as Actor"
  );
  const actorsList = actors.records
    .map((record) => record._fields[0])
    .reduce((prev, curr) => {
      if (prev.map((el) => el.id).includes(curr.id)) {
        return [...prev];
      } else {
        return [...prev, curr];
      }
    }, []);
  const relations = await session.run(
    "MATCH (a:Actor)-[r]-() RETURN { id: toString(ID(r)), treeId: r.treeId, default: r.default, type: type(r), from: toString(ID(startNode(r))), to: toString(ID(endNode(r))) } as Relation"
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
    `MATCH (a) WHERE ID(a) = ${actorId} RETURN { id: toString(ID(a)), firstName: a.firstName , lastName: a.lastName,  birthDate: a.birthDate, gender: a.gender, treeId: a.treeId } as Actor `
  );
  return res.send(wynik.records[0]._fields[0]);
});

router.post("/", async (req, res) => {
  const session = driver.session();
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const gender = req.body.gender;
  const birthDate = req.body.birthDate;
  const treeId = req.body.treeId;
  if (firstName && lastName && birthDate) {
    await session
      .run(
        `CREATE (a:Actor {firstName : \'${firstName}\', lastName : \'${lastName}\', gender : \'${gender}\', birthDate : \'${birthDate}\', treeId : \'${treeId}\'}) RETURN ID(a)`
      )
      .then((response) => {
        return res.send({
          firstName: firstName,
          lastName: lastName,
          birthDate: birthDate,
          gender: gender,
          treeId: treeId,
          id: response.records[0]._fields[0].low,
        });
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
  const gender = req.body.gender;
  const actorId = req.params.id;

  await session
    .run(
      `MATCH (a) WHERE ID(a) = ${actorId} SET a.firstName = \'${firstName}\', a.lastName = \'${lastName}\', a.birthDate = \'${birthDate}\', a.gender = \'${gender}\' RETURN a`
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

router.delete("/deleteAll", async (req, res) => {
  const session = driver.session();
  const wynik = await session.run(`MATCH (a:Actor) DETACH DELETE a`);
  return res.send(wynik);
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
  const actors = await session.run(
    `MATCH (b)-[r:IS_FATHER]->(a) WHERE ID(a)=${childId} RETURN b`
  );
  if (actors.records.map((record) => record._fields[0].properties).length > 0) {
    const wynik = await session.run(
      `MATCH (a:Actor), (b:Actor) WHERE ID(a) = ${parentId} AND ID(b) = ${childId} MERGE (a)-[r:IS_FATHER {treeId: a.treeId, default: false}]->(b) RETURN r`
    );
    return res.send(wynik);
  } else {
    const wynik = await session.run(
      `MATCH (a:Actor), (b:Actor) WHERE ID(a) = ${parentId} AND ID(b) = ${childId} MERGE (a)-[r:IS_FATHER {treeId: a.treeId, default: true}]->(b) RETURN r`
    );
    return res.send(wynik);
  }
});

router.post("/addMother/:id", async (req, res) => {
  const session = driver.session();
  const parentId = req.body.parentId;
  const childId = req.params.id;
  const actors = await session.run(
    `MATCH (b)-[r:IS_MOTHER]->(a) WHERE ID(a)=${childId} RETURN b`
  );
  if (actors.records.map((record) => record._fields[0].properties).length > 0) {
    const wynik = await session.run(
      `MATCH (a:Actor), (b:Actor) WHERE ID(a) = ${parentId} AND ID(b) = ${childId} MERGE (a)-[r:IS_MOTHER {treeId: a.treeId, default: false}]->(b) RETURN r`
    );
    return res.send(wynik);
  } else {
    const wynik = await session.run(
      `MATCH (a:Actor), (b:Actor) WHERE ID(a) = ${parentId} AND ID(b) = ${childId} MERGE (a)-[r:IS_MOTHER {treeId: a.treeId, default: true}]->(b) RETURN r`
    );
    return res.send(wynik);
  }
});

router.get("/mothers/:id", async (req, res) => {
  const session = driver.session();
  const id = req.params.id;
  const actors = await session.run(
    `MATCH (b)-[r:IS_MOTHER {default: false}]->(a) WHERE ID(a)=${id} RETURN { id: toString(ID(b)), firstName: b.firstName , lastName: b.lastName, gender: b.gender, birthDate: b.birthDate, treeId: b.treeId } as Actor`
  );
  return res.send(actors.records.map((e) => e._fields[0]));
});

router.get("/fathers/:id", async (req, res) => {
  const session = driver.session();
  const id = req.params.id;
  const actors = await session.run(
    `MATCH (b)-[r:IS_FATHER {default: false}]->(a) WHERE ID(a)=${id} RETURN { id: toString(ID(b)), firstName: b.firstName , lastName: b.lastName, gender: b.gender, birthDate: b.birthDate, treeId: b.treeId } as Actor`
  );
  return res.send(actors.records.map((e) => e._fields[0]));
});

router.put("/setDefault/:id", async (req, res) => {
  const session = driver.session();
  const childId = req.params.id;
  const parentId = req.body.id;
  const targetParent = await session.run(
    `MATCH (a) WHERE ID(a)=${parentId} RETURN a`
  );
  if (targetParent.records[0]._fields[0].properties.gender === "male") {
    const actualDefault = await session.run(
      `MATCH (a)-[r:IS_FATHER {default: true}]->(b) WHERE ID(b)=${childId} SET r.default=false RETURN r`
    );
    const newDefault = await session.run(
      `MATCH (a)-[r:IS_FATHER {default: false}]->(b) WHERE ID(a) = ${parentId} AND ID(b) = ${childId} SET r.default=true RETURN r`
    );
    return res.send(newDefault.records[0]._fields[0]);
  } else {
    const actualDefault = await session.run(
      `MATCH (a)-[r:IS_MOTHER {default: true}]->(b) WHERE ID(b)=${childId} SET r.default=false RETURN r`
    );
    const newDefault = await session.run(
      `MATCH (a)-[r:IS_MOTHER {default: false}]->(b) WHERE ID(a) = ${parentId} AND ID(b) = ${childId} SET r.default=true RETURN r`
    );
    return res.send(newDefault.records[0]._fields[0]);
  }
  // return res.send(targetParent.records[0]._fields[0].properties);
});

router.post("/potentialAncestors/:id", async (req, res) => {
  const session = driver.session();
  const userId = req.params.id;
  const gender = req.body.gender;
  const user = await session.run(`MATCH (a) WHERE ID(a)=${userId} RETURN a`);
  const formatted = user.records[0]._fields[0].properties;
  const ancestors = await session.run(
    `MATCH (b:Actor {treeId:'${
      formatted.treeId
    }'}),(a:Actor) WHERE ID(a)=${userId}
   AND date(b.birthDate) ${gender ? "<" : ">"} date(a.birthDate) ${
      gender ? `AND b.gender='${gender}'` : ""
    }
   RETURN {
     id: toString(ID(b)),
     firstName: b.firstName,
     lastName: b.lastName,
     gender: b.gender,
     birthDate: b.birthDate,
     treeId: b.treeId
   } as Actor`
  );
  return res.send(ancestors.records.map((e) => e._fields[0]));
});

router.post("/cloneSubgraph/:id", async (req, res) => {
  const session = driver.session();
  const toId = req.params.id;
  const fromId = req.body.id;
  const treeId = req.body.treeId;
  const subgraph = await session.run(`
    MATCH (p1:Actor) WHERE id(p1)=${fromId}
          MATCH (p2:Actor) WHERE id(p2)=${toId}
          MATCH path = (p1)-[:IS_FATHER|IS_MOTHER*]-()
          WITH p1,p2, collect(path) as paths
          CALL apoc.refactor.cloneSubgraphFromPaths(paths, {
              standinNodes:[[p1, p2]],
              skipProperties: ['treeId']
          })
          YIELD input, output, error
          RETURN input, output, error
  `);
  const fixRelsId = await session.run(
    `MATCH ()-[r:IS_FATHER|IS_MOTHER]->()
           WHERE r.treeId IS NULL
           SET r.treeId = '${treeId}'`
  );
  const fixNodesId = await session.run(
    `MATCH (p:Actor)
          WHERE p.treeId IS NULL
          SET p.treeId='${treeId}'`
  );
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
