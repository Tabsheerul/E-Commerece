import React, { createContext, useState, useContext, useEffect } from 'react';
import { AuthContext } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const authContext = useContext(AuthContext);
  const user = authContext ? authContext.user : null;
  const [cartItems, setCartItems] = useState([]);

  // Load cart data when user logs in or out
  useEffect(() => {
    const key = user ? `cart_${user.username}` : 'cart_guest';
    const savedCart = localStorage.getItem(key);
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        setCartItems([]);
      }
    } else {
      setCartItems([]);
    }
  }, [user]);

  // Helper to save to state AND local storage
  const updateCartAndSave = (updater) => {
    setCartItems((prevItems) => {
      const newItems = typeof updater === 'function' ? updater(prevItems) : updater;
      const key = user ? `cart_${user.username}` : 'cart_guest';
      localStorage.setItem(key, JSON.stringify(newItems));
      return newItems;
    });
  };

  // Add item
  const addToCart = (product) => {
    updateCartAndSave((prevItems) => {
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
    updateCartAndSave((prevItems) => prevItems.filter(item => item.cartItemId !== cartItemId));
  };

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  
  // Calculate the total price of all items in the cart
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const clearCart = () => {
    updateCartAndSave([]);
  };

  // Calculate total price
  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  // Update quantity (adding it since Cart.jsx calls it)
  const updateQuantity = (cartItemId, newQuantity) => {
    if (newQuantity < 1) return;
    updateCartAndSave((prevItems) => 
      prevItems.map(item => 
        item.cartItemId === cartItemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  return (
    // Make sure to pass the new functions down!
    <CartContext.Provider value={{ cartItems, addToCart, getCartTotal, removeFromCart, updateQuantity, totalItems, cartTotal, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};