import { SoundOutlined } from "@ant-design/icons";
import { Button } from "antd";

const ChatboxHeader = ({ isPin, msg, groupName, color, handlePinOnClick }) => {
  return (
    <div
      style={{
        padding: 20,
        background: color,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        height: "8em",
      }}>
      <h2>{groupName}</h2>
      <div style={{ flexDirection: "row", alignItems: "flex-end" }}>
        {isPin ? (
          <Button
            onClick={handlePinOnClick}
            style={{
              background: "#ffe38e",
              color: "#423c4a",
              fontWeight: "bold",
              border: 0,
            }}>
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
