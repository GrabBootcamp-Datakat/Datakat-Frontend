import Link from 'next/link';
import { ReactNode } from 'react';
import { Button, Space } from 'antd';
import Title from 'antd/es/typography/Title';
import Paragraph from 'antd/es/typography/Paragraph';
import ShadowCard from './ShadowCard';

export interface FeatureCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  stats: string[];
  linkText: string;
  linkHref: string;
}

export default function FeatureCard(props: FeatureCardProps) {
  const { title, description, icon, stats, linkText, linkHref } = props;
  return (
    <ShadowCard>
      <Space direction="vertical" size="middle" className="!w-full">
        <Title level={4} style={{ margin: 0 }}>
          {title}
        </Title>
        <Paragraph type="secondary" style={{ margin: 0 }}>
          {description}
        </Paragraph>
        <div className="!flex !h-[120px] !items-center !justify-center !rounded-md !bg-gradient-to-br !from-blue-50 !to-blue-100 !p-4">
          <Space direction="vertical" size="small" className="!text-center">
            {icon}
            <div className="!text-sm !text-gray-600">
              {stats.map((stat: string, index: number) => (
                <div key={index}>{stat}</div>
              ))}
            </div>
          </Space>
        </div>
        <Link href={linkHref} className="!w-full">
          <Button type="primary" block size="large">
            {linkText}
          </Button>
        </Link>
      </Space>
    </ShadowCard>
  );
}
