import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { Quiz } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

interface QuizComponentProps {
  quiz: Quiz;
  onComplete?: (correct: boolean) => void;
}

export default function QuizComponent({ quiz, onComplete }: QuizComponentProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<boolean | null>(null);
  
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const submitQuizMutation = useMutation({
    mutationFn: async (answer: number) => {
      const correct = answer === quiz.correctAnswer;
      const response = await apiRequest('POST', '/api/quiz-attempts', {
        userId: user!.id,
        quizId: quiz.id,
        selectedAnswer: answer,
        correct,
      });
      return { correct, data: await response.json() };
    },
    onSuccess: ({ correct }) => {
      setResult(correct);
      setSubmitted(true);
      
      if (correct) {
        toast({
          title: "Correct! 🎉",
          description: "You earned 50 XP!",
        });
      } else {
        toast({
          title: "Not quite right",
          description: "Review the explanation and try again next time.",
          variant: "destructive",
        });
      }

      // Invalidate user data to refresh XP
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
      
      onComplete?.(correct);
    },
  });

  const handleSubmit = () => {
    if (!selectedAnswer || !user) return;
    
    const answerIndex = parseInt(selectedAnswer);
    submitQuizMutation.mutate(answerIndex);
  };

  const resetQuiz = () => {
    setSelectedAnswer("");
    setSubmitted(false);
    setResult(null);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Quiz Challenge
          {submitted && (
            result ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500" />
            )
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <h3 className="font-medium">{quiz.question}</h3>
          
          <RadioGroup 
            value={selectedAnswer} 
            onValueChange={setSelectedAnswer}
            disabled={submitted}
          >
            {quiz.options.map((option, index) => {
              const isCorrect = index === quiz.correctAnswer;
              const isSelected = parseInt(selectedAnswer) === index;
              
              let labelClass = "cursor-pointer";
              if (submitted) {
                if (isCorrect) {
                  labelClass += " text-green-600 font-medium";
                } else if (isSelected && !isCorrect) {
                  labelClass += " text-red-600";
                }
              }
              
              return (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className={labelClass}>
                    {option}
                    {submitted && isCorrect && " ✓"}
                    {submitted && isSelected && !isCorrect && " ✗"}
                  </Label>
                </div>
              );
            })}
          </RadioGroup>

          {submitted && quiz.explanation && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Explanation:</h4>
              <p className="text-blue-800 text-sm">{quiz.explanation}</p>
            </div>
          )}

          <div className="flex gap-2">
            {!submitted ? (
              <Button 
                onClick={handleSubmit}
                disabled={!selectedAnswer || submitQuizMutation.isPending}
                className="flex-1"
              >
                {submitQuizMutation.isPending ? "Submitting..." : "Submit Answer"}
              </Button>
            ) : (
              <Button onClick={resetQuiz} variant="outline" className="flex-1">
                Try Again
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
