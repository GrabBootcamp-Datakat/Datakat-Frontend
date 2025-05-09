'use client';
import { Menu, MenuProps } from 'antd';
import {
  BarChartOutlined,
  FileTextOutlined,
  ThunderboltOutlined,
  DashboardOutlined,
  AlertOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Header as AntHeader } from 'antd/es/layout/layout';

const items: MenuProps['items'] = [
  {
    key: 'dashboard',
    icon: <DashboardOutlined />,
    label: <Link href="/dashboard">Dashboard</Link>,
  },
  {
    key: 'metrics',
    icon: <BarChartOutlined />,
    label: <Link href="/metrics">Metrics</Link>,
  },
  {
    key: 'logs',
    icon: <FileTextOutlined />,
    label: <Link href="/logs">Logs</Link>,
  },
  {
    key: 'anomalies',
    icon: <AlertOutlined />,
    label: <Link href="/anomalies">Anomalies</Link>,
  },
  {
    key: 'query',
    icon: <QuestionCircleOutlined />,
    label: <Link href="/query">Query</Link>,
  },
];

export default function Header() {
  const pathname = usePathname();
  const current = pathname === '/' ? '' : pathname.split('/')[1];
  return (
    <AntHeader className="fixed top-0 right-0 left-0 z-50 flex items-center justify-between border-b border-b-gray-300 !bg-white">
      <Link href="/" className="flex items-center gap-2">
        <ThunderboltOutlined className="text-2xl !text-blue-600" />
        <span className="text-xl font-semibold text-gray-800">LogSavvy</span>
      </Link>
      <Menu mode="horizontal" selectedKeys={[current]} items={items} />
    </AntHeader>
  );
}
