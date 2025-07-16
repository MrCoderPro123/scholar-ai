import { BookLocator } from "@/components/features/book-locator";

export default function BooksPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <div className="flex items-center">
        <h1 className="font-semibold text-lg md:text-2xl">Book Locator</h1>
      </div>
       <p className="text-muted-foreground">
        Find textbooks and other resources. Enter a subject to get a list of relevant books.
      </p>
      <BookLocator />
    </div>
  );
}
