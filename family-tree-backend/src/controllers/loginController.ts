import passport from "passport";
import { NextFunction, Request, Response } from "express";
require("dotenv").config();

const loginController = {
  handleLogin: (req: Request, res: Response, next: NextFunction) =>
    passport.authenticate("local", (_err: any, user: any) => {
      if (!user) {
        return res.status(400).send({ message: "Invalid credentials" });
      }
      req.logIn(
        user,
        // {
        //   maxAge: 36000,
        //   httpOnly: true,
        // },
        (err) => {
          if (err) {
            return res.status(401).json({ message: "Problem with logging in" });
          }
          return res
            .status(200)
            .json({ username: user.username, email: user.email, _id: user._id });
        }
      );
    })(req, res, next),
};

export default loginController;
