import { NextRequest } from "next/server";
import { streamChat, chat } from "@/lib/gradio/spaces-client";
import { CHAT_SPACES } from "@/lib/gradio/spaces-config";

// Model ID to Space ID mapping
const MODEL_TO_SPACE: Record<string, string> = {
  'qwen-72b': 'qwen-72b',
  'qwen-32b': 'qwen-32b',
  'qwen': 'qwen-72b',
  'llama-70b': 'llama-3-70b',
  'llama': 'llama-3-70b',
  'mistral': 'mistral-nemo',
  'gemma': 'gemma-2-27b',
};

// Fallback order
const FALLBACK_SPACES = ['qwen-72b', 'llama-3-70b', 'mistral-nemo'];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      message,
      history = [],
      systemPrompt,
      model = "qwen-72b",
      temperature = 0.7,
      maxTokens = 2048,
      stream = true,
    } = body;

    if (!message) {
      return new Response(
        JSON.stringify({ success: false, error: { code: "INVALID_REQUEST", message: "Message is required" } }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const spaceId = MODEL_TO_SPACE[model] || 'qwen-72b';

    // Streaming response
    if (stream) {
      const encoder = new TextEncoder();
      
      const readableStream = new ReadableStream({
        async start(controller) {
          try {
            const generator = streamChat(spaceId, {
              message,
              history,
              systemPrompt,
              temperature,
              maxTokens,
            });

            for await (const event of generator) {
              if (event.done) {
                controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
                break;
              }
              
              const data = JSON.stringify({
                choices: [{
                  delta: { content: event.chunk },
                  finish_reason: null,
                }],
              });
              controller.enqueue(encoder.encode(`data: ${data}\n\n`));
            }
          } catch (error) {
            console.error("Stream error:", error);
            const errorData = JSON.stringify({
              error: {
                message: error instanceof Error ? error.message : "Stream failed",
              },
            });
            controller.enqueue(encoder.encode(`data: ${errorData}\n\n`));
          } finally {
            controller.close();
          }
        },
      });

      return new Response(readableStream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          "Connection": "keep-alive",
        },
      });
    }

    // Non-streaming response with fallback
    const spacesToTry = [spaceId, ...FALLBACK_SPACES.filter(s => s !== spaceId)];
    let lastError: string | undefined;

    for (const currentSpace of spacesToTry) {
      const result = await chat(currentSpace, {
        message,
        history,
        systemPrompt,
        temperature,
        maxTokens,
      });

      if (result.success && result.data) {
        return new Response(
          JSON.stringify({
            success: true,
            data: {
              response: result.data.response,
              history: result.data.history,
              model: currentSpace,
              provider: "huggingface-spaces",
              duration: result.duration,
            },
          }),
          { headers: { "Content-Type": "application/json" } }
        );
      }

      lastError = result.error;
      console.warn(`Chat space ${currentSpace} failed: ${result.error}`);
    }

    return new Response(
      JSON.stringify({
        success: false,
        error: {
          code: "CHAT_FAILED",
          message: "All chat providers are currently unavailable.",
          details: lastError,
        },
      }),
      { status: 503, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Chat error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: error instanceof Error ? error.message : "Failed to process request",
        },
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

// Get available chat models
export async function GET() {
  return new Response(
    JSON.stringify({
      success: true,
      data: {
        models: CHAT_SPACES.map(space => ({
          id: space.id,
          name: space.name,
          description: space.description,
        })),
      },
    }),
    { headers: { "Content-Type": "application/json" } }
  );
}
