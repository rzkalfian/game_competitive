import type { CategoryId, Question } from "../../domain/entities/question";

export interface QuestionRepository {
  getQuestions(category: CategoryId): Promise<Question[]>;
}
