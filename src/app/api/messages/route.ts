import { fetchMessages } from "@/lib/api";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const after = searchParams.get("after") ?? undefined;
  const limit = parseInt(searchParams.get("limit") ?? "50", 10);

  const messages = await fetchMessages(after, limit);
  return Response.json(messages);
}
