# AI Creative Suite - API Documentation

## Overview

This document describes the internal API structure of the AI Creative Suite application.

## Base URL

Development: `http://localhost:3000/api`
Production: `https://your-domain.com/api`

## Authentication

The API uses anonymous session-based authentication. No user accounts required.

### Session Headers

```
X-Session-ID: <uuid>
X-Session-Timestamp: <unix-timestamp>
```

Sessions are automatically created on first visit and persisted in localStorage.

## Endpoints

### Session API

#### Create/Get Session

```
GET /api/session
```

Returns the current session or creates a new one.

**Response:**
```json
{
  "id": "uuid-v4",
  "createdAt": 1234567890,
  "lastActiveAt": 1234567890
}
```

### Image Generation API

#### Generate Images

```
POST /api/generate/image
```

**Request Body:**
```json
{
  "prompt": "A beautiful sunset over mountains",
  "negativePrompt": "blurry, low quality",
  "model": "flux-schnell",
  "width": 1024,
  "height": 1024,
  "steps": 30,
  "guidanceScale": 7.5,
  "seed": 12345,
  "stylePreset": "photorealistic"
}
```

**Response:**
```json
{
  "id": "job-uuid",
  "status": "processing",
  "createdAt": 1234567890
}
```

#### Get Generation Status

```
GET /api/generate/image/:jobId
```

**Response:**
```json
{
  "id": "job-uuid",
  "status": "completed",
  "images": [
    {
      "url": "https://...",
      "width": 1024,
      "height": 1024,
      "seed": 12345
    }
  ],
  "prompt": "A beautiful sunset...",
  "model": "flux-schnell",
  "createdAt": 1234567890,
  "completedAt": 1234567895
}
```

### Video Generation API

#### Generate Video

```
POST /api/generate/video
```

**Request Body:**
```json
{
  "prompt": "A timelapse of clouds moving",
  "model": "animatediff",
  "duration": 4,
  "fps": 24,
  "width": 1024,
  "height": 576,
  "motionPreset": {
    "id": "slow-zoom-in",
    "params": { "motion_strength": 0.5 }
  },
  "startFrame": "base64-or-url"
}
```

**Response:**
```json
{
  "id": "job-uuid",
  "status": "processing",
  "createdAt": 1234567890
}
```

### Image Editing API

#### Edit Image

```
POST /api/edit/image
```

**Request Body:**
```json
{
  "image": "base64-or-url",
  "operation": "inpaint",
  "mask": "base64-or-url",
  "prompt": "Replace with flowers",
  "strength": 0.8
}
```

**Operations:**
- `inpaint` - Remove/replace objects
- `upscale` - Enhance resolution (2x, 3x, 4x)
- `background-remove` - Remove background
- `enhance` - Improve quality
- `colorize` - Add color to B&W
- `style-transfer` - Apply artistic style

### Video Editing API

#### Edit Video

```
POST /api/edit/video
```

**Request Body:**
```json
{
  "video": "url-or-base64",
  "operation": "speed",
  "params": {
    "speed": 2.0
  }
}
```

**Operations:**
- `trim` - Cut video (params: start, end)
- `speed` - Change speed (params: speed)
- `reverse` - Play backwards
- `loop` - Repeat (params: loops)
- `effect` - Apply effect (params: effect)
- `stabilize` - Reduce shake
- `interpolate` - Frame interpolation (params: fps)

## Available Models

### Image Generation Models

| ID | Name | Speed | Description |
|----|------|-------|-------------|
| `flux-schnell` | FLUX.1 Schnell | ~4s | Ultra-fast, great quality |
| `stable-diffusion-xl` | Stable Diffusion XL | ~15s | High-quality 1024px |
| `stable-diffusion-3` | Stable Diffusion 3 | ~20s | Best text rendering |
| `sdxl-turbo` | SDXL Turbo | ~2s | Single-step generation |
| `playground-v2` | Playground v2.5 | ~18s | Aesthetic-focused |
| `kandinsky-3` | Kandinsky 3 | ~15s | Unique artistic style |

### Video Generation Models

| ID | Name | Max Duration | Description |
|----|------|--------------|-------------|
| `animatediff` | AnimateDiff | 4s | Image/text to video |
| `stable-video-diffusion` | Stable Video Diffusion | 4s | High-quality img2vid |
| `modelscope` | ModelScope | 2s | Natural motion |
| `zeroscope` | Zeroscope v2 | 3s | Fast text2video |

## Error Responses

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message",
    "details": {}
  }
}
```

**Error Codes:**
- `INVALID_REQUEST` - Malformed request
- `MODEL_NOT_FOUND` - Unknown model ID
- `GENERATION_FAILED` - AI generation error
- `RATE_LIMITED` - Too many requests
- `NETWORK_ERROR` - External API failure

## Rate Limits

The free tier has generous limits:
- Image generation: 50/hour
- Video generation: 20/hour
- Image editing: 100/hour
- Video editing: 50/hour

With your own API keys, limits are determined by the provider.
