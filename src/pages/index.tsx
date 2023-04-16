import { Microphone } from "@/assets/Icons";
import Head from "next/head";
import { useEffect, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

declare const window: any;

export default function Home() {
  const [isListening, setIsListening] = useState(false);
  const [message, setMessage] = useState("");
  const [answer, setAnswer] = useState("");
  const [transcriptMessage, setTranscriptMessage] = useState("");
  const [fetching, setFetching] = useState(false);

  const [sendMessage, setSendMessage] = useState(false);

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

        setTranscriptMessage(transcript);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [isListening, transcript]);

  const handleMessageFetch = async (message: string) => {
    try {
      setFetching(true);
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
        setAnswer(
          data?.content || "Oops sorry i do not have any answer to this."
        );

        setMessage("");
      } else {
        alert("Speech synthesis not supported");
      }
    } catch (error) {
      console.log(error);
    } finally {
      resetTranscript();
      setFetching(false);
    }
  };

  return (
    <>
      <Head>
        <title>AI</title>
      </Head>
      <main className=" bg-gray-900 min-h-screen flex flex-col gap-4 text-white items-center justify-center ">
        <div className="w-fit h-fit shadow-xl  border-white rounded-full border-2 ">
          {fetching ? (
            <div className="h-20 flex items-center justify-center p-24 w-20">
              <p className="p-16">Thinking...</p>
            </div>
          ) : (
            <div className="w-fit p-16  ">
              <Microphone className="text-4xl text-white " />
            </div>
          )}
        </div>

        {transcriptMessage && (
          <p className="font-medium tracking-wide container">
            Question : {transcriptMessage}
          </p>
        )}
        {answer && (
          <p className="font-medium tracking-wide container">
            Answer : {answer}
          </p>
        )}

        {sendMessage ? (
          <div className="flex flex-col w-full fixed bottom-0 items-center  p-4  gap-4">
            <textarea
              name=""
              id=""
              rows={5}
              className="w-full max-w-5xl p-2 rounded-lg text-gray-700 "
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
            <div className="flex items-center gap-4">
              <button
                className="bg-blue-500 px-4 py-2 rounded-full hover:bg-blue-700 "
                onClick={() => {
                  handleMessageFetch(message);
                  setTranscriptMessage(message);
                  setAnswer("");
                }}
              >
                Send Message
              </button>
              <button
                className="bg-gray-500 px-4 py-2 rounded-full hover:bg-gray-700 "
                onClick={() => setSendMessage(false)}
              >
                Switch to voice
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col w-full fixed bottom-0 items-center  p-4  gap-4">
            <button
              className=" bg-blue-500 p-4 rounded-full cursor-pointer  hover:bg-blue-700   "
              onMouseDown={() => {
                setIsListening(true);
                SpeechRecognition.startListening();
              }}
              onMouseUp={() => {
                setIsListening(false);
                SpeechRecognition.abortListening();
                handleMessageFetch(transcriptMessage);
              }}
            >
              <Microphone className="text-xl" />
            </button>
            <button
              className="bg-gray-600 px-4 py-1 rounded-full hover:bg-gray-700 "
              onClick={() => setSendMessage(true)}
            >
              Type
            </button>
          </div>
        )}
      </main>
    </>
  );
}
