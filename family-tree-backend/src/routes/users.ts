import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User";
import checkAuthenticated from "../middleware/checkAuthenticated";
import loginController from "../controllers/loginController";
import logoutController from "../controllers/logoutController";

require("dotenv").config();


const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message;
  return String(error);
};

const router = Router();

// Pobranie danych wszystkich użytkowników
router.get("/", checkAuthenticated , async (req: Request, res: Response) => {
  try {
    const users = await User.find({});

    return res.status(200).json({ users });
  } catch (error) {
    console.log(getErrorMessage(error));
    res.status(500).json(getErrorMessage(error));
  }
});

// Utworzenie nowego użytkownika
router.post("/register", async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    return res.json({
      username: user.username,
      email: user.email,
    });
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(402).json({ error: "Username or email taken" });
    }
    console.log(getErrorMessage(error));
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

router.post("/login", loginController.handleLogin);

router.post("/logout", checkAuthenticated, logoutController.handleLogout);

router.get("/:userId", checkAuthenticated, async (req: Request, res: Response) => {
  try {
    const id = req.params.userId;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    return res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.put("/:userId", checkAuthenticated, async (req: Request, res: Response) => {
  try {
    const id = req.params.userId;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    const updatedUser = await user.save();
    return res.send({ updatedUser: updatedUser });
  } catch (error) {
    res.status(500).send(error);
  }
});

router.delete("/deleteAll", checkAuthenticated, async (req: Request, res: Response) => {
  try {
    await User.deleteMany({});
    return res.send("Deleted all");
  } catch (error) {
    res.status(500).send(error);
  }
});

router.delete("/:userId", checkAuthenticated, async (req: Request, res: Response) => {
  try {
    const id = req.params.userId;
    const userToDelete = await User.findByIdAndDelete(id);
    if (!userToDelete) {
      return res.status(404).send({ message: "User not found" });
    }
    return res.send({ deletedUserId: id });
  } catch (error) {
    res.status(400).send(error);
  }})

export default router;