"use client";

import { ConfigProvider, App } from "antd";
import { AntdRegistry } from "@ant-design/nextjs-registry";

export const theme = {
  //   token: {
  //     colorPrimary: "#4d2c5e",
  //     colorBgContainerDisabled: "#d4d4d8",
  //   },
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
