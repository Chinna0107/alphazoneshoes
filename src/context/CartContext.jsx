import { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({});
  const [productsCache, setProductsCache] = useState(() => {
    try { return JSON.parse(localStorage.getItem('az_products') || '[]'); }
    catch { return []; }
  });

  const cacheProducts = (list) => {
    setProductsCache(list);
    try { localStorage.setItem('az_products', JSON.stringify(list)); } catch { /* silent */ }
  };

  const addToCart = (productId, weight) => {
    const cartKey = `${productId}-${weight}`;
    console.log('Adding to cart:', cartKey);
    setCart(prevCart => {
      const newCart = { ...prevCart, [cartKey]: { productId, weight, quantity: 1 } };
      console.log('New cart state:', newCart);
      return newCart;
    });
  };

  const updateQuantity = (productId, weight, change) => {
    const cartKey = `${productId}-${weight}`;
    console.log('Updating quantity:', cartKey, change);
    setCart(prevCart => {
      const currentItem = prevCart[cartKey];
      if (!currentItem) return prevCart;
      
      const newQuantity = currentItem.quantity + change;
      if (newQuantity <= 0) {
        const newCart = { ...prevCart };
        delete newCart[cartKey];
        console.log('Removed from cart:', newCart);
        return newCart;
      } else {
        const newCart = { ...prevCart, [cartKey]: { ...currentItem, quantity: newQuantity } };
        console.log('Updated cart:', newCart);
        return newCart;
      }
    });
  };

  const clearCart = () => {
    setCart({});
  };

  const getCartCount = () => {
    return Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);
  };

  const isInCart = (productId, weight) => {
    const cartKey = `${productId}-${weight}`;
    return !!cart[cartKey];
  };

  const getCartQuantity = (productId, weight) => {
    const cartKey = `${productId}-${weight}`;
    return cart[cartKey]?.quantity || 0;
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQuantity, clearCart, getCartCount, isInCart, getCartQuantity, productsCache, cacheProducts }}>
      {children}
    </CartContext.Provider>
  );
};
