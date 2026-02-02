import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { generateImage as generateWithGradio } from "@/lib/gradio/spaces-client";
import { IMAGE_GEN_SPACES } from "@/lib/gradio/spaces-config";

// Model ID to Space ID mapping
const MODEL_TO_SPACE: Record<string, string> = {
  'flux-schnell': 'flux-schnell',
  'flux-dev': 'flux-dev',
  'sdxl-lightning': 'sdxl-lightning',
  'stable-diffusion-3': 'stable-diffusion-3',
  'playground-v2': 'playground-v2',
  'kolors': 'kolors',
  // Aliases
  'sd3': 'stable-diffusion-3',
  'sdxl': 'sdxl-lightning',
  'flux': 'flux-schnell',
};

// Fallback order for reliability
const FALLBACK_SPACES = ['flux-schnell', 'sdxl-lightning', 'playground-v2'];

export async function POST(request: NextRequest) {
  const jobId = uuidv4();
  const startTime = Date.now();
  
  try {
    const body = await request.json();
    
    const {
      prompt,
      negativePrompt,
      model = "flux-schnell",
      width = 1024,
      height = 1024,
      steps,
      guidanceScale,
      seed,
      stylePreset,
    } = body;

    if (!prompt) {
      return NextResponse.json(
        { success: false, error: { code: "INVALID_REQUEST", message: "Prompt is required" } },
        { status: 400 }
      );
    }

    // Apply style preset to prompt if provided
    const fullPrompt = stylePreset ? `${prompt}, ${stylePreset} style` : prompt;
    
    // Get primary space for the model
    const primarySpaceId = MODEL_TO_SPACE[model] || 'flux-schnell';
    
    // Try primary space first, then fallbacks
    const spacesToTry = [
      primarySpaceId,
      ...FALLBACK_SPACES.filter(s => s !== primarySpaceId)
    ];
    
    let lastError: string | undefined;
    
    for (const spaceId of spacesToTry) {
      const result = await generateWithGradio(spaceId, {
        prompt: fullPrompt,
        negativePrompt,
        width,
        height,
        steps,
        guidanceScale,
        seed,
      });
      
      if (result.success && result.data) {
        // Successfully generated
        return NextResponse.json({
          success: true,
          data: {
            id: jobId,
            status: "completed",
            images: result.data.images,
            prompt: fullPrompt,
            negativePrompt,
            model: spaceId,
            parameters: {
              width,
              height,
              steps,
              guidanceScale,
              seed: result.data.seed,
            },
            createdAt: startTime,
            completedAt: Date.now(),
            provider: "huggingface-spaces",
            space: result.space,
            duration: result.duration,
          },
        });
      }
      
      lastError = result.error;
      console.warn(`Space ${spaceId} failed: ${result.error}, trying next...`);
    }
    
    // All spaces failed - return error with helpful message
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "GENERATION_FAILED",
          message: "All generation providers are currently unavailable. Please try again in a moment.",
          details: lastError,
          availableModels: IMAGE_GEN_SPACES.map(s => ({
            id: s.id,
            name: s.name,
            description: s.description,
          })),
        },
      },
      { status: 503 }
    );
  } catch (error) {
    console.error("Image generation error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: "INTERNAL_ERROR", 
          message: error instanceof Error ? error.message : "Failed to process request",
        } 
      },
      { status: 500 }
    );
  }
}

// Get available models
export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      models: IMAGE_GEN_SPACES.map(space => ({
        id: space.id,
        name: space.name,
        description: space.description,
        defaultParams: space.defaultParams,
      })),
    },
  });
}
