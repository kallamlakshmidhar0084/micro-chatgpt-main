import "./styles/chat.css";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import botResponseIcon from "./utils/images/bot-response-icon.png";
import chatgpt from "./utils/images/chat-gpt.png";
import { DotLoading } from "antd-mobile";
import TimeAgo from "javascript-time-ago";

import en from "javascript-time-ago/locale/en.json";
import ru from "javascript-time-ago/locale/ru.json";

TimeAgo.addDefaultLocale(en);
TimeAgo.addLocale(ru);
import ReactTimeAgo from "react-time-ago";
import {
  SearchOutlined,
  PlusSquareFilled,
  CheckCircleFilled,
  AudioOutlined,
  CloudUploadOutlined,
  SendOutlined,
} from "@ant-design/icons";
import {
  Button,
  Input,
  Space,
  Select,
  Form,
  ConfigProvider,
  Upload,
  Modal,
} from "antd";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { data } from "./utils/data/roleData.js";
import { fb } from "@react/auth";
import { onAuthStateChanged } from "firebase/auth";

import { Card, Col, Row } from "antd";

export default function Root(props) {
  const [totalChats, SettotalChats] = useState(0);
  const [chatting, SetChatting] = useState(false);
  const [role, setRole] = useState("GENERAL_AI");
  const [history, setHistory] = useState([]);
  const [inputVal, setIntputVal] = useState();
  const [response, setResponse] = useState("");
  const [renderedResponse, setRenderedResponse] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const chatContainerRef = useRef(null);
  const [chatId, setChatId] = useState(null);
  const [inputMsg, setInputMsg] = useState();
  const [searchTerm, setSearchTerm] = useState("");
  const [handleStopGeneration, setHandleStopGeneration] = useState(true);
  const [handleRegeneration, sethandleRegeneration] = useState(true);
  const [makeSgTrue, setMakeSgTrue] = useState(true);
  let token = useRef("");
  let uidFromFirebase = useRef("");
  let stop = useRef(true);
  let latestTime = useRef("");
  let sg = useRef(false);

  //restrict user
  useEffect(() => {
    newTitle();
    let l = 0;
    var p1, p2;
    let p = new Promise((resolve, reject) => {
      p1 = resolve;
      p2 = reject;
    });

    onAuthStateChanged(fb, async (user) => {
      console.log("🚀 ~ file: chat.js:62 ~ onAuthStateChanged ~ user:", user);
      if (!user) {
        navigate("/login");
      } else {
        token.current = user.accessToken;
        uidFromFirebase.current = user.uid;
        l++;
        p1();
      }
    });
    p.then(() => {
      getChatHistoryNames(
        `http://localhost:6060/v1/api/chats?uid=2o8t8dPjssUJoueITPX0APrIHGw1`
      );
    });
  }, []);

  //Modal
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // // POST
  const postApi = async (url) => {
    try {
      const res = await axios.post(
        url,
        {
          role: role,
          message: inputVal ? inputVal : inputMsg,
          file: undefined,
        },
        {
          headers: {
            Authorization: `Bearer ${token.current}`,
          },
        }
      );
      console.log(res);
      return new Promise((resolve, reject) => {
        if (res.data.images) {
          resolve(res.data.images);
        }
        resolve(res.data.text);
      });
    } catch (error) {
      console.log(error);
    }
  };
  const chatNameApi = async (url, userMessage, BotMessage) => {
    try {
      const res = await axios.post(
        url,
        {
          role: role,
          user: userMessage,
          message: BotMessage,
        },
        {
          headers: {
            Authorization: `Bearer ${token.current}`,
          },
        }
      );
      console.log(res);
      return new Promise((resolve, reject) => {
        resolve(res.data.title);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getChatHistoryApi = async (url) => {
    try {
      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token.current}`,
        },
      });
      let chatFromHistory = [];
      console.log(res.data);
      res.data.map((e) => {
        if (e.sent) {
          chatFromHistory.push({
            message: e.text,
            classname: "message__color",
          });
        } else {
          chatFromHistory.push({
            message: e.text ? e.text : e.images,
            classname: "response__color",
          });
        }
      });
      chatFromHistory.push({
        message: "",
        classname: "response__color",
      });
      setChatMessages(chatFromHistory);
    } catch (error) {
      console.log(error);
    }
  };

  const postMessageApi = async (
    url,
    receivedMsg,
    receivedImg,
    sentByUser,
    chatInputId,
    chatName
  ) => {
    try {
      const res = await axios.post(
        url,
        {
          text: receivedMsg,
          images:receivedImg,
          sent: sentByUser,
          role: role,
          chatId: chatInputId ? chatInputId : undefined,
          chatName: chatName,
          userUid: chatInputId ? undefined : "2o8t8dPjssUJoueITPX0APrIHGw1", //initially uid compulsory  later chat id
          // userUid: uidFromFirebase.current, //initially uid compulsory  later chat id
          // userUid: undefined,
        },
        {
          headers: {
            Authorization: `Bearer ${token.current}`,
          },
        }
      );
      console.log(res);
      latestTime.current = res.data.timeStmap;
      setChatId(res.data.chat.id);
      return new Promise((resolve, reject) => {
        resolve(res.data.chat.id);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getChatHistoryNames = async (url) => {
    console.log(token.current);
    try {
      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token.current}`,
        },
      });
      let chatHistory = [];
      res.data.map((e) => {
        chatHistory.push({
          des: e.name,
          chatId: e.id,
          time: e.timeStamp,
        });
      });
      console.log(chatHistory);
      setHistory(chatHistory.reverse());
      SettotalChats(chatHistory.length);
    } catch (error) {}
  };

  //scrolling up
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };
  //getting all chat names

  //automatic scroll
  useEffect(() => {
    scrollToBottom();
  }, [renderedResponse]);

  useEffect(() => {
    sg.current = true;
  }, [makeSgTrue]);

  useEffect(() => {
    stop.current = !stop.current;
    sg.current = false;
  }, [handleStopGeneration]);

  const handleUserInput = async () => {
    setRenderedResponse("");
    let inputmsg = inputVal;
    setInputMsg(inputmsg);
    setIntputVal("");

    sg.current = false;
    console.log("before input sg:", sg.current);

    setChatMessages([
      ...chatMessages,
      {
        message: inputmsg,
        classname: "message__color",
      },
      {
        message: "Loading",
        classname: "response__color",
      },
      {
        message: "",
        classname: "response__color",
      },
    ]);
    let temp = await postApi(`http://localhost:4000/chat`);
    let chatName;
    if (chatMessages.length === 0) {
      chatName = await chatNameApi(
        `http://localhost:4000/chat_name`,
        inputmsg,
        temp
      );
    }
    let chatInputId = await postMessageApi(
      "http://localhost:6060/v1/api/messages/message",
      inputmsg,

      null,
      true,
      chatId,
      chatName
    );
    if (chatMessages.length === 0) {
      setHistory([
        {
          chatId: chatId ? chatId : chatInputId,
          des: chatName,
          time: new Date(),
          className: "",
        },
        ...history,
      ]);
      SettotalChats(totalChats + 1);
    }
    postMessageApi(
      "http://localhost:6060/v1/api/messages/message",
      typeof temp == "string" ? temp.replaceAll("\n", "<br>") : null,
      typeof temp!="string" ? temp : null ,
      false,
      chatInputId,
      chatName
    );

    setResponse(temp);

    setChatMessages([
      ...chatMessages,
      {
        message: inputmsg,
        classname: "message__color",
      },
      {
        message: typeof temp != "string" ? temp : temp.replaceAll("\n", "<br>"),
        classname: "response__color",
      },
    ]);

    let currentCharacterIndex = 0;

    const responseLength = temp.length;
    if (typeof temp == "string") {
      const renderNextCharacter = async () => {
        if (currentCharacterIndex < responseLength) {
          setRenderedResponse((prevRenderedResponse) => {
            const currentChar = temp[currentCharacterIndex];
            console.log("inside handle input stop:", stop.current);
            if (stop.current) {
              currentCharacterIndex = responseLength;
              return prevRenderedResponse;
            }
            if (currentChar === "\n") {
              return prevRenderedResponse + "<br>";
            }
            return prevRenderedResponse + temp[currentCharacterIndex];
          });

          currentCharacterIndex++;
          setTimeout(renderNextCharacter, 15); // Delay between characters (adjust as needed)
        } else {
          sg.current = true;
          console.log("after input sg :", sg.current);
          setMakeSgTrue(!makeSgTrue);
          stop.current = false;
        }
      };
      renderNextCharacter();
    } else {
      console.log("before setRenderedResponse ", temp);
      setRenderedResponse(temp);
      sg.current = true;
      console.log("after input sg :", sg.current);
      setMakeSgTrue(!makeSgTrue);
      stop.current = false;
    }
  };

  const regenerateResponse = async () => {
    sg.current = false;
    console.log("before regenerate input sg:", sg.current);
    setRenderedResponse("");
    let inputmsg = inputMsg;

    setChatMessages([
      ...chatMessages,
      {
        message: inputmsg,
        classname: "message__color",
      },
      {
        message: "Loading",
        classname: "response__color",
      },
      {
        message: "",
        classname: "response__color",
      },
    ]);
    let chatInputId = await postMessageApi(
      "http://localhost:6060/v1/api/messages/message",
      inputMsg,
      true,
      chatId
    );
    let temp = await postApi(`http://localhost:4000/chat`);
    let chatName;
    if (chatMessages.length === 0) {
      chatName = await chatNameApi(
        `http://localhost:4000/chat_name`,
        inputMsg,
        temp
      );
    }
    if (chatMessages.length === 0) {
      setHistory([
        ...history,
        {
          chatId: chatId ? chatId : chatInputId,
          des: chatName,
          className: "",
        },
      ]);
      SettotalChats(totalChats + 1);
    }

       let img = temp != "string" ? temp : null;
       postMessageApi(
         "http://localhost:6060/v1/api/messages/message",
         img ? null : temp.replaceAll("\n", "<br>"),
         img,
         false,
         chatInputId,
         chatName
       );

    setResponse(temp);

    setChatMessages([
      ...chatMessages,
      {
        message: inputMsg,
        classname: "message__color",
      },
      {
        message: typeof temp != "string" ? temp : temp.replaceAll("\n", "<br>"),
        classname: "response__color",
      },
    ]);

    let currentCharacterIndex = 0;

    const responseLength = temp.length;
    if (typeof temp == "string") {
      const renderNextCharacter = async () => {
        if (currentCharacterIndex < responseLength) {
          setRenderedResponse((prevRenderedResponse) => {
            const currentChar = temp[currentCharacterIndex];
            console.log("stop inside regenerate:", stop.current);
            if (stop.current) {
              currentCharacterIndex = responseLength;
              return prevRenderedResponse;
            }
            if (currentChar === "\n") {
              return prevRenderedResponse + "<br>";
            }
            return prevRenderedResponse + temp[currentCharacterIndex];
          });

          currentCharacterIndex++;
          setTimeout(renderNextCharacter, 15); // Delay between characters (adjust as needed)
        } else {
          sg.current = true;
          console.log("after regenerate input sg :", sg.current);
          setMakeSgTrue(!makeSgTrue);
          stop.current = false;
        }
      };

      renderNextCharacter();
    } else {
      console.log("before setRenderedResponse ", temp);
      setRenderedResponse(temp);
      sg.current = true;
      console.log("after input sg :", sg.current);
      setMakeSgTrue(!makeSgTrue);
      stop.current = false;
    }
  };

  //highlighting selected chat
  useEffect(() => {
    history.map((e) => {
      if (e.id == chatId) {
        e.className = "activeChat";
      }
    });
  }, [chatId]);

  let character = {};
  switch (role) {
    case "INTERVIEWER":
      character = data.interviewer;
      break;
    case "POET":
      character = data.poet;
      break;
    case "CAREER_COUNSELOR":
      character = data.counselor;
      break;
    case "ENGLISH_TRANSLATOR":
      character = data.englishTranslator;
      break;
    case "STAND_UP_COMEDIAN":
      character = data.standUpComedian;
      break;
    case "GENERAL_AI":
      character = data.generalAI;
  }
  function handleChatHistory(historyChatId) {
    setChatId(historyChatId);
    SetChatting(true);
    setChatMessages([]);
    getChatHistoryApi(
      `http://localhost:6060/v1/api/chats/chat?id=${historyChatId}`
    );
    setRenderedResponse();
  }
  //chat item
  function ChatListItem({
    description,
    timestamp,
    historyChatId,
    chatClassName,
  }) {
    return (
      <>
        <div
          className={chatClassName}
          onClick={() => {
            handleChatHistory(historyChatId);
          }}
        >
          <div>
            <p>{description}</p>
            <span>
              <ReactTimeAgo
                date={timestamp}
                locale="en-US"
                timeStyle="twitter"
              />
            </span>
          </div>
        </div>
      </>
    );
  }

  function MessageDisplay({ message, classname }) {
    return (
      <div className={classname}>
        <div className="chat__messages--content">
          <div className="chat__messages--icon">
            {classname == "message__color" ? (
              <FontAwesomeIcon
                icon={faUser}
                className="chat__icon message__icon"
                style={{ width: "2rem", height: "1.2rem" }}
              />
            ) : (
              <img
                className="chat__icon"
                src={botResponseIcon}
                alt="bot icon"
                style={{ width: "2rem" }}
              />
            )}
          </div>

          <div
            className="chat__messages--message"
            dangerouslySetInnerHTML={{ __html: message }}
          />
        </div>
      </div>
    );
  }
  function LoadingDisplay({ message, classname }) {
    return (
      <div className={classname}>
        <div className="chat__messages--content">
          <div className="chat__messages--icon">
            <img
              className="chat__icon"
              src={botResponseIcon}
              alt="bot icon"
              style={{ width: "2rem" }}
            />
          </div>
          <div className="chat__messages--message">
            <DotLoading color="#ffb800" />
          </div>
        </div>
      </div>
    );
  }
  function ImageDisplay({ images }) {
    return (
      <>
        <div className="chat__messages--content">
          <div className="chat__messages--icon">
            <img
              className="chat__icon"
              src={botResponseIcon}
              alt="bot icon"
              style={{ width: "2rem" }}
            />
          </div>

          {/* <div className="chat__messages--message">
            <img style={{ width: "20rem" }} src={images} alt="new" />
          </div> */}
        </div>
      </>
    );
  }

  //change page title

  function newTitle() {
    document.title = "ChatGrid | Chat";
  }

  //defaulting general ai
  useEffect(() => {
    newTitle();
    let dropdown = document.getElementById("roleId");
  }, []);

  //search chat
  function chatSearch() {}

  const handleInput = (e) => {
    SetChatting(true);
  };

  return (
    <>
      <div className="chatInterface">
        <div className="history">
          <div className="history__top">
            <div className="history__top--title">
              <p>
                Chat<span>({totalChats})</span>
              </p>
            </div>
            <div className="history__top--add">
              <PlusSquareFilled
                onClick={() => {
                  SetChatting(false);
                  setChatMessages([]);
                  setChatId(null);
                  sg.current = true;
                  // setRole("GENERAL_AI");
                }}
              />
            </div>
          </div>
          <Space.Compact size="large" className="history__search">
            <Input
              addonBefore={<SearchOutlined />}
              placeholder="Search . . ."
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
              onPressEnter={chatSearch}
            />
          </Space.Compact>
          <div className="history__chatlist">
            {history ? (
              history
                .filter((val) => {
                  if (searchTerm == "") {
                    return val;
                  } else if (val.des == undefined) {
                    return;
                  } else {
                    return val.des
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase());
                  }
                })
                .sort((a, b) => {
                  return b.chatId - a.chatId;
                })
                .map((e, index) => {
                  if (e.chatId == chatId) {
                    return (
                      <ChatListItem
                        key={index}
                        description={e.des}
                        timestamp={e.time}
                        historyChatId={e.chatId}
                        chatClassName="history__chatlist--item activeChat"
                      />
                    );
                  } else {
                    return (
                      <ChatListItem
                        key={index}
                        description={e.des}
                        timestamp={e.time}
                        historyChatId={e.chatId}
                        chatClassName="history__chatlist--item"
                      />
                    );
                  }
                })
            ) : (
              <div></div>
            )}
          </div>
        </div>
        <div className="chat">
          <div
            className="chat__display"
            style={{ display: chatting ? "none" : "flex" }}
          >
            <div className="chat__display--heading">
              <img src={chatgpt} alt="Micro Chat GPT banner" />
            </div>
            <div className="chat__display--example">
              <Row gutter={16}>
                {character.map((e, i) => {
                  return (
                    <Col span={8} key={i}>
                      <Card
                        bordered={false}
                        onClick={() => {
                          setIntputVal(e.description);
                        }}
                      >
                        {e.description}&nbsp;&nbsp;
                        <FontAwesomeIcon
                          icon={faArrowRight}
                          className="right-arrow"
                        />
                      </Card>
                    </Col>
                  );
                })}
              </Row>
            </div>
          </div>
          <div
            className="chat__messages"
            ref={chatContainerRef}
            style={{ display: chatting ? "flex" : "none" }}
          >
            {chatMessages.map((e, index) => {
              let len = chatMessages.length;
              if (
                index == len - 1 ||
                (e.message == "" && e.classname == "response__color")
              ) {
                return;
              }
              if (typeof e.message == "object") {
                return (
                  <div className="response__color" key={index}>
                    <div className="chat__messages--content">
                      <div className="chat__messages--icon">
                        <img
                          className="chat__icon"
                          src={botResponseIcon}
                          alt="bot icon"
                          style={{ width: "2rem" }}
                        />
                      </div>

                      <div className="chat__messages--images">
                        {e.message.map((i, id) => {
                          return <img src={i} key={id} />;
                        })}
                      </div>
                    </div>
                  </div>
                );
              }
              if (e.message == "Loading") {
                return (
                  <LoadingDisplay
                    key={index}
                    message={e.message}
                    classname={e.classname}
                  />
                );
              }
              return (
                <MessageDisplay
                  key={index}
                  message={e.message}
                  classname={e.classname}
                />
              );
            })}
            {typeof renderedResponse != "string" && renderedResponse ? (
              <div className="response__color">
                <div className="chat__messages--content">
                  <div className="chat__messages--icon">
                    <img
                      className="chat__icon"
                      src={botResponseIcon}
                      alt="bot icon"
                      style={{ width: "2rem" }}
                    />
                  </div>

                  <div className="chat__messages--images">
                    {renderedResponse.map((i, id) => {
                      return <img src={i} key={id} alt="new" />;
                    })}
                  </div>
                </div>
              </div>
            ) : renderedResponse ? (
              <div className="response__color">
                <div className="chat__messages--content">
                  <div className="chat__messages--icon">
                    <img
                      className="chat__icon"
                      src={botResponseIcon}
                      alt="bot icon"
                      style={{ width: "2rem" }}
                    />
                  </div>
                  <div
                    className="chat__messages--message"
                    dangerouslySetInnerHTML={{ __html: renderedResponse }}
                  />
                </div>
              </div>
            ) : (
              <div></div>
            )}
          </div>

          <ConfigProvider
            theme={{
              token: {
                colorPrimary: "#ffb800",
              },
            }}
          >
            <Button
              onClick={() => {
                setHandleStopGeneration(!handleStopGeneration);
              }}
              className="Generating"
              style={{
                display:
                  chatMessages.length == 0
                    ? "none"
                    : sg.current
                    ? "none"
                    : "block",
              }}
            >
              Stop generating
            </Button>
            <Button
              onClick={() => {
                sethandleRegeneration(!handleRegeneration);
                regenerateResponse();
              }}
              className="Generating"
              style={{
                display:
                  chatMessages.length == 0
                    ? "none"
                    : sg.current
                    ? "block"
                    : "none",
              }}
            >
              Regenerate response
            </Button>
          </ConfigProvider>

          <div className="chat__input" style={{ flexDirection: "row" }}>
            <AudioOutlined className="chat__input--microphone chat__icon" />
            <Form className="chat__input--form" onFinish={handleInput}>
              <ConfigProvider
                theme={{
                  token: {
                    colorPrimary: "#ffb800",
                  },
                }}
              >
                <Form.Item
                  className="chat__input--role"
                  name="role"
                  label="Current Role"
                >
                  <Select
                    onChange={(e) => {
                      setRole(e);
                    }}
                    id="roleId"
                    placeholder="General AI"
                  >
                    <Select.Option value="GENERAL_AI">General AI</Select.Option>
                    <Select.Option value="INTERVIEWER">
                      Interviewer
                    </Select.Option>
                    <Select.Option value="POET">Poet</Select.Option>
                    <Select.Option value="CAREER_COUNSELOR">
                      Career Counselor
                    </Select.Option>
                    <Select.Option value="ENGLISH_TRANSLATOR">
                      English Translator
                    </Select.Option>
                    <Select.Option value="STAND_UP_COMEDIAN">
                      Stand-up Comdeian
                    </Select.Option>
                  </Select>
                </Form.Item>

                <Form.Item>
                  <Space.Compact
                    className="chat__input--field"
                    style={{
                      width: "100%",
                    }}
                  >
                    <Modal
                      title="Upload File"
                      open={isModalOpen}
                      onOk={handleOk}
                      onCancel={handleCancel}
                    >
                      <Upload
                        accept=".pdf,.doc"
                        itemRender={() => {
                          return (
                            <CheckCircleFilled style={{ color: "#ffb800" }} />
                          );
                        }}
                      ></Upload>
                    </Modal>
                    <Button
                      type="primary"
                      onClick={showModal}
                      style={{
                        borderEndStartRadius: "0.5rem",
                        borderStartStartRadius: "0.5rem",
                      }}
                    >
                      <CloudUploadOutlined className="chat__icon" />
                    </Button>
                    <Input
                      size="large"
                      placeholder="Type something..."
                      htmlType="submit"
                      value={inputVal}
                      onChange={(e) => {
                        setIntputVal(e.target.value);
                      }}
                    />
                    <Button
                      type="primary"
                      htmlType="submit"
                      onClick={handleUserInput}
                    >
                      <SendOutlined className="chat__icon" />
                    </Button>
                  </Space.Compact>
                </Form.Item>
              </ConfigProvider>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
}
