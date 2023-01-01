import { SoundOutlined } from "@ant-design/icons";

const ChatboxHeader = ({ isPin, msg, groupName, color }) => {
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
        {isPin ? <SoundOutlined /> : ""}
        {"  "}
        {msg}
      </div>
    </div>
  );
};

export default ChatboxHeader;
