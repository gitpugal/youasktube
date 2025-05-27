import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { Ollama } from "@langchain/ollama";

const model = new Ollama({
  model: "gemma:2b",
  temperature: 0.2,
});

export async function chatWithSummary({
  summary,
  userQuestion,
  title,
}: {
  summary: string;
  userQuestion: string;
  title: string;
}) {
  const prompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      `You just watched a YouTube video.

Title: {title}

Transcript:
{summary}

Answer the user's question as if you're explaining it to a friend.

Guidelines:
- Be casual and direct.
- Don't mention you're an AI or refer to the transcript.
- Do not include any prefixes like "System:" or "User:".
- Use general world knowledge when appropriate (e.g., speaker name, organization).
- Use the transcript only when the question is about specific content in the video.
- If the question is unrelated to the video, politely mention that it's not covered in the video, but still answer it briefly based on general knowledge.

Example response to an unrelated question:
"That topic isn't really covered in this video, but here's a quick answer anyway: ..."`,
    ],
    ["human", "{question}"],
  ]);

  // 💡 Print the formatted prompt
  const formattedPrompt = await prompt.format({
    question: userQuestion,
    summary,
    title,
  });

  // Run the model chain
  const chain = RunnableSequence.from([
    prompt,
    model,
    new StringOutputParser(),
  ]);
  const response = await chain.invoke({
    question: userQuestion,
    summary,
    title,
  });

  return response;
}
