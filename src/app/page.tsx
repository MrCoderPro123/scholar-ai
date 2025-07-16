import { AiQa } from "@/components/features/ai-qa";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <div className="flex items-center">
        <h1 className="font-semibold text-lg md:text-2xl">AI Study Assistant</h1>
      </div>
      <p className="text-muted-foreground">
        Have a question? Ask our AI assistant. Select a subject, type your question, and get a detailed answer and explanation.
      </p>
      <AiQa />
    </div>
  );
}
