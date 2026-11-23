import { Delete, ArrowRight } from "lucide-react";
import { useState } from "react";
import type { Question } from "../../domain/entities/question";
export function AnswerRenderer({
  question,
  disabled,
  onAnswer,
}: {
  question: Question;
  disabled: boolean;
  onAnswer: (answer: string) => void;
}) {
  const [input, setInput] = useState("");
  if (question.answerType === "choice")
    return (
      <div className={`choices choices-${question.options?.length}`}>
        {question.options?.map((option) => (
          <button
            key={option.id}
            disabled={disabled}
            onClick={() => onAnswer(option.id)}
            className="answer-choice"
          >
            {option.label}
          </button>
        ))}
      </div>
    );
  return (
    <div className="numeric-controls">
      <output
        className="number-input"
        aria-label="Jawaban angka"
        aria-live="polite"
      >
        {input || "?"}
      </output>
      <div className="keypad">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"].map((digit) => (
          <button
            key={digit}
            disabled={disabled}
            onClick={() =>
              setInput((current) =>
                current.length < 3 ? current + digit : current,
              )
            }
          >
            {digit}
          </button>
        ))}
        <button
          disabled={disabled || !input}
          title="Hapus angka"
          aria-label="Hapus angka"
          onClick={() => setInput((current) => current.slice(0, -1))}
        >
          <Delete size={20} />
        </button>
        <button
          className="submit-answer"
          disabled={disabled || !input}
          aria-label="Kirim jawaban"
          title="Kirim jawaban"
          onClick={() => {
            if (input) onAnswer(input);
          }}
        >
          <ArrowRight size={22} />
        </button>
      </div>
    </div>
  );
}
