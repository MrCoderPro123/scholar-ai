"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { Card } from "../ui/card";

interface Subject {
    id: string;
    name: string;
    category: string;
    level: string;
}

const subjectCategories = ["Science", "Mathematics", "History", "Literature", "Arts", "Computer Science"];
const gradeLevels = ["Elementary", "Middle School", "High School", "Undergraduate", "Graduate"];


export function SubjectManager() {
    const [subjects, setSubjects] = useState<Subject[]>([
        { id: '1', name: 'Algebra II', category: 'Mathematics', level: 'High School'},
        { id: '2', name: 'World History', category: 'History', level: 'High School'},
        { id: '3', name: 'Introduction to Python', category: 'Computer Science', level: 'Undergraduate'},
    ]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newSubjectName, setNewSubjectName] = useState("");
    const [newSubjectCategory, setNewSubjectCategory] = useState("");
    const [newSubjectLevel, setNewSubjectLevel] = useState("");

    const handleAddSubject = () => {
        if (newSubjectName && newSubjectCategory && newSubjectLevel) {
            const newSubject: Subject = {
                id: Date.now().toString(),
                name: newSubjectName,
                category: newSubjectCategory,
                level: newSubjectLevel
            };
            setSubjects(prev => [...prev, newSubject]);
            setNewSubjectName("");
            setNewSubjectCategory("");
            setNewSubjectLevel("");
            setIsDialogOpen(false);
        }
    }

    const handleRemoveSubject = (id: string) => {
        setSubjects(prev => prev.filter(subject => subject.id !== id));
    }


  return (
    <Card>
        <div className="p-4 border-b">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Subject
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                <DialogTitle>Add a new subject</DialogTitle>
                <DialogDescription>
                    Fill in the details for your new subject.
                </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                        Name
                        </Label>
                        <Input id="name" value={newSubjectName} onChange={(e) => setNewSubjectName(e.target.value)} className="col-span-3" placeholder="e.g. Organic Chemistry" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="category" className="text-right">
                        Category
                        </Label>
                        <Select onValueChange={setNewSubjectCategory} value={newSubjectCategory}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                                {subjectCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="level" className="text-right">
                        Level
                        </Label>
                         <Select onValueChange={setNewSubjectLevel} value={newSubjectLevel}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select a level" />
                            </SelectTrigger>
                            <SelectContent>
                                {gradeLevels.map(lvl => <SelectItem key={lvl} value={lvl}>{lvl}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                <Button onClick={handleAddSubject}>Add Subject</Button>
                </DialogFooter>
            </DialogContent>
            </Dialog>
        </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Subject Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Level</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subjects.length > 0 ? (
            subjects.map((subject) => (
                <TableRow key={subject.id}>
                    <TableCell className="font-medium">{subject.name}</TableCell>
                    <TableCell>{subject.category}</TableCell>
                    <TableCell>{subject.level}</TableCell>
                    <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleRemoveSubject(subject.id)}>
                            <X className="h-4 w-4" />
                            <span className="sr-only">Remove</span>
                        </Button>
                    </TableCell>
                </TableRow>
            ))
          ) : (
            <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                    No subjects added yet.
                </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  );
}
