import passport from "passport";
import { JWT_SECRET } from "../config";
import { JwtPayload } from "jsonwebtoken";
import { user } from "../models/user";
import { Strategy, ExtractJwt, StrategyOptions } from "passport-jwt";

const opts: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET,
};

passport.use(
  new Strategy(opts, async function (jwt_payload: JwtPayload, done) {
    try {
      const queryuser = await user.findById(jwt_payload.id);
      if (!queryuser) {
        return done(new Error("User cannot be found."), undefined);
      } else {
        return done(null, queryuser);
      }
    } catch (error) {
      done(error);
    }
  })
);

const isLogin = passport.authenticate("jwt", { session: false });

export { isLogin };
