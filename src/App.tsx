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
  const [numberQuestions, numberQuestionsSet] = useState<string>("10");
  const [difficulty, difficultySet] = useState<string>("easy");

  const handleSubmit = (e: any) => {
    e.preventDefault();
    newQuestions(+numberQuestionsSet, difficulty);
    nextStep();
  };

  const newQuestions = useCallback(
    async (numberQuestions: number, difficulty: string) => {
      const endpoint = `https://opentdb.com/api.php?amount=${numberQuestions}&difficulty=${difficulty}&type=multiple`;
      const res = await axios.get(endpoint);
      console.log(res.data.results);
      gameQuestionsSet(res.data.results);
    },
    [numberQuestions, difficulty, gameQuestionsSet]
  );

  const nextStep = useCallback(() => {
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
    (answer: any) => {
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
      <div className='quiz-set'>
        <form>
          <label style={{ fontSize: "40px" }}>
            <b>Quiz Settings</b>
          </label>
          <br />
          <label>Number of Questions:</label>
          <br />
          <select
            value={numberQuestions}
            onChange={(e) => numberQuestionsSet(e.target.value)}
          >
            <option value='10'>10</option>
            <option value='20'>20</option>
            <option value='30'>30</option>
          </select>
          <br />
          <label>Difficulty:</label>
          <br />
          <select
            value={difficulty}
            onChange={(e) => difficultySet(e.target.value)}
          >
            <option value='easy'>easy</option>
            <option value='medium'>medium</option>
            <option value='hard'>hard</option>
          </select>
          <br />
          <button
            className='btn'
            type='button'
            onClick={async () => {
              gameOverSet(false);
              await newQuestions(+numberQuestions, difficulty);
              stepSet(step + 1);
            }}
          >
            Submit
          </button>
        </form>
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
              className='btn'
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
            <div>
              <b>Difficulty: </b> {gameQuestions[step].difficulty}{" "}
            </div>
            <div>
              <b>Category:</b> {gameQuestions[step].category}{" "}
            </div>
            <div>
              <b>Question: </b>
              <br />
              {gameQuestions[step].question}{" "}
            </div>
          </div>
          <div className='div-answers'>
            {getAnswers.map((answer: string, index: number) => {
              return (
                <button
                  className='div-btn'
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
