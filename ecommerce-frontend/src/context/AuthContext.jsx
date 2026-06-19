import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);

    useEffect(() => {
        if (token) {
            // Ideally we should validate the token or fetch user details here
            // But for simplicity we assume the token is valid if it exists
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                try {
                    setUser(JSON.parse(storedUser));
                } catch (e) {
                    console.error("Failed to parse user from local storage");
                }
            }
        }
    }, [token]);

    const login = async (email, password) => {
        try {
            const response = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                setToken(data.token);
                const userData = { username: data.username, role: data.role };
                setUser(userData);
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(userData));
                return { success: true };
            } else {
                const errorData = await response.text();
                return { success: false, message: errorData || 'Login failed' };
            }
        } catch (error) {
            return { success: false, message: 'Network error occurred' };
        }
    };

    const register = async (name, email, password) => {
        try {
            const response = await fetch('http://localhost:8080/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }),
            });

            if (response.ok) {
                return { success: true };
            } else {
                const errorData = await response.text();
                return { success: false, message: errorData || 'Registration failed' };
            }
        } catch (error) {
            return { success: false, message: 'Network error occurred' };
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
