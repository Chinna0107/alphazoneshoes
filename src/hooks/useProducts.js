import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import config from '../config';

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// In-memory cache — no localStorage size limits, no serialization issues
let memCache = { data: null, ts: 0 };

const readCache = () => {
  if (!memCache.data) return null;
  if (Date.now() - memCache.ts > CACHE_TTL) return null;
  return memCache.data;
};

const writeCache = (data) => {
  memCache = { data, ts: Date.now() };
};

export const invalidateProductsCache = () => {
  memCache = { data: null, ts: 0 };
};

const useProducts = () => {
  const cached = readCache();
  const [products, setProducts] = useState(cached || []);
  const [loading, setLoading]   = useState(!cached);
  const [error, setError]       = useState(null);

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
