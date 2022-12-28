import UserModel from "../models/user";
const Query = {
    user: async (parent, { name,studentID,passwd,groupNum}) => {
        let user = await UserModel.findOne({ studentID:studentID });
        if (!user)
            user = await new UserModel({ name:name,studentID:studentID,passwd:passwd,groupNum:groupNum }).save();
        return user
    },
}
export default Query;