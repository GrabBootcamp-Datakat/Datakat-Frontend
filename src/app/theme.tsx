'use client';

import { ConfigProvider, App } from 'antd';
import { AntdRegistry } from '@ant-design/nextjs-registry';

export const theme = {
  components: {
    Card: {
      bodyPadding: 12,
      headerPadding: 12,
    },
  },
};

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AntdRegistry>
      <App>
        <ConfigProvider theme={theme}>{children}</ConfigProvider>
      </App>
    </AntdRegistry>
  );
}
