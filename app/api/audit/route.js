import { runAudit } from "@/lib/audit";
import { toReport } from "@/lib/report";

export async function POST(request) {
  try {
    const body = await request.json();
    const audit = await runAudit(body.url);
    return Response.json(toReport(audit));
  } catch (err) {
    return Response.json({ error: err.message || "Something went wrong." }, { status: 400 });
  }
}