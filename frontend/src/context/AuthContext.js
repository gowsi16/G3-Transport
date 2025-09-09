import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const login = async (username, password) => {
        try {
            const response = await fetch('http://localhost:5001/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const userData = await response.json();
                console.log('Login successful, user data:', userData);
                setUser(userData);
                localStorage.setItem('g3_user', JSON.stringify(userData));
                return true;
            } else {
                console.log('Login failed, response status:', response.status);
                return false;
            }
        } catch (error) {
            console.error('Login error:', error);
            return false;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('g3_user');
    };
    
    useEffect(() => {
        const storedUser = localStorage.getItem('g3_user');
        if(storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const value = { user, login, logout };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};