import Title from 'antd/es/typography/Title';

export default function PageTitle({ title }: { title: string }) {
  return (
    <Title level={2} style={{ margin: 0 }}>
      {title}
    </Title>
  );
}
