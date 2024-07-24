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
exports.loginController = exports.genereteAccessToken = exports.createCustomerController = exports.authSateController = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const catchAsyncErrors_1 = __importDefault(require("../middlewares/catchAsyncErrors"));
const auth_model_1 = __importDefault(require("../models/auth.model"));
const jwtToken_1 = require("../utils/jwtToken");
const sendResponse_1 = __importDefault(require("../utils/sendResponse"));
exports.authSateController = (0, catchAsyncErrors_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    res.json({ success: true, message: "User state get", data: user });
}));
exports.createCustomerController = (0, catchAsyncErrors_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    const isExistCustomer = yield auth_model_1.default.findOne({ email: body.email });
    if (isExistCustomer) {
        return (0, sendResponse_1.default)(res, {
            success: false,
            data: null,
            message: "A account already exist in this email",
        });
    }
    const auth = yield auth_model_1.default.create(Object.assign(Object.assign({}, body), { role: "customer" }));
    const token = (0, jwtToken_1.createAcessToken)({
        email: auth.email,
        id: auth._id,
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
    const refreshTokenSecret = process.env.JWT_REFRESH_SECRET;
    try {
        const decoded = jsonwebtoken_1.default.verify(refreshToken, refreshTokenSecret);
        const user = decoded.user;
        const accessTOkenPayload = {
            email: user.email,
            id: user.id,
            role: user.role,
        };
        const isExistUser = yield auth_model_1.default.findById(user.id);
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
    const isPasswordMatched = yield bcrypt_1.default.compare(password, isExistUser.password);
    if (!isPasswordMatched) {
        return (0, sendResponse_1.default)(res, {
            message: "password didn't matched",
            success: false,
            data: null,
        });
    }
    const token = (0, jwtToken_1.createAcessToken)({
        email: isExistUser.email,
        id: isExistUser._id,
        role: isExistUser.role,
    }, "1h");
    const refreshToken = (0, jwtToken_1.createRefreshToken)({
        email: isExistUser.email,
        id: isExistUser._id,
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
