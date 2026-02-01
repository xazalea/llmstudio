import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      prompt,
      negativePrompt,
      model = "animatediff",
      duration = 4,
      fps = 24,
      width = 1024,
      height = 576,
      motionPreset,
      motionStrength = 0.5,
      startFrame,
    } = body;

    if (!prompt) {
      return NextResponse.json(
        { success: false, error: { code: "INVALID_REQUEST", message: "Prompt is required" } },
        { status: 400 }
      );
    }

    // Create job ID
    const jobId = uuidv4();
    const seed = Math.floor(Math.random() * 1000000);

    // In production, this would call video generation APIs
    // For demo, we return a placeholder
    
    await new Promise(resolve => setTimeout(resolve, 100));

    const result = {
      id: jobId,
      status: "completed",
      videoUrl: "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4",
      thumbnailUrl: `https://picsum.photos/seed/${seed}/${width}/${height}`,
      prompt,
      negativePrompt,
      model,
      duration,
      fps,
      width,
      height,
      motionPreset,
      motionStrength,
      createdAt: Date.now(),
      completedAt: Date.now(),
    };

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Video generation error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: "GENERATION_FAILED", 
          message: "Failed to generate video" 
        } 
      },
      { status: 500 }
    );
  }
}
