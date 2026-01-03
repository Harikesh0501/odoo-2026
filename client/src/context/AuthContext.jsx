import React, { createContext, useReducer, useEffect, useContext } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: false, // Default to false, check on load
    loading: true,
    user: null
};

const reducer = (state, action) => {
    console.log('Auth Reducer:', action.type);
    switch (action.type) {
        case 'USER_LOADED':
            return {
                ...state,
                isAuthenticated: true,
                loading: false,
                user: action.payload
            };
        case 'LOGIN_SUCCESS':
        case 'REGISTER_SUCCESS':
            return {
                ...state,
                ...action.payload,
                isAuthenticated: true,
                loading: false
            };
        case 'AUTH_ERROR':
        case 'LOGIN_FAIL':
        case 'LOGOUT':
            return {
                ...state,
                token: null,
                isAuthenticated: false,
                loading: false,
                user: null
            };
        default:
            return state;
    }
};

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    // Load User
    const loadUser = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            // Ideally verify token with backend here
            dispatch({
                type: 'USER_LOADED',
                payload: { name: 'User' } // Placeholder for user data until profile fetch
            });
        } else {
            dispatch({ type: 'AUTH_ERROR' });
        }
    };

    useEffect(() => {
        loadUser();
    }, []);

    // Login
    const login = async (email, password) => {
        try {
            const res = await api.post('/auth/login', { email, password });
            console.log('Login API Response:', res.data);

            if (res.data.token) {
                localStorage.setItem('token', res.data.token);
                dispatch({
                    type: 'LOGIN_SUCCESS',
                    payload: res.data
                });
                // Immediately load user to ensure state consistency
                loadUser();
            } else {
                throw new Error('No token received');
            }
        } catch (err) {
            console.error('Login Error in Context:', err);
            localStorage.removeItem('token');
            dispatch({ type: 'LOGIN_FAIL' });
            throw err;
        }
    };

    // Register
    const register = async (formData) => {
        try {
            const res = await api.post('/auth/register', formData);

            if (res.data.token) {
                localStorage.setItem('token', res.data.token);
                dispatch({
                    type: 'REGISTER_SUCCESS',
                    payload: res.data
                });
                loadUser();
            }
        } catch (err) {
            console.error(err);
            localStorage.removeItem('token');
            dispatch({ type: 'AUTH_ERROR' });
            throw err;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        dispatch({ type: 'LOGOUT' });
    };

    return (
        <AuthContext.Provider
            value={{
                token: state.token,
                isAuthenticated: state.isAuthenticated,
                loading: state.loading,
                user: state.user,
                login,
                register,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
