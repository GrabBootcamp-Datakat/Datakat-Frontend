"use client";

import { Layout, Menu } from "antd";
import { useToggle } from "@/lib/hooks/useToggle";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
} from "@ant-design/icons";

const { Sider } = Layout;

export default function Sidebar() {
  const { open, toggle } = useToggle(true);

  return (
    <Sider trigger={null} collapsible collapsed={open}>
      <div className="demo-logo-vertical" />
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={["1"]}
        items={[
          {
            key: "1",
            icon: <DashboardOutlined />,
            label: "Dashboard",
          },
        ]}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          padding: "16px",
          textAlign: "center",
          cursor: "pointer",
        }}
        onClick={toggle}
      >
        {open ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </div>
    </Sider>
  );
}
