import { HuggingFaceInference } from "@langchain/community/llms/hf";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence, RunnableLambda } from "@langchain/core/runnables";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { Document } from "@langchain/core/documents";

// Hugging Face LLM config
const model = new HuggingFaceInference({
  apiKey: process.env.HUGGINGFACE_API_KEY,
  model: "HuggingFaceH4/zephyr-7b-beta", // or another model like "tiiuae/falcon-7b-instruct"
  maxTokens: 200,
});

// Prompt template
const prompt = ChatPromptTemplate.fromMessages([
  ["system", "Answer the question using the provided context."],
  ["human", "Context:\n{context}\n\nQuestion:\n{question}"],
]);

const formatInput = new RunnableLambda({
  func: async (input: { documents: Document[]; question: string }) => {
    return {
      context: input.documents.map((doc) => doc.pageContent).join("\n\n"),
      question: input.question,
    };
  },
});

const wrappedModel = new RunnableLambda({
  func: async (input: string) => {
    return await model.invoke(input);
  },
});

// Chain: context → prompt → model → parse
const chain = RunnableSequence.from([
  formatInput,
  prompt,
  wrappedModel,
  new StringOutputParser(),
]);

// Exported function
export async function askQuestion(
  documentText: string,
  question: string,
): Promise<string> {
  try {
    const documents = [new Document({ pageContent: documentText })];
    const result = await chain.invoke({ documents, question });
    return result;
  } catch (error) {
    console.error("Error in askQuestion:", error);
    throw new Error("Failed to get a response.");
  }
}
