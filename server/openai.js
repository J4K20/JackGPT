import OpenAI from "openai";

let client;

const getClient = () => {
  if (!client) {
    client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return client;
};

export async function callOpenAI(message) {
  const response = await getClient().responses.create({
    model: "gpt-4o-2024-11-20",
    input: message,
    max_output_tokens: 20,
  });
  return response.output_text;
}
