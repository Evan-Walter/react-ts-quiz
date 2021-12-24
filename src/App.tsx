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
  const [gameOver, gameOverSet] = useState<boolean>(false);
  // const [gameQuestions, gameQuestionsSet] = useState(quizQuestions);

  const nextStep = useCallback(() => {
    if (step < quizQuestions.length - 1) {
      stepSet(step + 1);
    } else {
      gameOverSet(true);
    }
  }, [step, stepSet, gameOverSet]);

  const getAnswers = useMemo(() => {
    if (step > -1) {
      return [
        ...quizQuestions[step].incorrect_answers,
        quizQuestions[step].correct_answer,
      ];
    }
    return [];
  }, [step]);

  const verifyAnswer = useCallback(
    (answer) => {
      if (answer === quizQuestions[step].correct_answer) {
        scoreSet(score + 1);
      }
      nextStep();
    },
    [step, score, scoreSet, nextStep]
  );

  if (step === -1) {
    return (
      <div>
        <button type='button' onClick={nextStep}>
          Play Quiz
        </button>
      </div>
    );
  }

  return (
    <div className='App'>
      <div>
        <div>
          <h1>The Easiest Quiz Ever</h1>
        </div>
        <div>
          <h4>Score: {score}</h4>
        </div>
        <div>difficulty: {quizQuestions[step].difficulty} </div>
        <div>category: {quizQuestions[step].category} </div>
        <div>question: {quizQuestions[step].question} </div>
      </div>
      {getAnswers.map((answer: string, index: number) =>
        console.log(answer, index)
      )}
      {getAnswers.map((answer: string, index: number) => {
        return (
          <button
            type='button'
            key={index}
            onClick={() => verifyAnswer(answer)}
          >
            {answer}
          </button>
        );
      })}
    </div>
  );
}

export default App;
