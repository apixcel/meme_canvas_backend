import { JwtPayload } from "jsonwebtoken";
import catchAsyncError from "../middlewares/catchAsyncErrors";
import Image from "../models/image.model";
import Project from "../models/project.model";
import sendResponse from "../utils/sendResponse";
import { sendImageToCloudinary } from "../utils/uploadFile";

export const getAllProjects = catchAsyncError(async (req, res) => {
  const user = req.user as JwtPayload;

  const isExist = await Project.find({ user: user._id })
    .select("projectName createdAt updatedAt")
    .sort({ updatedAt: -1 });

  sendResponse(res, {
    data: isExist,
    success: true,
    message: "projects retrived successfully",
  });
});
export const getProjectById = catchAsyncError(async (req, res) => {
  const user = req.user as JwtPayload;
  const { id } = req.params;

  const isExist = await Project.findById(id).populate("user");

  if (!isExist) {
    return sendResponse(res, {
      data: null,
      success: false,
      message: "project not found on this id",
    });
  }

  const auth: any = isExist.toObject().user;

  if (!auth._id || auth._id.toString() !== user._id) {
    return sendResponse(res, {
      success: false,
      message: "forbiden access",
      statusCode: 403,
      data: null,
    });
  }

  sendResponse(res, {
    data: isExist,
    success: true,
    message: "project retrived successfully",
  });
});

export const createProjectController = catchAsyncError(async (req, res) => {
  const { body } = req;
  const user = req.user as JwtPayload;
  const result = await Project.create({ ...body, user: user._id });

  sendResponse(res, {
    data: result,
    message: "project created successfuly",
    success: true,
  });
});
export const updateProjectShapes = catchAsyncError(async (req, res) => {
  const { body } = req;
  const { id } = req.params;
  const user = req.user as JwtPayload;

  const isExist = await Project.findById(id).populate("user");

  if (!isExist) {
    return sendResponse(res, {
      data: null,
      success: false,
      message: "project not found on this id",
    });
  }

  const auth: any = isExist.toObject().user;

  if (!auth._id || auth._id.toString() !== user._id) {
    return sendResponse(res, {
      success: false,
      message: "forbiden access",
      statusCode: 403,
      data: null,
    });
  }
  const result = await Project.findByIdAndUpdate(
    id,
    {
      $set: { shapes: body },
    },
    { runValidators: true, new: true }
  );

  sendResponse(res, {
    data: result,
    message: "project created successfuly",
    success: true,
  });
});
export const renameProject = catchAsyncError(async (req, res) => {
  const { projectName } = req.body;
  const { id } = req.params;
  const user = req.user as JwtPayload;

  const isExist = await Project.findById(id).populate("user");

  if (!isExist) {
    return sendResponse(res, {
      data: null,
      success: false,
      message: "project not found on this id",
    });
  }

  const auth: any = isExist.toObject().user;

  if (!auth._id || auth._id.toString() !== user._id) {
    return sendResponse(res, {
      success: false,
      message: "forbiden access",
      statusCode: 403,
      data: null,
    });
  }
  const result = await Project.findByIdAndUpdate(
    id,
    {
      $set: { projectName },
    },
    { runValidators: true, new: true }
  );

  sendResponse(res, {
    data: result,
    message: "project created successfuly",
    success: true,
  });
});

export const deleteProject = catchAsyncError(async (req, res) => {
  const user = req.user as JwtPayload;
  const { id } = req.params;

  const isExist = await Project.findById(id).populate("user");

  if (!isExist) {
    return sendResponse(res, {
      data: null,
      success: false,
      message: "project not found on this id",
    });
  }

  const auth: any = isExist.toObject().user;

  if (auth._id || auth._id.toString() !== user._id.toString()) {
    return sendResponse(res, {
      success: false,
      message: "forbiden access",
      statusCode: 403,
      data: null,
    });
  }

  const result = await Project.findByIdAndDelete(id);

  sendResponse(res, {
    data: result,
    message: "project deleted succesfuly",
    success: true,
    statusCode: 200,
  });
});

export const uploadImage = catchAsyncError(async (req, res) => {
  const file = req.file;
  const user = req.user as JwtPayload;
  if (!file) {
    return sendResponse(res, {
      message: "file not found",
      success: false,
      data: null,
      statusCode: 404,
    });
  }
  const uploadRes: any = await sendImageToCloudinary(file.filename, file.path);

  await Image.create({ url: uploadRes.secure_url, user: user._id });

  sendResponse(res, {
    data: uploadRes.secure_url,
    message: "image uploaded",
    success: true,
  });
});
export const getAllImages = catchAsyncError(async (req, res) => {
  const user = req.user as JwtPayload;

  const result = await Image.find({ user: user._id });
  sendResponse(res, {
    data: result,
    success: true,
    message: "Successfully get user images",
  });
});
