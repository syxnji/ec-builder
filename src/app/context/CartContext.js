'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // クライアントサイドでのみ実行されるように
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      try {
        setCartItems(JSON.parse(storedCart));
      } catch (error) {
        console.error('カートデータの解析に失敗しました:', error);
        localStorage.removeItem('cart');
      }
    }
    setIsLoaded(true);
  }, []);

  // カートの更新時にローカルストレージを更新
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
  }, [cartItems, isLoaded]);

  // 商品をカートに追加
  const addToCart = (product, quantity = 1) => {
    if (!product || quantity < 1) return;
    
    // 在庫チェック
    if (product.stock < quantity) {
      alert(`在庫が不足しています。現在の在庫: ${product.stock}`);
      return;
    }
    
    // 必要な商品情報のみを抽出
    const cartProduct = {
      id: product.id,
      name: product.name,
      price: product.price,
      stock: product.stock,
      imageUrl: product.imageUrl,
      quantity: quantity
    };
    
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      
      if (existingItem) {
        // 既存の商品の場合は数量を更新（在庫チェック）
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity > product.stock) {
          alert(`在庫が不足しています。現在の在庫: ${product.stock}、カート内: ${existingItem.quantity}`);
          return prevItems;
        }
        
        return prevItems.map(item => 
          item.id === product.id 
            ? { ...item, quantity: newQuantity, stock: product.stock } // 在庫情報も更新
            : item
        );
      } else {
        // 新しい商品の場合はカートに追加
        return [...prevItems, cartProduct];
      }
    });
  };

  // カート内の商品の数量を更新
  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return;
    
    setCartItems(prevItems => {
      const item = prevItems.find(item => item.id === productId);
      
      // 在庫チェック
      if (item && item.stock < quantity) {
        alert(`在庫が不足しています。現在の在庫: ${item.stock}`);
        return prevItems;
      }
      
      return prevItems.map(item => 
        item.id === productId ? { ...item, quantity } : item
      );
    });
  };

  // カートから商品を削除
  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  // カートをクリア
  const clearCart = () => {
    setCartItems([]);
  };

  // カート内の商品数を取得
  const getCartItemsCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // カート内の合計金額を取得
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // カート内の商品情報を最新の状態に更新
  const refreshCartItems = async () => {
    if (cartItems.length === 0) return true;
    
    try {
      // カート内の商品IDを取得
      const productIds = cartItems.map(item => item.id);
      
      // 商品情報を一括取得
      const response = await fetch('/api/products/batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids: productIds }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '商品情報の更新に失敗しました');
      }
      
      const products = await response.json();
      
      // 更新が必要かどうかを確認
      let needsUpdate = false;
      let removedItems = false;
      
      // 存在しない商品をカートから削除
      const existingProducts = products.map(p => p.id);
      const filteredItems = cartItems.filter(item => {
        const exists = existingProducts.includes(item.id);
        if (!exists) {
          removedItems = true;
        }
        return exists;
      });
      
      if (removedItems) {
        needsUpdate = true;
      }
      
      const updatedItems = filteredItems.map(item => {
        const updatedProduct = products.find(p => p.id === item.id);
        if (updatedProduct) {
          // 在庫が変更されているか、または数量調整が必要な場合
          const updatedQuantity = Math.min(item.quantity, updatedProduct.stock);
          if (
            item.stock !== updatedProduct.stock || 
            item.price !== updatedProduct.price || 
            item.name !== updatedProduct.name || 
            item.imageUrl !== updatedProduct.imageUrl ||
            item.quantity !== updatedQuantity
          ) {
            needsUpdate = true;
            return {
              ...item,
              name: updatedProduct.name,
              price: updatedProduct.price,
              stock: updatedProduct.stock,
              imageUrl: updatedProduct.imageUrl,
              quantity: updatedQuantity
            };
          }
        }
        return item;
      });
      
      // 変更がある場合のみ更新
      if (needsUpdate) {
        setCartItems(updatedItems);
      }
      
      return true;
    } catch (error) {
      console.error('カート内商品の更新エラー:', error);
      return false;
    }
  };

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      updateQuantity, 
      removeFromCart, 
      clearCart,
      getCartItemsCount,
      getCartTotal,
      refreshCartItems,
      isLoaded
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
} 