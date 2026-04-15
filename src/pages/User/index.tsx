import {
  create,
  findAll,
  remove,
  update,
} from '@/services/users/UserController';
import { User } from '@/services/users/typings';
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

/**
 * 新建用户
 */
const handleAdd = async (fields: {
  name: string;
  email: string;
  password: string;
}) => {
  const hide = message.loading('正在添加');
  try {
    await create(fields);
    hide();
    message.success('添加成功');
    return true;
  } catch {
    hide();
    message.error('添加失败，请重试');
    return false;
  }
};

/**
 * 更新用户
 */
const handleUpdate = async (id: number, fields: Partial<User>) => {
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

/**
 * 删除用户
 */
const handleRemove = async (id: number) => {
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

const UserList: React.FC = () => {
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [currentRow, setCurrentRow] = useState<Partial<User>>({});
  const [drawerRow, setDrawerRow] = useState<User | undefined>(undefined);
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<User>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
      search: false,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      formItemProps: {
        rules: [{ required: true, message: '姓名为必填项' }],
      },
      render: (_, record) => (
        <a onClick={() => setDrawerRow(record)}>{record.name}</a>
      ),
    },
    {
      title: '邮箱',
      dataIndex: 'email',
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
            title="确认删除该用户？"
            onConfirm={async () => {
              const success = await handleRemove(record.id!);
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
    <PageContainer header={{ title: '用户管理' }}>
      <ProTable<User>
        headerTitle="用户列表"
        actionRef={actionRef}
        rowKey="id"
        search={{ labelWidth: 80 }}
        toolBarRender={() => [
          <Button
            key="add"
            type="primary"
            onClick={() => setCreateModalVisible(true)}
          >
            新建用户
          </Button>,
        ]}
        request={async (params) => {
          const data = await findAll({
            name: params.name,
            email: params.email,
          });
          return { data: data || [], success: true };
        }}
        columns={columns}
      />

      {/* 新建弹窗 */}
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

      {/* 编辑弹窗 */}
      <UpdateForm
        modalVisible={updateModalVisible}
        values={currentRow}
        onCancel={() => {
          setUpdateModalVisible(false);
          setCurrentRow({});
        }}
        onSubmit={async (values) => {
          const success = await handleUpdate(currentRow.id!, values);
          if (success) {
            setUpdateModalVisible(false);
            setCurrentRow({});
            actionRef.current?.reload();
          }
        }}
      />

      {/* 详情抽屉 */}
      <Drawer
        width={500}
        open={!!drawerRow}
        onClose={() => setDrawerRow(undefined)}
        closable={false}
      >
        {drawerRow && (
          <ProDescriptions<User>
            column={1}
            title={drawerRow.name}
            dataSource={drawerRow}
            columns={columns as ProDescriptionsItemProps<User>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default UserList;
