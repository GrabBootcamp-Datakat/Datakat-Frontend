import Title from 'antd/es/typography/Title';

export const PageTitle = ({ title }: { title: string }) => {
  return (
    <Title level={2} style={{ margin: 0 }}>
      {title}
    </Title>
  );
};
