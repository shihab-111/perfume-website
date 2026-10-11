import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Shield,
  Key,
  Save,
  Plus,
  Trash2,
  Edit3,
  Image as ImageIcon,
  DollarSign,
  Sparkles,
  RefreshCw,
  Check,
  Package,
  Layers,
  Settings,
  Star,
  LogOut,
  AlertCircle,
  Eye,
  Sliders,
  Database,
  ArrowRight,
  Unlock,
} from 'lucide-react';
import { useBrand, BrandSettings } from '../context/BrandContext';
import { Perfume, BottleTheme } from '../types/perfume';
import { luxuryAudio } from '../utils/audio';

// Curated high-res luxury perfume bottle images that admins can quick-pick or customize
const LUXURY_IMAGE_PRESETS = [
  {
    name: 'Obsidian Noir & Gold Flacon',
    url: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Crystal Amber Flacon',
    url: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Gilded Imperial Bottle',
    url: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Emerald Royal Elixir',
    url: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Velvet Midnight Flacon',
    url: 'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=800&q=80',
  },
];

interface OrderAdmin {
  id: number;
  userId: number | null;
  customerName: string;
  customerEmail: string;
  items: string;
  totalAmount: number;
  currency: string;
  shippingAddress: string;
  engravingText: string;
  status: string;
  createdAt: string;
}

interface ReviewAdmin {
  id: number;
  fragranceId: string;
  authorName: string;
  rating: number;
  comment: string;
  verified: number;
  createdAt: string;
}

export const AdminPanelModal: React.FC = () => {
  const {
    brandSettings,
    perfumes,
    isAdmin,
    isAdminModalOpen,
    setIsAdminModalOpen,
    loginAdmin,
    logoutAdmin,
    updateBrandSettings,
    updatePerfume,
    deletePerfume,
    addPerfume,
    resetPerfumes,
    formatPrice,
  } = useBrand();

  const [activeTab, setActiveTab] = useState<'brand' | 'perfumes' | 'orders' | 'reviews'>('brand');
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [isSubmittingPin, setIsSubmittingPin] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Brand Settings local edit form
  const [brandForm, setBrandForm] = useState<BrandSettings>(brandSettings);
  const [isSavingBrand, setIsSavingBrand] = useState(false);

  // Perfume edit / creation state
  const [selectedPerfumeId, setSelectedPerfumeId] = useState<string | null>(null);
  const [editingPerfume, setEditingPerfume] = useState<Perfume | null>(null);
  const [isNewPerfume, setIsNewPerfume] = useState(false);
  const [isSavingPerfume, setIsSavingPerfume] = useState(false);
  const [searchPerfume, setSearchPerfume] = useState('');

  // Orders and reviews state
  const [adminOrders, setAdminOrders] = useState<OrderAdmin[]>([]);
  const [adminReviews, setAdminReviews] = useState<ReviewAdmin[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);

  // Sync local brand form when brandSettings updates
  useEffect(() => {
    setBrandForm(brandSettings);
  }, [brandSettings]);

  // Set initial editing perfume if list exists
  useEffect(() => {
    if (perfumes.length > 0 && !selectedPerfumeId) {
      setSelectedPerfumeId(perfumes[0].id);
      setEditingPerfume(JSON.parse(JSON.stringify(perfumes[0])));
    }
  }, [perfumes, selectedPerfumeId]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    luxuryAudio.playChime(784, 0.08);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinInput.trim()) return;
    setIsSubmittingPin(true);
    setPinError('');
    const ok = await loginAdmin(pinInput.trim());
    setIsSubmittingPin(false);
    if (ok) {
      setPinInput('');
      luxuryAudio.playChime(880, 0.1);
      showToast('Master Atelier Access Granted');
    } else {
      setPinError('Invalid Atelier Passcode. Try default: admin123');
      luxuryAudio.playTap();
    }
  };

  const handleSaveBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingBrand(true);
    const ok = await updateBrandSettings(brandForm);
    setIsSavingBrand(false);
    if (ok) {
      showToast('Maison Brand & Logo Updated across all salons');
    } else {
      showToast('Error saving settings to Cloud SQL');
    }
  };

  const handleSelectPerfume = (p: Perfume) => {
    setSelectedPerfumeId(p.id);
    setEditingPerfume(JSON.parse(JSON.stringify(p)));
    setIsNewPerfume(false);
  };

  const handleCreateNewPerfume = () => {
    const newId = `creation-${Date.now().toString().slice(-5)}`;
    const blankPerfume: Perfume = {
      id: newId,
      name: 'Nouveau Millésime',
      subtitle: 'Extrait de Parfum',
      category: 'Extrait de Parfum',
      concentration: '30% Pure Extrait',
      tagline: 'Rare Botanicals & Noble Resins',
      story: 'Distilled in French oak barrels with precious artisanal essences.',
      price50ml: 320,
      price100ml: 460,
      longevity: '14+ Hours',
      sillage: 'Sovereign & Enveloping',
      season: 'All Seasons',
      timeOfDay: 'Evening & Dusk',
      liquidColor: '#C4823F',
      liquidGradient: 'from-[#542B0D] via-[#94551F] to-[#D99A4E]',
      accentColor: '#D99A4E',
      bottleTheme: 'obsidian',
      featured: false,
      harvestNotes: 'Ethically harvested single-estate botanicals.',
      accords: [
        { name: 'Warm Ambergris', percentage: 88 },
        { name: 'Precious Woods', percentage: 80 },
        { name: 'Velvet Floral', percentage: 65 },
      ],
      pyramid: {
        top: [{ name: 'Bergamot Calabrèse', origin: 'Italy', scentCharacter: 'Sparkling citrus', temperature: 'Crisp & Cool', volatility: 'High' }],
        heart: [{ name: 'Rose de Mai Absolute', origin: 'Grasse', scentCharacter: 'Velvet honeyed petals', temperature: 'Velvet & Floral', volatility: 'Medium' }],
        base: [{ name: 'Aged Amber & Oud', origin: 'Artisanal', scentCharacter: 'Balsamic dark resin', temperature: 'Warm & Resinous', volatility: 'Low' }],
      },
    };
    setSelectedPerfumeId(newId);
    setEditingPerfume(blankPerfume);
    setIsNewPerfume(true);
  };

  const handleSavePerfume = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPerfume) return;
    setIsSavingPerfume(true);
    let ok = false;
    if (isNewPerfume) {
      ok = await addPerfume(editingPerfume);
      setIsNewPerfume(false);
    } else {
      ok = await updatePerfume(editingPerfume);
    }
    setIsSavingPerfume(false);
    if (ok) {
      showToast(`Flacon "${editingPerfume.name}" saved to Cloud SQL`);
    } else {
      showToast('Error saving perfume to Cloud SQL');
    }
  };

  const handleDeletePerfume = async () => {
    if (!editingPerfume) return;
    if (perfumes.length <= 1) {
      alert('The boutique must keep at least one signature flacon.');
      return;
    }
    if (window.confirm(`Are you certain you wish to retire "${editingPerfume.name}" from the collection?`)) {
      await deletePerfume(editingPerfume.id);
      showToast(`Retired "${editingPerfume.name}"`);
      const remaining = perfumes.filter(p => p.id !== editingPerfume.id);
      if (remaining.length > 0) {
        handleSelectPerfume(remaining[0]);
      }
    }
  };

  const handleResetCatalog = async () => {
    if (window.confirm('Restore original curated Heritage Collection? Any uncommitted drafts will be reset.')) {
      await resetPerfumes();
      showToast('Heritage catalog restored from master formulation');
    }
  };

  // Load orders when entering orders tab
  const fetchOrders = async () => {
    setIsLoadingOrders(true);
    try {
      const res = await fetch('/api/admin/orders');
      if (res.ok) {
        const data = await res.json();
        setAdminOrders(data);
      }
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setAdminOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        showToast(`Order #${orderId} marked as ${newStatus}`);
      }
    } catch (err) {
      console.error('Status update failed:', err);
    }
  };

  // Load reviews when entering reviews tab
  const fetchReviews = async () => {
    setIsLoadingReviews(true);
    try {
      const res = await fetch('/api/reviews');
      if (res.ok) {
        const data = await res.json();
        setAdminReviews(data);
      }
    } catch (err) {
      console.error('Failed to load reviews:', err);
    } finally {
      setIsLoadingReviews(false);
    }
  };

  const handleDeleteReview = async (reviewId: number) => {
    if (window.confirm('Delete this client review permanently?')) {
      try {
        const res = await fetch(`/api/admin/reviews/${reviewId}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          setAdminReviews(prev => prev.filter(r => r.id !== reviewId));
          showToast('Review removed from salon');
        }
      } catch (err) {
        console.error('Delete review error:', err);
      }
    }
  };

  useEffect(() => {
    if (isAdmin && activeTab === 'orders') {
      fetchOrders();
    } else if (isAdmin && activeTab === 'reviews') {
      fetchReviews();
    }
  }, [isAdmin, activeTab]);

  if (!isAdminModalOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setIsAdminModalOpen(false)}
        className="fixed inset-0 bg-[#060709]/85 backdrop-blur-md"
      />

      {/* Main Admin Console Card */}
      <motion.div
        initial={{ scale: 0.96, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.96, opacity: 0, y: 16 }}
        transition={{ type: 'spring', damping: 28, stiffness: 320 }}
        className="relative w-full max-w-6xl max-h-[92vh] flex flex-col bg-[#0B0D13] border border-[#C9A96E]/30 text-[#F5F2EB] rounded-2xl shadow-[0_24px_80px_rgba(0,0,0,0.85)] overflow-hidden"
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-5 sm:px-7 py-4 border-b border-white/[0.08] bg-black/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#C9A96E] via-[#A88243] to-[#765620] flex items-center justify-center text-[#090A0E] shadow-[0_2px_12px_rgba(201,169,110,0.3)]">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-serif tracking-[0.16em] uppercase text-[#F5F2EB]">
                  Maison Atelier Admin Panel
                </h2>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#C9A96E]/15 text-[#C9A96E] border border-[#C9A96E]/30 tracking-widest">
                  Live Cloud SQL
                </span>
              </div>
              <p className="text-[11px] text-[#A6A298] tracking-wider">
                Full Director Control: Parfume Images, Brand Identity, Logo, Pricing & Real Database Catalog
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdmin && (
              <button
                onClick={() => {
                  logoutAdmin();
                  showToast('Signed out of Atelier Admin');
                }}
                title="Lock Console"
                className="p-2 text-[#9A9589] hover:text-[#C9A96E] hover:bg-white/5 rounded-lg text-xs flex items-center gap-1.5 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline text-[11px] uppercase tracking-wider">Lock</span>
              </button>
            )}

            <button
              onClick={() => {
                luxuryAudio.playTap();
                setIsAdminModalOpen(false);
              }}
              className="p-2 text-[#9A9589] hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              aria-label="Close Admin Console"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toast alert */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-[#C9A96E] text-[#0A0B0E] text-xs font-medium rounded-lg shadow-xl flex items-center gap-2 border border-white/20 tracking-wider uppercase"
            >
              <Check className="w-4 h-4" />
              <span>{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content Area */}
        {!isAdmin ? (
          /* Locked State - Passcode Gate */
          <div className="flex-1 p-8 sm:p-12 flex flex-col items-center justify-center text-center max-w-md mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-[#C9A96E]/30 flex items-center justify-center text-[#C9A96E] mb-5 shadow-[0_0_30px_rgba(201,169,110,0.15)]">
              <Key className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-serif tracking-[0.2em] uppercase text-white mb-2">
              Atelier Director Passcode
            </h3>
            <p className="text-xs text-[#9E988D] mb-6 leading-relaxed">
              Enter the master atelier security key to modify perfumes, images, prices, brand nomenclature, and manage Cloud SQL database orders.
            </p>

            <form onSubmit={handlePinSubmit} className="w-full space-y-4">
              <div className="relative">
                <input
                  type="password"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="Enter Master PIN (e.g. admin123)"
                  autoFocus
                  className="w-full px-4 py-3 bg-black/50 border border-white/20 focus:border-[#C9A96E] focus:outline-none rounded-xl text-center text-sm font-mono tracking-[0.3em] text-[#F5F2EB] placeholder:text-stone-600 transition-colors"
                />
              </div>

              {pinError && (
                <p className="text-xs text-rose-400 flex items-center justify-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {pinError}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmittingPin}
                className="w-full py-3 bg-gradient-to-r from-[#C9A96E] via-[#DFC287] to-[#B89456] text-[#090A0D] text-xs uppercase tracking-[0.2em] font-semibold rounded-xl hover:opacity-95 shadow-[0_4px_20px_rgba(201,169,110,0.25)] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Unlock className="w-4 h-4" />
                <span>{isSubmittingPin ? 'Verifying...' : 'Unlock Admin Console'}</span>
              </button>

              <div className="pt-2 text-[11px] text-[#7E7A71]">
                Master Default PIN: <span className="font-mono text-[#C9A96E]">admin123</span>
              </div>
            </form>
          </div>
        ) : (
          /* Unlocked Admin Interface */
          <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
            {/* Sidebar Navigation */}
            <div className="w-full md:w-60 border-b md:border-b-0 md:border-r border-white/[0.08] bg-black/25 p-3 sm:p-4 flex md:flex-col gap-1.5 shrink-0 overflow-x-auto md:overflow-y-auto">
              <button
                onClick={() => setActiveTab('brand')}
                className={`flex-1 md:flex-none flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs uppercase tracking-wider font-medium transition-colors text-left cursor-pointer whitespace-nowrap ${
                  activeTab === 'brand'
                    ? 'bg-[#C9A96E]/20 text-[#DFC287] border border-[#C9A96E]/40 font-semibold'
                    : 'text-[#9E988D] hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <Settings className="w-4 h-4 shrink-0" />
                <span>Brand & Logo</span>
              </button>

              <button
                onClick={() => setActiveTab('perfumes')}
                className={`flex-1 md:flex-none flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs uppercase tracking-wider font-medium transition-colors text-left cursor-pointer whitespace-nowrap ${
                  activeTab === 'perfumes'
                    ? 'bg-[#C9A96E]/20 text-[#DFC287] border border-[#C9A96E]/40 font-semibold'
                    : 'text-[#9E988D] hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>Perfumes Catalog</span>
                <span className="ml-auto text-[10px] px-1.5 py-0.2 rounded bg-white/10 text-stone-300">
                  {perfumes.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('orders')}
                className={`flex-1 md:flex-none flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs uppercase tracking-wider font-medium transition-colors text-left cursor-pointer whitespace-nowrap ${
                  activeTab === 'orders'
                    ? 'bg-[#C9A96E]/20 text-[#DFC287] border border-[#C9A96E]/40 font-semibold'
                    : 'text-[#9E988D] hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <Package className="w-4 h-4 shrink-0" />
                <span>Client Orders</span>
                <span className="ml-auto text-[10px] px-1.5 py-0.2 rounded bg-white/10 text-stone-300">
                  SQL
                </span>
              </button>

              <button
                onClick={() => setActiveTab('reviews')}
                className={`flex-1 md:flex-none flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs uppercase tracking-wider font-medium transition-colors text-left cursor-pointer whitespace-nowrap ${
                  activeTab === 'reviews'
                    ? 'bg-[#C9A96E]/20 text-[#DFC287] border border-[#C9A96E]/40 font-semibold'
                    : 'text-[#9E988D] hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <Star className="w-4 h-4 shrink-0" />
                <span>Reviews</span>
              </button>

              <div className="hidden md:block mt-auto pt-4 border-t border-white/[0.08] text-[11px] text-[#7A756C] space-y-2">
                <div className="flex items-center gap-2 text-[#C9A96E]">
                  <Database className="w-3.5 h-3.5" />
                  <span>Cloud SQL Asia</span>
                </div>
                <p className="leading-tight text-[10px]">
                  All edits write directly to PostgreSQL tables.
                </p>
              </div>
            </div>

            {/* Main Tab View */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 min-h-0 bg-[#090A0F]">
              {/* TAB 1: BRAND IDENTITY & LOGO */}
              {activeTab === 'brand' && (
                <form onSubmit={handleSaveBrand} className="max-w-3xl space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                    <div>
                      <h3 className="text-lg font-serif tracking-[0.12em] text-[#F5F2EB] uppercase">
                        Maison Brand & Logo Configuration
                      </h3>
                      <p className="text-xs text-[#9E988D]">
                        Changes reflect live across the entire boutique, navbar, flacons, footer, and packaging.
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={isSavingBrand}
                      className="px-5 py-2.5 bg-gradient-to-r from-[#C9A96E] to-[#B89456] text-[#0A0B0E] text-xs uppercase tracking-[0.16em] font-semibold rounded-lg hover:opacity-95 shadow-md flex items-center gap-2 cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{isSavingBrand ? 'Saving to SQL...' : 'Save Brand Settings'}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Brand Name */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-[#C9A96E] uppercase tracking-wider block">
                        Maison Brand Name
                      </label>
                      <input
                        type="text"
                        value={brandForm.brandName}
                        onChange={(e) => setBrandForm({ ...brandForm, brandName: e.target.value })}
                        placeholder="e.g. AURELIA or TOONHUB"
                        required
                        className="w-full px-3.5 py-2.5 bg-white/[0.04] border border-white/15 focus:border-[#C9A96E] rounded-lg text-sm text-white focus:outline-none"
                      />
                      <span className="text-[10px] text-[#7E7A71]">
                        Shown in header navigation, hero section, and browser tab title.
                      </span>
                    </div>

                    {/* Logo Wordmark Text */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-[#C9A96E] uppercase tracking-wider block">
                        Header Logo Text / Wordmark
                      </label>
                      <input
                        type="text"
                        value={brandForm.logoText}
                        onChange={(e) => setBrandForm({ ...brandForm, logoText: e.target.value })}
                        placeholder="e.g. AURELIA"
                        className="w-full px-3.5 py-2.5 bg-white/[0.04] border border-white/15 focus:border-[#C9A96E] rounded-lg text-sm text-white focus:outline-none"
                      />
                      <span className="text-[10px] text-[#7E7A71]">
                        The typographic wordmark rendered in the top-left navigation.
                      </span>
                    </div>

                    {/* Logo Image URL (Optional custom emblem/logo) */}
                    <div className="md:col-span-2 space-y-1.5">
                      <label className="text-xs font-medium text-[#C9A96E] uppercase tracking-wider block">
                        Custom Logo Image / Emblem URL (Optional)
                      </label>
                      <div className="flex gap-3">
                        <input
                          type="url"
                          value={brandForm.logoUrl}
                          onChange={(e) => setBrandForm({ ...brandForm, logoUrl: e.target.value })}
                          placeholder="https://example.com/brand-logo.png or SVG URL"
                          className="flex-1 px-3.5 py-2.5 bg-white/[0.04] border border-white/15 focus:border-[#C9A96E] rounded-lg text-sm text-white focus:outline-none"
                        />
                        {brandForm.logoUrl && (
                          <div className="h-10 px-3 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center">
                            <img
                              src={brandForm.logoUrl}
                              alt="Logo Preview"
                              className="max-h-7 max-w-[120px] object-contain"
                              onError={(e) => (e.currentTarget.style.display = 'none')}
                            />
                          </div>
                        )}
                      </div>
                      <span className="text-[10px] text-[#7E7A71]">
                        If provided, this image or emblem logo is displayed in place of or beside the brand text in the Navbar.
                      </span>
                    </div>

                    {/* Hero Headline */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-[#C9A96E] uppercase tracking-wider block">
                        Hero Banner Headline
                      </label>
                      <input
                        type="text"
                        value={brandForm.heroHeadline}
                        onChange={(e) => setBrandForm({ ...brandForm, heroHeadline: e.target.value })}
                        placeholder="e.g. HAUTE PARFUMERIE"
                        className="w-full px-3.5 py-2.5 bg-white/[0.04] border border-white/15 focus:border-[#C9A96E] rounded-lg text-sm text-white focus:outline-none"
                      />
                    </div>

                    {/* Currency */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-[#C9A96E] uppercase tracking-wider block">
                        Currency
                      </label>
                      <select
                        value={brandForm.currency}
                        onChange={(e) => setBrandForm({ ...brandForm, currency: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-[#14161E] border border-white/15 focus:border-[#C9A96E] rounded-lg text-sm text-white focus:outline-none cursor-pointer"
                      >
                        <option value="USD">USD ($) · United States Dollar</option>
                        <option value="EUR">EUR (€) · Euro</option>
                        <option value="GBP">GBP (£) · British Pound</option>
                        <option value="JPY">JPY (¥) · Japanese Yen</option>
                      </select>
                    </div>

                    {/* Hero Subheadline */}
                    <div className="md:col-span-2 space-y-1.5">
                      <label className="text-xs font-medium text-[#C9A96E] uppercase tracking-wider block">
                        Hero Subheadline
                      </label>
                      <input
                        type="text"
                        value={brandForm.heroSubheadline}
                        onChange={(e) => setBrandForm({ ...brandForm, heroSubheadline: e.target.value })}
                        placeholder="e.g. Bespoke Olfactory Masterpieces Aged in French Limousin Oak"
                        className="w-full px-3.5 py-2.5 bg-white/[0.04] border border-white/15 focus:border-[#C9A96E] rounded-lg text-sm text-white focus:outline-none"
                      />
                    </div>

                    {/* Brand Tagline */}
                    <div className="md:col-span-2 space-y-1.5">
                      <label className="text-xs font-medium text-[#C9A96E] uppercase tracking-wider block">
                        Maison Heritage Story / Tagline
                      </label>
                      <textarea
                        rows={2}
                        value={brandForm.brandTagline}
                        onChange={(e) => setBrandForm({ ...brandForm, brandTagline: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white/[0.04] border border-white/15 focus:border-[#C9A96E] rounded-lg text-sm text-white focus:outline-none"
                      />
                    </div>

                    {/* Announcement Bar */}
                    <div className="md:col-span-2 space-y-1.5">
                      <label className="text-xs font-medium text-[#C9A96E] uppercase tracking-wider block">
                        Top Announcement Ribbon Text
                      </label>
                      <input
                        type="text"
                        value={brandForm.announcementBar}
                        onChange={(e) => setBrandForm({ ...brandForm, announcementBar: e.target.value })}
                        placeholder="Ribbon banner text at top of screen"
                        className="w-full px-3.5 py-2.5 bg-white/[0.04] border border-white/15 focus:border-[#C9A96E] rounded-lg text-sm text-white focus:outline-none"
                      />
                    </div>

                    {/* Flagship Salon Cities */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-[#C9A96E] uppercase tracking-wider block">
                        Flagship Salon Cities
                      </label>
                      <input
                        type="text"
                        value={brandForm.brandCities}
                        onChange={(e) => setBrandForm({ ...brandForm, brandCities: e.target.value })}
                        placeholder="Paris · Grasse · London · Tokyo · Dubai"
                        className="w-full px-3.5 py-2.5 bg-white/[0.04] border border-white/15 focus:border-[#C9A96E] rounded-lg text-sm text-white focus:outline-none"
                      />
                    </div>

                    {/* Admin Access Passcode */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-[#C9A96E] uppercase tracking-wider block">
                        Master Atelier Passcode (PIN)
                      </label>
                      <input
                        type="text"
                        value={brandForm.adminPin}
                        onChange={(e) => setBrandForm({ ...brandForm, adminPin: e.target.value })}
                        placeholder="e.g. admin123"
                        className="w-full px-3.5 py-2.5 bg-white/[0.04] border border-white/15 focus:border-[#C9A96E] rounded-lg text-sm font-mono text-white focus:outline-none"
                      />
                      <span className="text-[10px] text-[#7E7A71]">
                        Used to unlock this Admin panel.
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 flex items-center justify-between border-t border-white/[0.08]">
                    <div className="text-[11px] text-[#A6A298]">
                      Stored securely in Cloud SQL table <code className="text-[#C9A96E]">site_settings</code>.
                    </div>
                    <button
                      type="submit"
                      disabled={isSavingBrand}
                      className="px-6 py-2.5 bg-gradient-to-r from-[#C9A96E] to-[#B89456] text-[#0A0B0E] text-xs uppercase tracking-[0.16em] font-semibold rounded-lg hover:opacity-95 shadow-md flex items-center gap-2 cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{isSavingBrand ? 'Saving...' : 'Apply Brand Settings'}</span>
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 2: PERFUMES & FLACONS CATALOG MANAGER */}
              {activeTab === 'perfumes' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left Column: Perfume List */}
                  <div className="lg:col-span-4 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-sm font-serif tracking-[0.14em] text-[#F5F2EB] uppercase">
                        Master Flacons
                      </h4>
                      <button
                        onClick={handleCreateNewPerfume}
                        className="px-2.5 py-1.5 bg-[#C9A96E] text-[#0A0B0E] text-[11px] uppercase tracking-wider font-semibold rounded flex items-center gap-1 hover:opacity-95 cursor-pointer shadow"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>New Flacon</span>
                      </button>
                    </div>

                    <input
                      type="text"
                      placeholder="Search flacons..."
                      value={searchPerfume}
                      onChange={(e) => setSearchPerfume(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white/[0.04] border border-white/10 rounded-lg text-xs text-white placeholder:text-stone-500 focus:outline-none focus:border-[#C9A96E]"
                    />

                    <div className="space-y-2 max-h-[550px] overflow-y-auto pr-1">
                      {perfumes
                        .filter(p => p.name.toLowerCase().includes(searchPerfume.toLowerCase()) || p.subtitle.toLowerCase().includes(searchPerfume.toLowerCase()))
                        .map(p => {
                          const isSelected = editingPerfume?.id === p.id;
                          return (
                            <div
                              key={p.id}
                              onClick={() => handleSelectPerfume(p)}
                              className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
                                isSelected
                                  ? 'bg-[#C9A96E]/15 border-[#C9A96E] shadow-[0_2px_12px_rgba(201,169,110,0.15)]'
                                  : 'bg-white/[0.02] border-white/10 hover:border-white/25 hover:bg-white/[0.05]'
                              }`}
                            >
                              {/* Flacon Color preview swatch or thumbnail */}
                              <div
                                className="w-10 h-10 rounded-lg border border-white/20 shrink-0 flex items-center justify-center overflow-hidden"
                                style={{ backgroundColor: p.liquidColor }}
                              >
                                {p.imageUrl ? (
                                  <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-2.5 h-6 rounded-sm bg-black/30 border border-white/30" />
                                )}
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-serif font-medium text-white truncate">
                                    {p.name}
                                  </span>
                                  {p.featured && (
                                    <span className="text-[9px] px-1 py-0.2 rounded bg-[#C9A96E]/20 text-[#C9A96E] uppercase font-mono">
                                      Hero
                                    </span>
                                  )}
                                </div>
                                <div className="text-[11px] text-[#A6A298] truncate">
                                  {p.category} · {formatPrice(p.price50ml)} / {formatPrice(p.price100ml)}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={handleResetCatalog}
                        className="w-full py-2 bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-[#A6A298] hover:text-white rounded-lg text-[11px] uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Restore Default Catalog</span>
                      </button>
                    </div>
                  </div>

                  {/* Right Column: Perfume Detail Edit Form */}
                  <div className="lg:col-span-8 bg-white/[0.02] border border-white/10 rounded-xl p-4 sm:p-6 min-h-0">
                    {editingPerfume ? (
                      <form onSubmit={handleSavePerfume} className="space-y-5">
                        <div className="flex items-center justify-between pb-3 border-b border-white/10">
                          <div>
                            <span className="text-[10px] uppercase font-mono tracking-widest text-[#C9A96E]">
                              {isNewPerfume ? 'Formulating New Creation' : `Editing Flacon: ${editingPerfume.name}`}
                            </span>
                            <h4 className="text-base font-serif text-white">
                              {editingPerfume.name}
                            </h4>
                          </div>

                          <div className="flex items-center gap-2">
                            {!isNewPerfume && (
                              <button
                                type="button"
                                onClick={handleDeletePerfume}
                                className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Delete</span>
                              </button>
                            )}

                            <button
                              type="submit"
                              disabled={isSavingPerfume}
                              className="px-4 py-1.5 bg-gradient-to-r from-[#C9A96E] to-[#B89456] text-[#0A0B0E] rounded text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5 hover:opacity-95 shadow cursor-pointer"
                            >
                              <Save className="w-3.5 h-3.5" />
                              <span>{isSavingPerfume ? 'Saving...' : 'Save Flacon'}</span>
                            </button>
                          </div>
                        </div>

                        {/* Basic Details: Name, Category, Prices */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                          <div className="space-y-1">
                            <label className="text-[11px] uppercase tracking-wider text-[#C9A96E] font-medium">
                              Perfume Name
                            </label>
                            <input
                              type="text"
                              value={editingPerfume.name}
                              onChange={(e) => setEditingPerfume({ ...editingPerfume, name: e.target.value })}
                              required
                              className="w-full px-3 py-2 bg-white/5 border border-white/15 rounded text-xs text-white focus:outline-none focus:border-[#C9A96E]"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[11px] uppercase tracking-wider text-[#C9A96E] font-medium">
                              Subtitle / Classification
                            </label>
                            <input
                              type="text"
                              value={editingPerfume.subtitle}
                              onChange={(e) => setEditingPerfume({ ...editingPerfume, subtitle: e.target.value })}
                              className="w-full px-3 py-2 bg-white/5 border border-white/15 rounded text-xs text-white focus:outline-none focus:border-[#C9A96E]"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[11px] uppercase tracking-wider text-[#C9A96E] font-medium">
                              Concentration
                            </label>
                            <input
                              type="text"
                              value={editingPerfume.concentration}
                              onChange={(e) => setEditingPerfume({ ...editingPerfume, concentration: e.target.value })}
                              placeholder="e.g. 32% Pure Extrait"
                              className="w-full px-3 py-2 bg-white/5 border border-white/15 rounded text-xs text-white focus:outline-none focus:border-[#C9A96E]"
                            />
                          </div>

                          {/* 50ml Price */}
                          <div className="space-y-1">
                            <label className="text-[11px] uppercase tracking-wider text-[#C9A96E] font-medium flex items-center gap-1">
                              <DollarSign className="w-3 h-3" />
                              Price (50ml Flacon)
                            </label>
                            <input
                              type="number"
                              min="1"
                              value={editingPerfume.price50ml}
                              onChange={(e) => setEditingPerfume({ ...editingPerfume, price50ml: Number(e.target.value) || 0 })}
                              required
                              className="w-full px-3 py-2 bg-white/5 border border-white/15 rounded text-xs font-mono text-white focus:outline-none focus:border-[#C9A96E]"
                            />
                          </div>

                          {/* 100ml Price */}
                          <div className="space-y-1">
                            <label className="text-[11px] uppercase tracking-wider text-[#C9A96E] font-medium flex items-center gap-1">
                              <DollarSign className="w-3 h-3" />
                              Price (100ml Master)
                            </label>
                            <input
                              type="number"
                              min="1"
                              value={editingPerfume.price100ml}
                              onChange={(e) => setEditingPerfume({ ...editingPerfume, price100ml: Number(e.target.value) || 0 })}
                              required
                              className="w-full px-3 py-2 bg-white/5 border border-white/15 rounded text-xs font-mono text-white focus:outline-none focus:border-[#C9A96E]"
                            />
                          </div>

                          {/* Featured In Hero */}
                          <div className="space-y-1 flex flex-col justify-end">
                            <label className="flex items-center gap-2 p-2 bg-white/5 rounded border border-white/15 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={!!editingPerfume.featured}
                                onChange={(e) => {
                                  // Set this perfume as featured and unset others
                                  setEditingPerfume({ ...editingPerfume, featured: e.target.checked });
                                }}
                                className="accent-[#C9A96E] w-4 h-4"
                              />
                              <span className="text-xs text-white font-medium">Hero Spotlight</span>
                            </label>
                          </div>
                        </div>

                        {/* IMAGE CONTROL: Custom Bottle Image URL & Presets */}
                        <div className="p-4 rounded-xl bg-black/40 border border-[#C9A96E]/20 space-y-3">
                          <div className="flex items-center justify-between">
                            <label className="text-xs uppercase tracking-wider text-[#C9A96E] font-semibold flex items-center gap-1.5">
                              <ImageIcon className="w-4 h-4" />
                              <span>Perfume Image Control</span>
                            </label>
                            <span className="text-[10px] text-[#A6A298]">
                              Specify custom bottle photo URL or choose a luxury preset
                            </span>
                          </div>

                          <div className="flex flex-col sm:flex-row gap-3 items-start">
                            <div className="flex-1 w-full space-y-2">
                              <input
                                type="url"
                                value={editingPerfume.imageUrl || ''}
                                onChange={(e) => setEditingPerfume({ ...editingPerfume, imageUrl: e.target.value })}
                                placeholder="Paste image URL (https://... or unsplash/CDN)"
                                className="w-full px-3 py-2 bg-white/5 border border-white/15 rounded text-xs text-white focus:outline-none focus:border-[#C9A96E]"
                              />

                              {/* Quick Presets */}
                              <div className="space-y-1">
                                <span className="text-[10px] uppercase text-[#7A756C] font-mono block">
                                  Quick Luxury Bottle Presets:
                                </span>
                                <div className="flex flex-wrap gap-1.5">
                                  {LUXURY_IMAGE_PRESETS.map((preset, idx) => (
                                    <button
                                      type="button"
                                      key={idx}
                                      onClick={() => setEditingPerfume({ ...editingPerfume, imageUrl: preset.url })}
                                      className="text-[10px] px-2 py-1 rounded bg-white/5 hover:bg-[#C9A96E]/20 hover:text-[#C9A96E] border border-white/10 text-stone-300 transition-colors"
                                    >
                                      {preset.name}
                                    </button>
                                  ))}
                                  {editingPerfume.imageUrl && (
                                    <button
                                      type="button"
                                      onClick={() => setEditingPerfume({ ...editingPerfume, imageUrl: '' })}
                                      className="text-[10px] px-2 py-1 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20"
                                    >
                                      Clear (Use SVG Flacon)
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Live Image Preview Card */}
                            <div className="w-24 h-24 rounded-lg bg-black/60 border border-white/20 overflow-hidden shrink-0 flex items-center justify-center relative">
                              {editingPerfume.imageUrl ? (
                                <img
                                  src={editingPerfume.imageUrl}
                                  alt="Flacon Preview"
                                  className="w-full h-full object-cover"
                                  onError={(e) => (e.currentTarget.src = '')}
                                />
                              ) : (
                                <div
                                  className="w-full h-full flex flex-col items-center justify-center text-[10px] text-stone-400 p-1 text-center"
                                  style={{ backgroundColor: editingPerfume.liquidColor }}
                                >
                                  <Sparkles className="w-4 h-4 text-white/70 mb-1" />
                                  <span className="text-[9px] text-white/90">SVG Glass Flacon</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Flacon Visual Colors & Themes */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="space-y-1">
                            <label className="text-[11px] uppercase tracking-wider text-[#C9A96E] font-medium">
                              Flacon Liquid Color (Hex)
                            </label>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={editingPerfume.liquidColor}
                                onChange={(e) => setEditingPerfume({ ...editingPerfume, liquidColor: e.target.value })}
                                className="w-8 h-8 rounded border border-white/20 bg-transparent cursor-pointer"
                              />
                              <input
                                type="text"
                                value={editingPerfume.liquidColor}
                                onChange={(e) => setEditingPerfume({ ...editingPerfume, liquidColor: e.target.value })}
                                className="flex-1 px-3 py-2 bg-white/5 border border-white/15 rounded text-xs font-mono text-white focus:outline-none"
                              />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[11px] uppercase tracking-wider text-[#C9A96E] font-medium">
                              Accent Brass Color (Hex)
                            </label>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={editingPerfume.accentColor}
                                onChange={(e) => setEditingPerfume({ ...editingPerfume, accentColor: e.target.value })}
                                className="w-8 h-8 rounded border border-white/20 bg-transparent cursor-pointer"
                              />
                              <input
                                type="text"
                                value={editingPerfume.accentColor}
                                onChange={(e) => setEditingPerfume({ ...editingPerfume, accentColor: e.target.value })}
                                className="flex-1 px-3 py-2 bg-white/5 border border-white/15 rounded text-xs font-mono text-white focus:outline-none"
                              />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[11px] uppercase tracking-wider text-[#C9A96E] font-medium">
                              Glass Bottle Theme
                            </label>
                            <select
                              value={editingPerfume.bottleTheme}
                              onChange={(e) => setEditingPerfume({ ...editingPerfume, bottleTheme: e.target.value as any })}
                              className="w-full px-3 py-2 bg-[#14161E] border border-white/15 rounded text-xs text-white focus:outline-none"
                            >
                              <option value="obsidian">Obsidian (Smoked Charcoal)</option>
                              <option value="amber">Amber (Golden Resin)</option>
                              <option value="crystal">Crystal (Pure Diamond)</option>
                              <option value="emerald">Emerald (Deep Botanical)</option>
                              <option value="garnet">Garnet (Ruby Nocturne)</option>
                            </select>
                          </div>
                        </div>

                        {/* Tagline & Story */}
                        <div className="space-y-3">
                          <div className="space-y-1">
                            <label className="text-[11px] uppercase tracking-wider text-[#C9A96E] font-medium">
                              Olfactory Tagline
                            </label>
                            <input
                              type="text"
                              value={editingPerfume.tagline}
                              onChange={(e) => setEditingPerfume({ ...editingPerfume, tagline: e.target.value })}
                              placeholder="e.g. Smoked Cambodian Agarwood & Damask Rose"
                              className="w-full px-3 py-2 bg-white/5 border border-white/15 rounded text-xs text-white focus:outline-none focus:border-[#C9A96E]"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[11px] uppercase tracking-wider text-[#C9A96E] font-medium">
                              Maison Scent Story & Inspiration
                            </label>
                            <textarea
                              rows={3}
                              value={editingPerfume.story}
                              onChange={(e) => setEditingPerfume({ ...editingPerfume, story: e.target.value })}
                              className="w-full px-3 py-2 bg-white/5 border border-white/15 rounded text-xs text-white focus:outline-none focus:border-[#C9A96E]"
                            />
                          </div>
                        </div>

                        {/* Longevity, Sillage, Harvest */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="space-y-1">
                            <label className="text-[11px] uppercase tracking-wider text-[#C9A96E] font-medium">
                              Longevity
                            </label>
                            <input
                              type="text"
                              value={editingPerfume.longevity}
                              onChange={(e) => setEditingPerfume({ ...editingPerfume, longevity: e.target.value })}
                              placeholder="e.g. 16+ Hours"
                              className="w-full px-3 py-2 bg-white/5 border border-white/15 rounded text-xs text-white focus:outline-none"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[11px] uppercase tracking-wider text-[#C9A96E] font-medium">
                              Sillage
                            </label>
                            <input
                              type="text"
                              value={editingPerfume.sillage}
                              onChange={(e) => setEditingPerfume({ ...editingPerfume, sillage: e.target.value })}
                              placeholder="e.g. Sovereign & Enveloping"
                              className="w-full px-3 py-2 bg-white/5 border border-white/15 rounded text-xs text-white focus:outline-none"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[11px] uppercase tracking-wider text-[#C9A96E] font-medium">
                              Season
                            </label>
                            <input
                              type="text"
                              value={editingPerfume.season}
                              onChange={(e) => setEditingPerfume({ ...editingPerfume, season: e.target.value })}
                              placeholder="e.g. Autumn / Winter"
                              className="w-full px-3 py-2 bg-white/5 border border-white/15 rounded text-xs text-white focus:outline-none"
                            />
                          </div>
                        </div>

                        {/* Olfactory Pyramid (Top, Heart, Base Summary) */}
                        <div className="p-3 bg-white/[0.03] border border-white/10 rounded-lg space-y-2">
                          <span className="text-xs uppercase tracking-wider text-[#C9A96E] font-semibold block">
                            Olfactory Pyramid (Core Ingredients)
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                            <div>
                              <span className="text-[10px] text-stone-400 uppercase font-mono block">Top Notes:</span>
                              <input
                                type="text"
                                value={editingPerfume.pyramid.top.map(n => n.name).join(', ')}
                                onChange={(e) => {
                                  const names = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                                  setEditingPerfume({
                                    ...editingPerfume,
                                    pyramid: {
                                      ...editingPerfume.pyramid,
                                      top: names.map(name => ({ name, origin: 'Calabria, Italy', scentCharacter: 'Luminous', temperature: 'Crisp & Cool', volatility: 'High' })),
                                    },
                                  });
                                }}
                                className="w-full mt-1 px-2.5 py-1.5 bg-black/40 border border-white/10 rounded text-xs text-white"
                              />
                            </div>

                            <div>
                              <span className="text-[10px] text-stone-400 uppercase font-mono block">Heart Notes:</span>
                              <input
                                type="text"
                                value={editingPerfume.pyramid.heart.map(n => n.name).join(', ')}
                                onChange={(e) => {
                                  const names = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                                  setEditingPerfume({
                                    ...editingPerfume,
                                    pyramid: {
                                      ...editingPerfume.pyramid,
                                      heart: names.map(name => ({ name, origin: 'Grasse, France', scentCharacter: 'Floral Opulence', temperature: 'Velvet & Floral', volatility: 'Medium' })),
                                    },
                                  });
                                }}
                                className="w-full mt-1 px-2.5 py-1.5 bg-black/40 border border-white/10 rounded text-xs text-white"
                              />
                            </div>

                            <div>
                              <span className="text-[10px] text-stone-400 uppercase font-mono block">Base Notes:</span>
                              <input
                                type="text"
                                value={editingPerfume.pyramid.base.map(n => n.name).join(', ')}
                                onChange={(e) => {
                                  const names = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                                  setEditingPerfume({
                                    ...editingPerfume,
                                    pyramid: {
                                      ...editingPerfume.pyramid,
                                      base: names.map(name => ({ name, origin: 'Wild Harvest', scentCharacter: 'Warm Resin', temperature: 'Warm & Resinous', volatility: 'Low' })),
                                    },
                                  });
                                }}
                                className="w-full mt-1 px-2.5 py-1.5 bg-black/40 border border-white/10 rounded text-xs text-white"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="pt-2 flex justify-end">
                          <button
                            type="submit"
                            disabled={isSavingPerfume}
                            className="px-6 py-2.5 bg-gradient-to-r from-[#C9A96E] to-[#B89456] text-[#0A0B0E] text-xs uppercase tracking-[0.16em] font-semibold rounded-lg hover:opacity-95 shadow-md flex items-center gap-2 cursor-pointer"
                          >
                            <Save className="w-3.5 h-3.5" />
                            <span>{isSavingPerfume ? 'Committing to SQL...' : 'Save Flacon Changes'}</span>
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="p-12 text-center text-stone-500 text-xs">
                        Select a perfume from the left or create a new flacon.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: CLIENT ORDERS FROM CLOUD SQL */}
              {activeTab === 'orders' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div>
                      <h3 className="text-base font-serif text-white tracking-wider uppercase">
                        Client Orders in Cloud SQL
                      </h3>
                      <p className="text-xs text-[#9E988D]">
                        All orders recorded from checkout in PostgreSQL table <code className="text-[#C9A96E]">orders</code>.
                      </p>
                    </div>

                    <button
                      onClick={fetchOrders}
                      className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/15 rounded text-xs text-stone-300 flex items-center gap-1.5 cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Refresh</span>
                    </button>
                  </div>

                  {isLoadingOrders ? (
                    <div className="py-12 text-center text-stone-400 text-xs">Loading orders from Cloud SQL...</div>
                  ) : adminOrders.length === 0 ? (
                    <div className="py-12 text-center text-stone-500 text-xs">
                      No customer orders placed yet. Orders placed in the boutique will appear here in real time.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-white/10 text-[#C9A96E] uppercase font-mono text-[10px]">
                            <th className="py-2.5 px-3">Order #</th>
                            <th className="py-2.5 px-3">Client</th>
                            <th className="py-2.5 px-3">Items</th>
                            <th className="py-2.5 px-3">Total</th>
                            <th className="py-2.5 px-3">Engraving</th>
                            <th className="py-2.5 px-3">Status</th>
                            <th className="py-2.5 px-3">Date</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {adminOrders.map(order => {
                            let parsedItems: any[] = [];
                            try {
                              parsedItems = JSON.parse(order.items);
                            } catch {
                              parsedItems = [{ name: order.items }];
                            }

                            return (
                              <tr key={order.id} className="hover:bg-white/[0.02]">
                                <td className="py-3 px-3 font-mono text-stone-300">#{order.id}</td>
                                <td className="py-3 px-3">
                                  <div className="font-medium text-white">{order.customerName}</div>
                                  <div className="text-[10px] text-stone-400">{order.customerEmail}</div>
                                </td>
                                <td className="py-3 px-3 max-w-xs">
                                  {parsedItems.map((item, idx) => (
                                    <div key={idx} className="text-[11px] text-stone-300">
                                      {item.quantity || 1}x {item.name || 'Master Flacon'} ({item.size || '100ml'})
                                    </div>
                                  ))}
                                </td>
                                <td className="py-3 px-3 font-mono text-[#DFC287]">
                                  {order.currency} ${order.totalAmount}
                                </td>
                                <td className="py-3 px-3 font-serif text-[11px] text-stone-300 italic">
                                  {order.engravingText || '—'}
                                </td>
                                <td className="py-3 px-3">
                                  <select
                                    value={order.status || 'confirmed'}
                                    onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                                    className="bg-black/60 border border-white/20 text-xs rounded px-2 py-1 text-white focus:outline-none focus:border-[#C9A96E] cursor-pointer"
                                  >
                                    <option value="confirmed">Confirmed</option>
                                    <option value="macerating">Limousin Macerating</option>
                                    <option value="dispatched">Dispatched via Courier</option>
                                    <option value="delivered">Delivered to Salon</option>
                                    <option value="cancelled">Cancelled</option>
                                  </select>
                                </td>
                                <td className="py-3 px-3 text-[10px] text-stone-500 font-mono">
                                  {new Date(order.createdAt).toLocaleDateString()}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: REVIEWS & FEEDBACK */}
              {activeTab === 'reviews' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div>
                      <h3 className="text-base font-serif text-white tracking-wider uppercase">
                        Client Reviews Moderation
                      </h3>
                      <p className="text-xs text-[#9E988D]">
                        Reviews recorded in Cloud SQL table <code className="text-[#C9A96E]">reviews</code>.
                      </p>
                    </div>

                    <button
                      onClick={fetchReviews}
                      className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/15 rounded text-xs text-stone-300 flex items-center gap-1.5 cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Refresh</span>
                    </button>
                  </div>

                  {isLoadingReviews ? (
                    <div className="py-12 text-center text-stone-400 text-xs">Loading reviews...</div>
                  ) : adminReviews.length === 0 ? (
                    <div className="py-12 text-center text-stone-500 text-xs">No reviews submitted yet.</div>
                  ) : (
                    <div className="space-y-3">
                      {adminReviews.map(rev => (
                        <div key={rev.id} className="p-4 rounded-xl bg-white/[0.02] border border-white/10 flex items-start justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-serif text-sm text-white font-medium">{rev.authorName}</span>
                              <span className="text-[10px] text-[#C9A96E] font-mono">★ {rev.rating}/5</span>
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/10 text-stone-400 font-mono">
                                {rev.fragranceId}
                              </span>
                            </div>
                            <p className="text-xs text-[#C8C4BA] italic">"{rev.comment}"</p>
                            <span className="text-[10px] text-stone-500 font-mono block">
                              {new Date(rev.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          <button
                            onClick={() => handleDeleteReview(rev.id)}
                            className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded border border-rose-500/20 cursor-pointer"
                            title="Delete review"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer Bar */}
        <div className="px-6 py-3.5 border-t border-white/[0.08] bg-black/40 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-stone-400 text-[11px]">
            <Shield className="w-3.5 h-3.5 text-[#C9A96E]" />
            <span>Authenticated Cloud SQL Master Session</span>
          </div>

          <button
            onClick={() => {
              luxuryAudio.playTap();
              setIsAdminModalOpen(false);
            }}
            className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white rounded-lg text-xs uppercase tracking-wider font-medium flex items-center gap-2 cursor-pointer transition-colors"
          >
            <span>Close & View Live Salon</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
