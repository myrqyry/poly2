// Poly2 - Retro Image Transformer with Google GenAI Integration
// Based on Google GenAI JavaScript SDK patterns and "nano banana" example

class GoogleGenAI {
    constructor({ apiKey }) {
        this.apiKey = apiKey;
        this.baseURL = 'https://generativelanguage.googleapis.com/v1beta';
        this.models = {
            generateContent: this.generateContent.bind(this)
        };
    }

    async generateContent({ model, contents }) {
        const url = `${this.baseURL}/models/${model}:generateContent`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-goog-api-key': this.apiKey
            },
            body: JSON.stringify({
                contents: contents,
                generationConfig: {
                    temperature: 0.4,
                    candidateCount: 1,
                    maxOutputTokens: 2048
                }
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`Gemini API error: ${response.status} ${response.statusText}${errorData.error ? ` - ${errorData.error.message}` : ''}`);
        }

        const data = await response.json();
        return { response: data };
    }
}

class Poly2App {
    constructor() {
        this.currentImage = null;
        this.currentImageFile = null;
        this.selectedConsole = 'playstation1';
        this.genAI = null;
        this.apiKey = localStorage.getItem('poly2_api_key') || '';
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateTransformButton();
        this.initializeAPI();
    }

    initializeAPI() {
        if (this.apiKey) {
            try {
                this.genAI = new GoogleGenAI({ apiKey: this.apiKey });
                this.updateConfigStatus('API key configured ✓', 'success');
                this.updateTransformMode('AI');
                document.getElementById('apiKeyInput').value = '••••••••••••';
            } catch (error) {
                console.error('Error initializing GenAI:', error);
                this.updateConfigStatus('Invalid API key', 'error');
                this.updateTransformMode('Demo');
            }
        } else {
            this.updateConfigStatus('Enter API key for AI transformations', '');
            this.updateTransformMode('Demo');
        }
    }

    updateConfigStatus(message, type) {
        const status = document.getElementById('configStatus');
        status.textContent = message;
        status.className = `config-status ${type}`;
    }

    updateTransformMode(mode) {
        const modeElement = document.getElementById('transformMode');
        modeElement.textContent = mode === 'AI' ? 'Mode: AI Generation' : 'Mode: Demo Filters';
        modeElement.className = `transform-mode ${mode.toLowerCase()}`;
    }

    bindEvents() {
        // API Configuration
        document.getElementById('saveApiKey').addEventListener('click', () => {
            const apiKeyInput = document.getElementById('apiKeyInput');
            const newApiKey = apiKeyInput.value.trim();
            
            if (newApiKey && !newApiKey.includes('•')) {
                this.apiKey = newApiKey;
                localStorage.setItem('poly2_api_key', newApiKey);
                this.initializeAPI();
                this.showStatus('API key saved successfully!', 'success');
            } else if (!newApiKey) {
                this.apiKey = '';
                localStorage.removeItem('poly2_api_key');
                this.genAI = null;
                this.updateConfigStatus('API key removed', '');
                this.updateTransformMode('Demo');
                apiKeyInput.value = '';
                this.showStatus('API key removed', 'info');
            }
        });

        // File input handling
        const imageInput = document.getElementById('imageInput');
        const uploadArea = document.getElementById('uploadArea');
        const changeImageBtn = document.getElementById('changeImage');
        
        imageInput.addEventListener('change', (e) => this.handleFileSelect(e.target.files[0]));
        uploadArea.addEventListener('click', () => imageInput.click());
        changeImageBtn.addEventListener('click', () => this.resetUpload());

        // Drag and drop
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            this.handleFileSelect(e.dataTransfer.files[0]);
        });

        // Console selection
        const consoleInputs = document.querySelectorAll('input[name="console"]');
        consoleInputs.forEach(input => {
            input.addEventListener('change', (e) => {
                this.selectedConsole = e.target.value;
            });
        });

        // Transform button
        document.getElementById('transformBtn').addEventListener('click', () => {
            this.transformImage();
        });

        // Result actions
        document.getElementById('downloadBtn').addEventListener('click', () => {
            this.downloadResult();
        });

        document.getElementById('newTransformBtn').addEventListener('click', () => {
            this.showControlsSection();
        });
    }

    handleFileSelect(file) {
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            this.showStatus('Please select a valid image file.', 'error');
            return;
        }

        // Check file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            this.showStatus('Image file too large. Please select a file under 10MB.', 'error');
            return;
        }

        this.currentImageFile = file;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            this.currentImage = e.target.result;
            this.showImagePreview(e.target.result);
            this.updateTransformButton();
        };
        reader.readAsDataURL(file);
    }

    showImagePreview(imageSrc) {
        const uploadArea = document.getElementById('uploadArea');
        const imagePreview = document.getElementById('imagePreview');
        const previewImg = document.getElementById('previewImg');

        uploadArea.style.display = 'none';
        imagePreview.style.display = 'block';
        previewImg.src = imageSrc;
    }

    resetUpload() {
        const uploadArea = document.getElementById('uploadArea');
        const imagePreview = document.getElementById('imagePreview');
        
        uploadArea.style.display = 'block';
        imagePreview.style.display = 'none';
        
        this.currentImage = null;
        this.currentImageFile = null;
        this.updateTransformButton();
        
        document.getElementById('imageInput').value = '';
    }

    updateTransformButton() {
        const transformBtn = document.getElementById('transformBtn');
        transformBtn.disabled = !this.currentImage;
    }

    async transformImage() {
        if (!this.currentImage) return;

        const transformBtn = document.getElementById('transformBtn');
        const btnText = transformBtn.querySelector('.btn-text');
        const btnLoading = transformBtn.querySelector('.btn-loading');

        // Show loading state
        transformBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline';

        try {
            let transformedImage;
            
            if (this.genAI && this.apiKey) {
                // Use Google GenAI for true AI image generation
                transformedImage = await this.generateWithAI();
                this.showStatus('AI transformation complete! 🎉', 'success');
            } else {
                // Fallback to demo transformation
                transformedImage = await this.createDemoTransformation();
                this.showStatus('Demo transformation complete!', 'success');
            }
            
            this.showResult(transformedImage);
            
        } catch (error) {
            console.error('Transformation error:', error);
            
            // If AI fails, try demo transformation as fallback
            if (this.genAI && this.apiKey) {
                try {
                    const transformedImage = await this.createDemoTransformation();
                    this.showResult(transformedImage);
                    this.showStatus('AI service unavailable, using demo transformation.', 'info');
                } catch (demoError) {
                    this.showStatus('Error transforming image. Please try again.', 'error');
                }
            } else {
                this.showStatus('Error transforming image. Please try again.', 'error');
            }
        } finally {
            // Reset button state
            transformBtn.disabled = false;
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
        }
    }

    async generateWithAI() {
        try {
            // Convert the image to the format needed for the API
            const imagePart = await this.createImagePart();
            
            // Build console-specific prompt following the "nano banana" style
            const prompt = this.buildConsolePrompt();

            // Use Gemini 2.5 Flash for image editing/transformation
            // Following the pattern from the Google GenAI codegen instructions
            const response = await this.genAI.models.generateContent({
                model: 'gemini-2.5-flash-image-preview',
                contents: [imagePart, prompt],
            });

            // Check if we got an image back
            if (response.response.candidates && response.response.candidates[0] && response.response.candidates[0].content) {
                for (const part of response.response.candidates[0].content.parts) {
                    if (part.inlineData) {
                        const base64ImageBytes = part.inlineData.data;
                        const imageUrl = `data:image/png;base64,${base64ImageBytes}`;
                        return imageUrl;
                    }
                }
            }
            
            // If no image was generated, throw error to fall back to demo
            throw new Error('No image generated by AI model');
            
        } catch (error) {
            console.error('AI Generation error:', error);
            throw error;
        }
    }

    async createImagePart() {
        // Convert the current image to the format expected by the Gemini API
        const base64Data = this.currentImage.split(',')[1];
        const mimeType = this.currentImageFile.type;
        
        return {
            inlineData: {
                data: base64Data,
                mimeType: mimeType
            }
        };
    }

    buildConsolePrompt() {
        // Following the "nano banana" example pattern - descriptive prompts for transformation
        const consolePrompts = {
            playstation1: "A retro PlayStation 1 version of this image with low-poly geometry, pixelated textures, limited 16-bit color palette, sharp angular surfaces, and the characteristic blocky geometric look of 1995 3D games. Apply strong dithering effects and reduce polygon count for that authentic PSX aesthetic.",
            
            nintendo64: "A Nintendo 64 styled version of this image with smooth Gouraud shading, simple geometry, color banding, bilinear texture filtering, and the characteristic slightly blurred but smooth look of 1996 N64 games. Use warmer color tones and subtle fog effects typical of N64 graphics.",
            
            saturn: "A Sega Saturn graphics version of this image with flat shading, geometric shapes, limited texture resolution, sharp polygon edges, and the distinct visual style of Saturn's 2D/3D hybrid capabilities. Use high contrast and saturated colors with minimal anti-aliasing.",
            
            psx: "An early 3D console graphics version of this image with vertex wobble effects, limited color depth, angular geometry, texture warping, and the unstable polygon rendering characteristic of early 3D hardware. Add subtle jittering and polygon pop-in effects for authentic early 3D console feel."
        };
        
        return consolePrompts[this.selectedConsole] || consolePrompts.playstation1;
    }

    async createDemoTransformation() {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();

            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);

                // Apply retro filter based on selected console
                this.applyRetroFilter(ctx, canvas.width, canvas.height);

                resolve(canvas.toDataURL('image/png'));
            };

            img.src = this.currentImage;
        });
    }

    applyRetroFilter(ctx, width, height) {
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;

        switch (this.selectedConsole) {
            case 'playstation1':
                this.applyPlayStation1Effect(data, width, height);
                break;
            case 'nintendo64':
                this.applyNintendo64Effect(data, width, height);
                break;
            case 'saturn':
                this.applySaturnEffect(data, width, height);
                break;
            case 'psx':
                this.applyEarly3DEffect(data, width, height);
                break;
        }

        ctx.putImageData(imageData, 0, 0);
    }

    applyPlayStation1Effect(data, width, height) {
        // Enhanced PlayStation 1 effect with vertex wobble simulation
        for (let i = 0; i < data.length; i += 4) {
            const x = (i / 4) % width;
            const y = Math.floor((i / 4) / width);
            
            // Aggressive color quantization (16-bit style)
            data[i] = Math.floor(data[i] / 16) * 16;     // Red
            data[i + 1] = Math.floor(data[i + 1] / 16) * 16; // Green
            data[i + 2] = Math.floor(data[i + 2] / 16) * 16; // Blue
            
            // Add vertex wobble simulation
            const wobble = Math.sin(x * 0.1) * Math.sin(y * 0.1) * 8;
            data[i] = Math.max(0, Math.min(255, data[i] + wobble));
            data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + wobble));
            data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + wobble));
            
            // Increase contrast for that sharp PSX look
            data[i] = Math.min(255, data[i] * 1.3);
            data[i + 1] = Math.min(255, data[i + 1] * 1.3);
            data[i + 2] = Math.min(255, data[i + 2] * 1.3);
        }
    }

    applyNintendo64Effect(data, width, height) {
        // Enhanced N64 effect with bilinear filtering simulation
        for (let i = 0; i < data.length; i += 4) {
            // Smoother color reduction (less aggressive than PSX)
            data[i] = Math.floor(data[i] / 12) * 12;
            data[i + 1] = Math.floor(data[i + 1] / 12) * 12;
            data[i + 2] = Math.floor(data[i + 2] / 12) * 12;
            
            // Bilinear filtering effect (slight blur)
            data[i] = Math.min(255, data[i] * 1.1);
            data[i + 1] = Math.min(255, data[i + 1] * 1.05);
            
            // Add slight glow for that N64 anti-aliasing look
            const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
            if (brightness > 180) {
                data[i] = Math.min(255, data[i] + 8);
                data[i + 1] = Math.min(255, data[i + 1] + 8);
                data[i + 2] = Math.min(255, data[i + 2] + 8);
            }
        }
    }

    applySaturnEffect(data, width, height) {
        // Enhanced Saturn effect with flat shading
        for (let i = 0; i < data.length; i += 4) {
            // Very aggressive color quantization for flat shading
            data[i] = Math.floor(data[i] / 32) * 32;
            data[i + 1] = Math.floor(data[i + 1] / 32) * 32;
            data[i + 2] = Math.floor(data[i + 2] / 32) * 32;
            
            // Flat shading simulation
            const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
            const factor = avg > 128 ? 1.4 : 0.7;
            data[i] = Math.max(0, Math.min(255, data[i] * factor));
            data[i + 1] = Math.max(0, Math.min(255, data[i + 1] * factor));
            data[i + 2] = Math.max(0, Math.min(255, data[i + 2] * factor));
            
            // Increase saturation for that Saturn look
            const maxComponent = Math.max(data[i], data[i + 1], data[i + 2]);
            if (maxComponent > 0) {
                data[i] = Math.min(255, (data[i] / maxComponent) * maxComponent * 1.2);
                data[i + 1] = Math.min(255, (data[i + 1] / maxComponent) * maxComponent * 1.2);
                data[i + 2] = Math.min(255, (data[i + 2] / maxComponent) * maxComponent * 1.2);
            }
        }
    }

    applyEarly3DEffect(data, width, height) {
        // Enhanced early 3D effect with vertex wobble and instability
        for (let i = 0; i < data.length; i += 4) {
            const x = (i / 4) % width;
            const y = Math.floor((i / 4) / width);
            
            // Heavy color reduction
            data[i] = Math.floor(data[i] / 24) * 24;
            data[i + 1] = Math.floor(data[i + 1] / 24) * 24;
            data[i + 2] = Math.floor(data[i + 2] / 24) * 24;
            
            // More pronounced vertex wobble with multiple frequencies
            const wobbleX = Math.sin(x * 0.05 + y * 0.02) * 12;
            const wobbleY = Math.cos(x * 0.03 + y * 0.07) * 8;
            const instability = Math.sin(x * y * 0.0001) * 6;
            const noise = wobbleX + wobbleY + instability;
            
            data[i] = Math.max(0, Math.min(255, data[i] + noise));
            data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise * 0.8));
            data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise * 0.6));
        }
    }

    showResult(transformedImage) {
        const resultSection = document.getElementById('resultSection');
        const originalImg = document.getElementById('originalImg');
        const resultImg = document.getElementById('resultImg');

        originalImg.src = this.currentImage;
        resultImg.src = transformedImage;
        
        resultSection.style.display = 'block';
        resultSection.scrollIntoView({ behavior: 'smooth' });

        // Store transformed image for download
        this.transformedImage = transformedImage;
    }

    showControlsSection() {
        const resultSection = document.getElementById('resultSection');
        resultSection.style.display = 'none';
        
        // Scroll back to controls
        document.querySelector('.controls-section').scrollIntoView({ behavior: 'smooth' });
    }

    downloadResult() {
        if (!this.transformedImage) return;

        const link = document.createElement('a');
        const mode = this.genAI && this.apiKey ? 'ai' : 'demo';
        link.download = `poly2-${this.selectedConsole}-${mode}-${Date.now()}.png`;
        link.href = this.transformedImage;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        this.showStatus('Image downloaded successfully!', 'success');
    }

    showStatus(message, type = 'info') {
        const statusMessage = document.getElementById('statusMessage');
        statusMessage.textContent = message;
        statusMessage.className = `status-message ${type}`;
        statusMessage.style.display = 'block';

        setTimeout(() => {
            statusMessage.style.display = 'none';
        }, 3000);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Poly2App();
});