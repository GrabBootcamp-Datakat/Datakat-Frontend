'use client';

import { ConfigProvider, App, theme as antdTheme } from 'antd';
import { AntdRegistry } from '@ant-design/nextjs-registry';

export const theme = {
  algorithm: antdTheme.defaultAlgorithm,
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
