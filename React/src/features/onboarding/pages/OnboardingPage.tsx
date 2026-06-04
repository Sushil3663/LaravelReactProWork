import { useState, useEffect } from 'react';
import {
  Button, Card, Form, Input, Select, DatePicker, Steps, Typography, Upload, Divider, Skeleton, Row, Col, Space
} from 'antd';
import { InboxOutlined, LeftOutlined, RightOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useLatestOnboarding, useCaseInitiation, useUploadImage, useUpdateBasicInfo, useUpdateOtherInfo } from '@/features/onboarding/hooks/useOnboarding';
import { useMasterData } from '@/features/master-data/hooks/useMasterData';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Dragger } = Upload;

const steps = [
  { title: 'Start' },
  { title: 'Identity' },
  { title: 'Basic Info' },
  { title: 'Address' },
];

export default function OnboardingPage() {
  const [current, setCurrent] = useState(0);
  const [formId, setFormId] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState<string>('passport');
  const [basicInfoValues, setBasicInfoValues] = useState<Record<string, unknown> | null>(null);

  const [basicForm] = Form.useForm();
  const [addressForm] = Form.useForm();

  const { data: latest, isLoading: latestLoading } = useLatestOnboarding();
  const caseInitiation = useCaseInitiation();
  const uploadImage = useUploadImage();
  const updateBasicInfo = useUpdateBasicInfo();
  const updateOtherInfo = useUpdateOtherInfo();
  const { data: masterDataRes, isLoading: mdLoading, error: mdError } = useMasterData();
  const countries = masterDataRes?.data?.masterData?.country ?? [];
  const provinces = masterDataRes?.data?.masterData?.proviences ?? [];
  const districts = masterDataRes?.data?.masterData?.district ?? [];
  const municipalities = masterDataRes?.data?.masterData?.municipilities ?? [];

  useEffect(() => {
    if (latest?.data?.form_id && !formId) {
      setFormId(latest.data.form_id);
    }
  }, [latest, formId]);

  const handleStart = async () => {
    const res = await caseInitiation.mutateAsync();
    setFormId(res.data.form_id);
    setCurrent(1);
  };

  const handleContinue = () => {
    if (latest?.data?.form_id) {
      setFormId(latest.data.form_id);
      setCurrent(1);
    }
  };

  const handleUploadImage = async () => {
    if (!formId || !file) return;
    await uploadImage.mutateAsync({ formId, file });
    setFile(null);
    setCurrent(2);
  };

  const handleBasicInfo = async (values: Record<string, unknown>) => {
    if (!formId) return;
    await updateBasicInfo.mutateAsync({
      form_id: formId,
      salutation: values.salutation as string,
      full_name: values.full_name as string,
      gender: values.gender as string,
      date_of_birth: dayjs(values.date_of_birth as string).format('YYYY-MM-DD'),
      father_name: values.father_name as string,
      mother_name: values.mother_name as string,
      place_of_birth: values.place_of_birth as string,
    });
    setBasicInfoValues(values);
    setCurrent(3);
  };

  const handleAddressInfo = async (values: Record<string, unknown>) => {
    if (!formId || !basicInfoValues) return;
    await updateOtherInfo.mutateAsync({
      form_id: formId,
      country: values.country as string,
      permanent_provience: values.permanent_provience as string,
      permanent_district: values.permanent_district as string,
      permanent_municipality: values.permanent_municipality as string,
      permanent_ward: values.permanent_ward as string,
      permanent_city: values.permanent_city as string,
      temporary_provience: values.temporary_provience as string,
      temporary_district: values.temporary_district as string,
      temporary_municipality: values.temporary_municipality as string,
      temporary_ward: values.temporary_ward as string,
      temporary_city: values.temporary_city as string,
      full_name: basicInfoValues.full_name as string,
      gender: basicInfoValues.gender as string,
      date_of_birth: dayjs(basicInfoValues.date_of_birth as string).format('YYYY-MM-DD'),
      father_name: basicInfoValues.father_name as string,
      mother_name: basicInfoValues.mother_name as string,
      place_of_birth: basicInfoValues.place_of_birth as string,
    });
    setCurrent(4);
  };

  const copyToTemporary = () => {
    const permanentValues = addressForm.getFieldsValue([
      'permanent_provience', 'permanent_district', 'permanent_municipality',
      'permanent_ward', 'permanent_city',
    ]);
    addressForm.setFieldsValue({
      temporary_provience: permanentValues.permanent_provience,
      temporary_district: permanentValues.permanent_district,
      temporary_municipality: permanentValues.permanent_municipality,
      temporary_ward: permanentValues.permanent_ward,
      temporary_city: permanentValues.permanent_city,
    });
  };

  if (latestLoading) {
    return (
      <Card style={{ maxWidth: 800, margin: '24px auto' }}>
        <Skeleton active />
      </Card>
    );
  }

  if (latest && latest.data && latest.data.form_id && !formId) {
    return (
      <Card style={{ maxWidth: 600, margin: '24px auto', textAlign: 'center' }}>
        <Title level={4}>Active Onboarding Case</Title>
        <Text type="secondary">Form ID: {latest.data.form_id}</Text>
        <br />
        <Text type="secondary">Status: {latest.data.status}</Text>
        <br /><br />
        <Button type="primary" size="large" onClick={handleContinue}>
          Continue
        </Button>
      </Card>
    );
  }

  return (
    <Card style={{ maxWidth: 800, margin: '24px auto' }}>
      <Title level={3} style={{ textAlign: 'center', marginBottom: 32 }}>
        Account Opening
      </Title>

      <Steps current={current} items={steps} style={{ marginBottom: 32 }} />

      {current === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <Title level={4}>Start Your Application</Title>
          <p style={{ marginBottom: 24, color: '#666' }}>
            Begin the account opening process by initiating a new case.
          </p>
          <Button
            type="primary"
            size="large"
            onClick={handleStart}
            loading={caseInitiation.isPending}
          >
            Start Onboarding
          </Button>
        </div>
      )}

      {current === 1 && (
        <div>
          <Title level={4}>Upload Identity Card</Title>
          <Form layout="vertical" style={{ marginBottom: 16 }}>
            <Form.Item label="Document Type" required>
              <Select
                size="large"
                placeholder="Select document type"
                value={documentType}
                onChange={setDocumentType}
                options={[
                  { label: 'Passport', value: 'passport' },
                  { label: 'National ID', value: 'national_id' },
                  { label: "Driver's License", value: 'drivers_license' },
                  { label: 'Other', value: 'other' },
                ]}
              />
            </Form.Item>
          </Form>
          <Dragger
            accept=".jpg,.jpeg,.png"
            beforeUpload={(f) => { setFile(f); return false; }}
            showUploadList={false}
            style={{ marginBottom: 16 }}
          >
            <p className="ant-upload-drag-icon"><InboxOutlined /></p>
            <p className="ant-upload-text">Click or drag your identity card here</p>
            <p className="ant-upload-hint">Supports JPG, JPEG, PNG (max 2MB)</p>
          </Dragger>
          {file && (
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <img
                src={URL.createObjectURL(file)}
                alt="Identity card preview"
                style={{ maxWidth: '100%', maxHeight: 300, borderRadius: 8, objectFit: 'contain' }}
              />
              <p style={{ marginTop: 8, color: '#666' }}>{file.name}</p>
            </div>
          )}
          <Space style={{ width: '100%', justifyContent: 'space-between' }}>
            <Button onClick={() => setCurrent(0)} icon={<LeftOutlined />}>
              Back
            </Button>
            <Button
              type="primary"
              onClick={handleUploadImage}
              disabled={!file}
              loading={uploadImage.isPending}
            >
              Upload & Next
            </Button>
          </Space>
        </div>
      )}

      {current === 2 && (
        <div>
          <Title level={4}>Basic Information</Title>
          <Form
            form={basicForm}
            layout="vertical"
            onFinish={handleBasicInfo}
            initialValues={{ salutation: 'mr' }}
          >
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item name="salutation" label="Salutation" rules={[{ required: true }]}>
                  <Select
                    size="large"
                    options={[
                      { value: 'mr', label: 'Mr.' },
                      { value: 'mrs', label: 'Mrs.' },
                      { value: 'ms', label: 'Ms.' },
                      { value: 'dr', label: 'Dr.' },
                    ]}
                  />
                </Form.Item>
              </Col>
              <Col span={16}>
                <Form.Item name="full_name" label="Full Name" rules={[{ required: true, message: 'Please enter full name' }]}>
                  <Input size="large" placeholder="Enter full name" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="gender" label="Gender" rules={[{ required: true, message: 'Please select gender' }]}>
                  <Select
                    size="large"
                    options={[
                      { value: 'male', label: 'Male' },
                      { value: 'female', label: 'Female' },
                      { value: 'other', label: 'Other' },
                    ]}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="date_of_birth" label="Date of Birth" rules={[{ required: true, message: 'Please select date of birth' }]}>
                  <DatePicker style={{ width: '100%' }} size="large" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="father_name" label="Father's Name" rules={[{ required: true, message: 'Please enter father name' }]}>
                  <Input size="large" placeholder="Enter father's name" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="mother_name" label="Mother's Name" rules={[{ required: true, message: 'Please enter mother name' }]}>
                  <Input size="large" placeholder="Enter mother's name" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item name="place_of_birth" label="Place of Birth" rules={[{ required: true, message: 'Please enter place of birth' }]}>
              <Input size="large" placeholder="Enter place of birth" />
            </Form.Item>

            <Space style={{ width: '100%', justifyContent: 'space-between' }}>
              <Button onClick={() => setCurrent(1)} icon={<LeftOutlined />}>
                Back
              </Button>
              <Button type="primary" htmlType="submit" loading={updateBasicInfo.isPending}>
                Save & Next <RightOutlined />
              </Button>
            </Space>
          </Form>
        </div>
      )}

      {current === 3 && (
        <div>
          <Title level={4}>Address Information</Title>
          {mdError && (
            <Text type="danger">Failed to load address data. Please try again.</Text>
          )}
          <Form
            form={addressForm}
            layout="vertical"
            onFinish={handleAddressInfo}
          >
            <Form.Item
              name="country"
              label="Country"
              rules={[{ required: true, message: 'Please select country' }]}
            >
              <Select
                showSearch
                placeholder="Select country"
                size="large"
                allowClear
                loading={mdLoading}
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
                options={countries.map(c => ({ value: c.id, label: c.title }))}
              />
            </Form.Item>

            <Divider orientation="left">Permanent Address</Divider>
            <Form.Item
              name="permanent_provience"
              label="Permanent Province"
              rules={[{ required: true, message: 'Please select permanent province' }]}
            >
              <Select
                showSearch
                placeholder="Select permanent province"
                size="large"
                allowClear
                loading={mdLoading}
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
                options={provinces.map(p => ({ value: p.id, label: p.title }))}
              />
            </Form.Item>
            <Form.Item
              name="permanent_district"
              label="Permanent District"
              rules={[{ required: true, message: 'Please select permanent district' }]}
            >
              <Select
                showSearch
                placeholder="Select permanent district"
                size="large"
                allowClear
                loading={mdLoading}
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
                options={districts.map(d => ({ value: d.id, label: d.title }))}
              />
            </Form.Item>
            <Form.Item
              name="permanent_municipality"
              label="Permanent Municipality"
              rules={[{ required: true, message: 'Please select permanent municipality' }]}
            >
              <Select
                showSearch
                placeholder="Select permanent municipality"
                size="large"
                allowClear
                loading={mdLoading}
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
                options={municipalities.map(m => ({ value: m.id, label: m.title }))}
              />
            </Form.Item>
            <Form.Item
              name="permanent_ward"
              label="Permanent Ward"
              rules={[
                { required: true, message: 'Please select permanent ward' },
                { max: 3, message: 'Ward must be at most 3 characters' },
              ]}
            >
              <Select
                placeholder="Select permanent ward"
                size="large"
                allowClear
                options={Array.from({ length: 30 }, (_, i) => ({
                  value: String(i + 1),
                  label: `Ward ${i + 1}`,
                }))}
              />
            </Form.Item>
            <Form.Item
              name="permanent_city"
              label="Permanent City"
              rules={[{ required: true, message: 'Please select permanent city' }]}
            >
              <Select
                showSearch
                placeholder="Select permanent city"
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

            <Divider orientation="left">
              <Space>
                <span>Temporary Address</span>
                <Button size="small" type="link" onClick={copyToTemporary}>
                  Same as permanent
                </Button>
              </Space>
            </Divider>
            <Form.Item
              name="temporary_provience"
              label="Temporary Province"
              rules={[{ required: true, message: 'Please select temporary province' }]}
            >
              <Select
                showSearch
                placeholder="Select temporary province"
                size="large"
                allowClear
                loading={mdLoading}
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
                options={provinces.map(p => ({ value: p.id, label: p.title }))}
              />
            </Form.Item>
            <Form.Item
              name="temporary_district"
              label="Temporary District"
              rules={[{ required: true, message: 'Please select temporary district' }]}
            >
              <Select
                showSearch
                placeholder="Select temporary district"
                size="large"
                allowClear
                loading={mdLoading}
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
                options={districts.map(d => ({ value: d.id, label: d.title }))}
              />
            </Form.Item>
            <Form.Item
              name="temporary_municipality"
              label="Temporary Municipality"
              rules={[{ required: true, message: 'Please select temporary municipality' }]}
            >
              <Select
                showSearch
                placeholder="Select temporary municipality"
                size="large"
                allowClear
                loading={mdLoading}
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
                options={municipalities.map(m => ({ value: m.id, label: m.title }))}
              />
            </Form.Item>
            <Form.Item
              name="temporary_ward"
              label="Temporary Ward"
              rules={[
                { required: true, message: 'Please select temporary ward' },
                { max: 3, message: 'Ward must be at most 3 characters' },
              ]}
            >
              <Select
                placeholder="Select temporary ward"
                size="large"
                allowClear
                options={Array.from({ length: 30 }, (_, i) => ({
                  value: String(i + 1),
                  label: `Ward ${i + 1}`,
                }))}
              />
            </Form.Item>
            <Form.Item
              name="temporary_city"
              label="Temporary City"
              rules={[{ required: true, message: 'Please select temporary city' }]}
            >
              <Select
                showSearch
                placeholder="Select temporary city"
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

            <Space style={{ width: '100%', justifyContent: 'space-between' }}>
              <Button onClick={() => setCurrent(2)} icon={<LeftOutlined />}>
                Back
              </Button>
              <Button type="primary" htmlType="submit" loading={updateOtherInfo.isPending}>
                Save & Next <RightOutlined />
              </Button>
            </Space>
          </Form>
        </div>
      )}

      {current === 4 && (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <CheckCircleOutlined style={{ fontSize: 64, color: '#52c41a', marginBottom: 16 }} />
          <Title level={4}>Application Submitted Successfully!</Title>
          <Text type="secondary">
            Your account opening application has been received. We will review your information and get back to you shortly.
          </Text>
          <br /><br />
          <Button type="primary" size="large" onClick={() => window.location.reload()}>
            Start New Application
          </Button>
        </div>
      )}
    </Card>
  );
}
