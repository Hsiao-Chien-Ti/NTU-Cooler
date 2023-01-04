import {
  Modal,
  Form,
  Input,
  Button,
  Select,
  Checkbox,
  Switch,
  Radio,
  Row,
  Col,
  Tooltip,
} from "antd";
import CheckableTag from "antd/es/tag/CheckableTag";
import { useState } from "react";
import { useAll } from "../../containers/hooks/useAll";

const makeName = (name, to) => {
  return [name, to].sort().join("_");
};
const ChatModal = ({
  open,
  onCreate,
  onCancel,
  users,
  me,
  isTeacher,
  isQuiz,
}) => {
  const { allStudents, attendants } = useAll();
  const [form] = Form.useForm();
  const [isGroup, setIsGroup] = useState(false);
  const [groupShow, setGroupShow] = useState(false);
  const [start, setStart] = useState(false);
  //console.log("users:", users);
  const handleCreateGroup = () => {
    setIsGroup(!isGroup);
  };

  return (
    <Modal
      open={open}
      title="Create a new chat room"
      okText="Create"
      cancelText="Cancel"
      onCancel={() => {
        onCancel();
        console.log(allStudents);
        console.log();
        setIsGroup(false);
      }}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            console.log(values);
            form.resetFields();
            onCreate({
              name:
                isGroup || isQuiz
                  ? values.chatRoomName
                  : makeName(values.name, me),
              participants: isGroup ? [...values.users, me] : [values.name, me],
              quiz: isQuiz,
              groupShow,
              students: values.students,
              progress: start ? "open" : "before",
              teachers: values.teachers,
              question: values.question,
            });
            setIsGroup(false);
          })
          .catch((e) => {
            window.alert(e);
          });
      }}>
      {isGroup || isQuiz ? (
        <Form
          form={form}
          layout="horizontal"
          name="form_in_modal"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}>
          <Form.Item
            name="chatRoomName"
            label="Chat Room Name"
            rules={[
              {
                required: true,
                message: "Error: Please enter the name of the chat room!",
              },
            ]}>
            <Input />
          </Form.Item>
          <Form.Item
            name={isQuiz ? "students" : "users"}
            label="Choose Students"
            rules={[
              {
                required: true,
                message: "Error: Please enter the name of the person to chat!",
              },
            ]}>
            <Select
              mode="multiple"
              allowClear
              style={{ width: "100%" }}
              placeholder="Please select"
              //defaultValue={["a10", "c12"]}
              //onChange={handleChange}
              options={isQuiz ? allStudents : users}
            />
          </Form.Item>
          {isQuiz ? (
            <>
              <Form.Item name="teachers" label="Choose Teacher">
                <Select
                  mode="multiple"
                  allowClear
                  style={{ width: "100%" }}
                  placeholder="Please select"
                  //defaultValue={["a10", "c12"]}
                  //onChange={handleChange}
                  options={attendants.filter((p) => {
                    var found = false;
                    for (var i = 0; i < allStudents.length; i++) {
                      if (allStudents[i].value == p.value) {
                        found = true;
                        break;
                      }
                    }
                    return !found;
                  })}
                />
              </Form.Item>
              <Form.Item name="quizOptions" label="Options">
                <Checkbox.Group>
                  <Row>
                    <Col span={15}>
                      <Tooltip title="Answer in Group">
                        <Checkbox
                          value="groupShow"
                          style={{ lineHeight: "32px" }}
                          onChange={(e) => setGroupShow(e.target.checked)}>
                          Group
                        </Checkbox>
                      </Tooltip>
                    </Col>
                    <Col span={8}>
                      <Tooltip title="Directly start the quiz">
                        <Checkbox
                          value="progress"
                          style={{ lineHeight: "32px" }}
                          onChange={(e) => setStart(e.target.checked)}>
                          Start
                        </Checkbox>
                      </Tooltip>
                    </Col>
                  </Row>
                </Checkbox.Group>
              </Form.Item>
              <Form.Item
                name="question"
                label="Question"
                hidden={!start}
                rules={[
                  {
                    required: start,
                    message:
                      "Error: Please enter the question to start the quiz!",
                  },
                ]}>
                <Input />
              </Form.Item>
            </>
          ) : (
            <Button onClick={handleCreateGroup}>Single Chat</Button>
          )}
        </Form>
      ) : (
        <Form form={form} layout="vertical" name="form_in_modal">
          <Form.Item
            name="name"
            label="Name"
            rules={[
              {
                required: true,
                message: "Error: Please enter the name of the person to chat!",
              },
            ]}>
            <Select
              showSearch
              placeholder="Select a person"
              optionFilterProp="children"
              // onChange={onChange}
              // onSearch={onSearch}
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={users}
            />
          </Form.Item>
          <Button onClick={handleCreateGroup}>Create Group</Button>
        </Form>
      )}
    </Modal>
  );
};

export default ChatModal;
