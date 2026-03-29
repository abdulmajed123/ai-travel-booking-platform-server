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
Object.defineProperty(exports, "__esModule", { value: true });
exports.itemControllers = void 0;
const items_model_1 = require("../models/items.model");
// Create item
const createItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Request body:", req.body); // add this line
    try {
        const savedItem = yield items_model_1.Item.create(req.body);
        console.log("Saved item:", savedItem); // add this line
        res.status(201).json({
            success: true,
            message: "Item created successfully",
            data: savedItem,
        });
    }
    catch (err) {
        console.error(err); // print full error
        res.status(500).json({
            success: false,
            message: "Failed to create Item",
            error: err.message,
        });
    }
});
const getAllItems = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { search, category, priceMin, priceMax, rating, sort, page = "1", limit = "10", } = req.query;
        // 🔍 Build Filter
        const filter = {};
        // Search
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
                { category: { $regex: search, $options: "i" } },
            ];
        }
        // Category
        if (category) {
            filter.category = category;
        }
        // Price
        if (priceMin || priceMax) {
            filter.price = {};
            if (priceMin)
                filter.price.$gte = Number(priceMin);
            if (priceMax)
                filter.price.$lte = Number(priceMax);
        }
        // Rating
        if (rating) {
            filter.rating = { $gte: Number(rating) };
        }
        // 🔃 Sort
        let sortOption = {};
        if (sort) {
            const sortField = String(sort);
            if (sortField.startsWith("-")) {
                sortOption[sortField.slice(1)] = -1;
            }
            else {
                sortOption[sortField] = 1;
            }
        }
        // 📄 Pagination
        const pageNumber = Number(page);
        const limitNumber = Number(limit);
        const skip = (pageNumber - 1) * limitNumber;
        // 📦 Query
        const items = yield items_model_1.Item.find(filter)
            .sort(sortOption)
            .skip(skip)
            .limit(limitNumber);
        const total = yield items_model_1.Item.countDocuments(filter);
        res.status(200).json({
            success: true,
            message: "Items fetched successfully",
            data: items,
            meta: {
                page: pageNumber,
                limit: limitNumber,
                total,
            },
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch Items",
            error: err.message,
        });
    }
});
// Get single item
const getSingleItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const item = yield items_model_1.Item.findById(req.params.id);
        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Item not found",
            });
        }
        res.status(200).json({
            success: true,
            message: "Item fetched successfully",
            data: item,
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch Item",
            error: err.message,
        });
    }
});
// Update item
const updateItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedItem = yield items_model_1.Item.findByIdAndUpdate(req.params.id, req.body, {
            returnDocument: "after",
            runValidators: true,
        });
        if (!updatedItem) {
            return res.status(404).json({
                success: false,
                message: "Item not found",
            });
        }
        res.status(200).json({
            success: true,
            message: "Item updated successfully",
            data: updatedItem,
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to update item",
            error: err.message,
        });
    }
});
// Delete item
const deleteItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deleteItem = yield items_model_1.Item.findByIdAndDelete(req.params.id);
        if (!deleteItem) {
            return res.status(404).json({
                success: false,
                message: "Item not found",
            });
        }
        res.status(200).json({
            success: true,
            message: "Item deleted successfully",
            data: null,
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to delete item",
            error: err.message,
        });
    }
});
exports.itemControllers = {
    createItem,
    getAllItems,
    getSingleItem,
    updateItem,
    deleteItem,
};
