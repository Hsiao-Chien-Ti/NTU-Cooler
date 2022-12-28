import { useState, useEffect } from "react";
import { createContext, useContext } from "react";
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import { LOGIN_MUTATION } from "../../graphql";
import { message } from "antd";
import { useNavigate } from 'react-router-dom';
const LOCALSTORAGE_KEY = "save-me";
const savedMe = localStorage.getItem(LOCALSTORAGE_KEY);

const AllContext = createContext({
    me: "",
    signedIn: false,
    signIn:[],
    status:{},
    displayStatus:()=>{},
    loginData:{}
});
const AllProvider = (props) => {
    const [me, setMe] = useState(savedMe || "");
    const [signedIn, setSignedIn] = useState(false);
    const [signIn,{data:loginData}] = useMutation(LOGIN_MUTATION);

    // useEffect(()=>{
    //     if(loginData!=undefined)
    //     {
    //         setSignedIn(loginData.login)
    //         if(!loginData.login)
    //         {
    //             displayStatus({
    //                 type: "error",
    //                 msg: "Invalid student ID or password",
    //                 duration:1
    //             });   
    //         }
    //         else
    //         {
    //             navigate('/homepage')
    //         }
    //     }
    // },[loginData])
    useEffect(() => {
        if (signedIn) {
            localStorage.setItem(LOCALSTORAGE_KEY, me);
        }
    }, [me, signedIn]);
    const [status, setStatus] = useState({});
    const displayStatus = (s) => {
        if (s.msg) {
            const { type, msg,duration } = s;
            const content = {
                content: msg, duration: duration
            }
            switch (type) {
                case 'success':
                    message.success(content)
                    break
                case 'error':
                default:
                    message.error(content)
                    break
            }
        }
    }
    useEffect(() => {
        displayStatus(status)
    }, [status])
    return (
        <AllContext.Provider
            value={{
                me, signedIn,setSignedIn,signIn,status,displayStatus,loginData
            }}
            {...props}
        />
    );
};
const useAll = () => useContext(AllContext);
export { AllProvider, useAll };