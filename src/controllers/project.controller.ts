import { JwtPayload } from "jsonwebtoken";
import catchAsyncError from "../middlewares/catchAsyncErrors";
import Project from "../models/project.model";
import sendResponse from "../utils/sendResponse";

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

  if (isExist.user !== user.id) {
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
  const result = await Project.create({ ...body, user: user.id });

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

  if (isExist.user !== user.id) {
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

  if (isExist.user !== user.id) {
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
