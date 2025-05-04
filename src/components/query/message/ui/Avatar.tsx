import { ThunderboltOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';

export const UserAvatar = () => {
  return (
    <Avatar
      icon={<UserOutlined className="!text-gray-600" />}
      style={{
        backgroundColor: '#fff',
        border: '1px solid #e0e0e0',
        minWidth: '32px',
        minHeight: '32px',
      }}
    />
  );
};

export const BotAvatar = () => {
  return (
    <Avatar
      icon={<ThunderboltOutlined className="!text-blue-600" />}
      style={{
        backgroundColor: '#fff',
        border: '1px solid #e0e0e0',
        minWidth: '32px',
        minHeight: '32px',
      }}
    />
  );
};
