"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.askQuestion = askQuestion;
const hf_1 = require("@langchain/community/llms/hf");
const output_parsers_1 = require("@langchain/core/output_parsers");
const runnables_1 = require("@langchain/core/runnables");
const prompts_1 = require("@langchain/core/prompts");
const documents_1 = require("@langchain/core/documents");
// Hugging Face LLM config
const model = new hf_1.HuggingFaceInference({
    apiKey: process.env.HUGGINGFACE_API_KEY,
    model: "HuggingFaceH4/zephyr-7b-beta", // or another model like "tiiuae/falcon-7b-instruct"
    maxTokens: 200,
});
// Prompt template
const prompt = prompts_1.ChatPromptTemplate.fromMessages([
    ["system", "Answer the question using the provided context."],
    ["human", "Context:\n{context}\n\nQuestion:\n{question}"],
]);
const formatInput = new runnables_1.RunnableLambda({
    func: async (input) => {
        return {
            context: input.documents.map((doc) => doc.pageContent).join("\n\n"),
            question: input.question,
        };
    },
});
const wrappedModel = new runnables_1.RunnableLambda({
    func: async (input) => {
        return await model.invoke(input);
    },
});
// Chain: context → prompt → model → parse
const chain = runnables_1.RunnableSequence.from([
    formatInput,
    prompt,
    wrappedModel,
    new output_parsers_1.StringOutputParser(),
]);
// Exported function
async function askQuestion(documentText, question) {
    try {
        const documents = [new documents_1.Document({ pageContent: documentText })];
        const result = await chain.invoke({ documents, question });
        return result;
    }
    catch (error) {
        console.error("Error in askQuestion:", error);
        throw new Error("Failed to get a response.");
    }
}
