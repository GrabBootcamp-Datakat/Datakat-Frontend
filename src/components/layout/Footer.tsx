import { Footer as AntFooter } from 'antd/es/layout/layout';
import Paragraph from 'antd/es/typography/Paragraph';

export default function Footer() {
  return (
    <AntFooter className="border-t border-gray-200 py-8 text-center">
      <Paragraph className="text-gray-600">
        &copy; {new Date().getFullYear()} LogSavvy. All rights reserved.
      </Paragraph>
    </AntFooter>
  );
}
