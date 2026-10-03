import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  addToCartApi,
  getCartApi,
  removeCartApi,
  updateCartApi,
  clearCartApi,
} from "../services/api";

const formatCartItems = (items) => {
  if (!Array.isArray(items)) return [];

  return items.map((item) => {
    const populated = item.product && typeof item.product === "object"
      ? item.product
      : null;

    return {
      _id:
        populated?._id ??
        (typeof item.product === "string" ? item.product : null) ??
        item._id,
      name: populated?.name ?? item.name,
      price: Number(populated?.price ?? item.price ?? 0),
      image: populated?.images?.[0]?.url ?? item.image,
      description:
        populated?.desc ?? populated?.description ?? item.description,
      cartQuantity: Number(item.quantity ?? item.cartQuantity ?? 0),
    };
  });
};

export default function useCart() {
  const [loading, setLoading] = useState(false);

  // Stable unique id per hook instance (used to ignore self-originated events).
  const instanceIdRef = useRef(Symbol("cart-instance"));

  const [cartItems, setCartItems] = useState([]);

  const fetchCart = useCallback(async () => {
    if (!localStorage.getItem("token")) {
      setCartItems([]);
      return;
    }

    setLoading(true);
    try {
      const res = await getCartApi();

      const items = res.data?.cart?.items || [];

      setCartItems(formatCartItems(items));
    } catch (err) {
      console.error("Fetch cart error:", err.response?.data || err);
      if (err.response?.status === 401) setCartItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();

    const onCartChanged = (e) => {
      if (e?.detail?.source === instanceIdRef.current) return;
      fetchCart();
    };

    const onAuthChanged = () => {
      fetchCart();
    };

    window.addEventListener("cart-changed", onCartChanged);
    window.addEventListener("auth-changed", onAuthChanged);
    return () => {
      window.removeEventListener("cart-changed", onCartChanged);
      window.removeEventListener("auth-changed", onAuthChanged);
    };
  }, [fetchCart]);

  const notifyCartChanged = useCallback(() => {
    window.dispatchEvent(
      new CustomEvent("cart-changed", {
        detail: { source: instanceIdRef.current },
      }),
    );
  }, []);

  const addToCart = useCallback(
    async (product, quantity = 1) => {
      try {
        await addToCartApi({
          productId: product._id,
          quantity,
        });
        toast.success("Added to cart");
        await fetchCart();
        notifyCartChanged();
      } catch (err) {
        if (err.response?.status === 401) {
          toast.error("Please login to add items to your cart");
        } else {
          console.error("Add error:", err);
          toast.error("Failed to add");
        }
      }
    },
    [fetchCart, notifyCartChanged],
  );

  const removeFromCart = useCallback(
    async (productId) => {
      try {
        await removeCartApi(productId);
        toast.success("Item removed");
        await fetchCart();
        notifyCartChanged();
      } catch (err) {
        console.error("Remove error:", err);
        toast.error("Failed to remove");
      }
    },
    [fetchCart, notifyCartChanged],
  );

  const updateQuantity = useCallback(
    async (productId, quantity) => {
      if (quantity <= 0) {
        return removeFromCart(productId);
      }

      try {
        await updateCartApi({ productId, quantity });
        await fetchCart();
        notifyCartChanged();
      } catch (err) {
        console.error("Update error:", err);
        toast.error("Failed to update");
      }
    },
    [notifyCartChanged, removeFromCart, fetchCart],
  );

  const clearCart = useCallback(async () => {
    try {
      await clearCartApi();
      setCartItems([]);
      toast.success("Cart cleared");
      notifyCartChanged();
    } catch (err) {
      console.error("Clear error:", err);
      toast.error("Failed to clear");
    }
  }, [notifyCartChanged]);

  const cartTotal = useMemo(
    () =>
      cartItems.reduce(
        (total, item) => total + Number(item.price) * item.cartQuantity,
        0,
      ),
    [cartItems],
  );

  const cartCount = useMemo(
    () => cartItems.reduce((count, item) => count + item.cartQuantity, 0),
    [cartItems],
  );

  return {
    loading,
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    fetchCart,
    cartTotal,
    cartCount,
  };
}
