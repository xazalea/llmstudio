# AI Creative Suite

A free, unlimited AI-powered creative platform combining features from multiple AI creative tools. No authentication required - uses anonymous sessions.

## Features

### Image Generation
- Multiple AI models (Stable Diffusion XL, FLUX.1, SDXL Turbo, etc.)
- Style presets (Photorealistic, Anime, Oil Painting, etc.)
- Aspect ratio presets
- Advanced controls (steps, guidance scale, seed)

### Video Generation
- Text-to-video generation
- Image-to-video animation
- Motion presets (zoom, pan, orbit, cinematic)
- Duration and FPS control

### Image Editor
- AI Inpainting (object removal/replacement)
- Upscaling (2x, 3x, 4x)
- Background removal
- Style transfer
- Enhancement and colorization

### Video Editor
- Trim and cut
- Speed control
- Reverse playback
- Loop creation
- Visual effects
- Frame interpolation

### Asset Library
- Stock photos and images
- Videos and vectors
- Fonts and icons
- Search and filtering
- Free downloads

### Collaborative Workspaces
- Infinite canvas
- Real-time collaboration
- Text, shapes, and images
- Export and sharing

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, React
- **Styling**: Tailwind CSS, shadcn/ui
- **State**: React Query, Zustand
- **AI Models**: Hugging Face Inference API, open-source models

## Project Structure

```
higg/
├── lib/                    # Shared libraries
│   ├── api/               # API client wrappers
│   ├── auth/              # Anonymous session management
│   ├── ai/                # AI model integrations
│   └── models/            # Data models
├── apps/
│   └── v1/                # Main application
│       ├── src/
│       │   ├── app/       # Next.js app router
│       │   ├── components/# React components
│       │   └── hooks/     # Custom hooks
│       └── public/        # Static assets
└── docs/                   # Documentation
    ├── reverse-engineering/
    └── api-documentation/
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
cd higg

# Install dependencies
cd apps/v1
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Optional: Add API Keys

For faster generation, add your own API keys in Settings:

- **Hugging Face**: Get a free key at [huggingface.co](https://huggingface.co)
- **Replicate**: Get a free key at [replicate.com](https://replicate.com)

## API Documentation

See [docs/api-documentation/README.md](docs/api-documentation/README.md) for API reference.

## Free AI Models Used

### Image Generation
- Stable Diffusion XL (Stability AI)
- FLUX.1 Schnell/Dev (Black Forest Labs)
- SDXL Turbo
- Playground v2.5
- Kandinsky 3

### Video Generation
- AnimateDiff
- Stable Video Diffusion
- ModelScope Text2Video
- Zeroscope v2

### Image Editing
- Stable Diffusion Inpainting
- Real-ESRGAN (upscaling)
- RMBG-1.4 (background removal)

## Architecture

```
┌─────────────────────────────────────────────┐
│                  Frontend                    │
│  (Next.js + React + TypeScript + Tailwind)  │
└─────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────┐
│              Anonymous Sessions              │
│         (localStorage + API headers)         │
└─────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────┐
│                API Routes                    │
│    /api/generate/* | /api/edit/* | etc.     │
└─────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────┐
│            AI Model Providers                │
│  Hugging Face | Replicate | Local Models    │
└─────────────────────────────────────────────┘
```

## Key Principles

1. **Free Forever** - Uses only free/open-source AI models
2. **No Authentication** - Anonymous session-based system
3. **Unlimited Usage** - No artificial rate limits
4. **Privacy First** - No tracking, no data collection
5. **Open Source** - Full transparency

## License

MIT License - Free to use, modify, and distribute.

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.
