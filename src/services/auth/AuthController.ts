import { request } from '@umijs/max';

export interface LoginParams {
  name: string;
  password: string;
}

export interface LoginResult {
  access_token: string;
}

/** 登录 POST /auth/login */
export function login(data: LoginParams) {
  return request<LoginResult>('/proxy/auth/login', {
    method: 'POST',
    data,
  });
}
