import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { generateVideo as generateWithGradio } from "@/lib/gradio/spaces-client";
import { VIDEO_GEN_SPACES } from "@/lib/gradio/spaces-config";

// Model ID to Space ID mapping
const MODEL_TO_SPACE: Record<string, string> = {
  'animatediff': 'animatediff-lightning',
  'animatediff-lightning': 'animatediff-lightning',
  'i2vgen-xl': 'i2vgen-xl',
  'cogvideox': 'cogvideox',
};

// Fallback order for reliability
const FALLBACK_SPACES = ['animatediff-lightning', 'cogvideox'];

export async function POST(request: NextRequest) {
  const jobId = uuidv4();
  const startTime = Date.now();
  
  try {
    const body = await request.json();
    
    const {
      prompt,
      negativePrompt,
      model = "animatediff-lightning",
      steps,
      fps = 8,
      duration = 4,
      imageUrl, // For image-to-video
    } = body;

    if (!prompt) {
      return NextResponse.json(
        { success: false, error: { code: "INVALID_REQUEST", message: "Prompt is required" } },
        { status: 400 }
      );
    }

    // Get primary space for the model
    const primarySpaceId = MODEL_TO_SPACE[model] || 'animatediff-lightning';
    
    // Try primary space first, then fallbacks
    const spacesToTry = [
      primarySpaceId,
      ...FALLBACK_SPACES.filter(s => s !== primarySpaceId)
    ];
    
    let lastError: string | undefined;
    
    for (const spaceId of spacesToTry) {
      // Handle image-to-video separately
      let imageBlob: Blob | undefined;
      if (imageUrl && spaceId === 'i2vgen-xl') {
        try {
          const imageResponse = await fetch(imageUrl);
          imageBlob = await imageResponse.blob();
        } catch (e) {
          console.warn('Failed to fetch image for i2v:', e);
        }
      }
      
      const result = await generateWithGradio(spaceId, {
        prompt,
        negativePrompt,
        steps,
        fps,
        duration,
        image: imageBlob,
      });
      
      if (result.success && result.data) {
        return NextResponse.json({
          success: true,
          data: {
            id: jobId,
            status: "completed",
            videoUrl: result.data.videoUrl,
            prompt,
            negativePrompt,
            model: spaceId,
            parameters: {
              steps,
              fps,
              duration: result.data.duration,
            },
            createdAt: startTime,
            completedAt: Date.now(),
            provider: "huggingface-spaces",
            space: result.space,
            processingTime: result.duration,
          },
        });
      }
      
      lastError = result.error;
      console.warn(`Video space ${spaceId} failed: ${result.error}, trying next...`);
    }
    
    // All spaces failed
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "GENERATION_FAILED",
          message: "Video generation is currently unavailable. Please try again later.",
          details: lastError,
          availableModels: VIDEO_GEN_SPACES.map(s => ({
            id: s.id,
            name: s.name,
            description: s.description,
          })),
        },
      },
      { status: 503 }
    );
  } catch (error) {
    console.error("Video generation error:", error);
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

// Get available video models
export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      models: VIDEO_GEN_SPACES.map(space => ({
        id: space.id,
        name: space.name,
        description: space.description,
        defaultParams: space.defaultParams,
      })),
    },
  });
}
