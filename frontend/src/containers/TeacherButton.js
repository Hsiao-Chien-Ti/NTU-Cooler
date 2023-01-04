import React, { useState } from 'react';
import { FloatButton } from 'antd';
import { EditOutlined, PlusOutlined, ToolOutlined } from '@ant-design/icons';
import TeacherModal from '../components/TeacherModal';
import { useAll } from './hooks/useAll';
import { useChat } from "./hooks/useChat";
import moment from 'moment';

const TeacherButton = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const {
    createAnnouncement,
    createSyllabus,
    createFile,
    createGrade,
    createHW,
    subject,
    allStudents,
    courseID,
    user,
  } = useAll();
  const { startChat } = useChat();

  const handleCreate = (form) => {
    console.log(form);
    if (form.addType === "Announcement") {
      let today = new Date();
      let dateTime=moment(today).format("YYYY-MM-DD HH:mm")
      createAnnouncement({
        variables: {
          time: dateTime,
          title: form.title,
          content: form.content,
        },
      });
    } else if (form.addType === "Syllabus") {
      createSyllabus({
        variables: {
          weekNum: form.weekNum.toString(),
          outline: form.outline,
        },
      });
    } else if (form.addType === "File") {
      createFile({
        variables: {
          type: form.type,
          info: form.info,
          fileName: form.fileName,
          fileLink: form.fileLink,
          linkType: form.linkType,
        },
      });
    } else if (form.addType === "Grade") {
      form.upload.map((student) => {
        createGrade({
          variables: {
            studentID: student[0],
            subject: subject,
            itemName: form.itemName,
            score: student[1],
            weight: parseFloat(form.weight),
          },
        });
      });
    } else if (form.addType === "HW") {
      createHW({
        variables: {
          title: form.title,
          deadline: moment(form.deadline).format("YYYY-MM-DD HH:mm"),
          description: form.description
        },
      });
    } else if (form.addType === "Quiz") {
      startChat({
        variables: {
          name: form.name,
          courseID,
          participants: [...form.attendants, user.studentID],
          type: true,
        },
      });
    }
  };
  return (
    <>
      <FloatButton
        icon={<EditOutlined />}
        onClick={() => {
          setModalOpen(true);
        }}
        style={{
          right: "2%",
          scale: "1.2",
        }}
      />
      <TeacherModal
        open={modalOpen}
        onCreate={(form) => {
          handleCreate(form);
          setModalOpen(false);
        }}
        onCancel={() => {
          setModalOpen(false);
        }}
        users={allStudents}
      />
    </>
  );
};
export default TeacherButton