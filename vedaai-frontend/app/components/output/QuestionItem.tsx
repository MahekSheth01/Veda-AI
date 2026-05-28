import DifficultyBadge from "./DifficultyBadge";
interface QuestionItemProps {
  question: {
    question: string;
    difficulty: string;
    marks: number;
  };
  index: number;
}
export default function QuestionItem({ question, index }: QuestionItemProps) {
  return (
    <div className="flex items-start justify-between gap-4 py-5 border-b border-gray-100 last:border-0">

      <div className="flex-1">

        <div className="flex items-center gap-3 mb-2">

          <span className="font-semibold text-sm text-gray-700 min-w-[28px]">
            Q{index + 1}.
          </span>

          <DifficultyBadge difficulty={question.difficulty} />
        </div>
        <p className="text-gray-800 leading-7 pl-9">{question.question}</p>
      </div>

      <div className="min-w-[70px] text-right text-sm font-semibold text-gray-600 whitespace-nowrap">
        [{question.marks} {question.marks === 1 ? "Mark" : "Marks"}]
      </div>
    </div>
  );
}
