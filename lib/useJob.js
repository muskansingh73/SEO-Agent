import { useRef, useState } from "react";

// Starts a request to one of our API routes and keeps its state.
// The AgentLoader calls finish() when its progress animation ends.
export function useJob(endpoint) {
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const pending = useRef(null);

  function start(body) {
    setResult(null);
    setError("");
    setRunning(true);
    pending.current = fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
      .then(async (res) => ({ ok: res.ok, data: await res.json() }))
      .catch(() => ({
        ok: false,
        data: { error: "Could not reach the server. Check your connection and try again." },
      }));
  }

  async function finish() {
    const { ok, data } = await pending.current;
    if (ok) setResult(data);
    else setError(data.error || "Something went wrong.");
    setRunning(false);
  }

  return { running, result, error, start, finish };
}