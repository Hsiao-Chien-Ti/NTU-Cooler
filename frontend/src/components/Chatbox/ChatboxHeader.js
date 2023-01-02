import { SoundOutlined } from "@ant-design/icons";
import { Button } from "antd";

const ChatboxHeader = ({ isPin, msg, groupName, color, handlePinOnClick }) => {
  return (
    <div
      style={{
        padding: 20,
        background: color,
        flexDirection: "row",
        alignContent: "space-between",
      }}
    >
      <div>{groupName}</div>
      <div style={{ flexDirection: "row", alignItems: "flex-end" }}>
        {isPin ? (
          <Button onClick={handlePinOnClick}>
            <SoundOutlined /> {msg}
          </Button>
        ) : (
          <>{msg}</>
        )}
      </div>
    </div>
  );
};

export default ChatboxHeader;
