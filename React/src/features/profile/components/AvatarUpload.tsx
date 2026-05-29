import { useState } from 'react';
import { Upload, message } from 'antd';
import { UploadOutlined, UserOutlined } from '@ant-design/icons';
import type { UploadChangeParam } from 'antd/es/upload';
import { useQueryClient } from '@tanstack/react-query';
import { storageUrl } from '../../../shared/api/storageUrl';
import { profileApi } from '../api/profileApi';

interface Props {
  image: string | null;
  name: string;
}

export default function AvatarUpload({ image, name }: Props) {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const handleChange = (info: UploadChangeParam) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      setLoading(false);
      message.success('Profile image uploaded');
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    }
    if (info.file.status === 'error') {
      setLoading(false);
      message.error('Failed to upload image');
    }
  };

  return (
    <Upload
      name="image"
      showUploadList={false}
      customRequest={({ file, onSuccess, onError }) => {
        profileApi
          .uploadImage(file as File)
          .then((result) => onSuccess?.(result))
          .catch((err) => onError?.(err));
      }}
      onChange={handleChange}
      accept="image/jpeg,image/png,image/jpg"
    >
      <div
        style={{
          position: 'relative',
          width: 96,
          height: 96,
          borderRadius: '50%',
          overflow: 'hidden',
          cursor: 'pointer',
          border: '2px dashed #d9d9d9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto',
        }}
      >
        {image ? (
          <img
            src={storageUrl(image) ?? ''}
            alt={name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        ) : (
          <UserOutlined style={{ fontSize: 40, color: '#1677ff' }} />
        )}
        {loading && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0,0,0,0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <UploadOutlined style={{ fontSize: 24, color: '#fff' }} />
          </div>
        )}
      </div>
    </Upload>
  );
}
