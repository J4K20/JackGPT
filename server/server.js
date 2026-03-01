import "dotenv/config";
import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(cors());
app.use(express.json());

app.post("/api/chat", async (req, res) => {
  const messages = req.body.messages;
  const result = await client.responses.create({
    model: "gpt-4.1",
    input: messages,
    max_output_tokens: 20,
  });
  res.json({ text: result.output_text });
});

app.listen(3001, () => {
  console.log("Server running on 3001");
});
