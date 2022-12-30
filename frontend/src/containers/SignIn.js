import Title from "../components/Title";
import LogIn from "../components/Login";
import {useAll} from "./hooks/useAll";
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useEffect } from "react";
const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    width: 500px;
    margin: auto;`
const SignIn = () => {
    const { user,setUser, displayStatus, signIn,loginData } = useAll();
    const navigate = useNavigate();
    const handleLogin = async(s) => {
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
    useEffect(()=>{
        if(loginData!=undefined)
        {
            setUser(loginData.login)
            if(!loginData.login.login)
            {
                displayStatus({
                    type: "error",
                    msg: "Invalid student ID or password",
                    duration:1
                });   
            }
            else
            {
                navigate('/homepage')
            }
        }
    },[loginData])
    return (
        <Wrapper>
            <Title />
            <LogIn onLogin={handleLogin} />
        </Wrapper>
    );
}
export default SignIn