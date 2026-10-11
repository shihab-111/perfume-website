import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, User, Package, Sparkles, LogOut, ShieldCheck, Clock, ExternalLink, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useBrand } from '../context/BrandContext';
import { luxuryAudio } from '../utils/audio';

interface SalonPriveModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface OrderRecord {
  id: number;
  customerName: string;
  customerEmail: string;
  items: string;
  totalAmount: number;
  currency: string;
  shippingAddress: string | null;
  engravingText: string | null;
  status: string;
  createdAt: string;
}

interface BespokeBlendRecord {
  id: number;
  blendName: string;
  topNotes: string;
  heartNotes: string;
  baseNotes: string;
  flaconColor: string;
  concentration: string;
  macerationDays: number;
  createdAt: string;
}

export const SalonPriveModal: React.FC<SalonPriveModalProps> = ({ isOpen, onClose }) => {
  const { user, idToken, signInWithGoogle, signOut } = useAuth();
  const { isLight } = useTheme();
  const { brandSettings, setIsAdminModalOpen } = useBrand();

  const [activeTab, setActiveTab] = useState<'orders' | 'blends'>('orders');
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [blends, setBespokeBlends] = useState<BespokeBlendRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && user && idToken) {
      loadUserData();
    }
  }, [isOpen, user, idToken]);

  const loadUserData = async () => {
    if (!idToken) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/user/me', {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
        setBespokeBlends(data.bespokeBlends || []);
      }
    } catch (err) {
      console.error('Failed to load user records from database:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async () => {
    luxuryAudio.playTap();
    setAuthError(null);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setAuthError(err.message || 'Authentication failed');
    }
  };

  const handleSignOut = async () => {
    luxuryAudio.playTap();
    await signOut();
    setOrders([]);
    setBespokeBlends([]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={`relative w-full max-w-2xl rounded-2xl p-6 sm:p-8 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col border transition-colors ${
          isLight
            ? 'bg-[#FAF8F5] border-[#E2DDD2] text-[#1E1C18]'
            : 'bg-[#111319] border-white/10 text-[#E8E6E3]'
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close salon privé"
          className={`absolute top-4 right-4 sm:top-5 sm:right-5 z-20 p-2 rounded-full transition-colors cursor-pointer ${
            isLight
              ? 'text-black/50 hover:text-black bg-black/5 hover:bg-black/10'
              : 'text-white/50 hover:text-white bg-white/5 hover:bg-white/10'
          }`}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1 border-b pb-4 mb-6 border-[#C9A96E]/20">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#C9A96E] font-medium">
              Maison Aurelia
            </span>
            <span className="text-xs px-2 py-0.5 rounded text-[#C9A96E] bg-[#C9A96E]/10 border border-[#C9A96E]/25 text-[10px] uppercase tracking-wider">
              Cloud SQL Connected
            </span>
          </div>
          <h3 className={`text-2xl font-serif ${isLight ? 'text-[#1E1C18]' : 'text-[#F8F6F0]'}`}>
            Le Salon Privé
          </h3>
          <p className={`text-xs ${isLight ? 'text-[#696357]' : 'text-[#87837A]'}`}>
            Private collector account, allocation receipts, and bespoke formulation vault.
          </p>
        </div>

        {!user ? (
          /* Sign-In View */
          <div className="py-8 sm:py-12 flex flex-col items-center text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-[#C9A96E]/15 border border-[#C9A96E]/30 flex items-center justify-center text-[#C9A96E]">
              <User className="w-8 h-8" />
            </div>

            <div className="max-w-md space-y-2">
              <h4 className={`text-lg font-serif ${isLight ? 'text-[#1E1C18]' : 'text-white'}`}>
                Sign In to Your Collector Vault
              </h4>
              <p className={`text-xs ${isLight ? 'text-[#6E675B]' : 'text-[#8C8880]'}`}>
                Authenticate with your Google account to access your permanent orders, tracked shipments, and bespoke flacon archives stored securely in Cloud SQL PostgreSQL.
              </p>
            </div>

            {authError && (
              <p className="text-xs text-rose-500 bg-rose-500/10 px-4 py-2 rounded border border-rose-500/20 max-w-sm">
                {authError}
              </p>
            )}

            <button
              onClick={handleSignIn}
              className="px-6 py-3 bg-gradient-to-r from-[#D9BA7C] via-[#EDD6A4] to-[#C9A96E] text-[#090A0D] text-xs uppercase tracking-[0.2em] font-semibold rounded hover:opacity-95 shadow-[0_4px_20px_rgba(201,169,110,0.3)] transition-all cursor-pointer flex items-center gap-2.5"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>
        ) : (
          /* Authenticated User View */
          <div className="flex-1 flex flex-col min-h-0 space-y-6">
            {/* User Profile Bar */}
            <div
              className={`p-4 rounded-xl flex items-center justify-between border ${
                isLight ? 'bg-white border-[#E8E2D6]' : 'bg-white/[0.03] border-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'Collector'}
                    className="w-10 h-10 rounded-full border border-[#C9A96E]/40 object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#C9A96E]/20 text-[#C9A96E] flex items-center justify-center font-bold text-sm">
                    {(user.displayName || user.email || 'U')[0].toUpperCase()}
                  </div>
                )}
                <div>
                  <h4 className={`text-sm font-medium ${isLight ? 'text-[#1E1C18]' : 'text-white'}`}>
                    {user.displayName || 'Haute Parfumerie Patron'}
                  </h4>
                  <p className={`text-xs ${isLight ? 'text-[#7D766A]' : 'text-[#8C8880]'}`}>
                    {user.email}
                  </p>
                </div>
              </div>

              <button
                onClick={handleSignOut}
                className={`p-2 rounded-lg border text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                  isLight
                    ? 'border-[#DDD5C7] text-[#7D766A] hover:text-rose-600 hover:border-rose-300'
                    : 'border-white/10 text-[#8C8880] hover:text-rose-400 hover:border-rose-500/30'
                }`}
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-[#C9A96E]/20 text-xs">
              <button
                onClick={() => {
                  luxuryAudio.playTap();
                  setActiveTab('orders');
                }}
                className={`pb-3 px-4 uppercase tracking-wider font-medium cursor-pointer border-b-2 transition-colors flex items-center gap-1.5 ${
                  activeTab === 'orders'
                    ? 'border-[#C9A96E] text-[#C9A96E]'
                    : isLight
                    ? 'border-transparent text-[#7D766A] hover:text-[#1E1C18]'
                    : 'border-transparent text-[#8C8880] hover:text-white'
                }`}
              >
                <Package className="w-3.5 h-3.5" />
                <span>Orders ({orders.length})</span>
              </button>
              <button
                onClick={() => {
                  luxuryAudio.playTap();
                  setActiveTab('blends');
                }}
                className={`pb-3 px-4 uppercase tracking-wider font-medium cursor-pointer border-b-2 transition-colors flex items-center gap-1.5 ${
                  activeTab === 'blends'
                    ? 'border-[#C9A96E] text-[#C9A96E]'
                    : isLight
                    ? 'border-transparent text-[#7D766A] hover:text-[#1E1C18]'
                    : 'border-transparent text-[#8C8880] hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Bespoke Blends ({blends.length})</span>
              </button>
            </div>

            {/* Tab Contents */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 min-h-[160px]">
              {isLoading ? (
                <div className="py-8 text-center text-xs text-[#C9A96E] animate-pulse">
                  Synchronizing records from Cloud SQL...
                </div>
              ) : activeTab === 'orders' ? (
                orders.length === 0 ? (
                  <div className="py-12 text-center text-xs text-[#8C8880] space-y-2">
                    <p>No orders registered yet.</p>
                    <p className="text-[11px] text-[#C9A96E]/80">
                      Orders placed in Le Panier are permanently preserved in your PostgreSQL database.
                    </p>
                  </div>
                ) : (
                  orders.map((ord) => {
                    let itemsList: any[] = [];
                    try {
                      itemsList = JSON.parse(ord.items);
                    } catch {
                      itemsList = [];
                    }
                    return (
                      <div
                        key={ord.id}
                        className={`p-4 rounded-xl border space-y-2 text-xs ${
                          isLight
                            ? 'bg-white border-[#E8E2D6]'
                            : 'bg-white/[0.03] border-white/5'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[#C9A96E] font-medium">
                            #ORD-{String(ord.id).padStart(4, '0')}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] uppercase tracking-wider bg-emerald-500/15 text-emerald-500 font-medium">
                            {ord.status}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-sm font-serif">
                          <span>Total: ${ord.totalAmount} {ord.currency}</span>
                          <span className={`text-[11px] font-sans ${isLight ? 'text-[#7D766A]' : 'text-[#8C8880]'}`}>
                            {new Date(ord.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        {ord.engravingText && (
                          <div className="text-[11px] text-[#C9A96E]">
                            Bespoke Plaque Monogram: &quot;{ord.engravingText}&quot;
                          </div>
                        )}
                        {itemsList.length > 0 && (
                          <div className={`pt-2 border-t text-[11px] space-y-1 ${isLight ? 'border-[#F0ECE1] text-[#6E675B]' : 'border-white/5 text-[#8C8880]'}`}>
                            {itemsList.map((item, idx) => (
                              <div key={idx} className="flex justify-between">
                                <span>{item.quantity}× {item.name} ({item.size})</span>
                                <span>${item.price * item.quantity}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })
                )
              ) : (
                blends.length === 0 ? (
                  <div className="py-12 text-center text-xs text-[#8C8880] space-y-2">
                    <p>No bespoke blends formulated yet.</p>
                    <p className="text-[11px] text-[#C9A96E]/80">
                      Create a custom formulation in the atelier to record your maceration profile into PostgreSQL.
                    </p>
                  </div>
                ) : (
                  blends.map((b) => (
                    <div
                      key={b.id}
                      className={`p-4 rounded-xl border space-y-2 text-xs ${
                        isLight ? 'bg-white border-[#E8E2D6]' : 'bg-white/[0.03] border-white/5'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <h5 className="font-serif text-sm font-medium">{b.blendName}</h5>
                        <span className="text-[10px] text-[#C9A96E] font-mono">
                          {b.macerationDays}-Day Maceration
                        </span>
                      </div>
                      <div className={`text-[11px] space-y-1 ${isLight ? 'text-[#6E675B]' : 'text-[#8C8880]'}`}>
                        <div><strong className="text-[#C9A96E]">Top:</strong> {b.topNotes}</div>
                        <div><strong className="text-[#C9A96E]">Heart:</strong> {b.heartNotes}</div>
                        <div><strong className="text-[#C9A96E]">Base:</strong> {b.baseNotes}</div>
                      </div>
                    </div>
                  ))
                )
              )}
            </div>
          </div>
        )}

        {/* Director Admin Console link */}
        <div className="mt-6 pt-4 border-t border-[#C9A96E]/20 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-[11px] text-[#A6A298]">
            <span>Maison Master Directory</span>
          </div>

          <button
            onClick={() => {
              onClose();
              luxuryAudio.playTap();
              setIsAdminModalOpen(true);
            }}
            className="px-3 py-1.5 bg-[#C9A96E]/15 hover:bg-[#C9A96E]/25 text-[#DFC287] border border-[#C9A96E]/40 rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Open Atelier Admin Panel</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
