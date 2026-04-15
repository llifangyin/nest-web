import { User } from '@/services/users/typings';
import { ProFormText } from '@ant-design/pro-components';
import { Form, Modal } from 'antd';
import React, { useEffect } from 'react';

export interface UpdateFormProps {
  modalVisible: boolean;
  onCancel: () => void;
  onSubmit: (values: Partial<User>) => Promise<void>;
  values: Partial<User>;
}

const UpdateForm: React.FC<UpdateFormProps> = ({
  modalVisible,
  onCancel,
  onSubmit,
  values,
}) => {
  const [form] = Form.useForm();

  // 每次打开弹窗时，用当前 record 填充表单
  useEffect(() => {
    if (modalVisible) {
      form.setFieldsValue(values);
    }
  }, [modalVisible, values, form]);

  const handleOk = async () => {
    const fields = await form.validateFields();
    await onSubmit(fields);
    form.resetFields();
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      destroyOnClose
      title="编辑用户"
      width={480}
      open={modalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="保存"
      cancelText="取消"
    >
      <Form form={form} layout="vertical" style={{ marginTop: 24 }}>
        <ProFormText
          name="name"
          label="姓名"
          placeholder="请输入姓名"
          rules={[{ required: true, message: '请输入姓名' }]}
        />
        <ProFormText
          name="email"
          label="邮箱"
          placeholder="请输入邮箱"
          rules={[
            { required: true, message: '请输入邮箱' },
            { type: 'email', message: '邮箱格式不正确' },
          ]}
        />
      </Form>
    </Modal>
  );
};

export default UpdateForm;
