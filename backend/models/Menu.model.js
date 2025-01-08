import mongoose from "mongoose";

const MenuSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Menu item name is required"],
  },
  category: {
    type: String,
    enum: ["Appetizers", "Main Course", "Desserts", "Beverages"],
    default: "Main Course",
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
    min: [0, "Price cannot be negative"],
  },
  availability: {
    type: Boolean,
    default: true,
  },
});

const Menu = mongoose.model("Menu", MenuSchema);
export default Menu;
