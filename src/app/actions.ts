
"use server";

import { answerQuestion, AiStudyAssistantInput } from "@/ai/flows/ai-study-assistant";
import { intelligentBookSearch, IntelligentBookSearchInput } from "@/ai/flows/intelligent-book-search";

export async function askAi(input: AiStudyAssistantInput) {
    return await answerQuestion(input);
}

export async function findBooks(input: IntelligentBookSearchInput) {
    return await intelligentBookSearch(input);
}
