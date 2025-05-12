'use client';
import { Button } from 'antd';
import { RedoOutlined } from '@ant-design/icons';
import { useAppDispatch } from '@/hooks/hook';
import { loadMore } from '@/store/slices/anomalySlice';

export default function LoadButton() {
  const dispatch = useAppDispatch();
  const handleLoadMore = () => {
    dispatch(loadMore());
  };

  return (
    <Button
      size="small"
      type="primary"
      onClick={handleLoadMore}
      icon={<RedoOutlined />}
    >
      Load More
    </Button>
  );
}
