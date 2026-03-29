"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.itemRoutes = void 0;
const express_1 = __importDefault(require("express"));
const item_controller_1 = require("../controllers/item.controller");
const router = express_1.default.Router();
// Create item
router.post("/", item_controller_1.itemControllers.createItem);
// Get all items
router.get("/", item_controller_1.itemControllers.getAllItems);
// Get single item
router.get("/:id", item_controller_1.itemControllers.getSingleItem);
// Update item
router.patch("/:id", item_controller_1.itemControllers.updateItem);
// Delete item
router.delete("/:id", item_controller_1.itemControllers.deleteItem);
exports.itemRoutes = router;
