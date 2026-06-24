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
            const savedWishlist = localStorage.getItem('wishlist_guest');
            if (savedWishlist) {
                try {
                    setWishlistItems(JSON.parse(savedWishlist));
                } catch (e) {
                    setWishlistItems([]);
                }
            } else {
                setWishlistItems([]);
            }
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
        // Optimistic update for both guest and authenticated users
        setWishlistItems(prev => {
            const newItems = [...prev, product];
            if (!token) {
                localStorage.setItem('wishlist_guest', JSON.stringify(newItems));
            }
            return newItems;
        });
        
        if (token) {
            try {
                const response = await fetch(`http://localhost:8080/api/wishlist/${product.id}`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!response.ok) {
                    fetchWishlist(); // Revert if failed
                }
            } catch (error) {
                fetchWishlist(); // Revert on error
            }
        }
    };

    const removeFromWishlist = async (productId) => {
        // Optimistic update for both guest and authenticated users
        setWishlistItems(prev => {
            const newItems = prev.filter(item => item.id !== productId);
            if (!token) {
                localStorage.setItem('wishlist_guest', JSON.stringify(newItems));
            }
            return newItems;
        });
        
        if (token) {
            try {
                const response = await fetch(`http://localhost:8080/api/wishlist/${productId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!response.ok) {
                    fetchWishlist(); // Revert if failed
                }
            } catch (error) {
                fetchWishlist(); // Revert on error
            }
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
