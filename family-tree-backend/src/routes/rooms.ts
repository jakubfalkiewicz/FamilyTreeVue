import express, { Router, Request, Response } from "express";
import checkAuthenticated from "../middleware/checkAuthenticated";
import Room from "../models/Room";
import IRoom from "../models/IRoom";


const router: Router = Router();

// Pobranie danych wszystkich pokoi
router.get("/", checkAuthenticated, async (req: Request, res: Response) => {
  const rooms: IRoom[] = await Room.find({});
  return res.send(rooms);
});

// Utworzenie nowego pokoju
router.post("/", checkAuthenticated, async (req: Request, res: Response) => {
  console.log(req.body);
  try {
    const room: IRoom = await Room.create(req.body);
    res.send(room);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.put("/:roomId", checkAuthenticated, async (req: Request, res: Response) => {
  const id: string = req.params.roomId;
  const filter = { _id: id };
  console.log(req.body);
  const updatedRoom = await Room.findByIdAndUpdate(filter, { ...req.body });
  return res.send({ updatedRoom: updatedRoom });
});

// Pobranie danych pokoju o podanym roomId
router.get("/:roomId", checkAuthenticated, async (req: Request, res: Response) => {
  const id: string = req.params.roomId;
  const room: IRoom[] = await Room.find({ _id: id });
  return res.send(room);
});


// Usuniecie pokoju o podanym roomId
router.delete("/:roomId", checkAuthenticated, async (req: Request, res: Response) => {
  const id: string = req.params.roomId;
  await Room.findByIdAndDelete({ _id: id });
  return res.send({
    deletedRoomId: id,
  });
});

export default router;