import passport from "passport";
import { NextFunction, Request, Response } from "express";
require("dotenv").config();

const loginController = {
  handleLogin: (req: Request, res: Response, next: NextFunction) =>
    passport.authenticate("local", (_err, user: any) => {
      if (!user) {
        return res.status(400).send({ message: "Invalid credentials" });
      }
      req.logIn(
        user,
        {
          maxAge: 1000 * 60 * 60 * 24 * 7,
          httpOnly: true,
        },
        (err) => {
          if (err) {
            return res.status(401).json({ message: "Problem with logging in" });
          }
          return res
            .status(200)
            .json({ username: user.username, email: user.email });
        }
      );
    })(req, res, next),
};

export default loginController;
