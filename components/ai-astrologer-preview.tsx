import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, MessageSquare, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { BirthDetailsDialog } from "./birth-details-dialog";
import { getAstrologicalResponse, UserBirthInfo } from "@/lib/gemini";
import Link from "next/link";

const commonQuestions = [
  "What does my career path look like?",
  "When will I find love?",
  "What are my strengths and weaknesses?",
  "What does this year hold for me?",
  "How can I improve my relationships?",
];

interface Message {
  role: "user" | "assistant";
  content: string;
}

const LOCAL_STORAGE_KEYS = {
  BIRTH_INFO: "astrohuff_birth_info",
  QUESTION_COUNT: "astrohuff_question_count",
};

export function AiAstrologerPreview() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userQuestion, setUserQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [showBirthDetails, setShowBirthDetails] = useState(false);
  const [birthInfo, setBirthInfo] = useState<UserBirthInfo | null>(null);
  const [questionCount, setQuestionCount] = useState(0);

  useEffect(() => {
    const storedBirthInfo = localStorage.getItem(LOCAL_STORAGE_KEYS.BIRTH_INFO);
    const storedQuestionCount = localStorage.getItem(LOCAL_STORAGE_KEYS.QUESTION_COUNT);
    
    if (storedBirthInfo) {
      setBirthInfo(JSON.parse(storedBirthInfo));
    }
    if (storedQuestionCount) {
      setQuestionCount(parseInt(storedQuestionCount));
    }
  }, []);

  const handleQuestionSubmit = async (question: string) => {
    if (!birthInfo) {
      setShowBirthDetails(true);
      setUserQuestion(question);
      return;
    }

    if (questionCount >= 5) {
      setMessages(prev => [
        ...prev,
        { role: "user", content: question },
        { role: "assistant", content: "You've reached the limit of free questions. Please sign up to continue your astrological journey!" }
      ]);
      return;
    }

    setLoading(true);
    try {
      const response = await getAstrologicalResponse(birthInfo, question);
      
      const newCount = questionCount + 1;
      setQuestionCount(newCount);
      localStorage.setItem(LOCAL_STORAGE_KEYS.QUESTION_COUNT, newCount.toString());

      setMessages(prev => [
        ...prev,
        { role: "user", content: question },
        { role: "assistant", content: response }
      ]);
    } catch (error) {
      setMessages(prev => [
        ...prev,
        { role: "user", content: question },
        { role: "assistant", content: "I apologize, but I couldn't process your request at the moment. Please try again." }
      ]);
    } finally {
      setLoading(false);
      setUserQuestion("");
    }
  };

  const handleBirthDetailsSubmit = (data: UserBirthInfo) => {
    setBirthInfo(data);
    localStorage.setItem(LOCAL_STORAGE_KEYS.BIRTH_INFO, JSON.stringify(data));
    if (userQuestion) {
      handleQuestionSubmit(userQuestion);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold">Ask the AI Astrologer</h2>
          <p className="text-muted-foreground">
            Get a glimpse of your cosmic destiny with 5 free questions
          </p>
        </div>

        <div className="flex flex-wrap gap-2 justify-center">
          {commonQuestions.map((question) => (
            <Button
              key={question}
              variant="outline"
              size="sm"
              onClick={() => handleQuestionSubmit(question)}
              disabled={loading || questionCount >= 5}
            >
              {question}
            </Button>
          ))}
        </div>

        <Card className="p-4 min-h-[400px] max-h-[400px] flex flex-col">
          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                <MessageSquare className="mr-2 h-4 w-4" />
                Ask a question to begin your cosmic journey
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))
            )}
            {loading && (
              <div className="flex justify-center">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            )}
          </div>

          <div className="relative">
            <Input
              placeholder={
                questionCount >= 5
                  ? "Sign up to ask more questions..."
                  : "Type your question..."
              }
              value={userQuestion}
              onChange={(e) => setUserQuestion(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && userQuestion.trim()) {
                  handleQuestionSubmit(userQuestion);
                }
              }}
              disabled={loading || questionCount >= 5}
            />
            {questionCount >= 5 && (
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <Button asChild size="sm">
                  <Link href="/sign-up">
                    <Lock className="h-4 w-4 mr-2" />
                    Sign Up
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </Card>

        <div className="text-center text-sm text-muted-foreground">
          {questionCount < 5 ? (
            <p>{5 - questionCount} questions remaining</p>
          ) : (
            <p>
              You've used all your free questions.{" "}
              <Link href="/sign-up" className="text-primary hover:underline">
                Sign up
              </Link>{" "}
              for unlimited insights!
            </p>
          )}
        </div>
      </motion.div>

      <BirthDetailsDialog
        open={showBirthDetails}
        onClose={() => setShowBirthDetails(false)}
        onSubmit={handleBirthDetailsSubmit}
      />
    </div>
  );
}
