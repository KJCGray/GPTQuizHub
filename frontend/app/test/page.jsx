"use client";

import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import nookies from "nookies";
import Swal from "sweetalert2";
import Navbar from "../../components/navbar";

const socket = io.connect(process.env.NEXT_PUBLIC_SOCKET_URL);
function App() {
  //   const [quiz, setQuiz] = useState([]);
  const [testStatus, setTestStatus] = useState("setting");
  const [roomId, setRoomId] = useState(nookies.get().user_id);
  const [startGame, setStartGame] = useState(false);
  const [loading, setLoading] = useState(false);
  // process state
  //   const [seconds, setSeconds] = useState(10);
  //   const [questionSeconds, setQuestionSeconds] = useState(10);
  //   const [randomOptions, setRandomOptions] = useState(false);
  //   const [shuffledOptions, setShuffledOptions] = useState([]);
  //   const [useCorrectRatio, setUseCorrectRatio] = useState(false);
  //   const [correctRatio, setCorrectRatio] = useState(1.05);
  //   const [score, setScore] = useState(0);
  //   const [hasClickOption, setHasClickedOption] = useState(false);
  //   const [selectedOptionId, setSelectedOptionId] = useState(null);
  //   const [consecutiveCorrectAnswers, setConsecutiveCorrectAnswers] = useState(false);
  //   const [questionIndex, setQuestionIndex] = useState(0);
  // socket state
  const roomRef = useRef();
  useEffect(() => {
    socket.on("test from backend", () => {
      console.log("Received message from backend");
    });
    return () => {
      socket.disconnect();
    };
  }, []);
  // 對戰過程相關
  //   useEffect(() => {
  //     let currentOptions = quiz?.questions?.[questionIndex].options;
  //     if (randomOptions) {
  //       currentOptions = [...currentOptions].sort(() => Math.random() - 0.5);
  //     }
  //     setShuffledOptions(currentOptions);
  //   }, [questionIndex, randomOptions, quiz]);
  //   useEffect(() => {
  //     const handleBeforeUnload = (e) => {
  //       e.preventDefault();
  //       e.returnValue = "";
  //     };
  //     if (testStatus === "process") {
  //       window.addEventListener("beforeunload", handleBeforeUnload);
  //     }
  //     return () => {
  //       window.removeEventListener("beforeunload", handleBeforeUnload);
  //     };
  //   });
  //   const moveToNextQuestion = () => {
  //     if (questionIndex === quiz.questions.length - 1) {
  //       setTestStatus("end");
  //     } else {
  //       setQuestionIndex((prevIndex) => prevIndex + 1);
  //       setSeconds(questionSeconds);
  //       setHasClickedOption(false);
  //     }
  //   };
  //   useEffect(() => {
  //     if (testStatus === "process") {
  //       const interval = setInterval(() => {
  //         if (seconds > 0) {
  //           setSeconds((prevSeconds) => prevSeconds - 1);
  //         } else {
  //           moveToNextQuestion();
  //         }
  //       }, 1000);
  //       return () => clearInterval(interval);
  //     }
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  //   }, [testStatus, seconds]);
  // socket.io
  function createRoomHandler() {
    socket.emit("createroom", nookies.get().user_id);
    // socket.on("createroom", () => {});
    setTestStatus("waiting");
  }
  function joinRoomHandler(joinRoomId) {
    socket.emit("joinroom", joinRoomId, nookies.get().user_id);
    setRoomId(joinRoomId);
    setTestStatus("waiting");
  }
  function startGameHandler() {
    setLoading(true);
    socket.emit("isReady", roomId, nookies.get().user_id);
    setStartGame(!startGame);
    setLoading(false);
  }
  socket.on("isReady");
  const SettingPage = (
    <>
      <div>
        <button
          type="button"
          onClick={createRoomHandler}
          className="px-20 py-4 mt-3 text-2xl text-white bg-primary rounded-xl min-w-[20rem]"
        >
          創建房間
        </button>
      </div>
      <form className="flex flex-col mt-5" onSubmit={() => joinRoomHandler(roomRef.current?.value)}>
        <input
          type="text"
          ref={roomRef}
          placeholder="房間號碼"
          required
          className="px-4 py-2 text-2xl text-center border max-w-[22.5rem]"
        />
        <button type="submit" className="px-20 py-4 mt-5 text-2xl text-white bg-primary rounded-xl">
          加入房間
        </button>
      </form>
    </>
  );
  function copyLink() {
    navigator.clipboard.writeText(roomId);
    Swal.fire({
      icon: "success",
      title: "已複製到剪貼簿",
      text: "分享給其他朋友",
      showConfirmButton: false,
      timer: 1000,
    });
  }
  const WaitingPage = (
    <div className="mt-5">
      <div className="flex items-center mt-6">
        <p>房號:{roomId}</p>
        <button type="button" onClick={copyLink} className="px-2 py-1 border rounded-lg dark:text-black">
          複製
        </button>
      </div>
      <button
        type="button"
        onClick={startGameHandler}
        disabled={loading === true}
        className="block px-24 py-4 mb-20 text-2xl text-white rounded-xl bg-primary"
      >
        {startGame ? "取消" : "點擊開始"}
      </button>
      {startGame && <p className="mb-3 text-2xl">正在等待對手...</p>}
    </div>
  );
  //   const handleOptionClick = (optionId) => {
  //     setSelectedOptionId(optionId);
  //     setHasClickedOption(true);
  //     const selectedOption = shuffledOptions.find((option) => option.id === optionId);
  //     const chooseCorrectAnswer =
  //       selectedOption && selectedOption.id === Number(quiz?.questions[questionIndex].correct_answer);
  //     const elapsedTime = questionSeconds - seconds + 0.5;
  //     const questionScore = Math.max(Math.round(100 - (100 * elapsedTime) / questionSeconds), 5);
  //     if (chooseCorrectAnswer) {
  //       setScore((prevScore) => prevScore + questionScore);
  //       setConsecutiveCorrectAnswers(true);
  //       // TODO:websocket雙人對戰
  //     } else {
  //       setConsecutiveCorrectAnswers(false);
  //     }
  //     if (chooseCorrectAnswer && consecutiveCorrectAnswers && useCorrectRatio) {
  //       setScore((prevScore) => prevScore + Math.round(questionScore * correctRatio));
  //       // TODO:websocket雙人對戰
  //     }
  //   };
  //   const OptionsItems =
  //     shuffledOptions &&
  //     shuffledOptions.length > 0 &&
  //     shuffledOptions.map((option) => {
  //       const isCorrectAnswer = option.id === Number(quiz?.questions[questionIndex].correct_answer);
  //       const isSelected = hasClickOption && option.id === selectedOptionId;
  //       let buttonClassName = "block px-24 py-4 text-2xl text-white rounded-xl mt-20 w-[45rem] leading-8 bg-[#4783EA]";
  //       if (isSelected) {
  //         buttonClassName += isCorrectAnswer ? " bg-green-500" : " bg-red-500";
  //       } else if (!isSelected && hasClickOption) {
  //         buttonClassName += " bg-slate-400";
  //       }
  //       return (
  //         <button
  //           type="button"
  //           onClick={() => handleOptionClick(option.id)}
  //           disabled={hasClickOption === true}
  //           key={option.id}
  //           className={buttonClassName}
  //         >
  //           {option.content}
  //         </button>
  //       );
  //     });
  //   const ProcessPage = (
  //     <div className="border border-black rounded-xl min-w-[60rem] min-h-[60rem] items-center">
  //       {quiz && quiz?.questions?.length > 0 && (
  //         <div>
  //           <div className="flex flex-col items-center mt-10">
  //             <h1 className="mb-4 text-4xl">剩餘時間 : {seconds}</h1>
  //             <p className="text-4xl">{quiz?.questions?.[questionIndex].question}</p>
  //             <div className="flex my-4">
  //               <p className="mr-3 text-3xl">難度 :</p>
  //               <p className="mr-6 text-3xl">{quiz?.questions?.[questionIndex].difficulty}</p>
  //               <p className="text-3xl">
  //                 {questionIndex + 1} / {quiz?.questions?.length}
  //               </p>
  //             </div>
  //           </div>
  //           <div className="flex flex-col items-center mb-10">{OptionsItems}</div>
  //         </div>
  //       )}
  //     </div>
  //   );
  function leaveGameHandler() {}
  const EndPage = (
    <div className="flex flex-col border border-black rounded-xl min-w-[60rem] min-h-[60rem] items-center justify-center">
      <p className="mb-4 text-4xl">你的得分:100</p>
      <p className="mb-4 text-4xl">對手得分: 100</p>
      <p className="mb-4 text-4xl">你贏了</p>
      <button
        type="button"
        onClick={leaveGameHandler}
        className="block px-24 py-4 text-4xl bg-[#4783EA] text-white rounded-xl mt-20 disabled:opacity-50"
      >
        離開
      </button>
    </div>
  );
  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center mt-7">
        <div className="mb-5 text-2xl">雙人對戰</div>
        {testStatus === "setting" && SettingPage}
        {testStatus === "waiting" && WaitingPage}
        {/* {testStatus === "start" && StartPage} */}
        {/* {testStatus === "process" && ProcessPage} */}
        {testStatus === "end" && EndPage}
      </div>
    </>
  );
}

export default App;
