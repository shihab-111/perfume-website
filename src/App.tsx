import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { CollectionGrid } from './components/CollectionGrid';
import { OlfactoryPyramidSection } from './components/OlfactoryPyramidSection';
import { DiscoveryCoffretBuilder } from './components/DiscoveryCoffretBuilder';
import { MaisonCraftsmanship } from './components/MaisonCraftsmanship';
import { FragranceSommelier } from './components/FragranceSommelier';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { Footer } from './components/Footer';
import { MistCanvas } from './components/MistCanvas';
import { PERFUMES, DISCOVERY_COFFRET_PRICE } from './data/perfumes';
import { CartItem, Perfume } from './types/perfume';
import { luxuryAudio } from './utils/audio';

export default function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 'initial-oud',
      perfumeId: 'oud-celeste',
      name: 'Oud Céleste',
      category: 'Extrait de Parfum',
      size: '100ml',
      price: 480,
      quantity: 1,
      engraving: 'E · V',
      liquidColor: '#C4823F',
    },
  ]);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [selectedPerfume, setSelectedPerfume] = useState<Perfume | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutSamples, setCheckoutSamples] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const heroPerfume = PERFUMES[0]; // Oud Céleste

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const handleAddToCart = (
    perfume: Perfume,
    size: '50ml' | '100ml',
    engraving?: string
  ) => {
    const price = size === '100ml' ? perfume.price100ml : perfume.price50ml;
    const existingIndex = cartItems.findIndex(
      (item) =>
        item.perfumeId === perfume.id &&
        item.size === size &&
        item.engraving === engraving
    );

    if (existingIndex > -1) {
      const updated = [...cartItems];
      updated[existingIndex].quantity += 1;
      setCartItems(updated);
    } else {
      const newItem: CartItem = {
        id: `${perfume.id}-${size}-${Date.now()}`,
        perfumeId: perfume.id,
        name: perfume.name,
        category: perfume.category,
        size,
        price,
        quantity: 1,
        engraving,
        liquidColor: perfume.liquidColor,
      };
      setCartItems([...cartItems, newItem]);
    }

    showToast(`Added ${perfume.name} (${size}) to Le Panier`);
    luxuryAudio.playChime(659, 0.08);
  };

  const handleAddCoffret = (selectedIds: string[], giftMessage?: string) => {
    const names = selectedIds
      .map((id) => PERFUMES.find((p) => p.id === id)?.name || '')
      .join(', ');

    const newCoffret: CartItem = {
      id: `coffret-${Date.now()}`,
      perfumeId: 'discovery-coffret',
      name: 'Le Coffret Découverte (3 × 10ml)',
      category: 'Discovery Set',
      size: 'Discovery Coffret (3x10ml)',
      price: DISCOVERY_COFFRET_PRICE,
      quantity: 1,
      engraving: giftMessage ? `Gift: "${giftMessage}"` : undefined,
      liquidColor: '#C9A96E',
    };

    setCartItems([...cartItems, newCoffret]);
    showToast(`Added Discovery Coffret [${names}] to Le Panier`);
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    luxuryAudio.playTap();
    setCartItems(
      cartItems
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveItem = (id: string) => {
    luxuryAudio.playTap();
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const handleOpenCheckout = (samples: string[]) => {
    setCheckoutSamples(samples);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderComplete = () => {
    setCartItems([]);
    showToast('Order confirmed. Allocation reserved at Grasse atelier.');
  };

  const cartTotalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#090A0D] text-[#E8E6E3] relative selection:bg-[#C9A96E]/25">
      {/* Dynamic Mist Particles Canvas */}
      <MistCanvas />

      {/* Luxury Top Navigation */}
      <Navbar
        cartCount={cartTotalCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenQuiz={() => setIsQuizOpen(true)}
      />

      {/* Main Content Area */}
      <main className="relative z-10">
        {/* Hero Section */}
        <HeroSection
          heroPerfume={heroPerfume}
          onSelectPerfume={(p) => setSelectedPerfume(p)}
          onQuickAdd={handleAddToCart}
        />

        {/* Collection Grid */}
        <CollectionGrid
          perfumes={PERFUMES}
          onSelectPerfume={(p) => setSelectedPerfume(p)}
          onQuickAdd={handleAddToCart}
        />

        {/* Olfactory Pyramid Section */}
        <OlfactoryPyramidSection
          perfumes={PERFUMES}
          onOpenDetails={(p) => setSelectedPerfume(p)}
        />

        {/* Discovery Coffret Builder */}
        <DiscoveryCoffretBuilder
          perfumes={PERFUMES}
          onAddCoffret={handleAddCoffret}
        />

        {/* Savoir-Faire / Craftsmanship Editorial */}
        <MaisonCraftsmanship />
      </main>

      {/* Luxury Footer */}
      <Footer />

      {/* Scent Sommelier Modal */}
      <FragranceSommelier
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        perfumes={PERFUMES}
        onSelectPerfume={(p) => setSelectedPerfume(p)}
        onQuickAdd={handleAddToCart}
      />

      {/* Product Detail / Quick View Modal */}
      <ProductModal
        perfume={selectedPerfume}
        onClose={() => setSelectedPerfume(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Shopping Bag Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onOpenCheckout={handleOpenCheckout}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        selectedSamples={checkoutSamples}
        onOrderComplete={handleOrderComplete}
      />

      {/* Subtle Toast Feedback Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 bg-[#14161F]/95 border border-[#C9A96E]/40 rounded-xl shadow-2xl backdrop-blur-md text-xs text-[#F5F2EB] flex items-center gap-2.5 animate-fadeIn">
          <span className="text-[#C9A96E]">✦</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
