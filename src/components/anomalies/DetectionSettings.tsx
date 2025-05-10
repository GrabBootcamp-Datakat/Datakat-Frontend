import { setSettings } from '@/store/slices/anomalySlice';
import { useAppDispatch, useAppSelector } from '@/hooks/hook';
import { selectSettings } from '@/store/slices/anomalySlice';
import { SettingOutlined } from '@ant-design/icons';
import { Switch, Slider, Card, Space, Row } from 'antd';
import Text from 'antd/es/typography/Text';

export default function DetectionSettings() {
  const dispatch = useAppDispatch();
  const settings = useAppSelector(selectSettings);

  return (
    <Card
      title={
        <>
          <SettingOutlined /> Detection Settings
        </>
      }
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <Row justify="space-between">
          <Text>Auto Detection</Text>
          <Switch
            checked={settings.autoDetect}
            onChange={(value) => dispatch(setSettings({ autoDetect: value }))}
          />
        </Row>
        <Row justify="space-between">
          <Text>Send Notification</Text>
          <Switch
            checked={settings.notify}
            onChange={(value) => dispatch(setSettings({ notify: value }))}
          />
        </Row>
        <Row justify="space-between">
          <Text>Threshold: {settings.threshold}%</Text>
        </Row>
        <Slider
          min={0}
          max={100}
          step={5}
          value={settings.threshold}
          onChange={(value) => dispatch(setSettings({ threshold: value }))}
        />
      </Space>
    </Card>
  );
}
