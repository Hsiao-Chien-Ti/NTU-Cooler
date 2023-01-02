import React, { useState } from 'react';
import { FloatButton } from 'antd';
import { EditOutlined, PlusOutlined, ToolOutlined } from '@ant-design/icons';
import TeacherModal from '../components/TeacherModal';
import { useAll } from './hooks/useAll';
const TeacherButton = () => {
    const [modalOpen, setModalOpen] = useState(false)
    const { createAnnouncement, createSyllabus, createFile,createGrade,subject } = useAll()
    const handleCreate = (form) => {
        console.log(form)
        if (form.addType === 'Announcement') {
            let today = new Date();
            let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
            let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            let dateTime = date + ' ' + time;
            createAnnouncement({ variables: { time: dateTime, title: form.title, content: form.content } })
        }
        else if (form.addType === 'Syllabus') {
            createSyllabus({ variables: { weekNum: form.weekNum.toString(), outline: form.outline } })
        }
        else if (form.addType === 'File') {
            createFile({ variables: { type: form.type, info: form.info, fileName: form.fileName, fileLink: form.upload, linkType:form.linkType } })
        }
        else if(form.addType==='Grade'){
            form.upload.map((student)=>{
                createGrade({variables:{studentID:student[0],subject:subject,itemName:form.itemName,score:student[1],weight:parseFloat(form.weight)}})
            })
        }
    }
    return (
        <>
            {/* <FloatButton.Group
                trigger="hover"
                type="primary"
                style={{
                    right: '2%',
                    scale: '1.2'
                }}
                icon={<ToolOutlined />}
            >
                <FloatButton icon={<PlusOutlined />} onClick={() => { setModalOpen(true); setMode('add') }} />
                <FloatButton icon={<EditOutlined />} />
            </FloatButton.Group> */}
            <FloatButton icon={<EditOutlined />} onClick={() => { setModalOpen(true);}}                 style={{
                    right: '2%',
                    scale: '1.2'
                }}/>
            <TeacherModal
                open={modalOpen}
                onCreate={(form) => {
                    handleCreate(form)
                    setModalOpen(false);
                }}
                onCancel={() => { setModalOpen(false) }}
            />
        </>
    )
};
export default TeacherButton