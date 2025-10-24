import { ConversationResponse } from "@/utils/types";

export async function GET(request: Request) {
      const url = new URL(request.url);

  const conversationId = url.searchParams.get("conversation_id") || url.searchParams.get("conversationId");

  if (!conversationId) {
    return new Response("Conversation ID is required", { status: 400 });
  }

  if (!process.env.ELEVENLABS_API_KEY) {
    return new Response("ELEVENLABS_API_KEY is not set", { status: 500 });
  }

  try {
  const response = await fetch(
    `${process.env.ELEVENLABS_BASE_URL}/v1/convai/conversations/${conversationId}`,
    {
      headers: {
        "xi-api-key": process.env.ELEVENLABS_API_KEY,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
      const errorText = await response.text();
      return new Response(errorText, { status: response.status });
    }


  const conversation: ConversationResponse = await response.json();
  console.log("[SERVER] Conversation", conversation);

  return new Response(JSON.stringify({ conversation }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response("Failed to fetch conversation", { status: 500 });
  }
}