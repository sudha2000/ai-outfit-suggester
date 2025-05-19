# AI-Based Outfit Suggestion Web App 👗🤖

This project is a full-stack web application that leverages generative AI and real-time weather data to suggest fashion outfits personalized to the user's occasion, mood, and location.

## Features
- **Responsive Frontend:** Built with HTML, CSS, and JavaScript, providing a simple form interface and dynamic presentation of outfit images and shopping links.
- **Real-Time Weather Integration:** Fetches temperature data from OpenWeather API to tailor outfit suggestions based on climate.
- **Generative AI Backend:**  
  - Uses AWS Bedrock's Anthropic Claude model for generating stylish, tech-infused outfit descriptions.  
  - Calls Stability AI's API to create multiple outfit images from the text description.  
- **Shopping Convenience:** Generates e-commerce search URLs (Amazon, Flipkart, Myntra, Ajio, Nykaa Fashion) based on AI suggestions to help users find and buy suggested outfits easily.
- **Modular & Secure:** Utilizes environment variables to securely manage API credentials.

## Tech Stack
- Frontend: HTML5, CSS3, JavaScript  
- Backend: Node.js, Express.js  
- External APIs: OpenWeather, AWS Bedrock (Anthropic Claude), Stability AI  
- Environment: dotenv for configuration

## How It Works
1. User inputs occasion, mood, and location in the frontend form.  
2. Backend fetches weather data for the location.  
3. Backend crafts a prompt using this data and sends it to Claude via AWS Bedrock.  
4. The AI returns a detailed outfit suggestion.  
5. Backend requests 10 outfit images from Stability AI based on the AI text.  
6. Backend sends outfit text, images, and e-commerce links back to the frontend.  
7. Frontend dynamically displays the results for the user to browse.

## Usage
- Run `npm install` to install dependencies.  
- Configure environment variables in `.env` for AWS credentials, OpenWeather API key, and Stability AI key.  
- Start the server with `node server.js`.  
- Open `http://localhost:5000` to use the app.

## Future Work
- Add user authentication and saved outfit collections.  
- Enhance image generation options and styles.  
- Integrate additional AI models for varied fashion advice.  
- Add real-time weather updates and seasonal trends.

## Repository
https://github.com/sudha2000/ai-outfit-suggester/
