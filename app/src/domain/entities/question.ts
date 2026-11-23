export type CategoryId = "math" | "shapes" | "waste" | "plants";
export interface Question {
  id: string;
  categoryId: CategoryId;
  prompt: string;
  answerType: "number" | "choice";
  correctAnswer: string;
  explanation: string;
  options?: { id: string; label: string }[];
  image?: string;
  imageAlt?: string;
}
