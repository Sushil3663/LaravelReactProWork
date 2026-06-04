import { Form, Select, Skeleton } from 'antd';
import { useMasterData } from '@/features/master-data/hooks/useMasterData';

interface AddressSelectProps {
  prefix: 'permanent' | 'temporary';
}

export default function AddressSelect({ prefix }: AddressSelectProps) {
  const label = prefix === 'permanent' ? 'Permanent' : 'Temporary';
  const { data: masterDataRes, isLoading } = useMasterData();

  const masterData = masterDataRes?.data?.masterData;
  const provinces = masterData?.proviences ?? [];
  const districts = masterData?.district ?? [];
  const municipalities = masterData?.municipilities ?? [];

  if (isLoading) {
    return <Skeleton active paragraph={{ rows: 4 }} />;
  }

  return (
    <>
      <Form.Item
        name={`${prefix}_provience`}
        label={`${label} Province`}
        rules={[{ required: true, message: `Please select ${label.toLowerCase()} province` }]}
      >
        <Select
          showSearch
          placeholder={`Select ${label.toLowerCase()} province`}
          size="large"
          allowClear
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
          options={provinces.map(p => ({ value: p.id, label: p.title }))}
        />
      </Form.Item>

      <Form.Item
        name={`${prefix}_district`}
        label={`${label} District`}
        rules={[{ required: true, message: `Please select ${label.toLowerCase()} district` }]}
      >
        <Select
          showSearch
          placeholder={`Select ${label.toLowerCase()} district`}
          size="large"
          allowClear
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
          options={districts.map(d => ({ value: d.id, label: d.title }))}
        />
      </Form.Item>

      <Form.Item
        name={`${prefix}_municipality`}
        label={`${label} Municipality`}
        rules={[{ required: true, message: `Please select ${label.toLowerCase()} municipality` }]}
      >
        <Select
          showSearch
          placeholder={`Select ${label.toLowerCase()} municipality`}
          size="large"
          allowClear
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
          options={municipalities.map(m => ({ value: m.id, label: m.title }))}
        />
      </Form.Item>

      <Form.Item
        name={`${prefix}_ward`}
        label={`${label} Ward`}
        rules={[
          { required: true, message: `Please enter ${label.toLowerCase()} ward` },
          { max: 3, message: 'Ward must be at most 3 characters' },
        ]}
      >
        <Select
          placeholder={`Select ${label.toLowerCase()} ward`}
          size="large"
          allowClear
          options={Array.from({ length: 30 }, (_, i) => ({
            value: String(i + 1),
            label: `Ward ${i + 1}`,
          }))}
        />
      </Form.Item>

      <Form.Item
        name={`${prefix}_city`}
        label={`${label} City`}
        rules={[{ required: true, message: `Please enter ${label.toLowerCase()} city` }]}
      >
        <Select
          showSearch
          placeholder={`Select ${label.toLowerCase()} city`}
          size="large"
          allowClear
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
          options={[
            { value: 'kathmandu', label: 'Kathmandu' },
            { value: 'pokhara', label: 'Pokhara' },
            { value: 'lalitpur', label: 'Lalitpur' },
            { value: 'bhaktapur', label: 'Bhaktapur' },
            { value: 'biratnagar', label: 'Biratnagar' },
            { value: 'butwal', label: 'Butwal' },
            { value: 'chitwan', label: 'Chitwan' },
            { value: 'dharan', label: 'Dharan' },
            { value: 'janakpur', label: 'Janakpur' },
            { value: 'nepalgunj', label: 'Nepalgunj' },
            { value: 'other', label: 'Other' },
          ]}
        />
      </Form.Item>
    </>
  );
}
