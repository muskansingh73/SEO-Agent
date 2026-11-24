import { TriangleAlert } from "lucide-react";

export default function ErrorPanel({ title, message }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-bad/30 bg-bad/5 p-5" role="alert">
      <TriangleAlert size={20} className="mt-0.5 shrink-0 text-bad" />
      <div>
        <p className="font-semibold">{title}</p>
        <p className="mt-1 text-[15px] text-ink/75">{message}</p>
      </div>
    </div>
  );
}