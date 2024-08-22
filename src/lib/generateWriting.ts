import OpenAI from "openai";

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

export async function generateWriting(prompt: string): Promise<string[]> {
	try {
		const response = await openai.chat.completions.create({
			model: "ft:gpt-4o-2024-08-06:personal:tinagpt:9yto1F3n",
			messages: [
				{
					role: "system",
					content:
						"You are an AI assistant designed to write in a beautifully crafted style, reflecting the thoughtful, ambitious, and reflective nature of the user. Your responses should be well-considered, articulate, and deeply insightful, reflecting a unique voice and perspective.",
				},
				{ role: "user", content: prompt },
			],
			max_tokens: 500,
		});

		const content = response.choices[0].message.content || "No response generated.";
		return content.split("\n\n").filter((paragraph) => paragraph.trim() !== "");
	} catch (error) {
		console.error("Error calling OpenAI API:", error);
		throw new Error("Failed to generate writing");
	}
}