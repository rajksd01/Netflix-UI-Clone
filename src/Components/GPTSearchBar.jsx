import { useSelector } from "react-redux";
import LANG from "../utils/LanguageConstants";
import { useRef } from "react";
import openai from "../utils/openai";
import dotenv from "dotenv/config";

function GPTSearchBar() {
  const env = dotenv.config();
  const searchText = useRef(null);
  const language = useSelector((store) => store.config.lang);
  const handleFormSubmit = (e) => {
    e.preventDefault();
  };
  const onButtonClick = async () => {
    const Geminiquery =
      "Act as a movie recommendation system and give some best movies for the query:" +
      searchText.current.value +
      ". Give me only 5 movies ,comma separated like the example result given ahead.Example Result: Gadar2, Sholay, Raaj, The Eliminator, Intestellar";
    const gptResults = await openai.chat.completions.create({
      messages: [{ role: "user", content: Geminiquery }],
      model: "gpt-3.5-turbo",
    });
    console.log(gptResults.choices);
  };

  return (
    <>
      <div className="pt-[12%] flex justify-center relative">
        <form
          className="w-1/2  p-3 bg-black text-black grid grid-cols-12 rounded-lg   "
          onSubmit={handleFormSubmit}
        >
          <input
            ref={searchText}
            type="text"
            className=" col-span-9  px-5  rounded-lg"
            placeholder={LANG[language].gptSearchPlaceholder}
          />
          <button
            className="bg-red-600 mx-3 py-2  rounded-lg col-span-3 text-2xl "
            onClick={onButtonClick}
          >
            {" "}
            {LANG[language].search}
          </button>
        </form>
      </div>
    </>
  );
}

// GEMINI code

// node --version # Should be >= 18
// npm install @google/generative-ai

import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

const MODEL_NAME = process.env.MODEL_NAME;
const API_KEY = process.env.API_KEY;

async function runChat() {
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const generationConfig = {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 2048,
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ];

  const chat = model.startChat({
    generationConfig,
    safetySettings,
    history: [],
  });

  const result = await chat.sendMessage("YOUR_USER_INPUT");
  const response = result.response;
  console.log(response.text());
}

runChat();

export default GPTSearchBar;
