import { useTranslation } from 'react-i18next';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

interface AddTaskButtonProps {
  onClick: () => void;
}

export function AddTaskButton({ onClick }: AddTaskButtonProps) {
  const { t } = useTranslation();

  return (
    <Button
      type="primary" 
      size="large"
      icon={<PlusOutlined />}
      onClick={onClick}
      className="rounded-xl font-semibold shadow-md hover:shadow-lg transition-all"
      style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        border: 'none'
      }}
    >
      {t('taskBoard.addTask')}
    </Button>
  );
}