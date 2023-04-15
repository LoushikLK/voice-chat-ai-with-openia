import Head from "next/head";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

declare const window: any;

export default function Home() {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  console.log(browserSupportsSpeechRecognition);

  console.log(transcript);

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
        <div className="w-full fixed bottom-0 flex items-center p-4  gap-4">
          <textarea
            name=""
            id=""
            className="w-full rounded-md"
            rows={5}
          ></textarea>
          <div
            className="w-fit  bg-blue-500 p-4 rounded-md shadow-xl cursor-pointer "
            onClick={() =>
              SpeechRecognition.startListening({
                continuous: true,
                language: "en-US",
              })
            }
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
        </div>
      </main>
    </>
  );
}
