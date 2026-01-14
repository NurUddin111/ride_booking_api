/* eslint-disable @typescript-eslint/no-explicit-any */

import bcrypt from "bcryptjs";
import { Strategy as LocalStrategy } from "passport-local";
import {
  Strategy as GoogleStrategy,
  Profile,
  VerifyCallback,
} from "passport-google-oauth20";

import { IUser, Role } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import { envVars } from "./env";
import passport from "passport";
import { checkUserStatus } from "../utils/checkUserStatus";
import { HydratedDocument } from "mongoose";
import { Request } from "express";

export type DoneFunction = (
  error: Error | null,
  user?: IUser | false,
  options?: { message: string }
) => void;

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (
      req: Request,
      email: string,
      password: string,
      done: DoneFunction
    ) => {
      try {
        const user = (await User.findOne({ email }).select(
          "+password"
        )) as HydratedDocument<IUser>;

        if (!user) {
          return done(null, false, {
            message: "No account found with this email",
          });
        }

        if (user.isDeleted) {
          return done(null, false, {
            message: "User is deleted!",
          });
        }

        if (!user.isVerified) {
          return done(null, false, {
            message: "User is not verified!",
          });
        }

        const isGoogleAuthenticated = user.auths.some(
          (providerObject) => providerObject.provider === "google"
        );

        if (isGoogleAuthenticated && !user.password) {
          return done(null, false, {
            message:
              "The email address you entered is associated with an account created using 'Log in with Google'. To access your account, please click the Google button. If you'd like to set a password for future logins, you can do so in your account settings after logging in.",
          });
        }

        const isPasswordMatched = await bcrypt.compare(
          password,
          user.password as string
        );

        if (!isPasswordMatched) {
          return done(null, false, { message: "Incorrect Password" });
        }

        return done(null, user);
      } catch (error) {
        console.error(error);
      }
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: envVars.GOOGLE_CLIENT_ID,
      clientSecret: envVars.GOOGLE_CLIENT_SECRET,
      callbackURL: envVars.GOOGLE_CALLBACK_URL,
      passReqToCallback: true,
    },
    async (
      req: Request,
      accessToken: string,
      refreshToke: string,
      profile: Profile,
      done: VerifyCallback
    ) => {
      try {
        let email;

        if (profile.emails && profile.emails.length > 0) {
          email = profile.emails.find((email) => email.verified)?.value;
        } else {
          return done(null, false, { message: "Email Not Found" });
        }

        let user = (await User.findOne({ email }).select(
          "+password"
        )) as HydratedDocument<IUser>;

        if (!user) {
          user = await User.create({
            name: profile.displayName,
            email,
            picture: profile.photos?.[0].value,
            role: Role.RIDER,
            isVerified: true,
            auths: [
              {
                provider: "google",
                providerId: profile.id,
              },
            ],
          });

          return done(null, user);
        }

        checkUserStatus(req, user, email as string);

        const isCredentialsAuthenticated = user.auths.some(
          (providerObject) => providerObject.provider === "credentials"
        );

        if (isCredentialsAuthenticated) {
          return done(null, false, {
            message: `An account with ${user.email} already exists. Please sign in with your email and password to link your Google account to your profile.`,
          });
        }

        return done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.serializeUser((user: any, done: (err: any, id?: string) => void) => {
  done(null, user._id);
});

passport.deserializeUser(
  async (id: string, done: (err: any, user?: any) => void) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  }
);
