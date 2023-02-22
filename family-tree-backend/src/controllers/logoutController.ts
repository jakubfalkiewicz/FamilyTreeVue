import { NextFunction, Response, Request } from "express";

const logoutController = {
  handleLogout: (req: Request, res: Response, next: NextFunction) => {
    req.logout(function (err: Error) {
      if (err) {
        return next(err);
      }
      res.status(200).json({ message: "Logged out" });
    });
  },
};

export default logoutController;