
const fs = require("fs");
const express = require("express");
const cors = require("cors");

const path = require("path");
const OpenAI = require("openai");
const { request } = require("http");

const openaiApiKey = "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";

if (!openaiApiKey) {
  throw new Error(
    "The OPENAI_API_KEY environment variable is missing or empty."
  );
}

const app = express();
app.use(express.json());
app.use(cors());

const openai = new OpenAI({ apiKey: openaiApiKey });

app.post("/generate-speech", async (req, res) => {
  const { text } = req.body;

  try {
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: "nova",
      input: text,
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());

    // Save the audio file in the public folder of your frontend
    const speechFile = path.resolve("../client/public/audio.mp3");
    await fs.promises.writeFile(speechFile, buffer);

    // Serve the audio file from your backend
    res.send({ audioUrl: "/audio.mp3" }); // Send the URL of the audio file
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("An error occurred");
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
