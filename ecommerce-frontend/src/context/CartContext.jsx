import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Add item
  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const cartItemId = `${product.id}-${product.device}`;
      const existingItem = prevItems.find(item => item.cartItemId === cartItemId);
      if (existingItem) {
        return prevItems.map(item => 
          item.cartItemId === cartItemId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { ...product, quantity: 1, cartItemId }];
    });
  };

  // Remove item entirely
  const removeFromCart = (cartItemId) => {
    setCartItems((prevItems) => prevItems.filter(item => item.cartItemId !== cartItemId));
  };

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  
  // Calculate the total price of all items in the cart
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // NEW: Calculate total price
  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  // Update quantity (adding it since Cart.jsx calls it)
  const updateQuantity = (cartItemId, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems((prevItems) => 
      prevItems.map(item => 
        item.cartItemId === cartItemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  return (
    // Make sure to pass the new functions down!
    <CartContext.Provider value={{ cartItems, addToCart, getCartTotal, removeFromCart, updateQuantity, totalItems, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
};