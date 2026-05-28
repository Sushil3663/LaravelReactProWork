import {
  Button,
  Card,
  Checkbox,
  DatePicker,
  Drawer,
  Dropdown,
  Flex,
  Form,
  FormProps,
  Input,
  MenuProps,
  Modal,
  Radio,
  RadioChangeEvent,
  Select,
  Space,
  Spin,
  Table,
  Timeline,
  Upload,
} from "antd";
import {
  BarChartOutlined,
  ClockCircleOutlined,
  DotChartOutlined,
  DownOutlined,
  LineChartOutlined,
  PieChartOutlined,
  SmileOutlined,
} from "@ant-design/icons";
import { useState } from "react";

interface FieldType {
  username?: string;
  password?: string;
  remember?: string;
  gender: string;
}

const dataSource = [
  {
    key: "1",
    name: "Mike",
    age: 32,
    address: "10 Downing Street",
  },
  {
    key: "2",
    name: "John",
    age: 42,
    address: "10 Downing Street",
  },
];

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    width: 250,
    ellipsis: true,
    sorter: true,
  },
  {
    title: "Age",
    dataIndex: "age",
    key: "age",
    width: 250,
    ellipsis: true,
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address",
    width: 300,
    ellipsis: true,
  },
];

const items: MenuProps["items"] = [
  {
    key: "1",
    label: (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.antgroup.com"
      >
        1st menu item
      </a>
    ),
  },
  {
    key: "2",
    label: (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.aliyun.com"
      >
        2nd menu item (disabled)
      </a>
    ),
    icon: <SmileOutlined />,
    disabled: true,
  },
  {
    key: "3",
    label: (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.luohanacademy.com"
      >
        3rd menu item (disabled)
      </a>
    ),
    disabled: true,
  },
  {
    key: "4",
    danger: true,
    label: "a danger item",
  },
];
const Dashboard = () => {
  const [value, setValue] = useState(1);

  const onChange = (e: RadioChangeEvent) => {
    setValue(e.target.value);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    console.log("Success:", values);
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo,
  ) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Card>
      <Flex gap={50}>
        <div>
          <Button>Button</Button>
        </div>
        <div>
          <Radio.Group
            onChange={onChange}
            value={value}
            options={[
              {
                value: 1,
                label: (
                  <Flex gap="small" justify="center" align="center" vertical>
                    <LineChartOutlined style={{ fontSize: 18 }} />
                    LineChart
                  </Flex>
                ),
              },
              {
                value: 2,
                label: (
                  <Flex gap="small" justify="center" align="center" vertical>
                    <DotChartOutlined style={{ fontSize: 18 }} />
                    DotChart
                  </Flex>
                ),
              },
              {
                value: 3,
                label: (
                  <Flex gap="small" justify="center" align="center" vertical>
                    <BarChartOutlined style={{ fontSize: 18 }} />
                    BarChart
                  </Flex>
                ),
              },
              {
                value: 4,
                label: (
                  <Flex gap="small" justify="center" align="center" vertical>
                    <PieChartOutlined style={{ fontSize: 18 }} />
                    PieChart
                  </Flex>
                ),
              },
            ]}
          />
        </div>
        <div>
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            layout="vertical"
          >
            <Form.Item<FieldType>
              label="Username"
              name="username"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item<FieldType>
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item<FieldType>
              name="gender"
              label="Gender"
              rules={[{ required: true }]}
            >
              <Select
                allowClear
                placeholder="Select a option and change input text above"
                options={[
                  { label: "male", value: "male" },
                  { label: "female", value: "female" },
                  { label: "other", value: "other" },
                ]}
              />
            </Form.Item>

            <Form.Item<FieldType>
              name="remember"
              valuePropName="checked"
              label={null}
            >
              <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <Form.Item label={null}>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </div>
        <>
          <Spin />
        </>

        <>
          <Upload>
            <Button>Upload</Button>
          </Upload>
        </>
        <>
          <Checkbox>Checkbox</Checkbox>
        </>
      </Flex>
      <Flex gap={50}>
        <>
          {" "}
          <Input.Search
            placeholder="input search text"
            size="large"
            loading={false}
            style={{ width: "350px" }}
          />
        </>
        <>
          <Dropdown menu={{ items }}>
            <a onClick={(e) => e.preventDefault()}>
              <Space style={{ width: "10rem" }}>
                Hover me
                <DownOutlined />
              </Space>
            </a>
          </Dropdown>
        </>
      </Flex>
      <Flex gap={50} style={{ marginTop: "2rem", marginBottom: "2rem" }}>
        <>
          {" "}
          <>
            <Button type="primary" onClick={showDrawer}>
              Open Drawer
            </Button>
            <Drawer title="Basic Drawer" onClose={onClose} open={open}>
              <p>Some contents...</p>
              <p>Some contents...</p>
              <p>Some contents...</p>
            </Drawer>
          </>
        </>
        <Button type="primary" onClick={showModal}>
          Open Modal
        </Button>
        <Modal
          title="Basic Modal"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          centered
          maskClosable={false}
        >
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
        </Modal>
      </Flex>
      <Table dataSource={dataSource} columns={columns} />
      <DatePicker />
      <Timeline
        mode="left"
        items={[
          {
            label: "2015-09-01",
            children: "Create a services site",
            dot: <ClockCircleOutlined style={{ fontSize: "16px" }} />,
            color: "green",
          },
          {
            label: "2015-09-01",
            children: "Solve initial network problems",
            color: "blue",
          },
          {
            label: "2015-09-01",
            children: "Debuging",
            dot: <ClockCircleOutlined style={{ fontSize: "16px" }} />,
            color: "blue",
          },
          {
            label: "2015-09-01",
            children: "Initiate",
            color: "blue",
          },
        ]}
      />
    </Card>
  );
};

export default Dashboard;
