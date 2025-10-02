"use client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export function getApiBaseUrl() {
  return API_URL;
}

export async function apiFetch(path, { method = "GET", body, token, headers = {} } = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try { const data = await res.json(); if (data?.message) message = data.message; } catch (_) {}
    throw new Error(message);
  }
  try { return await res.json(); } catch (_) { return null; }
}
