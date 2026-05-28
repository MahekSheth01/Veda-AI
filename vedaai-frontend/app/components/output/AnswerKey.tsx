import { AnswerKeySection } from "../../store/assignmentStore";
interface Props {
  answerKey: AnswerKeySection[];
}
export default function AnswerKey({ answerKey }: Props) {
  if (!answerKey || answerKey.length === 0) return null;
  return (
    <div className="mt-10 border-t-2 border-gray-300 pt-8">
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-px bg-gray-200" />
        <h2 className="text-base font-bold text-gray-900 tracking-wide uppercase shrink-0">
          Answer Key
        </h2>
        <div className="flex-1 h-px bg-gray-200" />
      </div>
      {/* SECTIONS */}
      <div className="space-y-6">
        {answerKey.map((section, si) => (
          <div key={si}>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              {section.sectionTitle}
            </h3>
            <div className="space-y-2">
              {section.answers.map((ans, ai) => (
                <div
                  key={ai}
                  className="flex items-start gap-3 py-2 border-b border-gray-100 last:border-0"
                >
                  {/* Q NUMBER */}
                  <span className="shrink-0 text-xs font-bold text-gray-500 w-7 mt-0.5">
                    Q{ans.questionNo}.
                  </span>
                  {/* ANSWER */}
                  <p className="text-sm text-gray-700 leading-relaxed flex-1">
                    {ans.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {/* END MARKER */}
      <div className="mt-8 text-center">
        <p className="text-xs text-gray-400 italic">— End of Question Paper —</p>
      </div>
    </div>
  );
}
