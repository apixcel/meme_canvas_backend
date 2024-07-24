import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";

import catchAsyncError from "../middlewares/catchAsyncErrors";
import Authentication from "../models/auth.model";

import { createAcessToken, createRefreshToken } from "../utils/jwtToken";
import sendResponse from "../utils/sendResponse";
export const authSateController = catchAsyncError(async (req, res) => {
  const user = req.user;

  res.json({ success: true, message: "User state get", data: user });
});
export const createUserController = catchAsyncError(async (req, res) => {
  const { body } = req;

  const isExistCustomer = await Authentication.findOne({ email: body.email });
  if (isExistCustomer) {
    return sendResponse(res, {
      success: false,
      data: null,
      message: "A account already exist in this email",
    });
  }

  const auth = await Authentication.create({ ...body, role: "customer" });

  const token = createAcessToken(
    {
      email: auth.email,
      id: auth._id,
      role: auth.role,
    },
    "1h"
  );

  const refreshToken = createRefreshToken({
    email: auth.email,
    id: auth._id,
    role: auth.role,
  });

  res.json({
    data: auth,
    message: "user created successfully",
    success: true,
    accessToken: token,
    refreshToken,
  });
});

export const genereteAccessToken = catchAsyncError(async (req, res) => {
  const getToken = req.header("Authorization");

  if (!getToken)
    return res.status(400).json({ msg: "Invalid Authentication." });

  const refreshToken = getToken.split(" ")[1];
  if (!refreshToken) {
    sendResponse(res, {
      message: "token must be provided",
      success: false,
      data: null,
      statusCode: 400,
    });
  }

  const refreshTokenSecret = process.env.JWT_REFRESH_SECRET as string;

  try {
    const decoded = jwt.verify(refreshToken, refreshTokenSecret);
    const user = (decoded as JwtPayload).user;
    const accessTOkenPayload = {
      email: user.email,
      id: user.id,
      role: user.role,
    };

    const isExistUser = await Authentication.findById(user.id);
    if (!isExistUser) {
      return sendResponse(res, {
        success: false,
        data: null,
        message: "User not found",
        statusCode: 404,
      });
    }

    const newAccessToken = createAcessToken(accessTOkenPayload, "1h");

    sendResponse(res, {
      success: true,
      message: "Successfully retrive access token",
      data: { accessToken: newAccessToken, user: isExistUser },
    });
  } catch (error) {
    console.error("Error decoding or verifying refresh token:", error);
    res.status(403).json({ message: "Invalid refresh token" });
  }
});

export const loginController = catchAsyncError(async (req, res) => {
  const { email, password } = req.body;
  const isExistUser = await Authentication.findOne({ email });
  if (!isExistUser) {
    return sendResponse(res, {
      success: false,
      data: null,
      message: "No account found on this email",
      statusCode: 404,
    });
  }

  const isPasswordMatched = await bcrypt.compare(
    password,
    isExistUser.password
  );
  if (!isPasswordMatched) {
    return sendResponse(res, {
      message: "password didn't matched",
      success: false,
      data: null,
    });
  }

  const token = createAcessToken(
    {
      email: isExistUser.email,
      id: isExistUser._id,
      role: isExistUser.role,
    },
    "1h"
  );

  const refreshToken = createRefreshToken({
    email: isExistUser.email,
    id: isExistUser._id,
    role: isExistUser.role,
  });

  const { password: pass, ...rest } = isExistUser?.toObject() || {};

  res.json({
    data: rest,
    message: "Login successfull",
    success: true,
    accessToken: token,
    refreshToken,
  });
});
