import dotenv from "dotenv";
dotenv.config();

import { HuggingFaceInference } from "langchain/llms/hf";
import { PromptTemplate } from "langchain/prompts";
import { LLMChain } from "langchain/chains";

export async function askQuestion(
  documentText: string,
  question: string,
): Promise<string> {
  const model = new HuggingFaceInference({
    apiKey: process.env.HUGGINGFACE_API_KEY, // token from Secrets
    model: "tiiuae/falcon-7b-instruct", // or another model you prefer
  });

  const prompt = new PromptTemplate({
    template: `Answer the question based on the following text:\n\n{context}\n\nQuestion: {question}\nAnswer:`,
    inputVariables: ["context", "question"],
  });

  const chain = new LLMChain({
    llm: model,
    prompt,
  });

  const response = await chain.call({
    context: documentText,
    question: question,
  });

  return response.text.trim();
}
