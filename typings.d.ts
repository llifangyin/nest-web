import '@umijs/max/typings';
import 'react';

/** 全局 API 命名空间 */
declare namespace API {
  /** 登录用户信息（对应 /users/me 返回值） */
  interface UserInfo {
    userId: string;
    email: string;
    name: string;
  }
}
