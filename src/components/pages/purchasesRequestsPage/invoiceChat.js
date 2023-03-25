import { Avatar, message, Tooltip } from "antd";
import { useEffect, useRef, useState } from "react";
import { resources } from "../../../resource";
import { shopImgUrl } from "../../../api/baseUrl";
import { addNewMsgToChat, getInvoiceShopChat } from "../../../api/invoiceChats";
import back_direction from "../../../images/back_direction.png";
import { ManagerAccountInfo } from "../../../store/managerAccountInfo";
import { SendOutlined } from "@ant-design/icons";
import ErrorInFetch from "../../layout/errorInFetch";
import { SocketObject } from "../../../store/socketObject";

function InvoiceChat(props) {
  const [invoiceChat, setInvoiceChat] = useState([]);
  const [loadInvoiceChat, setLoadInvoiceChat] = useState(true);
  const { accountInfo } = ManagerAccountInfo();
  const { socketObj } = SocketObject();
  let inputMsgBodyRef = useRef();

  useEffect(() => {
    let output = getInvoiceShopChat(props.invoiceShopId);
    output.then(async (result) => {
      if (result === resources.FAILED_TO_FETCH) {
        ErrorInFetch(() => setLoadInvoiceChat(!loadInvoiceChat));
      } else {
        await setInvoiceChat(result);
        await setLoadInvoiceChat(false);
        let elem = document.getElementById("messages");
        elem.scrollTop = elem.scrollHeight;
      }
    });
  }, [loadInvoiceChat, props.invoiceShopId]);

  useEffect(() => {
    socketObj.on(resources.CHAT.SOCKET_MESSAGE.RECEIVE_MESSAGE_BY_MANAGER, (data) => {
      if (data.invoiceShopId === props.invoiceShopId) setLoadInvoiceChat(true);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onSendMsgClickHandler() {
    if (inputMsgBodyRef.current.value.trim() !== "") {
      let myReqBody = {
        invoiceShopId: props.invoiceShopId,
        msgBody: inputMsgBodyRef.current.value,
        sender: resources.CHAT.MANAGER_SENDER,
        senderId: accountInfo.managerId,
      };

      let output = addNewMsgToChat(JSON.stringify(myReqBody));
      output.then((result) => {
        if (result === resources.FAILED_TO_FETCH) {
          ErrorInFetch(() => onSendMsgClickHandler());
        } else {
          if (result.err === undefined) {
            inputMsgBodyRef.current.value = "";
            setInvoiceChat(result);
            let elem = document.getElementById("messages");
            elem.scrollTop = elem.scrollHeight;

            if (socketObj.connected) {
              socketObj.emit(resources.CHAT.SOCKET_MESSAGE.SEND_MESSAGE, JSON.stringify(myReqBody));
            } else {
              socketObj.on(resources.CHAT.SOCKET_MESSAGE.CONNECT, () => {
                socketObj.emit(resources.CHAT.SOCKET_MESSAGE.SEND_MESSAGE, JSON.stringify(myReqBody));
              });
            }
          } else {
            message.error("فشل في ارسال الرسالة");
          }
        }
      });
    } else {
      message.warning("لا يمكن ارسال رسالة فارغة");
    }
  }

  return (
    <div
      className="absolute inset-0 w-full h-full z-10"
      style={{ backgroundColor: "rgba(100, 116, 139, 0.85)" }}
    >
      <div
        className="m-auto h-5/6 w-8/12 bg-slate-800 mt-8"
        // style={{ overflowY: "scroll" }}
      >
        <div
          className="flex-1 p:2 sm:p-1 justify-between flex flex-col"
          style={{ height: "98%" }}
        >
          <div className="flex sm:items-center justify-between border-b-2 border-gray-200">
            <div className="flex items-center space-x-4">
              {/* <img
                src="https://images.unsplash.com/photo-1549078642-b2ba4bda0cdb?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=3&amp;w=144&amp;h=144"
                alt=""
                className="w-10 sm:w-16 h-10 sm:h-16 rounded-full"
              /> */}
              <div className="flex flex-col leading-tight">
                <div className="text-2xl mt-1 flex items-center">
                  <span className="text-gray-700 mr-3">
                    {props.customerName}
                  </span>
                  {/* <span className="text-green-500"> 
                   <svg width="10" height="10">
                      <circle cx="5" cy="5" r="5" fill="currentColor"></circle>
                    </svg> 
                   </span> */}
                </div>
                {/* <span className="text-lg text-gray-600">Junior Developer</span> */}
              </div>
            </div>

            <div className="flex justify-end mb-2 p-4  pb-3">
              <Tooltip placement="right" title={"رجوع"}>
                <img
                  src={back_direction}
                  alt="back_direction"
                  style={{ width: "35px", cursor: "pointer" }}
                  className="bg-slate-400 hover:bg-slate-100 p-0.5 rounded-sm pl-2 pr-2"
                  onClick={() => {
                    props.OnOpenInvoiceChatClickHandler();
                  }}
                ></img>
              </Tooltip>
            </div>
          </div>
          <div
            id="messages"
            className="flex flex-col space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
          >
            {invoiceChat.map((element) => (
              <div className="chat-message" key={element.id}>
                <div
                  className={`flex items-end 
                    ${
                      element.sender === resources.CHAT.CUSTOMER_SENDER &&
                      "justify-end"
                    }
                  `}
                >
                  <div
                    className={`flex flex-col space-y-2 text-xs max-w-xs mx-2 ${
                      element.sender === resources.CHAT.CUSTOMER_SENDER
                        ? "order-1 items-end"
                        : "order-2 items-start"
                    }`}
                  >
                    <div>
                      <span
                        className={`px-4 py-2 rounded-lg inline-block ${
                          element.sender === resources.CHAT.CUSTOMER_SENDER
                            ? "rounded-bl-none bg-gray-300 text-gray-600"
                            : "rounded-br-none bg-blue-600 text-white"
                        }`}
                      >
                        {element.msgBody}
                      </span>
                    </div>
                  </div>
                  <Avatar
                    className={`w-6 h-6 rounded-full leading-6  ${
                      element.sender === resources.CHAT.CUSTOMER_SENDER
                        ? "order-2"
                        : "order-1"
                    }`}
                    style={{ backgroundColor: "blue", verticalAlign: "middle" }}
                    size="large"
                    gap={2}
                    src={
                      element.sender === resources.CHAT.MANAGER_SENDER
                        ? accountInfo.shopLogo !== null &&
                          `${shopImgUrl}${accountInfo.shopLogo}`
                        : null
                    }
                  >
                    {element.sender === resources.CHAT.MANAGER_SENDER
                      ? accountInfo.shopLogo === null && accountInfo.shopName
                      : props.customerName}
                  </Avatar>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t-2 border-gray-200 px-4 pt-4 mb-2 sm:mb-0">
            {props.readOnlyComponent !== true && (
              <div className="relative flex">
                <input
                  ref={inputMsgBodyRef}
                  // onChange={(e) => (inputMsgBodyRef.current.value = e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && onSendMsgClickHandler()
                  }
                  type="text"
                  placeholder="اكتب هنـــا"
                  className="w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-12 bg-gray-200 rounded-full py-3 pr-14"
                />
                <div className="absolute right-0 items-center inset-y-0 hidden sm:flex">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-full h-12 w-12 transition duration-500 ease-in-out text-white bg-blue-500 hover:bg-blue-400 focus:outline-none"
                    onClick={onSendMsgClickHandler}
                  >
                    <SendOutlined
                      style={{ fontSize: "23px", paddingLeft: "3px" }}
                    />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default InvoiceChat;
