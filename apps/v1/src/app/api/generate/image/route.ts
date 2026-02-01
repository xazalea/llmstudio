import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      prompt,
      negativePrompt,
      model = "flux-schnell",
      width = 1024,
      height = 1024,
      steps = 30,
      guidanceScale = 7.5,
      seed,
      stylePreset,
    } = body;

    if (!prompt) {
      return NextResponse.json(
        { success: false, error: { code: "INVALID_REQUEST", message: "Prompt is required" } },
        { status: 400 }
      );
    }

    // Create job ID
    const jobId = uuidv4();
    const generationSeed = seed || Math.floor(Math.random() * 1000000);

    // In production, this would call Hugging Face or other AI APIs
    // For demo, we simulate generation with placeholder images
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 100));

    // Generate placeholder results
    const images = Array.from({ length: 4 }, (_, i) => ({
      url: `https://picsum.photos/seed/${generationSeed + i}/${width}/${height}`,
      width,
      height,
      seed: generationSeed + i,
    }));

    const result = {
      id: jobId,
      status: "completed",
      images,
      prompt: stylePreset ? `${prompt}, ${stylePreset} style` : prompt,
      negativePrompt,
      model,
      parameters: {
        width,
        height,
        steps,
        guidanceScale,
        seed: generationSeed,
      },
      createdAt: Date.now(),
      completedAt: Date.now(),
    };

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Image generation error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: "GENERATION_FAILED", 
          message: "Failed to generate images" 
        } 
      },
      { status: 500 }
    );
  }
}
