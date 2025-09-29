# 🎮 Poly2 - Retro Image Transformer

Transform your images with the distinct graphical style of classic, low-poly 3D video game consoles using Google's Gemini AI.

## ✨ Features

- **Image Upload**: Drag and drop or click to upload images (supports common formats)
- **Console Styles**: Choose from multiple retro console aesthetics:
  - PlayStation 1: Low-poly geometry with pixelated textures
  - Nintendo 64: Smooth shading with simple geometry
  - Sega Saturn: Flat shading with geometric shapes
  - Early 3D: Vertex wobble effects with limited colors
- **AI-Powered Transformation**: Leverages Google Gemini Vision API for intelligent style transfer
- **Demo Mode**: Built-in canvas filters for demonstration without API key
- **Download Results**: Save your transformed images as PNG files
- **Responsive Design**: Works on desktop and mobile devices

## 🚀 Quick Start

1. **Clone the repository**:
   ```bash
   git clone https://github.com/myrqyry/poly2.git
   cd poly2
   ```

2. **Open in browser**:
   ```bash
   # Serve locally (recommended)
   python -m http.server 8000
   # or
   npx serve .
   
   # Then open http://localhost:8000
   ```

3. **Start transforming**:
   - Upload an image by dragging and dropping or clicking the upload area
   - Select your preferred retro console style
   - Click "Transform Image" to generate the retro version
   - Download your result!

## 🔧 Configuration

### Google GenAI SDK Integration

The application now uses the official **Google GenAI JavaScript SDK** for true AI image generation and transformation:

**Key Features**:
- **Real AI Image Generation**: Uses Gemini 2.5 Flash Image Preview model for actual image generation
- **Intelligent Transformation**: AI understands your image and applies retro console styles
- **Seamless Integration**: Official SDK with proper error handling and fallback
- **User-Friendly Setup**: Simple API key configuration with persistent storage

**Setup Instructions**:

1. Get your free API key from [Google AI Studio](https://aistudio.google.com/apikey)
2. Open the application and enter your API key in the configuration section
3. Your key is securely stored locally for future use
4. Start transforming images with true AI power!

**How it works**:
- **Gemini 2.5 Flash Image Preview**: Analyzes your image and generates retro-styled versions
- **Console-Specific Prompts**: Detailed prompts for each retro console style
- **Intelligent Fallback**: Sophisticated canvas filters when AI is unavailable
- **Mode Indicators**: Clear feedback on whether you're using AI or demo mode

**Supported Models**:
- `gemini-2.5-flash-image-preview` for image transformation
- Automatic fallback to enhanced canvas filters

### Demo Mode

Without an API key, the app uses sophisticated canvas-based filters that simulate retro graphics effects with impressive visual results. Perfect for testing and demonstration.

## 🎨 Retro Styles

Each console style applies different visual transformations:

| Console | Effect Description |
|---------|------------------|
| **PlayStation 1** | Low-poly geometry, pixelated textures, limited color palette (32 colors per channel) |
| **Nintendo 64** | Smooth Gouraud shading, color banding, warmer tone shifts |
| **Sega Saturn** | Flat shading, geometric feel, very limited color palette, increased saturation |
| **Early 3D** | Vertex wobble simulation, heavy color reduction, random noise effects |

## 🛠️ Technical Details

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Image Processing**: Canvas API for client-side manipulation
- **AI Integration**: Google Gemini Pro Vision API
- **File Handling**: FileReader API for uploads, Blob URLs for downloads
- **No Backend Required**: Fully client-side application

## 📱 Browser Compatibility

- Modern browsers with Canvas API support
- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers supported

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-console-style`
3. Make your changes and test thoroughly
4. Commit changes: `git commit -m 'Add new console style'`
5. Push to branch: `git push origin feature/new-console-style`
6. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🔮 Future Enhancements

- [ ] More console styles (Dreamcast, 3DO, etc.)
- [ ] Batch processing for multiple images
- [ ] Advanced filter customization
- [ ] Social sharing integration
- [ ] Before/after comparison slider
- [ ] Custom style training

## 🙋‍♂️ Support

If you encounter issues or have questions:
1. Check the [Issues](https://github.com/myrqyry/poly2/issues) page
2. Create a new issue with detailed information
3. Include browser version and console errors if applicable

---

Made with ❤️ for retro gaming enthusiasts