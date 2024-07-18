import bcrypt from "bcrypt";
import mongoose from "mongoose";

export interface IAuthentication {
  role?: "customer";
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const AuthenticationSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["customer"],
      required: false,
      default: "user",
    },

    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

AuthenticationSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
const Authentication = mongoose.model("Authentication", AuthenticationSchema);

export default Authentication;
