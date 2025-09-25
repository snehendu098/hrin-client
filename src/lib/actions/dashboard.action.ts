"use server";

import { DashboardApiResponse } from "@/types/api";

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:8080";

export async function getDashboardData(address: string): Promise<DashboardApiResponse> {
  try {
    if (!address) {
      throw new Error("Address is required");
    }

    const response = await fetch(
      `${API_BASE_URL}/dashboard/user/${encodeURIComponent(address)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: DashboardApiResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch dashboard data"
    );
  }
}