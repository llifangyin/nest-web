import { request } from '@umijs/max';
import { User } from './typings';

/** 获取用户列表 GET /users */
export function findAll(params?: { name?: string; email?: string }) {
  return request<User[]>('/proxy/users', {
    method: 'GET',
    params,
  });
}
/** 获取单个用户 GET /users/:id */
export function findOne(id: string) {
  return request<User>(`/proxy/users/${id}`, {
    method: 'GET',
  });
}
/** 新建用户 POST /users */
export function create(data: Omit<User, '_id' | 'createdAt'>) {
  return request<User>('/proxy/users', {
    method: 'POST',
    data,
  });
}
/** 更新用户 PUT /users/:id */
export function update(
  id: string,
  data: Partial<Omit<User, '_id' | 'createdAt'>>,
) {
  return request<User>(`/proxy/users/${id}`, {
    method: 'PUT',
    data,
  });
}
/** 删除用户 DELETE /users/:id */
export function remove(id: string) {
  return request(`/proxy/users/${id}`, {
    method: 'DELETE',
  });
}
