import { ReactNode } from 'react';
import { Card, CardProps } from 'antd';

export interface ShadowCardProps extends CardProps {
  children: ReactNode;
}

export default function ShadowCard(props: CardProps) {
  const { children } = props;
  return (
    <Card
      className="!h-full !rounded-xl !shadow-lg !transition-all !duration-300 hover:!shadow-xl"
      styles={{
        body: {
          padding: '24px',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
      style={{
        background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
        border: '1px solid rgba(226, 232, 240, 0.8)',
      }}
    >
      {children}
    </Card>
  );
}
