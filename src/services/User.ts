import { User } from "@prisma/client";
import { db } from "../helpers/db";

export default abstract class UserService {
  /**
   * Gets a user by their ID
   *
   * @param id The ID of the user
   *
   * @returns The user if found, otherwise null
   */
  public static async getUserById(id: number): Promise<User | null> {
    const user = await db.user.findUnique({
      where: {
        id,
      },
    });

    return user;
  }

  /**
   * Gets a user by their username
   *
   * @param username The username of the user
   *
   * @returns The user if found, otherwise null
   */
  public static async getUserByUsername(username: string): Promise<User | null> {
    const user = await db.user.findUnique({
      where: {
        username,
      },
    });

    return user;
  }

  /**
   * Gets a user by their email
   *
   * @param email The email of the user
   *
   * @returns The user if found, otherwise null
   */
  public static async getUserByEmail(email: string): Promise<User | null> {
    const user = await db.user.findUnique({
      where: {
        email,
      },
    });

    return user;
  }
}
