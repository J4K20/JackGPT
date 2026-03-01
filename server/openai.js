import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function callOpenAI(message) {
  const response = await client.responses.create({
    model: "gpt-4o-2024-11-20",
    input: message,
    max_output_tokens: 20,
  });

  return response.output_text;
}
