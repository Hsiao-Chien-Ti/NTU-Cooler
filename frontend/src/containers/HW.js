import { Layout, theme } from "antd";
import React, { useEffect } from "react";
import { useState } from "react";
import { useAll } from "./hooks/useAll";
import HWContent from "../components/HWContent";

const { Header, Sider, Content } = Layout;
const HW = () => {
  const { hwLoading,hwData, user,createFile } = useAll();
  const handleSubmit=(title,s)=>{
    console.log(s)
    s.map((ss,i)=>{
        createFile({ variables: { type: "sHW", info: title, fileName: title+"_"+user.studentID+"_"+i.toString(), fileLink: ss, linkType:true,studentID:user.studentID, firstFlag:i===0 } })            
    }

    )

  }
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Content
      style={{
        margin: "24px 16px",
        padding: 24,
        minHeight: 280,
        background: colorBgContainer,
      }}
    >
      {!hwLoading ? (
        hwData!==undefined&&<HWContent
          rawdata={hwData.hw}
          handleSubmit={handleSubmit}
        ></HWContent>
      ) : (
        <p>loading</p>
      )}
    </Content>
  );
};
export default HW;
