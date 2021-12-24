import React, { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import { quizQuestions } from "./quizQuestions";
import "./App.css";

// type QuestionArr = {
//   category: string;
//   type: string;
//   difficulty: string;
//   question: string;
//   correct_answer: string;
//   incorrect_answers: string[];
// };

function App() {
  const [step, stepSet] = useState<number>(-1);
  const [score, scoreSet] = useState<number>(0);
  const [gameOver, gameOverSet] = useState<boolean>(true);
  const [gameQuestions, gameQuestionsSet] = useState(quizQuestions);

  const possibleAnswers = () => {
    if (step > -1) {
      return [
        ...gameQuestions[step].incorrect_answers,
        gameQuestions[step].correct_answer,
      ];
    }
  };

  if (step === -1) {
    return (
      <div>
        <button type='button' onClick={() => stepSet(step + 1)}>
          Play Quiz
        </button>
      </div>
    );
  }

  return (
    <div className='App'>
      <div>
        <h1>The Easiest Quiz Ever</h1>
      </div>
      <div>category: {gameQuestions[step].category} </div>
      <div>difficulty: {gameQuestions[step].difficulty} </div>
      <div>question: {gameQuestions[step].question} </div>
      <div>Category: {gameQuestions[step].category} </div>
      <div>
        {possibleAnswers.map((answer: string, index: number) => {
          <button type='button' key={index}>
            {answer}
          </button>;
        })}
      </div>
    </div>
  );
}

export default App;
