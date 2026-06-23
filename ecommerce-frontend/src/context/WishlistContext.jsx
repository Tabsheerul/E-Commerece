import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';

export const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
    const { token, user } = useContext(AuthContext);
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (token && user) {
            fetchWishlist();
        } else {
            setWishlistItems([]);
        }
    }, [token, user]);

    const fetchWishlist = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8080/api/wishlist', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setWishlistItems(data);
            }
        } catch (error) {
            console.error("Failed to fetch wishlist", error);
        } finally {
            setLoading(false);
        }
    };

    const addToWishlist = async (product) => {
        if (!token) return; // Should prompt login in real app
        
        // Optimistic update
        setWishlistItems(prev => [...prev, product]);
        
        try {
            const response = await fetch(`http://localhost:8080/api/wishlist/${product.id}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                // Revert if failed
                fetchWishlist();
            }
        } catch (error) {
            fetchWishlist();
        }
    };

    const removeFromWishlist = async (productId) => {
        if (!token) return;
        
        // Optimistic update
        setWishlistItems(prev => prev.filter(item => item.id !== productId));
        
        try {
            const response = await fetch(`http://localhost:8080/api/wishlist/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                fetchWishlist();
            }
        } catch (error) {
            fetchWishlist();
        }
    };

    const toggleWishlist = (product) => {
        if (isInWishlist(product.id)) {
            removeFromWishlist(product.id);
        } else {
            addToWishlist(product);
        }
    };

    const isInWishlist = (productId) => {
        return wishlistItems.some(item => item.id === productId);
    };

    return (
        <WishlistContext.Provider value={{
            wishlistItems,
            loading,
            addToWishlist,
            removeFromWishlist,
            toggleWishlist,
            isInWishlist
        }}>
            {children}
        </WishlistContext.Provider>
    );
};
