"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = exports.sendImageToCloudinary = void 0;
const multer_1 = __importDefault(require("multer"));
const cloud_1 = __importDefault(require("../config/cloud"));
const sendImageToCloudinary = (imageName, path) => {
    return new Promise((resolve, reject) => {
        cloud_1.default.uploader.upload(path, { public_id: imageName }, function (error, result) {
            if (error) {
                reject(error);
            }
            resolve(result);
            // delete a file asynchronously
            // fs.unlink(path, (err) => {
            //   if (err) {
            //     console.log(err);
            //   } else {
            //     console.log("File is deleted.");
            //   }
            // });
        });
    });
};
exports.sendImageToCloudinary = sendImageToCloudinary;
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, process.cwd() + "/uploads/");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        if (file) {
            cb(null, file.fieldname + "-" + uniqueSuffix);
        }
    },
});
exports.upload = (0, multer_1.default)({ storage: storage });
