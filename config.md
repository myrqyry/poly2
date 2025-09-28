# Poly2 Configuration

## Google Gemini API Setup

To enable AI-powered image transformations, you'll need to configure the Google Gemini API:

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
    apiUrl: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent'
};
```

## Console Style Descriptions

The app supports these retro console styles:

- **PlayStation 1**: Low-poly geometry, pixelated textures, limited color palette
- **Nintendo 64**: Smooth Gouraud shading, simple geometry, color banding
- **Sega Saturn**: Flat shading, geometric shapes, limited texture resolution
- **Early 3D**: Vertex wobble effects, limited color depth, angular geometry

## Demo Mode

Without a Gemini API key, the app runs in demo mode using canvas-based filters that simulate retro graphics effects. This provides a working demonstration of the interface and basic transformation capabilities.

## File Structure

```
poly2/
├── index.html      # Main HTML structure
├── style.css       # Retro-themed styling
├── script.js       # Application logic and API integration
├── config.md       # This configuration guide
└── README.md       # Project documentation
```