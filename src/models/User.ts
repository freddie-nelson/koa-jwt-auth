import { User } from "@prisma/client";

export interface UserModel {
  id: number;
  username: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export function mapUserToModel(user: User): UserModel {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
