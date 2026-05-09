const PRODUCTS = [
  {
    id: '1',
    name: 'Classic Leather Sandals',
    category: 'Sandals',
    gender: 'Men',
    description: 'Premium leather sandals for everyday comfort and style.',
    tag: 'bestseller',
    images: [
      'https://res.cloudinary.com/dgyykbmt6/image/upload/q_auto/f_auto/v1/sandals/classic-leather-1.jpg',
    ],
    grams: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10'],
    prices: { 'UK 6': 599, 'UK 7': 599, 'UK 8': 599, 'UK 9': 599, 'UK 10': 599 },
    originalPrices: { 'UK 6': 999, 'UK 7': 999, 'UK 8': 999, 'UK 9': 999, 'UK 10': 999 },
    styleTags: ['casual'],
    colors: [
      { name: 'Brown', hex: '#8B4513', images: ['https://res.cloudinary.com/dgyykbmt6/image/upload/q_auto/f_auto/v1/sandals/classic-leather-1.jpg'] },
      { name: 'Black', hex: '#1a1a1a', images: ['https://res.cloudinary.com/dgyykbmt6/image/upload/q_auto/f_auto/v1/sandals/classic-leather-black.jpg'] },
    ],
  },
  {
    id: '2',
    name: 'Sports Running Shoes',
    category: 'Shoes',
    gender: 'Men',
    description: 'Lightweight and breathable running shoes for peak performance.',
    tag: 'new',
    images: [
      'https://res.cloudinary.com/dgyykbmt6/image/upload/q_auto/f_auto/v1/shoes/sports-running-1.jpg',
    ],
    grams: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'],
    prices: { 'UK 6': 1299, 'UK 7': 1299, 'UK 8': 1299, 'UK 9': 1299, 'UK 10': 1299, 'UK 11': 1299 },
    originalPrices: { 'UK 6': 1999, 'UK 7': 1999, 'UK 8': 1999, 'UK 9': 1999, 'UK 10': 1999, 'UK 11': 1999 },
    styleTags: ['sports'],
    colors: [
      { name: 'White', hex: '#f5f5f5', images: ['https://res.cloudinary.com/dgyykbmt6/image/upload/q_auto/f_auto/v1/shoes/sports-running-1.jpg'] },
      { name: 'Black', hex: '#1a1a1a', images: ['https://res.cloudinary.com/dgyykbmt6/image/upload/q_auto/f_auto/v1/shoes/sports-running-black.jpg'] },
    ],
  },
  {
    id: '3',
    name: 'Casual Flip Flops',
    category: 'Flip Flops',
    gender: 'Men',
    description: 'Comfortable and durable flip flops for home and beach.',
    tag: 'popular',
    images: [
      'https://res.cloudinary.com/dgyykbmt6/image/upload/q_auto/f_auto/v1/flipflops/casual-1.jpg',
    ],
    grams: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10'],
    prices: { 'UK 6': 299, 'UK 7': 299, 'UK 8': 299, 'UK 9': 299, 'UK 10': 299 },
    originalPrices: { 'UK 6': 499, 'UK 7': 499, 'UK 8': 499, 'UK 9': 499, 'UK 10': 499 },
    styleTags: ['casual'],
    colors: [
      { name: 'Blue', hex: '#1e90ff', images: ['https://res.cloudinary.com/dgyykbmt6/image/upload/q_auto/f_auto/v1/flipflops/casual-1.jpg'] },
      { name: 'Red', hex: '#e74c3c', images: ['https://res.cloudinary.com/dgyykbmt6/image/upload/q_auto/f_auto/v1/flipflops/casual-red.jpg'] },
    ],
  },
  {
    id: '4',
    name: 'Trendy Slides',
    category: 'Slides',
    gender: 'Men',
    description: 'Stylish slides for everyday casual wear.',
    tag: 'trending',
    images: [
      'https://res.cloudinary.com/dgyykbmt6/image/upload/q_auto/f_auto/v1/slides/trendy-1.jpg',
    ],
    grams: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10'],
    prices: { 'UK 6': 499, 'UK 7': 499, 'UK 8': 499, 'UK 9': 499, 'UK 10': 499 },
    originalPrices: { 'UK 6': 799, 'UK 7': 799, 'UK 8': 799, 'UK 9': 799, 'UK 10': 799 },
    styleTags: ['casual'],
    colors: [
      { name: 'Black', hex: '#1a1a1a', images: ['https://res.cloudinary.com/dgyykbmt6/image/upload/q_auto/f_auto/v1/slides/trendy-1.jpg'] },
    ],
  },
  {
    id: '5',
    name: 'Graphic Oversized T-Shirt',
    category: 'T-Shirts',
    gender: 'Men',
    description: 'Trendy oversized graphic tee made from 100% cotton.',
    tag: 'new',
    images: [
      'https://res.cloudinary.com/dgyykbmt6/image/upload/q_auto/f_auto/v1/tshirts/graphic-oversized-1.jpg',
    ],
    grams: ['S', 'M', 'L', 'XL', 'XXL'],
    prices: { S: 499, M: 499, L: 499, XL: 499, XXL: 549 },
    originalPrices: { S: 799, M: 799, L: 799, XL: 799, XXL: 849 },
    styleTags: ['casual'],
    colors: [
      { name: 'White', hex: '#f5f5f5', images: ['https://res.cloudinary.com/dgyykbmt6/image/upload/q_auto/f_auto/v1/tshirts/graphic-oversized-1.jpg'] },
      { name: 'Black', hex: '#1a1a1a', images: ['https://res.cloudinary.com/dgyykbmt6/image/upload/q_auto/f_auto/v1/tshirts/graphic-oversized-black.jpg'] },
    ],
  },
  {
    id: '6',
    name: 'Jogger Track Pants',
    category: 'Track Pants',
    gender: 'Men',
    description: 'Comfortable jogger track pants for gym and casual wear.',
    tag: 'bestseller',
    images: [
      'https://res.cloudinary.com/dgyykbmt6/image/upload/q_auto/f_auto/v1/trackpants/jogger-1.jpg',
    ],
    grams: ['S', 'M', 'L', 'XL', 'XXL'],
    prices: { S: 699, M: 699, L: 699, XL: 699, XXL: 749 },
    originalPrices: { S: 1099, M: 1099, L: 1099, XL: 1099, XXL: 1149 },
    styleTags: ['sports', 'casual'],
    colors: [
      { name: 'Navy', hex: '#001f5b', images: ['https://res.cloudinary.com/dgyykbmt6/image/upload/q_auto/f_auto/v1/trackpants/jogger-1.jpg'] },
      { name: 'Black', hex: '#1a1a1a', images: ['https://res.cloudinary.com/dgyykbmt6/image/upload/q_auto/f_auto/v1/trackpants/jogger-black.jpg'] },
    ],
  },
  {
    id: '7',
    name: 'Women Ethnic Sandals',
    category: 'Sandals',
    gender: 'Women',
    description: 'Beautiful ethnic sandals perfect for festive occasions.',
    tag: 'popular',
    images: [
      'https://res.cloudinary.com/dgyykbmt6/image/upload/q_auto/f_auto/v1/sandals/women-ethnic-1.jpg',
    ],
    grams: ['UK 4', 'UK 5', 'UK 6', 'UK 7', 'UK 8'],
    prices: { 'UK 4': 699, 'UK 5': 699, 'UK 6': 699, 'UK 7': 699, 'UK 8': 699 },
    originalPrices: { 'UK 4': 1199, 'UK 5': 1199, 'UK 6': 1199, 'UK 7': 1199, 'UK 8': 1199 },
    styleTags: ['ethnic'],
    colors: [
      { name: 'Gold', hex: '#FFD700', images: ['https://res.cloudinary.com/dgyykbmt6/image/upload/q_auto/f_auto/v1/sandals/women-ethnic-1.jpg'] },
    ],
  },
  {
    id: '8',
    name: 'Kids Casual Shoes',
    category: 'Shoes',
    gender: 'Children',
    description: 'Comfortable and durable shoes for active kids.',
    tag: 'new',
    images: [
      'https://res.cloudinary.com/dgyykbmt6/image/upload/q_auto/f_auto/v1/shoes/kids-casual-1.jpg',
    ],
    grams: ['UK 1', 'UK 2', 'UK 3', 'UK 4', 'UK 5'],
    prices: { 'UK 1': 599, 'UK 2': 599, 'UK 3': 599, 'UK 4': 599, 'UK 5': 599 },
    originalPrices: { 'UK 1': 999, 'UK 2': 999, 'UK 3': 999, 'UK 4': 999, 'UK 5': 999 },
    styleTags: ['casual'],
    colors: [
      { name: 'Blue', hex: '#1e90ff', images: ['https://res.cloudinary.com/dgyykbmt6/image/upload/q_auto/f_auto/v1/shoes/kids-casual-1.jpg'] },
      { name: 'Pink', hex: '#ff69b4', images: ['https://res.cloudinary.com/dgyykbmt6/image/upload/q_auto/f_auto/v1/shoes/kids-casual-pink.jpg'] },
    ],
  },
];

const useProducts = () => ({
  products: PRODUCTS,
  loading: false,
  error: null,
  refresh: () => {},
});

export const invalidateProductsCache = () => {};

export default useProducts;

