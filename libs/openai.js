// openai.js
import OpenAI from "openai";

export const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const response = await openai.responses.create({
    model: "gpt-4.1",
    input: "Hello from router",
});

res.json(response.output[0].content[0].text);
