import UserModel from "../models/user";
import SyllabusModel from "../models/syllabus";
const Query = {
    user: async (parent, { name,studentID,passwd,groupNum}) => {
        let user = await UserModel.findOne({ studentID:studentID });
        if (!user)
            user = await new UserModel({ name:name,studentID:studentID,passwd:passwd,groupNum:groupNum }).save();
        return user
    },
    syllabus: async (parent) => {
        let user= await SyllabusModel.find({});
        return user
    },
}
export default Query;