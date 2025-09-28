# Poly2 Configuration

## Google Gemini API Setup

To enable AI-enhanced image transformations, you'll need to configure the Google Gemini API:

**Important**: Gemini API provides image analysis and intelligent descriptions rather than direct image generation. The integration works by having Gemini analyze your image and provide detailed transformation guidance that enhances the canvas-based filters.

Reference: https://ai.google.dev/gemini-api/docs/image-generation

1. Get a Gemini API key from Google AI Studio
2. Set the API key in the `script.js` file or use environment variables
3. Ensure your API key has access to the Gemini Pro Vision model

### Environment Variables (recommended)
```bash
export GEMINI_API_KEY="your-api-key-here"
```

### Direct Configuration
Update the `GEMINI_CONFIG` object in `script.js`:
```javascript
const GEMINI_CONFIG = {
    apiKey: 'your-api-key-here',
    model: 'gemini-pro-vision',
    imageGenerationUrl: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent'
};
```

## How Gemini Integration Works

1. **Image Analysis**: Gemini analyzes the uploaded image and understands its content
2. **Style Consultation**: AI provides detailed instructions for retro console transformation
3. **Enhanced Filtering**: Canvas-based filters apply transformations using AI insights
4. **Fallback Mode**: If Gemini is unavailable, sophisticated demo filters are used

## True AI Image Generation

For actual AI image generation (not just analysis), consider integrating with:

- **OpenAI DALL-E API**: `https://api.openai.com/v1/images/generations`
- **Stability AI**: Stable Diffusion models
- **Midjourney API**: (when available)

## Console Style Descriptions

The app supports these retro console styles:

- **PlayStation 1**: Low-poly geometry, pixelated textures, limited color palette
- **Nintendo 64**: Smooth Gouraud shading, simple geometry, color banding
- **Sega Saturn**: Flat shading, geometric shapes, limited texture resolution
- **Early 3D**: Vertex wobble effects, limited color depth, angular geometry

## Demo Mode

Without a Gemini API key, the app runs in demo mode using enhanced canvas-based filters that simulate retro graphics effects. This provides a working demonstration of the interface and transformation capabilities with impressive visual results.

## File Structure

```
poly2/
├── index.html      # Main HTML structure
├── style.css       # Retro-themed styling
├── script.js       # Application logic and API integration
├── config.md       # This configuration guide
└── README.md       # Project documentation
```