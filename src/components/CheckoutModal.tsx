import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, Sparkles, Package } from 'lucide-react';
import { CartItem } from '../types/perfume';
import { COMPLIMENTARY_SAMPLES } from '../data/perfumes';
import { luxuryAudio } from '../utils/audio';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  selectedSamples: string[];
  onOrderComplete: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  selectedSamples,
  onOrderComplete,
}) => {
  if (!isOpen) return null;

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: 'Eleanor Vance',
    email: 'eleanor.vance@maison.com',
    address: '42 Place Vendôme',
    city: 'Paris',
    postalCode: '75001',
    country: 'France',
  });

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const trackingNumber = `AUR-2026-FR-${Math.floor(1000 + Math.random() * 9000)}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    luxuryAudio.playChime(1046.5, 0.12, 1.2); // High C6 triumphant chime
    setIsSubmitted(true);
  };

  const handleFinish = () => {
    onOrderComplete();
    setIsSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#111319] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl overflow-hidden my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close checkout"
          className="absolute top-5 right-5 z-20 p-2 text-white/50 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSubmitted ? (
          <div className="space-y-6">
            <div className="space-y-1 border-b border-white/10 pb-4">
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#C9A96E] font-medium block">
                White Glove Delivery
              </span>
              <h3 className="text-2xl font-serif text-[#F8F6F0]">
                Private Salon Checkout
              </h3>
              <p className="text-xs text-[#87837A]">
                Each flacon is sealed in Limousin oak packaging with handwritten seal.
              </p>
            </div>

            {/* Order Summary Strip */}
            <div className="p-4 bg-white/[0.03] border border-white/5 rounded-xl space-y-2 text-xs">
              <div className="flex justify-between text-[#B5B1A8]">
                <span>Creations in Bag ({items.length})</span>
                <span className="text-white font-medium tabular-nums">${subtotal} USD</span>
              </div>
              <div className="flex justify-between text-[#87837A]">
                <span>Complimentary Samples Included</span>
                <span className="text-[#C9A96E]">{selectedSamples.length} Vials (2ml)</span>
              </div>
              <div className="flex justify-between text-[#87837A]">
                <span>Insured Global Air Express</span>
                <span className="text-emerald-400">Complimentary</span>
              </div>
            </div>

            {/* Delivery Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[#8C8880] uppercase tracking-wider block">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-black/40 border border-white/15 rounded p-2.5 text-white focus:border-[#C9A96E] focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[#8C8880] uppercase tracking-wider block">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-black/40 border border-white/15 rounded p-2.5 text-white focus:border-[#C9A96E] focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[#8C8880] uppercase tracking-wider block">Street Address</label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-black/40 border border-white/15 rounded p-2.5 text-white focus:border-[#C9A96E] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[#8C8880] uppercase tracking-wider block">City</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-black/40 border border-white/15 rounded p-2.5 text-white focus:border-[#C9A96E] focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[#8C8880] uppercase tracking-wider block">Postal Code</label>
                  <input
                    type="text"
                    required
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    className="w-full bg-black/40 border border-white/15 rounded p-2.5 text-white focus:border-[#C9A96E] focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[#8C8880] uppercase tracking-wider block">Country</label>
                  <input
                    type="text"
                    required
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full bg-black/40 border border-white/15 rounded p-2.5 text-white focus:border-[#C9A96E] focus:outline-none"
                  />
                </div>
              </div>

              <div className="p-3 bg-white/[0.02] border border-white/5 rounded-lg flex items-center gap-2.5 text-[11px] text-[#87837A]">
                <ShieldCheck className="w-4 h-4 text-[#C9A96E] shrink-0" />
                <span>Simulated Secure Checkout. No payment information is charged.</span>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-[#C9A96E] via-[#DFC287] to-[#B89456] text-[#090A0D] text-xs uppercase tracking-[0.2em] font-semibold rounded hover:opacity-95 shadow-[0_4px_20px_rgba(201,169,110,0.3)] transition-all"
              >
                Confirm Allocation & Place Order (${subtotal} USD)
              </button>
            </form>
          </div>
        ) : (
          /* Order Confirmed View */
          <div className="text-center py-6 space-y-6 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-[#C9A96E]/15 border border-[#C9A96E]/40 text-[#C9A96E] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#C9A96E] font-medium block">
                Allocation Confirmed
              </span>
              <h3 className="text-3xl font-serif text-[#F8F6F0]">
                Merci, {formData.name}
              </h3>
              <p className="text-xs text-[#A8A49A] max-w-md mx-auto leading-relaxed">
                Your bespoke order is now registered at our Grasse atelier.
                Our master perfumer is hand-inspecting each flacon and chiseling your monogram plate.
              </p>
            </div>

            {/* Tracking Card */}
            <div className="p-4 bg-white/[0.03] border border-white/10 rounded-xl max-w-md mx-auto text-xs space-y-2 text-left">
              <div className="flex justify-between items-center">
                <span className="text-[#87837A]">Atelier Tracking ID</span>
                <span className="font-mono text-[#C9A96E] font-medium">{trackingNumber}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#87837A]">Dispatched To</span>
                <span className="text-[#E0DCCE]">{formData.address}, {formData.city}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#87837A]">Notification Sent</span>
                <span className="text-[#E0DCCE]">{formData.email}</span>
              </div>
            </div>

            <button
              onClick={handleFinish}
              className="px-8 py-3.5 bg-[#C9A96E] hover:bg-[#DFC287] text-[#090A0D] text-xs uppercase tracking-[0.18em] font-semibold rounded transition-colors"
            >
              Return to Haute Parfumerie
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
