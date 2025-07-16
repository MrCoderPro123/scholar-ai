"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { findBooks } from "@/app/actions";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import type { IntelligentBookSearchOutput } from "@/ai/flows/intelligent-book-search";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Search } from "lucide-react";

const FormSchema = z.object({
  subject: z.string().min(2, {
    message: "Subject must be at least 2 characters.",
  }),
});

type Book = IntelligentBookSearchOutput["books"][0];

function BookCard({ book }: { book: Book }) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <Card className="flex flex-col">
        <CardHeader>
          <div className="relative aspect-[3/4] w-full mb-4">
            <Image
              src={book.coverImageUrl || 'https://placehold.co/300x400.png'}
              alt={`Cover of ${book.title}`}
              fill
              className="rounded-md object-cover"
              data-ai-hint="book cover"
            />
          </div>
          <CardTitle className="text-lg">{book.title}</CardTitle>
          <CardDescription>{book.author}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-sm text-muted-foreground line-clamp-3">{book.description}</p>
        </CardContent>
        <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
                <a href={book.url} target="_blank" rel="noopener noreferrer">View Book</a>
            </Button>
            <DialogTrigger asChild>
                <Button>
                    <Search className="mr-2" />
                    Search Inside
                </Button>
            </DialogTrigger>
        </CardFooter>
      </Card>
      <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Search in &quot;{book.title}&quot;</DialogTitle>
            <DialogDescription>
              Enter a keyword to search for answers within this book.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input id="keyword" placeholder="e.g., Photosynthesis" />
          </div>
          <Button onClick={() => setIsDialogOpen(false)}>Search</Button>
      </DialogContent>
    </Dialog>
  );
}


export function BookLocator() {
  const [books, setBooks] = useState<IntelligentBookSearchOutput["books"]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      subject: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);
    setBooks([]);
    try {
      const result = await findBooks({ subject: data.subject });
      setBooks(result.books);
    } catch (error) {
      console.error("Failed to find books:", error);
      toast({
        title: "Error",
        description: "Could not fetch book recommendations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Quantum Physics" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Searching..." : "Find Books"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="aspect-[3/4] w-full mb-4 rounded-md" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full mt-2" />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Skeleton className="h-10 w-20" />
                <Skeleton className="h-10 w-32" />
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {!isLoading && books.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {books.map((book) => (
            <BookCard key={book.title} book={book} />
          ))}
        </div>
      )}

      {!isLoading && books.length === 0 && !form.formState.isSubmitted && (
         <div className="text-center text-muted-foreground py-12">
            <p>Enter a subject above to discover new books.</p>
        </div>
      )}
    </div>
  );
}
