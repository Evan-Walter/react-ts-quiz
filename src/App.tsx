import React, { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import { quizQuestions } from "./quizQuestions";
import { shuffleAnswers } from "./utils";
import "./App.css";

type QuestionsType = {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}[];

function App() {
  const [gameQuestions, gameQuestionsSet] = useState<QuestionsType>([]);
  const [step, stepSet] = useState<number>(-1);
  const [score, scoreSet] = useState<number>(0);
  const [gameOver, gameOverSet] = useState<boolean>(false);

  const newQuestions = useCallback(async (size: number, difficulty: string) => {
    const endpoint = `https://opentdb.com/api.php?amount=${size}&difficulty=${difficulty}&type=multiple`;
    const res = await axios.get(endpoint);
    console.log(res.data.results);
    gameQuestionsSet(res.data.results);
  }, []);

  const nextStep = useCallback(() => {
    console.log("hello");
    if (step < gameQuestions.length - 1) {
      stepSet(step + 1);
    } else {
      gameOverSet(true);
    }
  }, [step, stepSet, gameOverSet]);

  const getAnswers = useMemo(() => {
    if (step > -1) {
      return shuffleAnswers([
        ...gameQuestions[step].incorrect_answers,
        gameQuestions[step].correct_answer,
      ]);
    }
    return [];
  }, [step]);

  const verifyAnswer = useCallback(
    (answer) => {
      if (answer === gameQuestions[step].correct_answer) {
        scoreSet(score + 1);
      }
      nextStep();
    },
    [step, score, scoreSet, nextStep]
  );

  const isGameOver = useCallback(() => {
    scoreSet(0);
    stepSet(-1);
    gameOverSet(false);
  }, [scoreSet, stepSet, gameOverSet]);

  if (step === -1) {
    return (
      <div>
        <button
          type='button'
          onClick={async () => {
            await newQuestions(10, "easy");
            nextStep();
          }}
        >
          Play Quiz
        </button>
      </div>
    );
  }

  return (
    <div className='App'>
      {gameOver ? (
        <div>
          <div>
            <h4>Score: {score}</h4>
          </div>
          <div>
            <button
              type='button'
              onClick={() => {
                isGameOver();
              }}
            >
              Play Again
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div>
            <div>
              <h1>The Easiest Quiz Ever</h1>
            </div>
            <div>
              <h4>Score: {score}</h4>
            </div>
            <div>difficulty: {gameQuestions[step].difficulty} </div>
            <div>category: {gameQuestions[step].category} </div>
            <div>question: {gameQuestions[step].question} </div>
          </div>
          <div>
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
        </div>
      )}
    </div>
  );
}

export default App;
