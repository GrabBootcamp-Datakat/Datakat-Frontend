import { PageTitle, LayoutStatic } from '@/components/common';
import { MessageArea, QueryInputArea } from '@/components/query';

export const metadata = {
  title: 'Natural Language Query',
  description: 'A page for natural language query',
};

export default function QueryPage() {
  return (
    <LayoutStatic>
      <PageTitle title="Natural Language Query" />
      <MessageArea />
      <QueryInputArea />
    </LayoutStatic>
  );
}
