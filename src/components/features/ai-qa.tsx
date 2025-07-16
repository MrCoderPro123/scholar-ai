"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { askAi } from "@/app/actions";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { AiStudyAssistantOutput } from "@/ai/flows/ai-study-assistant";
import { useToast } from "@/hooks/use-toast";
import { Lightbulb, BookCheck } from "lucide-react";

const FormSchema = z.object({
  subject: z.string({
    required_error: "Please select a subject.",
  }),
  question: z
    .string()
    .min(10, {
      message: "Question must be at least 10 characters.",
    })
    .max(500, {
      message: "Question must not be longer than 500 characters.",
    }),
});

const subjects = ["General Knowledge", "Mathematics", "History", "Science", "Literature", "Computer Science"];

export function AiQa() {
  const [result, setResult] = useState<AiStudyAssistantOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await askAi(data);
      setResult(response);
    } catch (error) {
      console.error("Failed to get answer:", error);
      toast({
        title: "Error",
        description: "Could not get an answer from the AI. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Ask a Question</CardTitle>
          <CardDescription>
            Select a subject and ask your question to our AI assistant.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a subject to ask about" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {subjects.map((subject) => (
                          <SelectItem key={subject} value={subject}>
                            {subject}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="question"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Question</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., What is the theory of relativity?"
                        className="resize-none"
                        {...field}
                        rows={5}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Thinking..." : "Ask AI"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <div className="space-y-4">
        {isLoading && (
            <div className="space-y-4">
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-1/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                         <Skeleton className="h-6 w-1/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                    </CardContent>
                </Card>
            </div>
        )}
        
        {result ? (
          <div className="space-y-4">
            <Card className="bg-primary/10 border-primary/20">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="p-2 bg-primary/20 rounded-full">
                    <BookCheck className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Answer</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="leading-relaxed">{result.answer}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="p-2 bg-accent/20 rounded-full">
                    <Lightbulb className="h-6 w-6 text-accent-foreground" />
                </div>
                <div>
                  <CardTitle>Explanation</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="leading-relaxed whitespace-pre-wrap">{result.explanation}</p>
              </CardContent>
            </Card>
          </div>
        ) : !isLoading && (
            <Card className="flex items-center justify-center h-full min-h-[300px]">
                <div className="text-center text-muted-foreground p-8">
                    <Lightbulb className="mx-auto h-12 w-12 mb-4 text-primary/50" />
                    <p>Your AI-generated answer will appear here.</p>
                </div>
            </Card>
        )}
      </div>
    </div>
  );
}
