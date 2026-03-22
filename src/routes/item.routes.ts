import express from "express";
import { itemControllers } from "../controllers/item.controller";

const router = express.Router();

// Create item
router.post("/", itemControllers.createItem);

// Get all items
router.get("/", itemControllers.getAllItems);

// Get single item
router.get("/:id", itemControllers.getSingleItem);

// Update item
router.patch("/:id", itemControllers.updateItem);

// Delete item
router.delete("/:id", itemControllers.deleteItem);

export const itemRoutes = router;
