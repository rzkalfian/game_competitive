import { describe, expect, it } from "vitest";
import { localQuestionRepository } from "./localQuestionRepository";
import { evaluateAnswer } from "../../domain/rules/evaluateAnswer";
import type { CategoryId } from "../../domain/entities/question";

describe("bank soal lokal", () => {
  for (const category of [
    "math",
    "shapes",
    "waste",
    "plants",
  ] as CategoryId[]) {
    it(`${category}: 20 soal unik dan tepat satu jawaban benar`, async () => {
      const questions = await localQuestionRepository.getQuestions(category);
      expect(questions).toHaveLength(20);
      expect(new Set(questions.map((question) => question.id)).size).toBe(20);
      for (const question of questions) {
        expect(evaluateAnswer(question, question.correctAnswer)).toBe(true);
        if (question.options)
          expect(
            question.options.filter((option) =>
              evaluateAnswer(question, option.id),
            ),
          ).toHaveLength(1);
      }
    });
  }
});
