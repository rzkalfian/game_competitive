import { localQuestionRepository } from "../infrastructure/repositories/localQuestionRepository";
import {
  prepareMatch,
  restartMatch,
} from "../application/useCases/matchActions";
import type { GameServices } from "../application/ports/gameServices";
import type { CategoryId, Question } from "../domain/entities/question";
import { subscribeVisibility } from "../infrastructure/browser/pageVisibility";
import { createScreenOrientation } from "../infrastructure/browser/screenOrientation";

function shuffle(questions: Question[]) {
  const result = [...questions];
  for (let index = result.length - 1; index > 0; index--) {
    const target = Math.floor(Math.random() * (index + 1));
    [result[index], result[target]] = [result[target], result[index]];
  }
  return result;
}
async function loadQuestions(category: CategoryId) {
  const questions = await localQuestionRepository.getQuestions(category);
  await Promise.all(
    [
      ...new Set(
        questions.flatMap((question) =>
          question.image ? [question.image] : [],
        ),
      ),
    ].map(
      (source) =>
        new Promise<void>((resolve, reject) => {
          const image = new Image();
          image.onload = () => resolve();
          image.onerror = () =>
            reject(
              new Error(
                "Gambar soal gagal dimuat. Coba lagi atau kembali ke menu.",
              ),
            );
          image.src = source;
        }),
    ),
  );
  return shuffle(questions);
}
export function createGame(): GameServices {
  let matchId = 0;
  return {
    ...createScreenOrientation(),
    async prepare(arena, category) {
      return prepareMatch(
        arena,
        category,
        await loadQuestions(category),
        ++matchId,
      );
    },
    async restart(match) {
      return restartMatch(
        match,
        await loadQuestions(match.category),
        ++matchId,
      );
    },
    subscribeVisibility,
  };
}
