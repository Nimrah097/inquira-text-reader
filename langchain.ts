import { ChatOpenAI } from "langchain/chat_models/openai";
import { HumanMessage } from "langchain/schema";

import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import * as dotenv from "dotenv";

// Load .env variables
dotenv.config();

export const askQuestion = async (
  documentText: string,
  question: string,
): Promise<string> => {
  const model = new ChatOpenAI({
    temperature: 0.7,
    openAIApiKey: process.env.OPENAI_API_KEY, // Use env variable here
  });

  // Example prompt logic (adjust based on your chain setup)
  const prompt = `Based on the following text: "${documentText}", answer: ${question}`;
  const res = await model.call([new HumanMessage(prompt)]);
  return res.text ?? "No answer found";
};
