import mongoose from "mongoose";

const UserModel = new mongoose.Schema(
  {
    profilePic: {
      type: String,
    },
    name: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
    },
  },
  { timestamps: true },
);

const User = mongoose.model("Users", UserModel);
export default User;
