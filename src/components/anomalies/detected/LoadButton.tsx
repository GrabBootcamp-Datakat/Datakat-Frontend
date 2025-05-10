import { loadMore } from '@/store/slices/anomalySlice';
import { useAppDispatch } from '@/hooks/hook';
import { Button } from 'antd';
import { RedoOutlined } from '@ant-design/icons';

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
