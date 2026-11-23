import type { QuestionRepository } from "../../application/ports/questionRepository";
import type { CategoryId, Question } from "../../domain/entities/question";
import math from "../data/questions/mathematics.json";
import shapes from "../data/questions/solidShapes.json";
import waste from "../data/questions/wasteTypes.json";
import plants from "../data/questions/plantParts.json";

interface Bank {
  options?: string[];
  questions: {
    prompt: string;
    answer: string;
    explanation: string;
    image?: string;
  }[];
}
const banks: Record<CategoryId, Bank> = { math, shapes, waste, plants };

export const localQuestionRepository: QuestionRepository = {
  async getQuestions(category) {
    const bank = banks[category];
    if (!bank || bank.questions.length !== 20)
      throw new Error("Bank soal belum lengkap.");
    return bank.questions.map((entry, index): Question => {
      if (
        !entry.prompt ||
        !entry.explanation ||
        (bank.options && !bank.options.includes(entry.answer)) ||
        (!bank.options && !/^\d+$/.test(entry.answer))
      ) {
        throw new Error("Ada soal yang tidak valid.");
      }
      return {
        id: `${category}-${index + 1}`,
        categoryId: category,
        prompt: entry.prompt,
        answerType: bank.options ? "choice" : "number",
        correctAnswer: entry.answer,
        explanation: entry.explanation,
        options: bank.options?.map((label) => ({ id: label, label })),
        image: entry.image
          ? `${import.meta.env.BASE_URL}images/${entry.image}.svg`
          : undefined,
        imageAlt: entry.image
          ? "Ilustrasi sebuah bangun ruang dengan garis rusuk dan permukaan."
          : undefined,
      };
    });
  },
};
