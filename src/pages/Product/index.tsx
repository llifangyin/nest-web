import {
  create,
  findAll,
  remove,
  update,
} from '@/services/products/ProductController';
import { Product } from '@/services/products/typings';
import {
  ActionType,
  PageContainer,
  ProColumns,
  ProDescriptions,
  ProDescriptionsItemProps,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Divider, Drawer, Popconfirm, message } from 'antd';
import React, { useRef, useState } from 'react';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';

const handleAdd = async (fields: {
  name: string;
  price: number;
  stock?: number;
  description?: string;
}) => {
  const hide = message.loading('正在添加');
  try {
    await create({ ...fields, stock: fields.stock ?? 0 });
    hide();
    message.success('添加成功');
    return true;
  } catch {
    hide();
    message.error('添加失败，请重试');
    return false;
  }
};

const handleUpdate = async (id: string, fields: Partial<Product>) => {
  const hide = message.loading('正在更新');
  try {
    await update(id, fields);
    hide();
    message.success('更新成功');
    return true;
  } catch {
    hide();
    message.error('更新失败，请重试');
    return false;
  }
};

const handleRemove = async (id: string) => {
  const hide = message.loading('正在删除');
  try {
    await remove(id);
    hide();
    message.success('删除成功');
    return true;
  } catch {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};

const ProductList: React.FC = () => {
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [currentRow, setCurrentRow] = useState<Partial<Product>>({});
  const [drawerRow, setDrawerRow] = useState<Product | undefined>(undefined);
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<Product>[] = [
    {
      title: 'ID',
      dataIndex: '_id',
      width: 80,
      search: false,
      ellipsis: true,
    },
    {
      title: '商品名称',
      dataIndex: 'name',
      render: (_, record) => (
        <a onClick={() => setDrawerRow(record)}>{record.name}</a>
      ),
    },
    {
      title: '价格',
      dataIndex: 'price',
      search: false,
      valueType: 'money',
    },
    {
      title: '库存',
      dataIndex: 'stock',
      search: false,
    },
    {
      title: '描述',
      dataIndex: 'description',
      search: false,
      ellipsis: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      valueType: 'dateTime',
      search: false,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <a
            onClick={() => {
              setCurrentRow(record);
              setUpdateModalVisible(true);
            }}
          >
            编辑
          </a>
          <Divider type="vertical" />
          <Popconfirm
            title="确认删除该商品？"
            onConfirm={async () => {
              const success = await handleRemove(record._id!);
              if (success) actionRef.current?.reload();
            }}
          >
            <a style={{ color: '#ff4d4f' }}>删除</a>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <PageContainer header={{ title: '商品管理' }}>
      <ProTable<Product>
        headerTitle="商品列表"
        actionRef={actionRef}
        rowKey="_id"
        search={{ labelWidth: 80 }}
        toolBarRender={() => [
          <Button
            key="add"
            type="primary"
            onClick={() => setCreateModalVisible(true)}
          >
            新建商品
          </Button>,
        ]}
        request={async (params) => {
          const data = await findAll({ name: params.name });
          return { data: data || [], success: true };
        }}
        columns={columns}
      />

      <CreateForm
        modalVisible={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        onSubmit={async (values) => {
          const success = await handleAdd(values);
          if (success) {
            setCreateModalVisible(false);
            actionRef.current?.reload();
          }
        }}
      />

      <UpdateForm
        modalVisible={updateModalVisible}
        values={currentRow}
        onCancel={() => {
          setUpdateModalVisible(false);
          setCurrentRow({});
        }}
        onSubmit={async (values) => {
          const success = await handleUpdate(currentRow._id!, values);
          if (success) {
            setUpdateModalVisible(false);
            setCurrentRow({});
            actionRef.current?.reload();
          }
        }}
      />

      <Drawer
        width={500}
        open={!!drawerRow}
        onClose={() => setDrawerRow(undefined)}
        closable={false}
      >
        {drawerRow && (
          <ProDescriptions<Product>
            column={1}
            title={drawerRow.name}
            dataSource={drawerRow}
            columns={columns as ProDescriptionsItemProps<Product>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default ProductList;
