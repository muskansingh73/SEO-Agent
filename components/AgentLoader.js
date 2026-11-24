"use client";

import { useEffect, useRef, useState } from "react";
import { Check, LoaderCircle } from "lucide-react";

// Shows the agent "working" through a list of steps, then calls onDone.
export default function AgentLoader({ steps, onDone }) {
  const [shown, setShown] = useState(1);
  const doneRef = useRef(onDone);

  useEffect(() => {
    doneRef.current = onDone;
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      if (shown < steps.length) setShown(shown + 1);
      else doneRef.current();
    }, 480);
    return () => clearTimeout(timer);
  }, [shown, steps.length]);

  return (
    <div className="panel overflow-hidden" role="status" aria-live="polite">
      <div className="h-1 bg-line">
        <div
          className="h-full bg-ink transition-all duration-500"
          style={{ width: `${(shown / steps.length) * 100}%` }}
        />
      </div>
      <div className="p-6">
        <p className="font-display text-lg font-semibold">The agent is working</p>
        <ul className="mt-4 space-y-2.5 font-mono text-sm">
          {steps.slice(0, shown).map((step, i) => (
            <li key={step} className="flex items-center gap-2.5">
              {i < shown - 1 ? (
                <Check size={16} className="text-good" strokeWidth={3} />
              ) : (
                <LoaderCircle size={16} className="animate-spin" />
              )}
              <span className={i < shown - 1 ? "text-ink/55" : ""}>{step}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}