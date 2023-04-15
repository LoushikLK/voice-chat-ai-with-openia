import Head from "next/head";
import { useEffect, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

declare const window: any;

export default function Home() {
  const [isListening, setIsListening] = useState(false);
  const [message, setMessage] = useState("");

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  useEffect(() => {
    if (!isListening && !transcript?.length) return;

    (async () => {
      try {
        if (!browserSupportsSpeechRecognition) {
          alert("Browser does not support speech recognition");
          return;
        }

        handleMessageFetch(transcript);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [isListening, transcript]);

  const handleMessageFetch = async (message: string) => {
    try {
      const response = await fetch(
        "https://chatbot-server-pqv8.onrender.com/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question: message,
          }),
        }
      );

      const data = await response.json();

      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();

        const speechService = new SpeechSynthesisUtterance(
          data?.content || "Oops sorry i do not have any answer to this."
        );

        window.speechSynthesis.speak(speechService);
      } else {
        alert("Speech synthesis not supported");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Head>
        <title>AI</title>
      </Head>
      <main className=" bg-gray-900 min-h-screen flex items-center justify-center ">
        <div className="w-fit h-fit shadow-xl  border-white rounded-full border-2 ">
          <div className="w-fit p-16  ">
            <svg
              stroke="currentColor"
              className="text-4xl"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 16 16"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M3.5 6.5A.5.5 0 014 7v1a4 4 0 008 0V7a.5.5 0 011 0v1a5 5 0 01-4.5 4.975V15h3a.5.5 0 010 1h-7a.5.5 0 010-1h3v-2.025A5 5 0 013 8V7a.5.5 0 01.5-.5z"
                clipRule="evenodd"
              ></path>
              <path
                fillRule="evenodd"
                d="M10 8V3a2 2 0 10-4 0v5a2 2 0 104 0zM8 0a3 3 0 00-3 3v5a3 3 0 006 0V3a3 3 0 00-3-3z"
                clipRule="evenodd"
              ></path>
            </svg>
          </div>
        </div>
        <div className="w-full fixed bottom-0 flex  p-4  gap-4">
          <textarea
            name=""
            id=""
            className="w-full rounded-md text-gray-900 p-4 "
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
          ></textarea>
          <div className="flex flex-col h-full justify-between gap-4 ">
            {!message?.trim()?.length ? (
              <div
                className="w-fit  bg-blue-500 px-8 py-3 rounded-md shadow-xl cursor-pointer "
                onClick={() => {
                  SpeechRecognition.startListening({
                    continuous: true,
                    language: "en-IN",
                  });
                  setIsListening(true);
                }}
              >
                <svg
                  stroke="currentColor"
                  className="text-xl"
                  fill="currentColor"
                  strokeWidth="0"
                  viewBox="0 0 16 16"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M3.5 6.5A.5.5 0 014 7v1a4 4 0 008 0V7a.5.5 0 011 0v1a5 5 0 01-4.5 4.975V15h3a.5.5 0 010 1h-7a.5.5 0 010-1h3v-2.025A5 5 0 013 8V7a.5.5 0 01.5-.5z"
                    clipRule="evenodd"
                  ></path>
                  <path
                    fillRule="evenodd"
                    d="M10 8V3a2 2 0 10-4 0v5a2 2 0 104 0zM8 0a3 3 0 00-3 3v5a3 3 0 006 0V3a3 3 0 00-3-3z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </div>
            ) : (
              <div
                className="w-fit  bg-blue-500 px-8 py-3 rounded-md shadow-xl cursor-pointer "
                onClick={() => handleMessageFetch(message)}
              >
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  strokeWidth="0"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs></defs>
                  <path d="M931.4 498.9L94.9 79.5c-3.4-1.7-7.3-2.1-11-1.2-8.5 2.1-13.8 10.7-11.7 19.3l86.2 352.2c1.3 5.3 5.2 9.6 10.4 11.3l147.7 50.7-147.6 50.7c-5.2 1.8-9.1 6-10.3 11.3L72.2 926.5c-0.9 3.7-0.5 7.6 1.2 10.9 3.9 7.9 13.5 11.1 21.5 7.2l836.5-417c3.1-1.5 5.6-4.1 7.2-7.1 3.9-8 0.7-17.6-7.2-21.6zM170.8 826.3l50.3-205.6 295.2-101.3c2.3-0.8 4.2-2.6 5-5 1.4-4.2-0.8-8.7-5-10.2L221.1 403 171 198.2l628 314.9-628.2 313.2z"></path>
                </svg>
              </div>
            )}
            {isListening && (
              <div
                className="font-medium bg-red-500 text-white cursor-pointer rounded-md py-2 px-4 tracking-wide text-md"
                onClick={() => {
                  resetTranscript();
                  SpeechRecognition.stopListening();
                  setIsListening(false);
                }}
              >
                Stop
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
