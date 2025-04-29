"use client";
import { Layout } from "antd";
import Sidebar from "@/components/layout/Sidebar";
import ChatbotPanel from "@/components/layout/ChatbotPanel";
import Dashboard from "@/components/dashboard/Dashboard";

const { Content } = Layout;

export default function Home() {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />
      <Layout
        style={{
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          transform: "translateX(0)",
        }}
      >
        <Content>
          <Dashboard />
        </Content>
      </Layout>
      <ChatbotPanel />
    </Layout>
  );
}
