import { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';

let sliderCache = { data: null, ts: 0 };
const TTL = 5 * 60 * 1000;

const useSliders = () => {
  const cached = sliderCache.data && Date.now() - sliderCache.ts < TTL ? sliderCache.data : null;
  const [sliders, setSliders] = useState(cached || []);
  const [loading, setLoading] = useState(!cached);

  useEffect(() => {
    if (cached) return;
    axios.get(`${config.API_URL}/api/sliders`)
      .then(res => {
        const list = res.data.success ? res.data.sliders : [];
        sliderCache = { data: list, ts: Date.now() };
        setSliders(list);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { sliders, loading };
};

export default useSliders;
