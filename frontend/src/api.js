import axios from 'axios';

// In production (Vercel), calls go to the Render backend
// In development, Vite proxy handles /api → localhost:5000
const BASE = import.meta.env.VITE_API_URL || '';

export default axios.create({
  baseURL: BASE,
});
