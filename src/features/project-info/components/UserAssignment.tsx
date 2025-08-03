import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Avatar, Button, Modal, Form, Input, message, Tooltip } from 'antd';
import { UserAddOutlined, PlusOutlined } from '@ant-design/icons';
import { useTasks } from '../../../features/tasks/hooks/useTasks';
import type { User } from '../../../types/global.types';

interface UserAssignmentProps {
  assignedUsers: User[];
  onAddUser: (user: { name: string; email: string }) => void;
  onRemoveUser?: (userId: string) => void;
  maxDisplay?: number;
}

export function UserAssignment({ 
  assignedUsers, 
  onAddUser, 
  maxDisplay = 3
}: UserAssignmentProps) {
  const { t } = useTranslation();
  const { addUser } = useTasks(); // Use the context method
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const handleAddUser = async () => {
    try {
      const values = await form.validateFields();
      
      // Add user to global users list via context
      addUser({
        name: values.name,
        email: values.email
      });
      
      // Also call the prop function to handle project-specific logic
      onAddUser({
        name: values.name,
        email: values.email
      });
      
      form.resetFields();
      setIsModalVisible(false);
      message.success(t('projectInfo.userAdded'));
    } catch (error) {
      console.error('Form validation failed:', error);
    }
  };

  return (
    <div className="flex items-center gap-2 w-full overflow-hidden">
      {/* Assigned Users Avatars  */}
      <div className="flex items-center flex-shrink-0">
        <Avatar.Group 
          maxCount={maxDisplay}
          maxStyle={{ 
            color: 'rgb(var(--text-color))', 
            backgroundColor: 'rgb(var(--bg-hover))',
            border: '2px solid rgb(var(--border-color))',
            fontSize: '14px'
          }}
          size="default"
          className="flex-shrink-0"
        >
          {assignedUsers.map(user => (
            <Tooltip key={user.id} title={`${user.name} (${user.email})`}>
              <Avatar
                size="default"
                style={{
                  backgroundColor: 'rgb(var(--blue))',
                  color: 'white',
                  border: '2px solid rgb(var(--bg-container))',
                  fontSize: '14px'
                }}
              >
                {user.name.charAt(0).toUpperCase()}
              </Avatar>
            </Tooltip>
          ))}
        </Avatar.Group>
      </div>

      {/* Add User Button  */}
      <Tooltip title={t('projectInfo.addUser')}>
        <Button
          type="text"
          shape="circle"
          icon={<PlusOutlined className="text-sm" />}
          onClick={() => setIsModalVisible(true)}
          className="hover:border-blue-400 hover:text-blue-500 w-8 h-8 min-w-8 flex-shrink-0 border-dashed"
          style={{
            color: 'rgb(var(--text-color) / 0.6)',
            borderColor: 'rgb(var(--border-color))',
            border: '1px dashed rgb(var(--border-color))'
          }}
        />
      </Tooltip>

      {/* Empty state */}
      {assignedUsers.length === 0 && (
        <span 
          className="text-xs italic hidden sm:block text-gray-400 flex-shrink-0"
          style={{ 
            color: 'rgb(var(--text-color) / 0.4)'
          }}
        >
          {t('projectInfo.noUsersAssigned')}
        </span>
      )}

      {/* Add User Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <UserAddOutlined style={{ color: 'rgb(var(--blue))' }} />
            {t('projectInfo.addUserToProject')}
          </div>
        }
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        destroyOnClose
        width={400}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddUser}
          className="mt-4"
        >
          <Form.Item
            name="name"
            label={t('projectInfo.userName')}
            rules={[
              { required: true, message: t('projectInfo.userNameRequired') },
              { min: 2, message: t('projectInfo.userNameMinLength') }
            ]}
          >
            <Input placeholder={t('projectInfo.userNamePlaceholder')} />
          </Form.Item>

          <Form.Item
            name="email"
            label={t('projectInfo.userEmail')}
            rules={[
              { required: true, message: t('projectInfo.userEmailRequired') },
              { type: 'email', message: t('projectInfo.userEmailInvalid') }
            ]}
          >
            <Input placeholder={t('projectInfo.userEmailPlaceholder')} />
          </Form.Item>

          <Form.Item className="mb-0 flex justify-end">
            <div className="flex gap-2">
                <Button 
                type="primary" 
                htmlType="submit"
                style={{
                  backgroundColor: 'rgb(var(--blue))',
                  borderColor: 'rgb(var(--blue))'
                }}
              >
                {t('projectInfo.addUser')}
              </Button>
              <Button 
                onClick={() => {
                  setIsModalVisible(false);
                  form.resetFields();
                }}
              >
                {t('common.cancel')}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}