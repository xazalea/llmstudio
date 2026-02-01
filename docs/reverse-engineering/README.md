# Reverse Engineering Documentation

## Overview

This documentation covers the reverse engineering analysis of Higgsfield.ai and Freepik.com to understand their authentication systems, API structures, and AI model integrations.

## Target Sites

### Higgsfield.ai
- **Main Site**: https://higgsfield.ai
- **API Base**: https://fnf.higgsfield.ai
- **CMS API**: https://cms.higgsfield.ai
- **Auth**: https://clerk.higgsfield.ai (Clerk-based)

### Freepik.com
- **Main Site**: https://www.freepik.com
- **API Base**: https://www.freepik.com/api
- **ID API**: https://id.freepik.com/api/v2

## Authentication Systems

### Higgsfield.ai - Clerk Authentication

Higgsfield uses Clerk for authentication. Key findings:

**Endpoints:**
- Sign-up: `/v1/client/sign_ups`
- Sign-in: `/v1/client/sign_ins`
- Session: `/v1/client/sessions`

**Token Structure:**
- `__session` cookie - JWT session token
- `__client` cookie - Client identifier
- Headers: `authorization`, `x-clerk-source`, `__clerk_js_version`

**Session Management:**
- Sessions stored in cookies and localStorage
- Token refresh via `/v1/client/sessions/{id}/touch`
- Session expiry: configurable, typically 7-30 days

### Freepik.com - Custom + Google One-Tap

Freepik uses a custom authentication system with Google One-Tap integration.

**Endpoints:**
- Sign-up: `/api/v2/signup`
- Sign-in: `/api/v2/login`
- Google One-Tap: `/api/v2/login/google-one-tap`

**Google One-Tap Config:**
- Client ID: `705648808057-3chuddbr6oahbebib1uh693k02sgfl30.apps.googleusercontent.com`
- Login URI: `https://id.freepik.com/api/v2/login/google-one-tap`

## API Endpoints

### Higgsfield.ai API Endpoints

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/user/meta` | GET | User metadata (country, region, cohort) | No |
| `/user/settings` | GET | User settings | Yes |
| `/user` | GET | User information | Yes |
| `/subscriptions/plans` | GET | Subscription plans | No |
| `/subscriptions/packages` | GET | Credit packages | No |
| `/workspaces/plans` | GET | Workspace plans | No |
| `/generations/image` | POST | Generate image | Yes |
| `/generations/video` | POST | Generate video | Yes |
| `/generations/{id}` | GET | Get generation status | Yes |

### Freepik.com API Endpoints

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/api/country` | GET | Country detection | No |
| `/api/pricing-plans` | GET | Pricing plans | No |
| `/api/image-generation` | POST | Generate image | Yes |
| `/api/search` | GET | Search assets | No |
| `/api/assets/{id}` | GET | Get asset details | No |
| `/api/assets/{id}/download` | GET | Get download URL | Yes |
| `/api/spaces` | GET/POST | Workspaces | Yes |

## AI Models Identified

### Image Generation Models

**Higgsfield:**
- Flux (various versions)
- Nano Banana Pro
- GPT Image
- Kling O1 Image
- Z-Image
- Seedream
- Soul
- Reve

**Freepik:**
- Flux
- Google Imagen (Nano Banana, Imagen 3/4)
- Ideogram
- GPT
- Runway
- Mystic
- Classic
- Seedream
- Reve
- Z Image

### Video Generation Models

**Higgsfield:**
- Kling 2.5 Turbo
- Sora
- WAN
- Grok Imagine

## Data Models

### Generation Job

```typescript
interface GenerationJob {
  id: string;
  type: 'image' | 'video';
  status: 'pending' | 'queued' | 'processing' | 'completed' | 'failed';
  prompt: string;
  negativePrompt?: string;
  model: string;
  parameters: {
    width: number;
    height: number;
    steps?: number;
    guidanceScale?: number;
    seed?: number;
  };
  output?: {
    urls: string[];
    metadata: Record<string, unknown>;
  };
  createdAt: number;
  completedAt?: number;
  error?: string;
}
```

### User Session

```typescript
interface UserSession {
  id: string;
  userId?: string;
  createdAt: number;
  lastActiveAt: number;
  metadata: {
    country?: string;
    region?: string;
    cohort?: string;
  };
}
```

## JavaScript Bundle Analysis

### Key Files Extracted

**Higgsfield:**
- `/_next/static/chunks/app/page-*.js` - Main app code
- `/_next/static/chunks/webpack-*.js` - Webpack runtime
- Clerk bundle: `@clerk/clerk-js@5/dist/clerk.browser.js`

**Freepik:**
- `/_next/static/chunks/pages/_app-*.js` - App code
- `/_next/static/chunks/commons-*.js` - Shared code
- Authentication handlers in vendor bundles

### State Management

Both sites use similar patterns:
- React Query for server state
- Zustand/Context for client state
- localStorage for persistence

## Free Alternatives Implementation

### Image Generation
- Hugging Face Inference API (free tier)
- Replicate API (free tier)
- Local Stable Diffusion deployment

### Video Generation
- AnimateDiff (open-source)
- Stable Video Diffusion
- ModelScope Text2Video

### Image Editing
- Stable Diffusion Inpainting
- Real-ESRGAN for upscaling
- RMBG-1.4 for background removal

## Security Notes

This reverse engineering is for educational purposes to understand:
- Modern web authentication patterns
- AI model API integration
- React application architecture

The implementation uses free, open-source alternatives rather than accessing proprietary APIs.
