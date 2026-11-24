import { getSuggestions } from "@/lib/suggest";

export async function POST(request) {
  try {
    const body = await request.json();
    const data = await getSuggestions(body.topic, body.country);
    return Response.json(data);
  } catch (err) {
    return Response.json({ error: err.message || "Something went wrong." }, { status: 400 });
  }
}