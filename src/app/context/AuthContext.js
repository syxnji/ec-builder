'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // ローカルストレージからトークンを取得
    const token = localStorage.getItem('token');
    
    if (token) {
      fetchUserData(token);
    } else {
      setLoading(false);
    }
  }, []);

  // ユーザーデータを取得する関数
  const fetchUserData = async (token) => {
    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        // トークンが無効な場合はログアウト
        localStorage.removeItem('token');
        Cookies.remove('token');
        setUser(null);
      }
    } catch (error) {
      console.error('ユーザーデータ取得エラー:', error);
    } finally {
      setLoading(false);
    }
  };

  // ログイン関数
  const login = async (email, password) => {
    setError(null);
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        // Cookieにもトークンを保存（7日間有効）
        Cookies.set('token', data.token, { expires: 7, path: '/' });
        setUser(data.user);
        return { success: true };
      } else {
        setError(data.error || 'ログインに失敗しました');
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('ログインエラー:', error);
      setError('ログイン中にエラーが発生しました');
      return { success: false, error: 'ログイン中にエラーが発生しました' };
    }
  };

  // 新規登録関数
  const register = async (name, email, password) => {
    setError(null);
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        // Cookieにもトークンを保存（7日間有効）
        Cookies.set('token', data.token, { expires: 7, path: '/' });
        setUser(data.user);
        return { success: true };
      } else {
        setError(data.error || '新規登録に失敗しました');
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('新規登録エラー:', error);
      setError('新規登録中にエラーが発生しました');
      return { success: false, error: '新規登録中にエラーが発生しました' };
    }
  };

  // ログアウト関数
  const logout = () => {
    localStorage.removeItem('token');
    Cookies.remove('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
} 