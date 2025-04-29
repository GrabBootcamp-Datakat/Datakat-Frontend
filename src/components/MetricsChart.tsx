import { useEffect, useState } from "react";
import { Line } from "@ant-design/plots";
import { Card } from "antd";

const generateData = () => {
  const data = [];
  const now = new Date();

  for (let i = 23; i >= 0; i--) {
    const time = new Date(now);
    time.setHours(now.getHours() - i);

    data.push({
      time: time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      cpu: Math.floor(Math.random() * 40) + 20,
      memory: Math.floor(Math.random() * 30) + 40,
      network: Math.floor(Math.random() * 50) + 10,
    });
  }

  return data;
};

export function MetricsChart() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    setData(generateData());
  }, []);

  const config = {
    data,
    xField: "time",
    yField: "value",
    seriesField: "type",
    smooth: true,
    animation: {
      appear: {
        animation: "path-in",
        duration: 1000,
      },
    },
    point: {
      size: 0,
      shape: "circle",
    },
    tooltip: {
      showMarkers: false,
      domStyles: {
        "g2-tooltip": {
          padding: "8px",
          fontSize: "12px",
        },
      },
    },
    legend: {
      position: "top",
    },
    xAxis: {
      label: {
        style: {
          fontSize: 12,
        },
      },
    },
    yAxis: {
      label: {
        formatter: (v: string) => `${v}%`,
        style: {
          fontSize: 12,
        },
      },
    },
  };

  // Transform data for Ant Design Charts
  const transformedData = data.flatMap((item) => [
    { time: item.time, type: "CPU", value: item.cpu },
    { time: item.time, type: "Memory", value: item.memory },
    { time: item.time, type: "Network", value: item.network },
  ]);

  return (
    <Card>
      <Line {...config} data={transformedData} />
    </Card>
  );
}
