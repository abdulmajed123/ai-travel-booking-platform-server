import { Request, Response } from "express";
import { Item } from "../models/items.model";

// Create item
const createItem = async (req: Request, res: Response) => {
  console.log("Request body:", req.body); // add this line
  try {
    const savedItem = await Item.create(req.body);
    console.log("Saved item:", savedItem); // add this line
    res.status(201).json({
      success: true,
      message: "Item created successfully",
      data: savedItem,
    });
  } catch (err: any) {
    console.error(err); // print full error
    res.status(500).json({
      success: false,
      message: "Failed to create Item",
      error: err.message,
    });
  }
};

// Get all Items
// const getAllItems = async (req: Request, res: Response) => {
//   try {
//     const Items = await Item.find();
//     res.status(200).json({
//       success: true,
//       message: "Items fetched successfully",
//       data: Items,
//     });
//   } catch (err: any) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch Items",
//       error: err.message,
//     });
//   }
// };

const getAllItems = async (req: Request, res: Response) => {
  try {
    const {
      search,
      category,
      priceMin,
      priceMax,
      rating,
      sort,
      page = "1",
      limit = "10",
    } = req.query;

    // 🔍 Build Filter
    const filter: any = {};

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
      if (priceMin) filter.price.$gte = Number(priceMin);
      if (priceMax) filter.price.$lte = Number(priceMax);
    }

    // Rating
    if (rating) {
      filter.rating = { $gte: Number(rating) };
    }

    // 🔃 Sort
    let sortOption: any = {};
    if (sort) {
      const sortField = String(sort);
      if (sortField.startsWith("-")) {
        sortOption[sortField.slice(1)] = -1;
      } else {
        sortOption[sortField] = 1;
      }
    }

    // 📄 Pagination
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;

    // 📦 Query
    const items = await Item.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNumber);

    const total = await Item.countDocuments(filter);

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
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch Items",
      error: err.message,
    });
  }
};

// Get single item
const getSingleItem = async (req: Request, res: Response) => {
  try {
    const item = await Item.findById(req.params.id);
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
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch Item",
      error: err.message,
    });
  }
};

// Update item
const updateItem = async (req: Request, res: Response) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, {
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
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "Failed to update item",
      error: err.message,
    });
  }
};

// Delete item
const deleteItem = async (req: Request, res: Response) => {
  try {
    const deleteItem = await Item.findByIdAndDelete(req.params.id);
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
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "Failed to delete item",
      error: err.message,
    });
  }
};

export const itemControllers = {
  createItem,
  getAllItems,
  getSingleItem,
  updateItem,
  deleteItem,
};
