import styled from "styled-components";
import { Tag } from "antd";

const StyledMessage = styled.div`
  display: flex;
  align-items: center;
  flex-direction: ${({ isMe }) => (isMe ? "row-reverse" : "row")};
  margin: 8px 10px;

  & p:first-child {
    margin: 0 5px;
  }

  & p:last-child {
    padding: 2px 5px;
    border-radius: 5px;
    background: #eee;
    color: gray;
    margin: auto 0;
  }
`;
const Message = ({ isMe, message, sender, access, hidden }) => {
  return (
    <StyledMessage isMe={isMe}>
      <p style={{ color: "#9DC2F5", width: "45px" }}>{sender.name}</p>
      {access ? (
        <p>{message}</p>
      ) : hidden ? (
        <p>reply to access</p>
      ) : (
        <p>{message}</p>
      )}
    </StyledMessage>
  );
};

export default Message;
