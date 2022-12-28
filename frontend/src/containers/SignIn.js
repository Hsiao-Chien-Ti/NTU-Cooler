import Title from "../components/Title";
import LogIn from "../components/Login";
import {useAll} from "./hooks/useAll";
const SignIn = () => {
    const { me, setMe, setSignedIn, displayStatus, signIn } = useAll();
    const handleLogin = async(s) => {
        console.log(s)
        const{studentID,passwd}=s
        if (!studentID)
        {
            displayStatus({
                type: "error",
                msg: "Missing student ID",
            });
        }
        else if(!passwd)
        {
            displayStatus({
                type: "error",
                msg: "Missing passwd",
            });
        }
        else
        {
            await signIn({ variables: { studentID:studentID,passwd:passwd } })
        }
    }
    return (
        <>
            <Title />
            <LogIn onLogin={handleLogin} />
        </>
    );
}
export default SignIn