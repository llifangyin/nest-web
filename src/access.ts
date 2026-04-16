export default (initialState: { currentUser?: API.UserInfo }) => {
  // 已登录的用户才能访问
  const isLogin = !!initialState?.currentUser;
  return {
    canSeeAdmin: isLogin,
  };
};
