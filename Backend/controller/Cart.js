import Cart from "../model/Cart.js";
import Product from "../model/Product.js";
import mongoose from "mongoose"

export const addToCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, quantity } = req.body;

    if (!productId || !mongoose.isValidObjectId(productId)) {
      return res.status(400).json({ message: "Valid productId required" });
    }

    const qty = Math.max(1, Number.parseInt(quantity, 10) || 1);

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({
        user: userId,
        items: [],
      });
    }

    const itemIndex = cart.items.findIndex((item) =>
      item.product.equals(productId),
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += qty;
      cart.items[itemIndex].subtotal =
        cart.items[itemIndex].quantity * product.price;
    } else {
      cart.items.push({
        product: product._id,
        name: product.name,
        price: product.price,
        image: product.images[0]?.url,
        quantity: qty,
        subtotal: product.price * qty,
      });
    }

    cart.totalPrice = cart.items.reduce((acc, item) => acc + item.subtotal, 0);

    await cart.save();

    const populatedCart = await Cart.findOne({ user: userId }).populate(
      "items.product",
    );

    res.json({ success: true, cart: populatedCart });
  } catch (error) {
    console.log("ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.params.id }).populate(
      "items.product",
    );

    if (!cart) {
      return res.json({ cart: { items: [], totalPrice: 0 } });
    }

    return res.status(200).json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCartByUserId = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product",
    );

    if (!cart) {
      return res.json({ cart: { items: [], totalPrice: 0 } });
    }

    return res.status(200).json({ success: true, cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const matchesCartItem = (item, id) =>
  item.product?.toString() === id || item._id?.toString() === id;

export const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const qty = Number(quantity);
    if (!productId || !Number.isInteger(qty) || qty < 1) {
      return res
        .status(400)
        .json({ message: "productId and a positive quantity are required" });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find((i) => matchesCartItem(i, productId));

    if (!item) return res.status(404).json({ message: "Item not found" });

    item.quantity = qty;
    item.subtotal = qty * item.price;

    cart.totalPrice = cart.items.reduce((acc, i) => acc + i.subtotal, 0);

    await cart.save();

    res.json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeCartItem = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter((item) => !matchesCartItem(item, productId));

    cart.totalPrice = cart.items.reduce((acc, item) => acc + item.subtotal, 0);

    await cart.save();

    res.json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndUpdate(
      { user: req.user._id },
      { items: [], totalPrice: 0 },
    );

    res.json({ success: true, message: "Cart cleared" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createCollection = async (req, res) => {
  try {
    const userId = req.user._id;
    const name = typeof req.body.name === "string" ? req.body.name.trim() : "";

    if (!name) {
      return res.status(400).json({ message: "Collection name is required" });
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = await Cart.create({
        user: userId,
        items: [],
        collections: [],
      });
    }
    const existingCollection = cart.collections.find((c) => c.name === name);
    if (existingCollection) {
      return res
        .status(400)
        .json({ message: "Collection with this name already exists" });
    }

    const newCollection = {
      name,
      items: [],
      totalPrice: 0,
    };

    cart.collections.push(newCollection);

    await cart.save();

    res.status(201).json({
      success: true,
      collection: cart.collections[cart.collections.length - 1],
    });
  } catch (error) {
    console.log("CREATE COLLECTION ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

export const addToCollection = async (req, res) => {
  try {
    const { productId, collectionId, quantity } = req.body;
    const userId = req.user._id;

    if (!productId || !mongoose.isValidObjectId(productId)) {
      return res.status(400).json({ message: "Valid productId required" });
    }
    if (!collectionId || !mongoose.isValidObjectId(collectionId)) {
      return res.status(400).json({ message: "Valid collectionId required" });
    }

    const qty = Math.max(1, Number.parseInt(quantity, 10) || 1);

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let cart = await Cart.findOne({ user: userId });
    if (!cart) cart = await Cart.create({ user: userId, collections: [] });

    const collection = cart.collections.id(collectionId);

    if (!collection) {
      return res.status(404).json({ message: "Collection not found" });
    }

    const itemIndex = collection.items.findIndex((item) =>
      item.product.equals(productId),
    );

    if (itemIndex > -1) {
      collection.items[itemIndex].quantity += qty;
      collection.items[itemIndex].subtotal =
        collection.items[itemIndex].quantity * product.price;
    } else {
      collection.items.push({
        product: product._id,
        name: product.name,
        price: product.price,
        image: product.images[0]?.url,
        quantity: qty,
        subtotal: product.price * qty,
      });
    }

    collection.totalPrice = collection.items.reduce(
      (acc, item) => acc + item.subtotal,
      0,
    );

    await cart.save();

    res.json({ success: true, cart });
  } catch (error) {
    console.log("ADD TO COLLECTION ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getCollections = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.json({ collections: [] });
    }

    res.json({
      success: true,
      collections: cart.collections,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
