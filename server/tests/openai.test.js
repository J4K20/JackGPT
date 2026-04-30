import { jest } from "@jest/globals";

const mockCreate = jest.fn();

await jest.unstable_mockModule("openai", () => ({
  default: jest.fn().mockImplementation(() => ({
    responses: {
      create: mockCreate,
    },
  })),
}));

const { callOpenAI } = await import("../openai.js");

describe("callOpenAI", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns output_text from OpenAI response", async () => {
    mockCreate.mockResolvedValue({ output_text: "Hello!" });
    const result = await callOpenAI("Say hello");
    expect(result).toBe("Hello!");
  });

  test("calls OpenAI with correct model and input", async () => {
    mockCreate.mockResolvedValue({ output_text: "Test response" });
    await callOpenAI("Test message");
    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        model: "gpt-4o-2024-11-20",
        input: "Test message",
        max_output_tokens: 20,
      }),
    );
  });

  test("throws if OpenAI call fails", async () => {
    mockCreate.mockRejectedValue(new Error("API error"));
    await expect(callOpenAI("Test")).rejects.toThrow("API error");
  });
});
