"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import "@near-wallet-selector/modal-ui/styles.css";
import { WalletSelector } from "@near-wallet-selector/core";
import { setupWalletSelector } from "@near-wallet-selector/core";
import { setupModal } from "@near-wallet-selector/modal-ui";
import { setupMyNearWallet } from "@near-wallet-selector/my-near-wallet";
import { setupSender } from "@near-wallet-selector/sender";
import { setupHereWallet } from "@near-wallet-selector/here-wallet";
import { setupMeteorWallet } from "@near-wallet-selector/meteor-wallet";
import { setupNightly } from "@near-wallet-selector/nightly";
import { setupLedger } from "@near-wallet-selector/ledger";
// import { CONTRACT_ID } from "@/near.config";
import { providers, utils } from "near-api-js";

interface WalletContextType {
  selector: WalletSelector | null;
  modal: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  accountId: string | null;
  isConnected: boolean;
  isLoading: boolean;
  connect: () => void;
  disconnect: () => Promise<void>;
  getBalance: () => Promise<string>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

interface WalletProviderProps {
  children: ReactNode;
}

export function WalletProvider({ children }: WalletProviderProps) {
  const [selector, setSelector] = useState<WalletSelector | null>(null);
  const [modal, setModal] = useState<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [accountId, setAccountId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const getBalance = useCallback(async (): Promise<string> => {
    if (!selector || !accountId) return "0";

    try {
      // Use multiple RPC endpoints for better reliability
      const rpcEndpoints = ["https://rpc.testnet.fastnear.com"];

      let lastError;
      for (const url of rpcEndpoints) {
        try {
          const provider = new providers.JsonRpcProvider({ url });
          const res: any = await provider.query({
            // eslint-disable-line @typescript-eslint/no-explicit-any
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
    } catch (err) {
      console.error("Failed to fetch balance from all endpoints:", err);
      return "0";
    }
  }, [selector, accountId]);

  useEffect(() => {
    const init = async () => {
      try {
        const walletSelector = await setupWalletSelector({
          network: "testnet",
          modules: [
            setupMyNearWallet(),
            setupSender(),
            setupHereWallet(),
            setupMeteorWallet(),
            setupNightly(),
            setupLedger(),
          ],
        });

        const walletModal = setupModal(walletSelector, {
          contractId: "contract.testnet",
        });

        setSelector(walletSelector);
        setModal(walletModal);

        // Init state
        const state = walletSelector.store.getState();
        if (state.accounts.length > 0) {
          setAccountId(state.accounts[0].accountId);
        }

        // Subscribe to store updates
        const subscription = walletSelector.store.observable.subscribe(
          (newState) => {
            const acc = newState.accounts[0];
            setAccountId(acc?.accountId || null);
          }
        );

        return () => subscription.unsubscribe();
      } catch (err) {
        console.error("Wallet init error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, []);

  const connect = () => {
    if (modal) modal.show();
  };

  const disconnect = async () => {
    if (!selector) return;
    try {
      const wallet = await selector.wallet();
      await wallet.signOut();
      setAccountId(null);
    } catch (err) {
      console.error("Failed to disconnect:", err);
    }
  };

  const value: WalletContextType = {
    selector,
    modal,
    accountId,
    isConnected: !!accountId,
    isLoading,
    connect,
    disconnect,
    getBalance,
  };

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used within WalletProvider");
  return ctx;
}
