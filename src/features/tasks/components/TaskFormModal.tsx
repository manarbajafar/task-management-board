import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Form, Input, Select, Button, Space } from 'antd';
import type { Task, TaskFormData } from '../types/task.types';
import type { TaskStatus, User } from '../../../types/global.types';

const { TextArea } = Input;
const { Option } = Select;

interface TaskFormModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (data: TaskFormData, taskId?: string) => void;
  task?: Task | null;
  defaultStatus?: TaskStatus;
  users: User[];
}

export function TaskFormModal({ 
  visible, 
  onCancel, 
  onSubmit, 
  task, 
  users 
}: TaskFormModalProps) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const isEditing = !!task;

  useEffect(() => {
    if (visible) {
      if (isEditing && task) {
        // Populate form with existing task data
        form.setFieldsValue({
          title: task.title,
          description: task.description,
          priority: task.priority,
          assigneeId: task.assignee?.id,
          tags: task.tags,
        });
      } else {
        // Reset form for new task
        form.resetFields();
      }
    }
  }, [visible, task, isEditing, form]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      
      const formData: TaskFormData = {
        title: values.title,
        description: values.description || '',
        priority: values.priority,
        assigneeId: values.assigneeId,
        tags: values.tags || [],
      };

      onSubmit(formData, task?.id);
      form.resetFields();
    } catch (error) {
      console.error('Form validation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={isEditing ? t('taskBoard.editTask') : t('taskBoard.addTask')}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        {/* Title */}
        <Form.Item
          name="title"
          label={t('taskBoard.task.title')}
          rules={[{ required: true, message: t('taskBoard.task.titleRequired') }]}
        >
          <Input placeholder={t('taskBoard.task.titlePlaceholder')} />
        </Form.Item>

        {/* Description */}
        <Form.Item
          name="description"
          label={t('taskBoard.task.description')}
        >
          <TextArea 
            rows={4} 
            placeholder={t('taskBoard.task.descriptionPlaceholder')} 
          />
        </Form.Item>

        {/* Priority */}
        <Form.Item
          name="priority"
          label={t('taskBoard.task.priority')}
          initialValue="medium"
          rules={[{ required: true, message: t('taskBoard.task.priorityRequired') }]}
        >
          <Select placeholder={t('taskBoard.task.selectPriority')}>
            <Option value="low">{t('taskBoard.priority.low')}</Option>
            <Option value="medium">{t('taskBoard.priority.medium')}</Option>
            <Option value="high">{t('taskBoard.priority.high')}</Option>
          </Select>
        </Form.Item>

        {/* Assignee */}
        <Form.Item
          name="assigneeId"
          label={t('taskBoard.task.assignee')}
        >
          <Select 
            placeholder={t('taskBoard.task.selectAssignee')}
            allowClear
          >
            {users.map(user => (
              <Option key={user.id} value={user.id}>
                {user.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* Tags */}
        <Form.Item
          name="tags"
          label={t('taskBoard.task.tags')}
        >
          <Select
            mode="tags"
            placeholder={t('taskBoard.task.tagsPlaceholder')}
            tokenSeparators={[',']}
          />
        </Form.Item>

        {/* Actions */}
        <Form.Item>
          <Space className="w-full justify-end">
            <Button 
              type="primary" 
              htmlType="submit"
              loading={loading}
            >
              {isEditing ? t('taskBoard.task.update') : t('taskBoard.task.create')}
            </Button>
             <Button onClick={onCancel}>
              {t('taskBoard.task.cancel')}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
}