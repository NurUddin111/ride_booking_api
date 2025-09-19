import { IAuthProvider, IUser } from "./user.interface";
import { User } from "./user.model";
import bcrypt from "bcryptjs";

const createUser = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;

  const isUserExist = await User.findOne({ email });

  if (isUserExist) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password as string, 10);

  const authProvider: IAuthProvider = {
    provider: "credentials",
    providerId: email as string,
  };

  const user = await User.create({
    email,
    password: hashedPassword,
    auths: [authProvider],
    ...rest,
  });

  return user;
};

const getAllUsers = async () => {
  const users = User.find();
  return users;
};

const getSingleUser = async (userId: string) => {
  const user = User.findById(userId);
  return user;
};

const updateUser = async (userId: string, payload: Partial<IUser>) => {
  const isUserExist = await User.findById(userId);

  if (!isUserExist) {
    throw new Error("User Not Found");
  }

  const user = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });

  return user;
};

const deleteUser = async (userId: string) => {
  const isUserExist = await User.findById(userId);

  if (!isUserExist || isUserExist.isDeleted) {
    throw new Error("User Not Found");
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { isDeleted: true },
    {
      new: true,
    }
  );

  return user;
};

export const UserServices = {
  createUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
};
