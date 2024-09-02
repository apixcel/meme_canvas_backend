"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_route_1 = __importDefault(require("./auth.route"));
const plan_route_1 = __importDefault(require("./plan.route"));
const project_route_1 = __importDefault(require("./project.route"));
const subscription_route_1 = __importDefault(require("./subscription.route"));
const template_route_1 = __importDefault(require("./template.route"));
const user_route_1 = __importDefault(require("./user.route"));
const router = express_1.default.Router();
const moduleRoute = [
    {
        path: "/auth",
        route: auth_route_1.default,
    },
    {
        path: "/project",
        route: project_route_1.default,
    },
    {
        path: "/user",
        route: user_route_1.default,
    },
    {
        path: "/plan",
        route: plan_route_1.default,
    },
    {
        path: "/subscription",
        route: subscription_route_1.default,
    },
    {
        path: "/template",
        route: template_route_1.default,
    },
];
moduleRoute.forEach((route) => router.use(route.path, route.route));
exports.default = router;
