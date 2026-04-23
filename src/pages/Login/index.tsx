import { TOKEN_KEY } from '@/constants';
import { login } from '@/services/auth/AuthController';
import { history, useModel } from '@umijs/max';
import { Button, Card, Form, Input, message, Typography } from 'antd';
import Cookies from 'js-cookie';

const { Title } = Typography;

export default function LoginPage() {
  const { refresh } = useModel('@@initialState');
  const [form] = Form.useForm();

  const onFinish = async (values: { name: string; password: string }) => {
    try {
      const res = await login(values);
      Cookies.set(TOKEN_KEY, res.access_token, { expires: 7 });
      message.success('登录成功');
      // 刷新 initialState（重新拉取当前用户信息），然后跳转首页
      await refresh();
      history.push('/');
    } catch {
      message.error('用户名或密码错误，请重试');
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#f0f2f5',
      }}
    >
      <Card
        style={{
          width: 400,
          borderRadius: 8,
          boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
        }}
      >
        {/* logo图标 */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <img
            src="/img/lightweight.svg"
            alt="logo"
            style={{ width: 80, height: 80 }}
          />
        </div>

        <Title level={3} style={{ textAlign: 'center', marginBottom: 32 }}>
          nest-web 登录
        </Title>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            name="name"
            label="用户名"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input placeholder="请输入用户名" size="large" />
          </Form.Item>
          <Form.Item
            name="password"
            label="密码"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password placeholder="请输入密码" size="large" />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0, marginTop: 8 }}>
            <Button type="primary" htmlType="submit" block size="large">
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
