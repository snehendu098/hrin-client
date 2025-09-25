"use server";

import {
  LendEarningsApiResponse,
  UserLoansApiResponse,
  CollateralStatusApiResponse,
} from "@/types/api";

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:8080";

export async function getLendEarnings(
  address: string
): Promise<LendEarningsApiResponse> {
  try {
    if (!address) {
      throw new Error("Address is required");
    }

    const response = await fetch(
      `${API_BASE_URL}/lend/earnings/${encodeURIComponent(address)}`,
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

    const data: LendEarningsApiResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching lend earnings:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch lend earnings"
    );
  }
}

export async function getUserLoans(
  address: string
): Promise<UserLoansApiResponse> {
  try {
    if (!address) {
      throw new Error("Address is required");
    }

    const response = await fetch(
      `${API_BASE_URL}/borrow/user/${encodeURIComponent(address)}`,
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

    const data: UserLoansApiResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching user loans:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch user loans"
    );
  }
}

export async function getCollateralStatus(
  address: string
): Promise<CollateralStatusApiResponse> {
  try {
    if (!address) {
      throw new Error("Address is required");
    }

    const response = await fetch(
      `${API_BASE_URL}/collateral/status/${encodeURIComponent(address)}`,
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

    const data: CollateralStatusApiResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching collateral status:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to fetch collateral status"
    );
  }
}
