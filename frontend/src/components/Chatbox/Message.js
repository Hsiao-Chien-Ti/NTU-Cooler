import styled from "styled-components";
import { Tag, message, Dropdown } from "antd";

const StyledMessage = styled.div`
  display: flex;
  align-items: center;
  flex-direction: ${({ isMe }) => (isMe ? "row-reverse" : "row")};
  margin: 15px 10px;
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

// {
//   label: "4rd menu item",
//   key: "4",
//   danger: true,
//   disabled: true,
// },

const Message = ({
  isMe,
  message,
  sender,
  access,
  hidden,
  handleOnClickMessage,
  isPin,
}) => {
  const items = [
    {
      label: isPin ? "unpin message" : "pin message",
      key: "1",
    },
    {
      label: "retrieve message",
      key: "2",
      disabled: true,
    },
    {
      label: "reply",
      key: "3",
      disabled: true,
      // danger: true,
    },
  ];
  return (<>
  <StyledMessage isMe={isMe} style={{ marginTop: "2em" }}>
    {sender.groupNum > 0 ? (
    <Tag
    color = "#0A2647"
      style={{
        alignSelf: isMe ? "flex-end" : "flex-start",
        border: 0,
      }}>
      GROUP {sender.groupNum}
    </Tag>
  ) : (
    <></>
  )}
</StyledMessage><Dropdown
      menu={{
        items,
        onClick: handleOnClickMessage,
      }}
      trigger={["contextMenu"]}>        

        <StyledMessage isMe={isMe}>
          {isMe ? (
            ""
          ) : (
            <div
              style={{
                color: "#9DC2F5",
                width: "45px",
                alignContent: "center",
              }}>
              {sender.name}
            </div>
          )}
          {access ? (
            <p>{message}</p>
          ) : hidden ? (
            <p>reply to access</p>
          ) : (
            <p>{message}</p>
          )}
        </StyledMessage>
    </Dropdown></>
    
  );
};
export default Message;