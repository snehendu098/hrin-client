"use server";

import { PoolStatusResponse } from "@/types/api";

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:8080";

export async function getPoolStatus(): Promise<PoolStatusResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/pool/status`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: PoolStatusResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching pool status:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch pool status"
    );
  }
}