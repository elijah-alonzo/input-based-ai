// ==================Article Generation Logic================== //

import Groq from "groq-sdk";
import fs from "fs/promises";
import path from "path";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

export type ProjectFields = {
  projectTitle: string;
  projectDate: string;
  club: string;
  projectCategory: string;
  areaOfFocus: string;
};

export type Project = {
  id: string;
  timestamp: string;
  fields: ProjectFields;
  generated_article: string;
};

export async function generateArticle(fields: ProjectFields): Promise<string> {
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a professional article writer specializing in community project documentation. Generate a complete, well-structured article based on the provided project information.

Article Structure Required:
1. **Introduction** - Opening paragraph introducing the project and its significance

Writing Style:
- Professional and objective tone
- Clear, engaging paragraphs
- No bullet points or lists
- Remove section headers and the subheading, just write the article content
- Focus on community impact and project significance
- Use the provided project details as the foundation

Generate a complete article (100 words) with proper paragraph structure.`,
        },
        {
          role: "user",
          content: `Generate a complete article for this community project:
          
Date: ${fields.projectDate}
Organized by: ${fields.club}
Project Category: ${fields.projectCategory}
Area of Focus: ${fields.areaOfFocus}

Create a comprehensive article with title, introduction, body paragraphs, and conclusion.`,
        },
      ],
      model: "llama-3.1-8b-instant",
      temperature: 0.7,
      max_tokens: 1000,
    });

    const article =
      completion.choices[0]?.message?.content || "Unable to generate article.";
    return article;
  } catch (error: any) {
    console.error("Groq API error:", error);

    // Provide specific error messages based on the error type
    if (error.status === 403) {
      throw new Error(
        "Access denied to Groq API. Please check your API key or network settings.",
      );
    } else if (error.status === 401) {
      throw new Error(
        "Invalid Groq API key. Please check your API key configuration.",
      );
    } else if (error.status === 429) {
      throw new Error("Rate limit exceeded. Please try again in a moment.");
    } else if (error.status >= 500) {
      throw new Error(
        "Groq API service is temporarily unavailable. Please try again later.",
      );
    } else {
      throw new Error(
        `Failed to generate article: ${error.message || "Unknown error"}`,
      );
    }
  }
}

export async function saveProject(
  fields: ProjectFields,
  article: string,
): Promise<void> {
  const dataPath = path.join(process.cwd(), "data", "data.json");

  const project: Project = {
    id: `project-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
    fields,
    generated_article: article,
  };

  try {
    let projects: Project[] = [];

    try {
      const fileContent = await fs.readFile(dataPath, "utf-8");
      const data = JSON.parse(fileContent);
      projects = data.projects || [];
    } catch {
      // File doesn't exist or is invalid, start with empty array
    }

    projects.push(project);

    await fs.writeFile(dataPath, JSON.stringify({ projects }, null, 2));
  } catch (error) {
    console.error("Error saving project:", error);
    throw error;
  }
}
