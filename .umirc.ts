import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  mock: false,
  initialState: {},
  request: {},
  layout: {
    title: 'nest-web',
  },
  proxy: {
    '/proxy': {
      target: 'http://localhost:3000',
      changeOrigin: true,
      pathRewrite: {
        '^/proxy': '',
      },
    },
  },
  routes: [
    {
      path: '/login',
      component: './Login',
      layout: false, // 登录页不需要侧边栏 layout
    },
    {
      path: '/',
      redirect: '/user',
    },
    // {
    //   name: '首页',
    //   path: '/home',
    //   component: './Home',
    // },
    // {
    //   name: '权限演示',
    //   path: '/access',
    //   component: './Access',
    // },
    // {
    //   name: ' CRUD 示例',
    //   path: '/table',
    //   component: './Table',
    // },
    {
      name: '用户管理',
      path: '/user',
      component: './User',
    },
    {
      name: '商品管理',
      path: '/product',
      component: './Product',
    },
  ],
  npmClient: 'npm',
});
