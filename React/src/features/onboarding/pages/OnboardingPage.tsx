import { useState } from 'react';
import { Button, Card, Form, Input, Steps, Typography, Upload, Select, Divider, Skeleton } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { useLatestOnboarding, useCaseInitiation, useUploadImage, useUploadCaseDocuments } from '@/features/onboarding/hooks/useOnboarding';

const { Title } = Typography;
const { Dragger } = Upload;

const steps = [
  { title: 'Start' },
  { title: 'Identity' },
  { title: 'Documents' },
];

export default function OnboardingPage() {
  const [current, setCurrent] = useState(0);
  const [formId, setFormId] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const { data: latest, isLoading: latestLoading } = useLatestOnboarding();
  const caseInitiation = useCaseInitiation();
  const uploadImage = useUploadImage();
  const uploadDocs = useUploadCaseDocuments();

  const handleStart = async () => {
    const res = await caseInitiation.mutateAsync();
    setFormId(res.data.form_id);
    setCurrent(1);
  };

  const handleUploadImage = async () => {
    if (!formId || !file) return;
    await uploadImage.mutateAsync({ formId, file });
    setFile(null);
    setCurrent(2);
  };

  const handleSubmitDocuments = async (values: { documentPath: string; documentType: string }) => {
    if (!formId) return;
    await uploadDocs.mutateAsync({ form_id: formId, ...values });
  };

  if (latestLoading) {
    return (
      <Card style={{ maxWidth: 600, margin: '24px auto' }}>
        <Skeleton active />
      </Card>
    );
  }

  if (latest && latest.data && latest.data.form_id) {
    return (
      <Card style={{ maxWidth: 600, margin: '24px auto' }}>
        <Title level={4}>Active Onboarding Case</Title>
        <p>Form ID: {latest.data.form_id}</p>
        <p>Status: {latest.data.status}</p>
        <Button type="primary" onClick={() => setFormId(latest.data.form_id!)}>
          Continue
        </Button>
      </Card>
    );
  }

  return (
    <Card style={{ maxWidth: 600, margin: '24px auto' }}>
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
          <Dragger
            accept=".jpg,.jpeg,.png"
            beforeUpload={(f) => { setFile(f); return false; }}
            showUploadList={false}
            style={{ marginBottom: 16 }}
          >
            <p className="ant-upload-drag-icon"><InboxOutlined /></p>
            <p className="ant-upload-text">Click or drag your identity card here</p>
          </Dragger>
          {file && (
            <p style={{ marginBottom: 16 }}>Selected: {file.name}</p>
          )}
          <Button
            type="primary"
            onClick={handleUploadImage}
            disabled={!file}
            loading={uploadImage.isPending}
            block
          >
            Upload & Next
          </Button>
        </div>
      )}

      {current === 2 && (
        <div>
          <Title level={4}>Upload Case Documents</Title>
          <Form layout="vertical" onFinish={handleSubmitDocuments}>
            <Form.Item
              name="documentPath"
              label="Document Path / URL"
              rules={[{ required: true, message: 'Please enter the document path' }]}
            >
              <Input placeholder="e.g. documents/passport.pdf" />
            </Form.Item>
            <Form.Item
              name="documentType"
              label="Document Type"
              rules={[{ required: true, message: 'Please select a document type' }]}
            >
              <Select
                placeholder="Select document type"
                options={[
                  { label: 'Passport', value: 'passport' },
                  { label: 'National ID', value: 'national_id' },
                  { label: 'Driver License', value: 'drivers_license' },
                  { label: 'Proof of Address', value: 'proof_of_address' },
                  { label: 'Other', value: 'other' },
                ]}
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={uploadDocs.isPending} block>
                Submit Documents
              </Button>
            </Form.Item>
          </Form>
          <Divider />
          <Button type="default" onClick={() => setCurrent(1)}>
            Back
          </Button>
        </div>
      )}
    </Card>
  );
}
