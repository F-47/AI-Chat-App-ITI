import React, { useState, useCallback } from "react";
import { ResponseType } from "./types";
import { generateContent } from "./services/contentService";
import { LoadingSpinner } from "./components/icons";

function App() {
  const [prompt, setPrompt] = useState<string>("");
  const [responseType, setResponseType] = useState<ResponseType>("text");
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) {
      setError("⚠️ Please enter a prompt first.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setResponse(null);

    try {
      const result = await generateContent(prompt, responseType);
      setResponse(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  }, [prompt, responseType]);

  const ResponseDisplay: React.FC = () => {
    if (isLoading) return <LoadingSpinner />;
    if (error) return <p className="text-red-500 text-center">{error}</p>;
    if (response) {
      return responseType === "text" ? (
        <p className="whitespace-pre-wrap text-gray-800 leading-relaxed">
          {response}
        </p>
      ) : (
        <img
          src={response}
          alt="Generated content"
          className="rounded-lg max-w-full h-auto shadow-md border border-gray-200"
        />
      );
    }
    return (
      <p className="text-gray-400 text-center">
        Your generated result will appear here.
      </p>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col items-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900">
            AI Content Generator
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            Generate text or images instantly with AI.
          </p>
        </header>

        {/* Input Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 space-y-6">
          <div className="space-y-2">
            <label htmlFor="prompt" className="font-medium text-gray-700">
              Enter Prompt
            </label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., A serene forest with misty mountains"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none text-gray-900"
              rows={4}
              disabled={isLoading}
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            {/* Type Selector */}
            <div className="flex space-x-2">
              <button
                onClick={() => setResponseType("text")}
                disabled={isLoading}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  responseType === "text"
                    ? "bg-indigo-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Text
              </button>
              <button
                onClick={() => setResponseType("image")}
                disabled={isLoading}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  responseType === "image"
                    ? "bg-indigo-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Image
              </button>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className="w-full sm:w-auto bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-300 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-all"
            >
              {isLoading ? "Generating..." : "Generate"}
            </button>
          </div>
        </div>

        {/* Output */}
        <div className="mt-8 bg-white rounded-xl shadow-lg border border-gray-200 p-6 min-h-[250px] flex items-center justify-center">
          <ResponseDisplay />
        </div>
      </div>
    </div>
  );
}

export default App;
