import axios from "axios";

type QuestionsType = {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}[];

export const getQuestions = async (size: number, difficulty: string) => {
  const endpoint = `https://opentdb.com/api.php?amount=${size}&difficulty=${difficulty}&type=multiple`;
  const res = await axios.get(endpoint);
  const answer: QuestionsType = res.data.results;
  return answer;
};
