import { createContext, useContext, useEffect, useReducer, useCallback } from 'react';
import { cafeApi } from '../services/api-client';

const AuthContext = createContext(null);

const initialState = { user: null, status: 'loading' }; // 'loading' | 'authenticated' | 'anonymous'

function reducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      return { user: action.user, status: 'authenticated' };
    case 'CLEAR_USER':
      return { user: null, status: 'anonymous' };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    let cancelled = false;

    cafeApi.me()
      .then(({ data }) => {
        if (!cancelled) dispatch({ type: 'SET_USER', user: data.data.user });
      })
      .catch(() => {
        // A 401 here just means no session cookie — not an error to surface.
        if (!cancelled) dispatch({ type: 'CLEAR_USER' });
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (email, password) => {
    const { data } = await cafeApi.login({ email, password });
    dispatch({ type: 'SET_USER', user: data.data.user });
    return data.data;
  }, []);

  const logout = useCallback(async () => {
    await cafeApi.logout();
    dispatch({ type: 'CLEAR_USER' });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
