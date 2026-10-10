import { apiFetch } from './client'

export const getProducts = () =>
  apiFetch('/products?limit=100').then((data) => data.products)

export const getProduct = (id) => apiFetch(`/products/${id}`)