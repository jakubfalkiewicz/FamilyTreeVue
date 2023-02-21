const express = require("express");
const router = express.Router();
const checkAuthenticated = require("../middleware/checkAuthenticated");

const Room = require("../models/Room");

// Pobranie danych wszystkich pokoi
router.get("/", checkAuthenticated, async (req, res) => {
  const rooms = await Room.find({});
  return res.send(rooms);
});

// Utworzenie nowego pokoju
router.post("/", async (req, res) => {
  console.log(req.body);
  Room.create(req.body)
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.status(400);
      res.end(error);
    });
});

router.put("/:roomId", async (req, res) => {
  const id = req.params.roomId;
  const filter = { _id: id };
  console.log(req.body);
  const updatedRoom = await Room.findByIdAndUpdate(filter, { ...req.body });
  return res.send({ updatedRoom: updatedRoom });
});

// Pobranie danych pokoju o podanym roomId
router.get("/:roomId", async (req, res) => {
  const id = req.params.roomId;
  const room = await Room.find({ _id: id });
  return res.send(room);
});

router.post("/join/:roomId", async (request, response) => {
  try {
    const room = await Room.findOne({ _id: request.body._id }).exec();
    if (!room) {
      return response.status(400).send({ message: "The _id does not exist" });
    }
    room.comparePassword(request.body.password, async (error, match) => {
      if (!match) {
        return response
          .status(400)
          .send({ message: "The password is invalid", correct: false });
      } else {
        room.joinedUsers.push(request.body.userToJoin);
        const update = {
          joinedUsers: room.joinedUsers,
        };
        const filter = { _id: request.body._id };
        const updatedRoom = await Room.findByIdAndUpdate(filter, update);
        response.send({
          correct: true,
          updatedRoomList: room.joinedUsers,
        });
      }
    });
    //ROOM ADD NEW USER TO USERLIST
    // response.send({...room._doc, logged: true });
  } catch (error) {
    response.status(500).send(error);
  }
});

// Usuniecie pokoju o podanym roomId
router.delete("/:roomId", async (req, res) => {
  const id = req.params.roomId;
  const roomToDelete = await Room.findByIdAndDelete({ _id: id });
  return res.send({
    deletedRoomId: id,
  });
});

module.exports = router;
