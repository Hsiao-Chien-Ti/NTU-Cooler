import { useState, useEffect } from "react";
import { createContext, useContext } from "react";
import { useQuery, useMutation } from '@apollo/react-hooks';
import { LOGIN_MUTATION,SYLLABUS_QUERY,SYLLABUS_SUBSCRIPTION } from "../../graphql";
import { message } from "antd";
import { useNavigate } from 'react-router-dom';
const LOCALSTORAGE_KEY = "save-me";
const savedMe = localStorage.getItem(LOCALSTORAGE_KEY);

const AllContext = createContext({
    user: {login:false},
    signIn:[],
    status:{},
    displayStatus:()=>{},
    loginData:{},
    syllabusData:[],
    syllabusLoading:false
});
const AllProvider = (props) => {
    const [user, setUser] = useState(savedMe || {login:false});
    const [signIn,{data:loginData}] = useMutation(LOGIN_MUTATION);
    useEffect(() => {
        if (user.login) {
            localStorage.setItem(LOCALSTORAGE_KEY, user);
        }
    }, [user]);
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
    const { data:syllabusData,loading: syllabusLoading} = useQuery(SYLLABUS_QUERY);
    // useEffect(() => {
    //     try {
    //       subscribeToMore({
    //         document: SYLLABUS_SUBSCRIPTION,
    //         updateQuery: (prev, { subscriptionData }) => {
    //           if (!subscriptionData.data) return prev;
    //           const newSyllabus = subscriptionData.data.syllabus
    //           console.log(newSyllabus)
    //           return {
    //             ...prev,
    //             posts: [newSyllabus, ...prev.syllabus],
    //           };
    //         },
    //       });
    //     } catch (e) {}
    //   }, [subscribeToMore]);
    return (
        <AllContext.Provider
            value={{
                user, setUser,signIn,status,displayStatus,loginData,syllabusData,syllabusLoading
            }}
            {...props}
        />
    );
};
const useAll = () => useContext(AllContext);
export { AllProvider, useAll };