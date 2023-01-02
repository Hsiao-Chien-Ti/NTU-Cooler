import UserModel from "../models/user";
import SyllabusModel from "../models/syllabus"
import FileModel from "../models/file";
import AnnouncementModel from "../models/announcement";
import GradeModel from "../models/grade"
const Mutation = {
    createUser: async (parent, { name, studentID, passwd, groupNum, isTeacher }) => {
        let user = await UserModel.findOne({ studentID: studentID });
        if (!user)
            user = await new UserModel({ name: name, studentID: studentID, passwd: passwd, groupNum: groupNum, login: true, isTeacher: isTeacher }).save();
        return user
    },
    login: async (parent, { studentID, passwd }) => {
        let user = await UserModel.findOne({ studentID: studentID, passwd: passwd });
        if (!user) {
            user = await UserModel.findOne({ login: false });
            if (!user)
                user = await new UserModel({ login: false }).save();
        }
        return user;
    },
    createSyllabus: async (parent, { weekNum, outline }, { pubsub }) => {
        let syllabus = await SyllabusModel.findOne({ weekNum: weekNum });
        if (syllabus)
        {
            syllabus = await SyllabusModel.updateOne({ weekNum: weekNum }, { $set: { outline: outline } });            
            syllabus = await SyllabusModel.findOne({ weekNum: weekNum });
        }
        else
            syllabus = await new SyllabusModel({ weekNum: weekNum, outline: outline, file: [] }).save();
        pubsub.publish('SYLLABUS', {
            syllabus: {
                weekNum: syllabus.weekNum,
                outline: syllabus.outline,
                file: syllabus.file
            }
        })
        return syllabus
    },
    createFile: async (parent, { type, info, fileName, fileLink }, { pubsub }) => {
        // console.log(type)
        let file = await FileModel.findOne({ type: type, info: info, fileName: fileName })
        if (file) {
            await FileModel.updateOne({ type: type, info: info, fileName: fileName }, { $set: { fileLink: fileLink } })
            file = await FileModel.findOne({ type: type, info: info, fileName: fileName })
        }
        else {
            file = await new FileModel({ type: type, info: info, fileName: fileName, fileLink: fileLink }).save()
        }
        // console.log(file)
        if (type == "weekNum") {
            let syllabus = await SyllabusModel.findOne({ weekNum: info });
            if (!syllabus)
                syllabus = await new SyllabusModel({ weekNum: info, outline: "", file: [] }).save();

            let newFile = { type: type, info: info, fileName: fileName, fileLink: fileLink }
            syllabus.file = syllabus.file.filter((f) => f.fileName !== fileName)
            console.log(syllabus.file)
            syllabus.file.push(newFile)
            await syllabus.save()
            pubsub.publish('SYLLABUS', {
                syllabus: {
                    weekNum: syllabus.weekNum,
                    outline: syllabus.outline,
                    file: syllabus.file
                }
            })
        }

        pubsub.publish('FILE', {
            file: {
                type: type,
                info: info,
                fileName: fileName,
                fileLink: fileLink
            }
        })
        return file
    },
    createAnnouncement: async (parent, { time, title, content }, { pubsub }) => {
        let announcement = await AnnouncementModel.findOne({ title: title});
        console.log(announcement)
        if(announcement)
        {
            await AnnouncementModel.updateOne({title: title},{$set:{ time: time, content: content }});
            announcement = await AnnouncementModel.findOne({ title: title});        
        }
        else
            announcement = await new AnnouncementModel({ time: time, title: title, content: content }).save();
        pubsub.publish('ANNOUNCEMENT', {
            announcement: {
                time: time,
                title: title,
                content: content
            }
        })
        return announcement
    },
    createGrade: async (parent, { studentID, subject, itemName, score, weight }, { pubsub }) => {
        let grade = await GradeModel.findOne({ studentID: studentID, subject: subject, itemName: itemName });
        if(grade)
        {
            await GradeModel.updateOne({ studentID: studentID, subject: subject, itemName: itemName },{$set:{score: score, weight: weight}});
            grade = await GradeModel.findOne({ studentID: studentID, subject: subject, itemName: itemName });            
        }
        else
            grade = await new GradeModel({ studentID: studentID, subject: subject, itemName: itemName, score: score, weight: weight }).save();
        pubsub.publish(`GRADE ${studentID+subject}`, {
            grade: {
                studentID: studentID,
                subject: subject,
                itemName: itemName,
                score: score,
                weight: weight
            }
        })
        return grade
    },
}
export default Mutation