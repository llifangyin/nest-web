import { request } from '@umijs/max';
import { Product } from './typings';

export function findAll(params?: { name?: string }) {
  return request<Product[]>('/proxy/products', { method: 'GET', params });
}

export function findOne(id: string) {
  return request<Product>(`/proxy/products/${id}`, { method: 'GET' });
}

export function create(data: Omit<Product, '_id' | 'createdAt'>) {
  return request<Product>('/proxy/products', { method: 'POST', data });
}

export function update(
  id: string,
  data: Partial<Omit<Product, '_id' | 'createdAt'>>,
) {
  return request<Product>(`/proxy/products/${id}`, { method: 'PUT', data });
}

export function remove(id: string) {
  return request(`/proxy/products/${id}`, { method: 'DELETE' });
}
