import QuestionItem from "./QuestionItem";
interface QuestionSectionProps {
  section: {
    title: string;
    instruction: string;
    questions: {
      question: string;
      difficulty: string;
      marks: number;
    }[];
  };
}
export default function QuestionSection({ section }: QuestionSectionProps) {
  return (
    <div className="mt-10">

      {/* SECTION HEADER */}

      <div className="mb-6">
        <h2 className="text-xl font-bold text-[#181818]">
          {section.title}
        </h2>
        <p className="text-sm text-gray-500 mt-2 italic">
          {section.instruction}
        </p>
      </div>

      {/* DIVIDER */}
     
      <div className="border-t border-gray-200 mb-4" />
    
      {/* QUESTIONS */}

      <div>
        {section.questions.map((question, index) => (
          <QuestionItem key={index} question={question} index={index} />
        ))}
        
      </div>
    </div>
  );
}
