import { Form, Input,Button } from "antd";
const LogIn = ({onLogin}) => {
    return (
        <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={onLogin}
        autoComplete="off"
      >
        <Form.Item
          label="StudentID"
          name="studentID"
          rules={[{ required: true, message: 'Please input your student ID!' }]}
        >
          <Input />
        </Form.Item>
  
        <Form.Item
          label="Password"
          name="passwd"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password />
        </Form.Item>
  
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Login
          </Button>
        </Form.Item>
      </Form>
    );
}
export default LogIn