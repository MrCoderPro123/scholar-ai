import { SubjectManager } from "@/components/features/subject-manager";

export default function SubjectsPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <div className="flex items-center">
        <h1 className="font-semibold text-lg md:text-2xl">My Subjects</h1>
      </div>
       <p className="text-muted-foreground">
        Add and manage your subjects to personalize your learning experience.
      </p>
      <SubjectManager />
    </div>
  );
}
