import { jest } from "@jest/globals";
import request from "supertest";
import express from "express";
import cors from "cors";

const mockCreate = jest.fn();

await jest.unstable_mockModule("openai", () => ({
  default: jest.fn().mockImplementation(() => ({
    responses: {
      create: mockCreate,
    },
  })),
}));

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/chat", async (req, res) => {
  try {
    const messages = req.body.messages;
    const result = await mockCreate({
      model: "gpt-4.1",
      input: messages,
      max_output_tokens: 20,
    });
    res.json({ text: result.output_text });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

describe("POST /api/chat", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns 200 and text on valid request", async () => {
    mockCreate.mockResolvedValue({ output_text: "Hello from GPT" });
    const res = await request(app)
      .post("/api/chat")
      .send({ messages: [{ role: "user", content: "Hi" }] });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("text", "Hello from GPT");
  });

  test("passes messages to OpenAI", async () => {
    mockCreate.mockResolvedValue({ output_text: "response" });
    const messages = [{ role: "user", content: "What is 2+2?" }];
    await request(app).post("/api/chat").send({ messages });
    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({ input: messages }),
    );
  });

  test("returns 500 if OpenAI throws", async () => {
    mockCreate.mockRejectedValue(new Error("OpenAI error"));
    const res = await request(app)
      .post("/api/chat")
      .send({ messages: [{ role: "user", content: "Hi" }] });
    expect(res.status).toBe(500);
  });
});
