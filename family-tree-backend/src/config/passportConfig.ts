import { PassportStatic } from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import User from "../models/User";
import bcrypt from "bcryptjs";

const initialize = (passport: PassportStatic) => {
  const authenticateUser = async (
    username: string,
    password: string,
    done: any
  ) => {
    const user = await User.findOne({ username }).lean();

    if (!user) {
      return done(null, false, { message: "User not found" });
    }

    try {
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user);
      } else {
        return done(null, false, { message: "Incorrect password" });
      }
    } catch (error: any) {
      return done(error);
    }
  };

  passport.use(new LocalStrategy({ usernameField: "username" }, authenticateUser));

  passport.serializeUser((user: any, done: any) => {
    done(null, user.username);
  });

  passport.deserializeUser(async (username: string, done: any) => {
    const user = await User.findOne({ username }).lean();
    return done(null, user);
  });
};

export default initialize;
