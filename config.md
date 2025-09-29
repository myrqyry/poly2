# Poly2 Configuration

## Google GenAI SDK Integration

Poly2 now uses the official **Google GenAI JavaScript SDK** for true AI image generation and transformation.

**Reference**: Based on the official Google GenAI codegen instructions:
- https://github.com/googleapis/js-genai/blob/main/codegen_instructions.md
- https://raw.githubusercontent.com/googleapis/js-genai/refs/heads/main/codegen_instructions.md

## Setup Instructions

### 1. Get Your API Key
Get a free Google AI API key from [Google AI Studio](https://aistudio.google.com/apikey)

### 2. Configure the Application
- Open the Poly2 application in your browser
- Enter your API key in the configuration section at the top
- Click "Save Key" to store it securely in your browser
- The app will switch to "AI Generation" mode automatically

### 3. Start Creating!
Upload an image, select a retro console style, and experience true AI-powered transformations.

## How It Works

### AI Image Generation Pipeline
```javascript
// The app uses the official Google GenAI SDK
import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({ apiKey: yourApiKey });

// Generate retro-styled images using Gemini 2.5 Flash
const response = await genAI.models.generateContent({
    model: 'gemini-2.5-flash-image-preview',
    contents: [imagePart, consoleStylePrompt],
});
```

### Console Style Prompts

The application uses detailed, console-specific prompts optimized for the Gemini model:

- **PlayStation 1**: "Transform this image into early PlayStation 1 graphics style with low-poly geometry, pixelated textures, limited color palette (16-bit colors), sharp angular surfaces..."

- **Nintendo 64**: "Transform this image to mimic Nintendo 64 graphics with smooth Gouraud shading, simple geometry, color banding, bilinear texture filtering..."

- **Sega Saturn**: "Transform this image to look like Sega Saturn graphics with flat shading, geometric shapes, limited texture resolution, sharp polygon edges..."

- **Early 3D**: "Transform this image to emulate early 3D console graphics with vertex wobble effects, limited color depth, angular geometry, texture warping..."

## Features

### 🤖 True AI Image Generation
- Uses Gemini 2.5 Flash Image Preview model
- Generates actual retro-styled images (not just filters)
- Understands context and applies appropriate transformations

### 💾 Persistent Configuration  
- API keys stored securely in browser localStorage
- Automatic detection of AI vs Demo mode
- Visual indicators for current mode

### 🔄 Intelligent Fallback
- Sophisticated canvas-based filters when AI unavailable
- Seamless switching between AI and demo modes
- Enhanced error handling and user feedback

### 📱 Modern Implementation
- ES6 modules with proper imports
- Official Google GenAI SDK integration
- No manual API calls or complex configurations

## Troubleshooting

### API Key Issues
- Ensure your API key is valid and has access to Gemini models
- Check the browser console for detailed error messages
- Try removing and re-entering your API key

### Generation Failures
- The app automatically falls back to demo filters if AI fails
- Demo mode provides sophisticated retro effects as backup
- Network issues may cause temporary AI unavailability

## Security Notes

- API keys are stored only in your browser's localStorage
- Keys are never transmitted to external servers (except Google's official API)
- You can remove stored keys anytime by clearing the input and clicking "Save Key"

## File Structure

```
poly2/
├── index.html      # Main HTML with ES6 module support
├── style.css       # Enhanced styling with API config UI
├── script.js       # Google GenAI SDK integration
├── config.md       # This configuration guide
└── README.md       # Project documentation
```

## Advanced Usage

### Custom Prompts
You can modify the console prompts in the `buildConsolePrompt()` method to create custom retro styles or adjust the transformation intensity.

### Additional Models
The Google GenAI SDK supports multiple models. You can experiment with different Gemini models by modifying the model parameter in the `generateWithAI()` method.

### Batch Processing
The current implementation processes one image at a time, but the architecture supports extending to batch processing multiple images with different console styles.