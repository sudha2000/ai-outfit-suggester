import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import dotenv from "dotenv";
import BedrockClientPkg from "@aws-sdk/client-bedrock-runtime";

const { BedrockRuntimeClient, InvokeModelCommand } = BedrockClientPkg;

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.static("public"));
app.use(bodyParser.json());

const bedrockClient = new BedrockRuntimeClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

app.post("/get-outfit", async (req, res) => {
  const { occasion, mood, location } = req.body;
  const weatherApiKey = process.env.WEATHER_API_KEY;

  try {
    // Fetch weather data
    const weatherRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${weatherApiKey}&units=metric`,
    );

    if (!weatherRes.ok) {
      return res.status(500).json({ error: "Weather API failed" });
    }

    const weatherData = await weatherRes.json();
    const temperature = weatherData.main.temp;

    // prompt for Claude
    const prompt = `\n\nHuman: Suggest an outfit for a woman going to a ${occasion} in ${location}, where the temperature is ${temperature}°C and she feels ${mood}. The style should fuse fashion and tech.\n\nAssistant:`;

    const params = {
      modelId: "anthropic.claude-instant-v1",
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({
        prompt,
        max_tokens_to_sample: 200,
        temperature: 0.7,
        stop_sequences: ["\n\nHuman:"],
      }),
    };

    const command = new InvokeModelCommand(params);
    const response = await bedrockClient.send(command);
    const responseBody = await response.body.transformToString();
    const completion = JSON.parse(responseBody).completion.trim();

    console.log("Claude Output:", completion);

    // Send text prompt to Stability AI for 10 images
    const stabilityResponse = await fetch(
      "https://api.stability.ai/v1/generation/stable-diffusion-v1-6/text-to-image",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          text_prompts: [{ text: completion }],
          cfg_scale: 7,
          height: 512,
          width: 512,
          samples: 10,
          steps: 30,
        }),
      },
    );

    if (!stabilityResponse.ok) {
      console.error("Stability API error:", await stabilityResponse.text());
      return res.status(500).json({ error: "Image generation failed" });
    }

    const imageJson = await stabilityResponse.json();

    const imageUrls = imageJson.artifacts.map(
      (artifact) => `data:image/png;base64,${artifact.base64}`,
    );

    // Create 5 e-commerce search URLs from the Claude suggestion
    const searchQuery = encodeURIComponent(completion);
    const productUrls = [
      `https://www.amazon.in/s?k=${searchQuery}`,
      `https://www.flipkart.com/search?q=${searchQuery}`,
      `https://www.myntra.com/${searchQuery}`,
      `https://www.ajio.com/search/?text=${searchQuery}`,
      `https://www.nykaafashion.com/search?searchQuery=${searchQuery}`,
    ];

    res.json({ suggestion: completion, imageUrls, productUrls });
  } catch (error) {
    console.error("Error in /get-outfit:", error);
    res.status(500).json({ error: "Something went wrong." });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
});
