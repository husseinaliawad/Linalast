import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);

const getInitial = () => {
  const stored = localStorage.getItem('bookit_cart');
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch (error) {
    return [];
  }
};

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(getInitial());

  useEffect(() => {
    localStorage.setItem('bookit_cart', JSON.stringify(items));
  }, [items]);

  const addItem = (product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.productId === product._id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          productId: product._id,
          title: product.title,
          price: product.price,
          image: product.images?.[0] || '',
          quantity,
        },
      ];
    });
  };

  const updateQuantity = (productId, quantity) => {
    setItems((prev) =>
      prev.map((item) => (item.productId === productId ? { ...item, quantity } : item))
    );
  };

  const removeItem = (productId) => {
    setItems((prev) => prev.filter((item) => item.productId !== productId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const value = useMemo(
    () => ({ items, addItem, updateQuantity, removeItem, clearCart, total }),
    [items, total]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);
