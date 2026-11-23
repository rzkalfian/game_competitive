import type { Question } from "../entities/question";

export function evaluateAnswer(
  question: Question,
  answer: string,
): boolean | null {
  if (question.answerType === "number") {
    if (!/^\d+$/.test(answer.trim())) return null;
    return Number(answer) === Number(question.correctAnswer);
  }
  if (!question.options?.some((option) => option.id === answer)) return null;
  return answer === question.correctAnswer;
}
