// 运行时配置
import { RequestConfig, history, request as httpRequest } from '@umijs/max';
import { Dropdown } from 'antd';
import Cookies from 'js-cookie';
import React from 'react';
import { TOKEN_KEY } from './constants';

/** 获取当前登录用户信息（调用 /users/me） */
async function fetchCurrentUser(): Promise<API.UserInfo> {
  const token = Cookies.get(TOKEN_KEY);
  return httpRequest<API.UserInfo>('/proxy/users/me', {
    headers: { Authorization: `Bearer ${token}` },
  });
}

// 全局初始化数据配置：读取 cookie，验证 token，拉取用户信息
export async function getInitialState(): Promise<{
  currentUser?: API.UserInfo;
}> {
  const token = Cookies.get(TOKEN_KEY);
  if (token) {
    try {
      const currentUser = await fetchCurrentUser();
      return { currentUser };
    } catch {
      Cookies.remove(TOKEN_KEY);
    }
  }
  return { currentUser: undefined };
}

export const layout = ({
  initialState,
  setInitialState,
}: {
  initialState: { currentUser?: API.UserInfo };
  setInitialState: (s: { currentUser?: API.UserInfo }) => void;
}) => {
  const handleLogout = () => {
    Cookies.remove(TOKEN_KEY);
    setInitialState({ currentUser: undefined });
    history.push('/login');
  };

  return {
    logo: '/img/lightweight.svg',
    menu: { locale: false },
    // 顶部右侧头像，点击展示退出登录
    avatarProps: initialState?.currentUser
      ? {
          src: undefined,
          title: initialState.currentUser.name,
          render: (_: unknown, dom: React.ReactNode) => (
            <Dropdown
              menu={{
                items: [
                  {
                    key: 'logout',
                    label: '退出登录',
                    onClick: handleLogout,
                  },
                ],
              }}
            >
              {dom}
            </Dropdown>
          ),
        }
      : undefined,
    // 路由守卫：直接读 cookie，避免闭包捕获旧 initialState 导致登录后立刻被踢回
    onPageChange: () => {
      const { pathname } = history.location;
      const token = Cookies.get(TOKEN_KEY);
      if (!token && pathname !== '/login') {
        history.push('/login');
      }
    },
  };
};

// 请求拦截：自动添加 Authorization header
export const request: RequestConfig = {
  requestInterceptors: [
    (config: any) => {
      const token = Cookies.get(TOKEN_KEY);
      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        };
      }
      return config;
    },
  ],
  responseInterceptors: [
    (response: any) => {
      // 统一响应格式解包：{ code, data, message } → 只保留 data
      const resData = response?.data;
      if (
        resData &&
        typeof resData === 'object' &&
        'code' in resData &&
        'data' in resData
      ) {
        response.data = resData.data;
      }
      if (response?.status === 401) {
        Cookies.remove(TOKEN_KEY);
        history.push('/login');
      }
      return response;
    },
  ],
};
