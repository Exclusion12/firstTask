import mongoose, { PassportLocalDocument } from "mongoose";
const schema = mongoose.Schema;
import passportLocalMongoose from "passport-local-mongoose";

export interface userDocument extends PassportLocalDocument {
  username: string;
  password: string;
  firstname: string;
  lastname: string;
  admin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

let userSchema = new schema(
  {
    firstname: {
      type: String,
      default: "",
    },
    lastname: {
      type: String,
      default: "",
    },
    admin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
userSchema.plugin(passportLocalMongoose);
const users = mongoose.model<userDocument>("user", userSchema);
export default users;
