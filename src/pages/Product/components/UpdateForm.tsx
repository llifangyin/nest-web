import { Product } from '@/services/products/typings';
import {
  ProFormDigit,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { Form, Modal } from 'antd';
import React, { useEffect } from 'react';

export interface UpdateFormProps {
  modalVisible: boolean;
  onCancel: () => void;
  onSubmit: (values: Partial<Product>) => Promise<void>;
  values: Partial<Product>;
}

const UpdateForm: React.FC<UpdateFormProps> = ({
  modalVisible,
  onCancel,
  onSubmit,
  values,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (modalVisible) form.setFieldsValue(values);
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
      title="编辑商品"
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
          label="商品名称"
          placeholder="请输入商品名称"
          rules={[{ required: true, message: '请输入商品名称' }]}
        />
        <ProFormDigit
          name="price"
          label="价格"
          placeholder="请输入价格"
          min={0}
          fieldProps={{ precision: 2 }}
          rules={[{ required: true, message: '请输入价格' }]}
        />
        <ProFormDigit
          name="stock"
          label="库存"
          placeholder="请输入库存数量"
          min={0}
          fieldProps={{ precision: 0 }}
        />
        <ProFormTextArea
          name="description"
          label="描述"
          placeholder="请输入商品描述"
        />
      </Form>
    </Modal>
  );
};

export default UpdateForm;
