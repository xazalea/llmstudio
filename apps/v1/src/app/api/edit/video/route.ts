import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      video,
      operation,
      params = {},
    } = body;

    if (!video) {
      return NextResponse.json(
        { success: false, error: { code: "INVALID_REQUEST", message: "Video is required" } },
        { status: 400 }
      );
    }

    if (!operation) {
      return NextResponse.json(
        { success: false, error: { code: "INVALID_REQUEST", message: "Operation is required" } },
        { status: 400 }
      );
    }

    const validOperations = [
      "trim", "speed", "reverse", "loop", "transition",
      "effect", "stabilize", "interpolate"
    ];

    if (!validOperations.includes(operation)) {
      return NextResponse.json(
        { success: false, error: { code: "INVALID_REQUEST", message: "Invalid operation" } },
        { status: 400 }
      );
    }

    // Create job ID
    const jobId = uuidv4();

    // In production, this would process video with FFmpeg
    // For demo, we return the original video
    
    await new Promise(resolve => setTimeout(resolve, 100));

    const result = {
      id: jobId,
      status: "completed",
      outputUrl: video, // In production, this would be the edited video
      originalUrl: video,
      operation,
      parameters: params,
      createdAt: Date.now(),
      completedAt: Date.now(),
    };

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Video edit error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: "EDIT_FAILED", 
          message: "Failed to edit video" 
        } 
      },
      { status: 500 }
    );
  }
}
