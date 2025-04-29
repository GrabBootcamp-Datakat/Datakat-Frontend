import { useEffect, useState } from "react";
import { Table } from "antd";
import type { TableProps } from "antd";

const generateTableData = (query: string) => {
  const data = [];

  // Generate different data based on query content
  if (query.toLowerCase().includes("cpu")) {
    for (let i = 0; i < 10; i++) {
      data.push({
        key: i,
        server: `app-server-0${(i % 3) + 1}`,
        cpu_usage: `${Math.floor(Math.random() * 40) + 20}%`,
        memory_usage: `${Math.floor(Math.random() * 30) + 40}%`,
        timestamp: new Date(Date.now() - i * 3600000).toLocaleString(),
      });
    }
  } else if (query.toLowerCase().includes("error")) {
    for (let i = 0; i < 10; i++) {
      data.push({
        key: i,
        service: [
          "api-gateway",
          "auth-service",
          "payment-service",
          "notification-service",
        ][i % 4],
        error_count: Math.floor(Math.random() * 50) + 10,
        error_rate: `${(Math.random() * 5).toFixed(2)}%`,
        last_error: new Date(Date.now() - i * 7200000).toLocaleString(),
      });
    }
  } else if (
    query.toLowerCase().includes("traffic") ||
    query.toLowerCase().includes("network")
  ) {
    for (let i = 0; i < 10; i++) {
      data.push({
        key: i,
        server: `app-server-0${(i % 3) + 1}`,
        inbound: `${Math.floor(Math.random() * 500) + 200} MB/s`,
        outbound: `${Math.floor(Math.random() * 300) + 100} MB/s`,
        total: `${Math.floor(Math.random() * 800) + 300} MB/s`,
      });
    }
  } else {
    // Default data
    for (let i = 0; i < 10; i++) {
      data.push({
        key: i,
        metric: [
          "CPU Usage",
          "Memory Usage",
          "Disk I/O",
          "Network Traffic",
          "Response Time",
        ][i % 5],
        value: Math.floor(Math.random() * 100),
        change: `${(Math.random() * 10 - 5).toFixed(2)}%`,
        timestamp: new Date(Date.now() - i * 3600000).toLocaleString(),
      });
    }
  }

  return data;
};

interface QueryResultTableProps {
  query: string;
}

export function QueryResultTable({ query }: QueryResultTableProps) {
  const [data, setData] = useState<any[]>([]);
  const [columns, setColumns] = useState<TableProps<any>["columns"]>([]);

  useEffect(() => {
    const newData = generateTableData(query);
    setData(newData);

    if (newData.length > 0) {
      const newColumns = Object.keys(newData[0])
        .filter((key) => key !== "key")
        .map((key) => ({
          title: key
            .replace(/_/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase()),
          dataIndex: key,
          key: key,
        }));
      setColumns(newColumns);
    }
  }, [query]);

  if (!data.length) return null;

  return (
    <Table
      dataSource={data}
      columns={columns}
      pagination={{ pageSize: 10 }}
      scroll={{ x: true }}
      size="middle"
      bordered
    />
  );
}
