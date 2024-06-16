import { User } from "@prisma/client";
import bcrypt from "bcrypt";
import { db } from "../helpers/db";
import { ParameterizedContext } from "koa";
import { sign, verify } from "jsonwebtoken";
import { UserModel, mapUserToModel } from "../models/User";

const saltRounds = parseInt(process.env.PASSWORD_SALT_ROUNDS!);
const jwtSecret = process.env.JWT_SECRET!;
const jwtExpiresIn = process.env.JWT_EXPIRES_IN!;

if (!saltRounds || !jwtSecret || !jwtExpiresIn) {
  throw new Error("Missing environment variables");
}

export default abstract class AuthService {
  public static readonly JWT_COOKIE_NAME = "token";

  /**
   * Attempts to log in a user with the given username and password
   *
   * @param username The username of the user
   * @param password The password of the user
   *
   * @returns The user if the login was successful, otherwise null
   */
  public static async login(username: string, password: string): Promise<User | null> {
    const user = await db.user.findUnique({
      where: {
        username,
      },
    });

    if (!user) {
      return null;
    }

    const isPasswordCorrect = await this.verifyPassword(password, user.password);
    if (!isPasswordCorrect) {
      return null;
    }

    return user;
  }

  /**
   * Attempts to register a user with the given email, username, and password
   *
   * @param email The email of the user
   * @param username The username of the user
   * @param password The password of the user
   *
   * @returns The user if the registration was successful, otherwise null
   */
  public static async register(email: string, username: string, password: string): Promise<User | null> {
    const existingUsers = await db.user.findMany({
      where: {
        OR: [
          {
            email,
          },
          {
            username,
          },
        ],
      },
    });
    if (existingUsers.length > 0) {
      return null;
    }

    const hashedPassword = await this.hashPassword(password);
    const user = await db.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
      },
    });

    return user;
  }

  /**
   * Sets the JWT token in the response cookies of the context for the given user
   *
   * @param ctx The Koa context
   * @param user The user to set the token for
   */
  public static async requestToken(ctx: ParameterizedContext, user: User) {
    const token = this.generateToken(user);

    ctx.cookies.set(this.JWT_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
  }

  /**
   * Authenticates the user based on the JWT token in the request cookies
   *
   * @param ctx The Koa context
   *
   * @returns The user if the token is valid, otherwise null
   */
  public static async authenticate(ctx: ParameterizedContext): Promise<User | null> {
    const token = ctx.cookies.get(this.JWT_COOKIE_NAME);
    if (!token) {
      return null;
    }

    const user = this.verifyToken(token);
    if (!user) {
      return null;
    }

    return await db.user.findUnique({
      where: {
        id: user.id,
      },
    });
  }

  private static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  private static async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, saltRounds);
  }

  private static generateToken(user: User): string {
    return sign(mapUserToModel(user), jwtSecret, { expiresIn: jwtExpiresIn });
  }

  private static verifyToken(token: string): UserModel | null {
    try {
      return <UserModel>verify(token, jwtSecret);
    } catch {
      return null;
    }
  }
}
