"use client";

import { Microphone, Send } from "@/assets/Icons";
import { createSpeechlySpeechRecognition } from "@speechly/speech-recognition-polyfill";
import Head from "next/head";
import { Fragment, useEffect, useRef, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { v4 as uuidV4 } from "uuid";

const SpeechlySpeechRecognition = createSpeechlySpeechRecognition(
  "869f2f3b-b56c-43d3-9c9c-d5d8dc55cc22"
);
SpeechRecognition.applyPolyfill(SpeechlySpeechRecognition);

declare const window: any;

type ChatMessage = {
  id: string;
  question: string;
  answer: string;
};

export default function Home() {
  const [chatMessage, setChatMessage] = useState<ChatMessage[]>([]);
  const [question, setQuestion] = useState("");
  const chatRef = useRef<HTMLDivElement>(null);
  const isChanging = useRef(false);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const handleStartListening = () => {
    resetTranscript();
    SpeechRecognition.startListening({ continuous: true, language: "en-IN" });
  };

  useEffect(() => {
    if (!transcript?.length) return;

    if (transcript.includes("cancel this question")) {
      resetTranscript();
    }

    if (isChanging.current) {
      setChatMessage((prev) =>
        prev.filter((item, index) => index !== prev.length - 1)
      );
    }

    isChanging.current = true;

    setChatMessage((prev) => {
      return [
        ...prev,
        {
          id: uuidV4(),
          question: transcript,
          answer: "",
        },
      ];
    });

    setQuestion(transcript);
  }, [transcript]);

  const handleButtonRemoveHold = async () => {
    SpeechRecognition.stopListening();

    let uuid = uuidV4();

    setChatMessage((prev) => {
      return [
        ...prev,
        {
          id: uuid,
          question: question,
          answer: "",
        },
      ];
    });

    const response = await handleFetchData(question);

    setQuestion("");

    setChatMessage((prev) => {
      return prev?.map((item) => {
        if (item?.id === uuid) {
          return {
            ...item,
            answer: response || "Oops sorry i do not have any answer to this.",
          };
        }
        return item;
      });
    });

    handleSpeechSynthesis(response);
  };

  const handleSendMessage = async () => {
    try {
      let uuid = uuidV4();

      setChatMessage((prev) => {
        return [
          ...prev,
          {
            id: uuid,
            question: question,
            answer: "",
          },
        ];
      });

      const response = await handleFetchData(question);

      setQuestion("");

      setChatMessage((prev) => {
        return prev?.map((item) => {
          if (item?.id === uuid) {
            return {
              ...item,
              answer:
                response || "Oops sorry i do not have any answer to this.",
            };
          }
          return item;
        });
      });

      handleSpeechSynthesis(response);
    } catch (error) {
      alert(error);
    }
  };

  const handleFetchData: (arg: string) => Promise<string> = async (
    question: string
  ) => {
    try {
      const response = await fetch(
        "https://chatbot-server-pqv8.onrender.com/",
        // "http://localhost:8000/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question: question,
          }),
        }
      );

      const data = await response.json();

      return data?.content || "Oops sorry i do not have any answer to this.";
    } catch (error) {
      alert(error);
      return "Something went wrong!";
    }
  };

  const handleSpeechSynthesis = (message: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();

      const speechService = new SpeechSynthesisUtterance(
        message || "Oops sorry i do not have any answer to this."
      );

      window.speechSynthesis.speak(speechService);
    } else {
      alert("Speech synthesis not supported");
    }
  };

  useEffect(() => {
    if (!chatMessage?.length) return;
    chatRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessage?.length]);

  return (
    <>
      <Head>
        <title>AI</title>
      </Head>
      <main className=" bg-gray-900 min-h-screen flex flex-col gap-4  text-white  ">
        <h1 className="w-full text-center p-4 text-4xl text-teal-500 font-medium tracking-wide ">
          AI Chat Room
        </h1>
        <div
          className={`w-full flex flex-col  container mx-auto p-4  px-4 pt-4 relative `}
        >
          <div className="flex flex-col h-[80vh] bg-gray-800 overflow-y-auto pl-4 pb-20 ">
            {chatMessage?.map((item) => (
              <Fragment key={item?.id}>
                {item?.question?.length ? (
                  <div
                    className="relative w-full left-0 text-sm  py-4 flex items-center justify-end  "
                    key={item?.id + item?.question}
                    ref={chatRef}
                  >
                    <div className="w-full flex flex-col items-end mr-4  gap-2">
                      <span className="max-w-[90%] md:max-w-[70%] w-fit   text-sm text-black bg-gray-100 rounded-b-2xl rounded-l-2xl shadow-lg font-medium tracking-wide py-2 px-4">
                        {item?.question}
                      </span>
                      <span className="flex items-center gap-2">
                        <small className="text-gray-500 tracking-wide"></small>
                      </span>
                    </div>
                  </div>
                ) : null}

                {item?.answer?.length ? (
                  <div
                    className="relative w-full py-4 left-0  gap-4 flex items-start justify-start"
                    key={item?.id}
                    ref={chatRef}
                  >
                    <div
                      className={` h-12 w-12  min-w-fit min-h-fit rounded-full flex items-center  justify-center overflow-hidden cursor-pointer select-none  font-medium text-white bg-gray-800`}
                    >
                      <img
                        src="/bot.png"
                        alt="bot"
                        className="h-full w-full object-cover "
                        loading="lazy"
                      />
                    </div>
                    <div className="w-full flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span
                          className="max-w-[90%] md:max-w-[70%] w-fit py-2 px-4   text-sm text-white 
                     bg-teal-500 font-medium tracking-wide rounded-b-2xl rounded-r-2xl"
                        >
                          {item?.answer}
                        </span>
                      </div>
                      <small className="text-gray-500 tracking-wide"></small>
                    </div>
                  </div>
                ) : (
                  <>Thinking...</>
                )}
              </Fragment>
            ))}
          </div>

          <div className="w-full h-fit flex absolute bottom-0 left-0 items-center justify-between gap-4 bg-white  dark:bg-gray-900 p-4    z-10  ">
            <div className="flex w-full items-center border p-2 rounded-full ">
              <input
                type="text"
                placeholder="Type a message..."
                className="w-full focus:outline-none bg-transparent text-black dark:text-white pl-4 "
                value={question}
                onChange={(e: any) => {
                  setQuestion(e.target.value);
                }}
              />
            </div>
            <button
              className="bg-gray-200/20 rounded-full h-10 w-10 flex items-center justify-center cursor-pointer  "
              onClick={handleSendMessage}
            >
              <Send />
            </button>
            <button
              className="bg-gray-200/20 rounded-full h-10 w-10 flex items-center justify-center cursor-pointer  "
              onMouseDown={handleStartListening}
              onPointerDown={handleStartListening}
              onMouseUp={handleButtonRemoveHold}
            >
              <Microphone />
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
