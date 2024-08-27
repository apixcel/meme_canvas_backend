import { JwtPayload } from "jsonwebtoken";
import catchAsyncError from "../middlewares/catchAsyncErrors";
import Project from "../models/project.model";
import Template from "../models/template.model";
import sendResponse from "../utils/sendResponse";

// create  project from chosen template
export const chooseTemplate = catchAsyncError(async (req, res) => {
  const templateId = req.params.id; // template id
  const user = req.user as JwtPayload;
  const isTemplateExists = await Template.findById(templateId);
  if (!isTemplateExists) {
    return sendResponse(res, {
      message: "Template not found",
      data: null,
      success: false,
      statusCode: 400,
    });
  }

  const { canvas, projectName, shapes, _id } = isTemplateExists.toObject();

  const project = await Project.create({
    canvas,
    shapes,
    projectName,
    user: user._id,
    template: _id,
  });

  sendResponse(res, {
    data: project,
    message: "Project created form template",
    success: true,
  });
});

export const createTemplate = catchAsyncError(async (req, res) => {
  const user = req.user as JwtPayload;
  const { id } = req.params; // project id
  const { templateName } = req.body;

  const project = await Project.findById(id);
  if (!project) {
    return sendResponse(res, {
      message: "project not found",
      success: false,
      data: null,
    });
  }

  if (user._id.toString() !== project.user.toString()) {
    return sendResponse(res, {
      data: null,
      message: "Unauthorized access",
      success: false,
      statusCode: 403,
    });
  }

  const { canvas, projectName, shapes, thumbnail } = project.toObject();

  const result = await Template.create({
    canvas,
    owner: user._id,
    projectName: templateName || projectName,
    shapes,
    thumbnail,
  });

  sendResponse(res, {
    data: result,
    message: "Template deleted succesfuly",
    success: true,
    statusCode: 200,
  });
});

export const getAllTemplates = catchAsyncError(async (req, res) => {
  const result = await Template.find().populate("owner").select("-shapes");

  sendResponse(res, {
    data: result,
    message: "Project created form template",
    success: true,
  });
});

export const deleteTemplate = catchAsyncError(async (req, res) => {
  const user = req.user as JwtPayload;
  const { id } = req.params;

  const isExist = await Template.findById(id).populate("owner");

  if (!isExist) {
    return sendResponse(res, {
      data: null,
      success: false,
      message: "template not found on this id",
    });
  }

  const author: any = isExist.toObject().owner;

  if (author._id || author._id.toString() !== user._id.toString()) {
    return sendResponse(res, {
      success: false,
      message: "forbiden access",
      statusCode: 403,
      data: null,
    });
  }

  const result = await Template.findByIdAndDelete(isExist._id);

  sendResponse(res, {
    data: result,
    message: "Template deleted succesfuly",
    success: true,
    statusCode: 200,
  });
});