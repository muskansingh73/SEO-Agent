import { findCompetitors } from "@/lib/competitors";

export async function POST(request) {
  try {
    const body = await request.json();
    const data = await findCompetitors(body);
    return Response.json(data);
  } catch (err) {
    return Response.json({ error: err.message || "Something went wrong." }, { status: 400 });
  }
}