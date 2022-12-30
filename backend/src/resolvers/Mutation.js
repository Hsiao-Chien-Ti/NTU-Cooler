import UserModel from "../models/user";
import SyllabusModel from "../models/syllabus"
import FileModel from "../models/file";
const Mutation={
    createUser: async (parent, { name,studentID,passwd,groupNum}) => {
        let user = await UserModel.findOne({ studentID:studentID });
        if (!user)
            user = await new UserModel({ name:name,studentID:studentID,passwd:passwd,groupNum:groupNum,login:true }).save();
        return user
    },
    login:async(parent,{studentID,passwd})=>{
        let user = await UserModel.findOne({ studentID:studentID,passwd:passwd});
        if(!user)
        {
            user = await UserModel.findOne({ login:false });
            if(!user)
            user = await new UserModel({ login:false }).save();
        }
        return user;
    },
    createSyllabus: async (parent, {weekNum,outline},{pubsub}) => {
        let syllabus = await SyllabusModel.findOne({ weekNum:weekNum });
        if (!syllabus)
            syllabus = await new SyllabusModel({ weekNum:weekNum,outline:outline}).save();
        pubsub.publish('SYLLABUS',{
            syllabus:{
                weekNum:weekNum,
                outline:outline,
                file:syllabus.file             
            }
        })
        return syllabus
    },
    createFile: async (parent, {type,info,fileName,fileLink}) => {
        let file=await FileModel.findOne({type:type,info:info,fileName:fileName,fileLink:fileLink})
        if(!file)
        {
            file=await new FileModel({type:type,info:info,fileName:fileName,fileLink:fileLink}).save()
            if(type=="weekNum")
            {
                let syllabus = await SyllabusModel.findOne({ weekNum:info });
                let newFile={type:type,info:info,fileName:fileName,fileLink:fileLink}
                syllabus.file.push(newFile)
                await syllabus.save()
            }            
        }
        return file
    },
}
export default Mutation