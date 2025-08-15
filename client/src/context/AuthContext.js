import React, { createContext, useContext, useReducer, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: true,
  error: null
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'USER_LOADED':
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: action.payload,
        error: null
      };
    case 'REGISTER_SUCCESS':
    case 'LOGIN_SUCCESS':
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        token: action.payload.token,
        user: action.payload.user,
        isAuthenticated: true,
        loading: false,
        error: null
      };
    case 'AUTH_ERROR':
    case 'LOGIN_FAIL':
    case 'REGISTER_FAIL':
    case 'LOGOUT':
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load user on mount
  useEffect(() => {
    if (state.token) {
      loadUser();
    } else {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // Load user
  const loadUser = async () => {
    try {
      const res = await api.get('/auth/me');
      dispatch({
        type: 'USER_LOADED',
        payload: res.data.user
      });
    } catch (error) {
      dispatch({ type: 'AUTH_ERROR', payload: error.response?.data?.message });
    }
  };

  // Register user
  const register = async (formData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const res = await api.post('/auth/register', formData);
      dispatch({
        type: 'REGISTER_SUCCESS',
        payload: res.data
      });
      return { success: true, data: res.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      dispatch({
        type: 'REGISTER_FAIL',
        payload: message
      });
      return { success: false, error: message };
    }
  };

  // Login user
  const login = async (formData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const res = await api.post('/auth/login', formData);
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: res.data
      });
      return { success: true, data: res.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      dispatch({
        type: 'LOGIN_FAIL',
        payload: message
      });
      return { success: false, error: message };
    }
  };

  // Logout
  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  // Update user profile
  const updateProfile = async (formData) => {
    try {
      const res = await api.put('/auth/profile', formData);
      dispatch({
        type: 'UPDATE_USER',
        payload: res.data.user
      });
      return { success: true, data: res.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Profile update failed';
      return { success: false, error: message };
    }
  };

  // Clear errors
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        register,
        login,
        logout,
        updateProfile,
        clearError,
        loadUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
