class Poly2App {
    constructor() {
        this.currentImage = null;
        this.currentImageFile = null;
        this.selectedConsole = 'playstation1';
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateTransformButton();
    }

    bindEvents() {
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
            // Since we don't have access to actual Gemini API without authentication,
            // I'll create a demo transformation using canvas effects
            const transformedImage = await this.createDemoTransformation();
            
            this.showResult(transformedImage);
            this.showStatus('Image transformed successfully!', 'success');
            
        } catch (error) {
            console.error('Transformation error:', error);
            this.showStatus('Error transforming image. Please try again.', 'error');
        } finally {
            // Reset button state
            transformBtn.disabled = false;
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
        }
    }

    async createDemoTransformation() {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();

            img.onload = () => {
                // Set canvas size
                canvas.width = img.width;
                canvas.height = img.height;

                // Draw original image
                ctx.drawImage(img, 0, 0);

                // Apply retro transformation based on selected console
                this.applyRetroFilter(ctx, canvas.width, canvas.height);

                // Return transformed image as data URL
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
                this.applyPlayStation1Effect(data);
                break;
            case 'nintendo64':
                this.applyNintendo64Effect(data);
                break;
            case 'saturn':
                this.applySaturnEffect(data);
                break;
            case 'psx':
                this.applyEarly3DEffect(data);
                break;
        }

        ctx.putImageData(imageData, 0, 0);
    }

    applyPlayStation1Effect(data) {
        // Low-poly, pixelated effect with limited color palette
        for (let i = 0; i < data.length; i += 4) {
            // Reduce color depth
            data[i] = Math.floor(data[i] / 32) * 32;     // Red
            data[i + 1] = Math.floor(data[i + 1] / 32) * 32; // Green
            data[i + 2] = Math.floor(data[i + 2] / 32) * 32; // Blue
            
            // Increase contrast slightly
            data[i] = Math.min(255, data[i] * 1.2);
            data[i + 1] = Math.min(255, data[i + 1] * 1.2);
            data[i + 2] = Math.min(255, data[i + 2] * 1.2);
        }
    }

    applyNintendo64Effect(data) {
        // Smooth shading with color banding
        for (let i = 0; i < data.length; i += 4) {
            // Reduce color depth but keep smoother gradients
            data[i] = Math.floor(data[i] / 16) * 16;
            data[i + 1] = Math.floor(data[i + 1] / 16) * 16;
            data[i + 2] = Math.floor(data[i + 2] / 16) * 16;
            
            // Slight color shift towards warmer tones
            data[i] = Math.min(255, data[i] * 1.1);
            data[i + 1] = Math.min(255, data[i + 1] * 1.05);
        }
    }

    applySaturnEffect(data) {
        // Flat shading with geometric feel
        for (let i = 0; i < data.length; i += 4) {
            // Very limited color palette
            data[i] = Math.floor(data[i] / 64) * 64;
            data[i + 1] = Math.floor(data[i + 1] / 64) * 64;
            data[i + 2] = Math.floor(data[i + 2] / 64) * 64;
            
            // Increase saturation
            const max = Math.max(data[i], data[i + 1], data[i + 2]);
            if (max > 0) {
                data[i] = Math.min(255, (data[i] / max) * max * 1.3);
                data[i + 1] = Math.min(255, (data[i + 1] / max) * max * 1.3);
                data[i + 2] = Math.min(255, (data[i + 2] / max) * max * 1.3);
            }
        }
    }

    applyEarly3DEffect(data) {
        // Vertex wobble simulation and limited colors
        for (let i = 0; i < data.length; i += 4) {
            // Heavy color reduction
            data[i] = Math.floor(data[i] / 48) * 48;
            data[i + 1] = Math.floor(data[i + 1] / 48) * 48;
            data[i + 2] = Math.floor(data[i + 2] / 48) * 48;
            
            // Add slight noise for "vertex wobble" feel
            const noise = (Math.random() - 0.5) * 20;
            data[i] = Math.max(0, Math.min(255, data[i] + noise));
            data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
            data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
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
        link.download = `poly2-${this.selectedConsole}-${Date.now()}.png`;
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

// Configuration for Gemini API (would be used in production)
const GEMINI_CONFIG = {
    apiKey: '', // Would be set from environment or user input
    apiUrl: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent'
};

// Console style prompts for Gemini API
const CONSOLE_PROMPTS = {
    playstation1: "Transform this image to look like early PlayStation 1 graphics with low-poly geometry, pixelated textures, limited color palette, and sharp angular surfaces typical of 1995 3D games.",
    nintendo64: "Transform this image to mimic Nintendo 64 graphics with smooth Gouraud shading, simple geometry, color banding, and the characteristic look of 1996 console games.",
    saturn: "Transform this image to look like Sega Saturn graphics with flat shading, geometric shapes, limited texture resolution, and the distinct visual style of Saturn's 3D capabilities.",
    psx: "Transform this image to emulate early 3D console graphics with vertex wobble effects, limited color depth, angular geometry, and the unstable polygon rendering of early 3D hardware."
};

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Poly2App();
});

// Add some helper functions for potential Gemini integration
async function callGeminiAPI(imageData, prompt) {
    // This would be the actual implementation for calling Gemini API
    // For now, it's a placeholder that would require:
    // 1. Base64 encoding of the image
    // 2. Proper API authentication
    // 3. Request formatting according to Gemini Vision API specs
    
    if (!GEMINI_CONFIG.apiKey) {
        throw new Error('Gemini API key not configured');
    }

    // Example structure (would need actual implementation):
    /*
    const response = await fetch(GEMINI_CONFIG.apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${GEMINI_CONFIG.apiKey}`
        },
        body: JSON.stringify({
            contents: [{
                parts: [
                    { text: prompt },
                    { inline_data: { mime_type: "image/jpeg", data: imageData } }
                ]
            }]
        })
    });
    
    return response.json();
    */
}

function base64ToBlob(base64Data, contentType = 'image/png') {
    const sliceSize = 1024;
    const byteCharacters = atob(base64Data.split(',')[1]);
    const bytesLength = byteCharacters.length;
    const slicesCount = Math.ceil(bytesLength / sliceSize);
    const byteArrays = new Array(slicesCount);

    for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
        const begin = sliceIndex * sliceSize;
        const end = Math.min(begin + sliceSize, bytesLength);
        const bytes = new Array(end - begin);
        
        for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
            bytes[i] = byteCharacters[offset].charCodeAt(0);
        }
        
        byteArrays[sliceIndex] = new Uint8Array(bytes);
    }
    
    return new Blob(byteArrays, { type: contentType });
}