import UserModel from "../models/user";
const Mutation={
    createUser: async (parent, { name,studentID,passwd,groupNum}) => {
        let user = await UserModel.findOne({ studentID:studentID });
        if (!user)
            user = await new UserModel({ name:name,studentID:studentID,passwd:passwd,groupNum:groupNum }).save();
        return user
    },
    login:async(parent,{studentID,passwd})=>{
        let user = await UserModel.findOne({ studentID:studentID,passwd:passwd});
        if(!user)
            return false;
        else
            return true;
    }
}
export default Mutation