import { providers, utils } from "near-api-js";

/**
 * Test function to fetch NEAR testnet balance for any account
 * @param accountId - The NEAR account ID to check balance for
 * @returns Promise<string> - The formatted balance in NEAR
 */
export async function fetchTestnetBalance(accountId: string): Promise<string> {
  if (!accountId) return "0";

  const rpcEndpoints = [
    'https://near-testnet.api.pagoda.co/rpc/v1',
    'https://rpc.testnet.near.org',
    'https://testnet-api.kitwallet.app/rpc'
  ];

  let lastError;
  for (const url of rpcEndpoints) {
    try {
      const provider = new providers.JsonRpcProvider({ url });
      const res: any = await provider.query({ // eslint-disable-line @typescript-eslint/no-explicit-any
        request_type: "view_account",
        account_id: accountId,
        finality: "final",
      });

      if (res.amount) {
        return utils.format.formatNearAmount(res.amount, 4);
      }
    } catch (error) {
      lastError = error;
      console.warn(`Failed to fetch balance from ${url}:`, error);
      continue;
    }
  }

  throw lastError || new Error("All RPC endpoints failed");
}

/**
 * Test function to check account existence on testnet
 * @param accountId - The NEAR account ID to check
 * @returns Promise<boolean> - Whether the account exists
 */
export async function checkAccountExists(accountId: string): Promise<boolean> {
  try {
    await fetchTestnetBalance(accountId);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Get account info including balance, storage usage, etc.
 * @param accountId - The NEAR account ID to get info for
 * @returns Promise with account details
 */
export async function getAccountInfo(accountId: string) {
  if (!accountId) throw new Error("Account ID is required");

  const rpcEndpoints = [
    'https://near-testnet.api.pagoda.co/rpc/v1',
    'https://rpc.testnet.near.org'
  ];

  let lastError;
  for (const url of rpcEndpoints) {
    try {
      const provider = new providers.JsonRpcProvider({ url });
      const res: any = await provider.query({ // eslint-disable-line @typescript-eslint/no-explicit-any
        request_type: "view_account",
        account_id: accountId,
        finality: "final",
      });

      return {
        accountId,
        balance: utils.format.formatNearAmount(res.amount, 4),
        balanceYocto: res.amount,
        storageUsage: res.storage_usage,
        storagePaidAt: res.storage_paid_at,
        codeHash: res.code_hash,
        exists: true
      };
    } catch (error) {
      lastError = error;
      continue;
    }
  }

  throw lastError || new Error("All RPC endpoints failed");
}