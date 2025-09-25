"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { useWallet } from './providers/WalletProvider'
import { Button } from '@/components/ui/button'
import { Wallet, LogOut, Copy, Check, RefreshCw } from 'lucide-react'

interface ConnectWalletButtonProps {
  className?: string
}

export default function ConnectWalletButton({ className }: ConnectWalletButtonProps) {
  const { accountId, isConnected, isLoading, connect, disconnect, getBalance } = useWallet()
  const [balance, setBalance] = useState<string>('0')
  const [copied, setCopied] = useState(false)
  const [isLoadingBalance, setIsLoadingBalance] = useState(false)

  const handleConnect = async () => {
    if (isConnected) {
      await disconnect()
    } else {
      connect()
    }
  }

  const handleCopyAddress = async () => {
    if (accountId) {
      await navigator.clipboard.writeText(accountId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const loadBalance = useCallback(async (showLoading = false) => {
    if (!isConnected) return;

    if (showLoading) setIsLoadingBalance(true);
    try {
      const walletBalance = await getBalance()
      setBalance(walletBalance)
    } catch (error) {
      console.error('Failed to load balance:', error)
      setBalance('0.0000')
    } finally {
      if (showLoading) setIsLoadingBalance(false);
    }
  }, [isConnected, getBalance])

  const handleRefreshBalance = async () => {
    await loadBalance(true);
  }

  useEffect(() => {
    if (isConnected) {
      const timer = setTimeout(() => {
        loadBalance()
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [isConnected, loadBalance])

  if (isLoading) {
    return (
      <Button disabled className={className}>
        <Wallet className="w-4 h-4 mr-2" />
        Loading...
      </Button>
    )
  }

  if (isConnected && accountId) {
    return (
      <div className={`flex items-center space-x-3 ${className}`}>
        <div className="flex flex-col items-end">
          <div className="flex items-center space-x-2">
            <span className="text-white/70 text-sm">Balance:</span>
            <span className="text-white font-medium">
              {isLoadingBalance ? '...' : `${balance} NEAR`}
            </span>
            <button
              onClick={handleRefreshBalance}
              disabled={isLoadingBalance}
              className="text-white/50 hover:text-white/70 transition-colors disabled:opacity-50"
              title="Refresh balance"
            >
              <RefreshCw className={`w-3 h-3 ${isLoadingBalance ? 'animate-spin' : ''}`} />
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-white/50 text-xs font-mono">
              {accountId.length > 20 ? `${accountId.slice(0, 10)}...${accountId.slice(-10)}` : accountId}
            </span>
            <button
              onClick={handleCopyAddress}
              className="text-white/50 hover:text-white/70 transition-colors"
              title="Copy address"
            >
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
        </div>
        <Button
          onClick={handleConnect}
          variant="outline"
          size="sm"
          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Disconnect
        </Button>
      </div>
    )
  }

  // ⬇Simple Button instead of ShimmerButton
  return (
    <Button onClick={handleConnect} className={className}>
      <Wallet className="w-4 h-4 mr-2" />
      <span>Connect Wallet</span>
    </Button>
  )
}