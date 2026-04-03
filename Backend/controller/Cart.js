import Cart from "../model/Cart.js";
import Product from "../model/Product.js";

export const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    const qty = Number(quantity) || 1;

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
    const cart = await Cart.findOne({ user: req.user.id }).populate(
      "items.product",
    );

    res.json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const cart = await Cart.findOne({ user: req.user.id });

    const item = cart.items.find((i) => i.product.toString() === productId);

    if (!item) return res.status(404).json({ message: "Item not found" });

    item.quantity = quantity;
    item.subtotal = quantity * item.price;

    cart.totalPrice = cart.items.reduce((acc, item) => acc + item.subtotal, 0);

    await cart.save();

    res.json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeCartItem = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user.id });

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId,
    );

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
      { user: req.user.id },
      { items: [], totalPrice: 0 },
    );

    res.json({ success: true, message: "Cart cleared" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createCollection = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name } = req.body;

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
      return res.status(400).json({ message: "Collection with this name already exists" });
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
  console.log("collection", req.body);
  const { productId, collectionId, quantity } = req.body;
  const userId = req.user.id;

  const product = await Product.findById(productId);

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
    collection.items[itemIndex].quantity += quantity;
    collection.items[itemIndex].subtotal =
      collection.items[itemIndex].quantity * product.price;
  } else {
    collection.items.push({
      product: product._id,
      name: product.name,
      price: product.price,
      image: product.images[0]?.url,
      quantity,
      subtotal: product.price * quantity,
    });
  }

  collection.totalPrice = collection.items.reduce(
    (acc, item) => acc + item.subtotal,
    0,
  );

  await cart.save();

  res.json(cart);
};

export const getCollections = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });

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
