import { useState, KeyboardEvent } from "react";
import { motion } from "framer-motion";
import { handleCopy } from "@/lib/helpers/copy";
import { useToast } from "@/components/ui/use-toast";
import Input from "./Input";
import GenerateButton from "./GenerateButton";
import ResponseButtons from "./ResponseButtons";

const ChatPage = () => {
	const [input, setInput] = useState("");
	const [submitted, setSubmitted] = useState(false);
	const [response, setResponse] = useState<string[]>([]);
	const [loading, setLoading] = useState(false);
	const { toast } = useToast();

	const onSubmit = async () => {
		if (input.trim().length === 0) return;
		setSubmitted(true);
		setLoading(true);

		try {
			const response = await fetch("/api/generateWriting", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ prompt: input }),
			});

			if (!response.ok) {
				throw new Error("Failed to generate writing");
			}

			const data = await response.json();
			setResponse(data.generatedText);
		} catch (error) {
			console.error("Error generating writing:", error);
			setResponse(["An error occurred while generating the text."]);
		} finally {
			setLoading(false);
		}
	};

	const onRewrite = async () => {
		setResponse([]);
		onSubmit();
	};

	const onContinue = async () => {
		// continue generation
	};

	// handle ⌘ + Enter
	const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
		if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
			// if not submitted, submit input to start generation
			if (!submitted) {
				e.preventDefault();
				onSubmit();
			} else {
				e.preventDefault();
				onContinue();
			}
		}
	};

	const handleCancel = () => {
		setResponse([]);
		setSubmitted(false);
	};

	return (
		<div className={`flex-grow vertical mx-5 sm:mx-auto sm:w-4/5 md:w-2/3  bg-white bg-opacity-75 ${!submitted && "hover:bg-opacity-100"} transition-all rounded-t-2xl overflow-hidden`}>
			<div className={`flex-grow vertical px-8 py-8 sm:px-14 sm:py-12 overflow-auto ${!submitted ? "justify-between gap-5" : "gap-10"}`}>
				<Input disabled={submitted} setInput={setInput} handleKeyDown={handleKeyDown} />
				{!submitted && <GenerateButton text="Start writing" onClick={onSubmit} />}
				{loading && <p>Generating...</p>}
				{submitted && !loading && response && (
					<>
						{response.map((paragraph, index) => (
							<p key={index} className="sm:text-lg md:text-xl text-black -mb-3">
								{paragraph}
							</p>
						))}
						<ResponseButtons handleCancel={handleCancel} onRewrite={onRewrite} onCopy={() => handleCopy({ text: response.join("\n\n"), toast })} onContinue={onContinue} />
					</>
				)}
			</div>
		</div>
	);
};

export default ChatPage;
