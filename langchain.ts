import { HuggingFaceInference } from "langchain/llms/hf";

const model = new HuggingFaceInference({
  apiKey: process.env.HUGGINGFACE_API_KEY,
  model: "google/flan-t5-base",
});

export const askQuestion = async (context: string, question: string) => {
  const prompt = `Context:\n${context}\n\nQuestion:\n${question}\n\nAnswer:`;
  const res = await model.invoke(prompt);
  return res;
};
