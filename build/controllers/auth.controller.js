"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.recoverPassword = exports.forgotPassword = exports.resetPassword = exports.loginController = exports.genereteAccessToken = exports.createUserController = exports.authSateController = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const catchAsyncErrors_1 = __importDefault(require("../middlewares/catchAsyncErrors"));
const auth_model_1 = __importDefault(require("../models/auth.model"));
const plan_model_1 = __importDefault(require("../models/plan.model"));
const subscription_model_1 = __importDefault(require("../models/subscription.model"));
const jwtToken_1 = require("../utils/jwtToken");
const sendMessage_1 = __importDefault(require("../utils/sendMessage"));
const sendResponse_1 = __importDefault(require("../utils/sendResponse"));
exports.authSateController = (0, catchAsyncErrors_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    res.json({ success: true, message: "User state get", data: user });
}));
exports.createUserController = (0, catchAsyncErrors_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    const isExistCustomer = yield auth_model_1.default.findOne({ email: body.email });
    if (isExistCustomer) {
        return (0, sendResponse_1.default)(res, {
            success: false,
            data: null,
            message: "A account already exist in this email",
        });
    }
    const auth = yield auth_model_1.default.create(Object.assign({}, body));
    const plan = yield plan_model_1.default.findOne({ price: 0 });
    const subscription = yield subscription_model_1.default.create({
        user: auth._id,
        plan: (plan === null || plan === void 0 ? void 0 : plan._id) || "",
        stripeSubscriptionId: "",
        currentCredit: (plan === null || plan === void 0 ? void 0 : plan.credit) || 5,
    });
    yield auth_model_1.default.findByIdAndUpdate(auth._id, {
        subscription: subscription._id,
    });
    const token = (0, jwtToken_1.createAcessToken)({
        email: auth.email,
        _id: auth._id.toString(),
        role: auth.role,
    }, "1h");
    const refreshToken = (0, jwtToken_1.createRefreshToken)({
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
}));
exports.genereteAccessToken = (0, catchAsyncErrors_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const getToken = req.header("Authorization");
    if (!getToken)
        return res.status(400).json({ msg: "Invalid Authentication." });
    const refreshToken = getToken.split(" ")[1];
    if (!refreshToken) {
        (0, sendResponse_1.default)(res, {
            message: "token must be provided",
            success: false,
            data: null,
            statusCode: 400,
        });
    }
    const refreshTokenSecret = process.env.JWT_REFRESH_SECRET;
    try {
        console.log({ refreshToken });
        const decoded = jsonwebtoken_1.default.verify(refreshToken, refreshTokenSecret);
        const user = decoded.user;
        const accessTOkenPayload = {
            email: user.email,
            _id: user._id,
            role: user.role,
        };
        const isExistUser = yield auth_model_1.default.findById(user._id);
        if (!isExistUser) {
            return (0, sendResponse_1.default)(res, {
                success: false,
                data: null,
                message: "User not found",
                statusCode: 404,
            });
        }
        const newAccessToken = (0, jwtToken_1.createAcessToken)(accessTOkenPayload, "1h");
        (0, sendResponse_1.default)(res, {
            success: true,
            message: "Successfully retrive access token",
            data: { accessToken: newAccessToken, user: isExistUser },
        });
    }
    catch (error) {
        console.error("Error decoding or verifying refresh token:", error);
        res.status(403).json({ message: "Invalid refresh token" });
    }
}));
exports.loginController = (0, catchAsyncErrors_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const isExistUser = yield auth_model_1.default.findOne({ email });
    if (!isExistUser) {
        return (0, sendResponse_1.default)(res, {
            success: false,
            data: null,
            message: "No account found on this email",
            statusCode: 404,
        });
    }
    console.log(password, isExistUser.password);
    const isPasswordMatched = yield bcrypt_1.default.compare(password, isExistUser.password);
    if (!isPasswordMatched) {
        return (0, sendResponse_1.default)(res, {
            message: "password didn't matched",
            success: false,
            data: null,
            statusCode: 403,
        });
    }
    const token = (0, jwtToken_1.createAcessToken)({
        email: isExistUser.email,
        _id: isExistUser._id.toString(),
        role: isExistUser.role,
    }, "1h");
    const refreshToken = (0, jwtToken_1.createRefreshToken)({
        email: isExistUser.email,
        _id: isExistUser._id,
        role: isExistUser.role,
    });
    const _a = (isExistUser === null || isExistUser === void 0 ? void 0 : isExistUser.toObject()) || {}, { password: pass } = _a, rest = __rest(_a, ["password"]);
    res.json({
        data: rest,
        message: "Login successfull",
        success: true,
        accessToken: token,
        refreshToken,
    });
}));
// reset password
exports.resetPassword = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { password, oldPassword } = req.body;
    const user = req.user;
    const email = user.email;
    if (!password || !oldPassword) {
        return res.json({
            message: "password, oldPassword => is required",
        });
    }
    const theUser = yield auth_model_1.default.findOne({ email });
    // check if there no user
    if (!theUser) {
        return (0, sendResponse_1.default)(res, {
            message: "user not found",
            data: null,
            success: false,
            statusCode: 404,
        });
    }
    // varify old password
    const isOk = yield bcrypt_1.default.compare(oldPassword, theUser.password);
    if (!isOk) {
        return (0, sendResponse_1.default)(res, {
            message: "password didn't matched",
            data: null,
            success: false,
            statusCode: 401,
        });
    }
    // create new hash password
    const newPass = yield bcrypt_1.default.hash(password, 10);
    // update the new
    const updatePassword = yield auth_model_1.default.findOneAndUpdate({ email }, {
        $set: {
            password: newPass,
        },
    });
    res.json({
        message: "password Updated",
        success: true,
        user: Object.assign(Object.assign({}, updatePassword === null || updatePassword === void 0 ? void 0 : updatePassword.toObject()), { password: "****" }),
    });
}));
// forgot-password controller
exports.forgotPassword = (0, catchAsyncErrors_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const user = yield auth_model_1.default.findOne({ email });
    if (!user) {
        return res
            .status(404)
            .json({ success: false, message: "No user found with this email!" });
    }
    const tokenPayload = {
        email: user.email,
        _id: user._id,
    };
    const token = jsonwebtoken_1.default.sign(tokenPayload, process.env.JWT_ACCESS_SECRET, {
        expiresIn: "5m",
    });
    console.log(`${process.env.FRONTEND_BASE_URL}/recover-password/${token}`);
    (0, sendMessage_1.default)("legendxpro123455@gmail.com", email, "Reset your password - Meme Canvas", `<div style="font-family: Arial, sans-serif; background-color: #f9f9f9; color: #333; margin: 0; padding: 0;">
      <div style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border: 1px solid #ddd;">
          <div style="text-align: center; background-color: #00466a; color: white; padding: 10px;">
              <h1 style="margin: 0;">Password Reset</h1>
          </div>
          <div style="padding: 20px;">
              <p>Hello,</p>
              <p>We received a request to reset your password. Click the button below to reset it.</p>
              <div style="text-align: center; margin: 20px 0;">
                  <a href="${process.env.FRONTEND_BASE_URL}/recover-password/${token}" style="display: inline-block; padding: 10px 20px; background-color: #00466a; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
              </div>
              <p>If you did not request a password reset, please ignore this email.</p>
              <p>Thanks,</p>
              <p>Memes canvas</p>
          </div>
          <div style="text-align: center; background-color: #f1f1f1; color: #555; padding: 10px;">
              <p style="margin: 0;">&copy; 2024 Fresh Blogs. All rights reserved.</p>
          </div>
      </div>
  </div>`);
    res.status(200).json({
        success: true,
        message: "Check your email to recover the password",
    });
}));
// Resetting new password
exports.recoverPassword = (0, catchAsyncErrors_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { password } = req.body;
    const getToken = req.header("Authorization");
    if (!getToken) {
        return (0, sendResponse_1.default)(res, {
            message: "Token is not provided",
            data: null,
            success: false,
        });
    }
    const token = getToken.split(" ")[1];
    if (!token || !password) {
        return res.status(400).json({ error: "Token and password are required" });
    }
    let decoded;
    try {
        const decode = jsonwebtoken_1.default.verify(token, process.env.JWT_ACCESS_SECRET);
        decoded = decode;
    }
    catch (error) {
        (0, sendResponse_1.default)(res, {
            data: null,
            message: "invalid authentication",
            statusCode: 401,
            success: false,
        });
        return;
    }
    if (!decoded)
        return res
            .status(401)
            .json({ success: false, message: "Invalid Authentication." });
    const user = yield auth_model_1.default.findOne({
        email: decoded.email,
    });
    if (!user) {
        return res.status(404).json({
            success: false,
            data: null,
            message: "User not found",
        });
    }
    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
    user.password = hashedPassword;
    yield auth_model_1.default.findByIdAndUpdate(user._id, {
        password: hashedPassword,
    });
    const tokenPayload = {
        email: user.email,
        _id: user._id.toString(),
        role: user.role,
    };
    const accessToken = (0, jwtToken_1.createAcessToken)(tokenPayload, "1h");
    res.status(200).json({
        success: true,
        message: "Password has been successfully reset",
        accessToken,
    });
}));
