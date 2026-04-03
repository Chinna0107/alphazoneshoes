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

  // color is optional — { name, hex }
  const addToCart = (productId, weight, color = null) => {
    const colorKey = color ? `${color.name || color.hex}` : '';
    const cartKey = `${productId}-${weight}${colorKey ? `-${colorKey}` : ''}`;
    const safeColor = color ? { name: color.name || '', hex: color.hex || '' } : null;
    const product = productsCache.find(p => String(p.id) === String(productId));
    const colorObj = color ? product?.colors?.find(c => c.name === color.name || c.hex === color.hex) : null;
    const stock = colorObj?.stock?.[weight];
    const maxQty = stock !== undefined ? Number(stock) : Infinity;
    setCart(prev => {
      const current = prev[cartKey]?.quantity || 0;
      if (current >= maxQty) return prev;
      return { ...prev, [cartKey]: { productId, weight, color: safeColor, quantity: current + 1 } };
    });
  };

  const updateQuantity = (productId, weight, change, color = null) => {
    const colorKey = color ? `${color.name || color.hex}` : '';
    const cartKey = `${productId}-${weight}${colorKey ? `-${colorKey}` : ''}`;
    const product = productsCache.find(p => String(p.id) === String(productId));
    const colorObj = color ? product?.colors?.find(c => c.name === color.name || c.hex === color.hex) : null;
    const stock = colorObj?.stock?.[weight];
    const maxQty = stock !== undefined ? Number(stock) : Infinity;
    setCart(prev => {
      const current = prev[cartKey];
      if (!current) return prev;
      const newQty = Math.min(current.quantity + change, maxQty);
      if (newQty <= 0) {
        const next = { ...prev };
        delete next[cartKey];
        return next;
      }
      return { ...prev, [cartKey]: { ...current, quantity: newQty } };
    });
  };

  const clearCart = () => setCart({});

  const getCartCount = () => Object.values(cart).reduce((s, i) => s + i.quantity, 0);

  const isInCart = (productId, weight, color = null) => {
    const colorKey = color ? `${color.name || color.hex}` : '';
    return !!cart[`${productId}-${weight}${colorKey ? `-${colorKey}` : ''}`];
  };

  const getCartQuantity = (productId, weight, color = null) => {
    const colorKey = color ? `${color.name || color.hex}` : '';
    return cart[`${productId}-${weight}${colorKey ? `-${colorKey}` : ''}`]?.quantity || 0;
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQuantity, clearCart, getCartCount, isInCart, getCartQuantity, productsCache, cacheProducts }}>
      {children}
    </CartContext.Provider>
  );
};
