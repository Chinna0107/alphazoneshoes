import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import config from '../config';

const CACHE_KEY = 'az_products_cache';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const readCache = () => {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw);
    if (Date.now() - ts > CACHE_TTL) return null; // expired
    return data;
  } catch { return null; }
};

const writeCache = (data) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data, ts: Date.now() }));
  } catch { /* storage full — silent */ }
};

export const invalidateProductsCache = () => {
  try { localStorage.removeItem(CACHE_KEY); } catch { /* silent */ }
};

const useProducts = () => {
  const cached = readCache();
  const [products, setProducts] = useState(cached || []);
  const [loading, setLoading] = useState(!cached); // no spinner if cache hit
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async (force = false) => {
    if (!force) {
      const hit = readCache();
      if (hit) { setProducts(hit); setLoading(false); return; }
    }
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${config.API_URL}/api/products`);
      const list = res.data.success
        ? res.data.products
        : Array.isArray(res.data) ? res.data : [];
      setProducts(list);
      writeCache(list);
    } catch (err) {
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const refresh = () => fetchProducts(true);

  return { products, loading, error, refresh };
};

export default useProducts;
