import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, Loader2 } from 'lucide-react';
import { CartItem } from '../types/perfume';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
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
  const { isLight } = useTheme();
  const { user, idToken } = useAuth();

  if (!isOpen) return null;

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderDbId, setOrderDbId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: user?.displayName || 'Eleanor Vance',
    email: user?.email || 'eleanor.vance@maison.com',
    address: '42 Place Vendôme',
    city: 'Paris',
    postalCode: '75001',
    country: 'France',
  });

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const trackingNumber = `AUR-2026-FR-${Math.floor(1000 + Math.random() * 9000)}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    luxuryAudio.playChime(1046.5, 0.12, 1.2);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerName: formData.name,
          customerEmail: formData.email,
          items: JSON.stringify(items),
          totalAmount: subtotal,
          currency: 'USD',
          shippingAddress: `${formData.address}, ${formData.city} ${formData.postalCode}, ${formData.country}`,
          engravingText: items.find(i => i.engraving)?.engraving || null,
          token: idToken || undefined,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data?.order?.id) {
          setOrderDbId(data.order.id);
        }
      }
    } catch (err) {
      console.error('Failed to save order to Cloud SQL:', err);
    } finally {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }
  };

  const handleFinish = () => {
    onOrderComplete();
    setIsSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div
        className={`relative w-full max-w-2xl rounded-2xl p-6 sm:p-8 shadow-2xl overflow-hidden my-auto max-h-[92vh] overflow-y-auto border transition-colors ${
          isLight
            ? 'bg-[#FAF8F5] border-[#E2DDD2] text-[#1E1C18]'
            : 'bg-[#111319] border-white/10 text-[#E8E6E3]'
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close checkout"
          className={`absolute top-4 right-4 sm:top-5 sm:right-5 z-20 p-2 rounded-full transition-colors cursor-pointer ${
            isLight
              ? 'text-black/50 hover:text-black bg-black/5 hover:bg-black/10'
              : 'text-white/50 hover:text-white bg-white/5 hover:bg-white/10'
          }`}
        >
          <X className="w-5 h-5" />
        </button>

        {!isSubmitted ? (
          <div className="space-y-6">
            <div className={`space-y-1 border-b pb-4 ${isLight ? 'border-[#EAE4D7]' : 'border-white/10'}`}>
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#C9A96E] font-medium block">
                White Glove Delivery
              </span>
              <h3 className={`text-2xl font-serif ${isLight ? 'text-[#1E1C18]' : 'text-[#F8F6F0]'}`}>
                Private Salon Checkout
              </h3>
              <p className={`text-xs ${isLight ? 'text-[#696357]' : 'text-[#87837A]'}`}>
                Each flacon is sealed in Limousin oak packaging with handwritten seal.
              </p>
            </div>

            {/* Order Summary Strip */}
            <div
              className={`p-4 rounded-xl space-y-2 text-xs border ${
                isLight
                  ? 'bg-white border-[#E8E2D6]'
                  : 'bg-white/[0.03] border-white/5'
              }`}
            >
              <div className="flex justify-between">
                <span className={isLight ? 'text-[#696357]' : 'text-[#B5B1A8]'}>Creations in Bag ({items.length})</span>
                <span className={`font-medium tabular-nums ${isLight ? 'text-[#1E1C18]' : 'text-white'}`}>
                  ${subtotal} USD
                </span>
              </div>
              <div className={`flex justify-between ${isLight ? 'text-[#7D766A]' : 'text-[#87837A]'}`}>
                <span>Complimentary Samples Included</span>
                <span className="text-[#C9A96E]">{selectedSamples.length} Vials (2ml)</span>
              </div>
              <div className={`flex justify-between ${isLight ? 'text-[#7D766A]' : 'text-[#87837A]'}`}>
                <span>Insured Global Air Express</span>
                <span className="text-emerald-500 font-medium">Complimentary</span>
              </div>
            </div>

            {/* Delivery Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className={`uppercase tracking-wider block ${isLight ? 'text-[#7D766A]' : 'text-[#8C8880]'}`}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full rounded p-2.5 focus:border-[#C9A96E] focus:outline-none border ${
                      isLight
                        ? 'bg-white border-[#DDD5C7] text-[#1E1C18]'
                        : 'bg-black/40 border-white/15 text-white'
                    }`}
                  />
                </div>
                <div className="space-y-1">
                  <label className={`uppercase tracking-wider block ${isLight ? 'text-[#7D766A]' : 'text-[#8C8880]'}`}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full rounded p-2.5 focus:border-[#C9A96E] focus:outline-none border ${
                      isLight
                        ? 'bg-white border-[#DDD5C7] text-[#1E1C18]'
                        : 'bg-black/40 border-white/15 text-white'
                    }`}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className={`uppercase tracking-wider block ${isLight ? 'text-[#7D766A]' : 'text-[#8C8880]'}`}>
                  Street Address
                </label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className={`w-full rounded p-2.5 focus:border-[#C9A96E] focus:outline-none border ${
                    isLight
                      ? 'bg-white border-[#DDD5C7] text-[#1E1C18]'
                      : 'bg-black/40 border-white/15 text-white'
                  }`}
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className={`uppercase tracking-wider block ${isLight ? 'text-[#7D766A]' : 'text-[#8C8880]'}`}>
                    City
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className={`w-full rounded p-2.5 focus:border-[#C9A96E] focus:outline-none border ${
                      isLight
                        ? 'bg-white border-[#DDD5C7] text-[#1E1C18]'
                        : 'bg-black/40 border-white/15 text-white'
                    }`}
                  />
                </div>
                <div className="space-y-1">
                  <label className={`uppercase tracking-wider block ${isLight ? 'text-[#7D766A]' : 'text-[#8C8880]'}`}>
                    Postal Code
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    className={`w-full rounded p-2.5 focus:border-[#C9A96E] focus:outline-none border ${
                      isLight
                        ? 'bg-white border-[#DDD5C7] text-[#1E1C18]'
                        : 'bg-black/40 border-white/15 text-white'
                    }`}
                  />
                </div>
                <div className="space-y-1">
                  <label className={`uppercase tracking-wider block ${isLight ? 'text-[#7D766A]' : 'text-[#8C8880]'}`}>
                    Country
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className={`w-full rounded p-2.5 focus:border-[#C9A96E] focus:outline-none border ${
                      isLight
                        ? 'bg-white border-[#DDD5C7] text-[#1E1C18]'
                        : 'bg-black/40 border-white/15 text-white'
                    }`}
                  />
                </div>
              </div>

              <div
                className={`p-3 rounded-lg flex items-center gap-2.5 text-[11px] border ${
                  isLight
                    ? 'bg-white border-[#E8E2D6] text-[#696357]'
                    : 'bg-white/[0.02] border-white/5 text-[#87837A]'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-[#C9A96E] shrink-0" />
                <span>Simulated Secure Checkout. No payment card is charged.</span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-gradient-to-r from-[#C9A96E] via-[#DFC287] to-[#B89456] text-[#090A0D] text-xs uppercase tracking-[0.2em] font-semibold rounded hover:opacity-95 shadow-[0_4px_20px_rgba(201,169,110,0.3)] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin text-[#090A0D]" />}
                <span>{isSubmitting ? 'Registering Order in Cloud SQL...' : `Confirm Allocation & Place Order ($${subtotal} USD)`}</span>
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
                Allocation Confirmed & Recorded
              </span>
              <h3 className={`text-3xl font-serif ${isLight ? 'text-[#1E1C18]' : 'text-[#F8F6F0]'}`}>
                Merci, {formData.name}
              </h3>
              <p className={`text-xs max-w-md mx-auto leading-relaxed ${isLight ? 'text-[#696357]' : 'text-[#A8A49A]'}`}>
                Your bespoke order is now registered at our Grasse atelier and recorded into your Cloud SQL database.
                {orderDbId && <span className="block mt-1 font-mono text-[#C9A96E]">Database Record: #ORD-{String(orderDbId).padStart(4, '0')}</span>}
                Our master perfumer is hand-inspecting each flacon and chiseling your metal monogram plate.
              </p>
            </div>

            {/* Tracking Card */}
            <div
              className={`p-4 rounded-xl max-w-md mx-auto text-xs space-y-2 text-left border ${
                isLight
                  ? 'bg-white border-[#E5DFD2]'
                  : 'bg-white/[0.03] border-white/10'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className={isLight ? 'text-[#7D766A]' : 'text-[#87837A]'}>Atelier Tracking ID</span>
                <span className="font-mono text-[#C9A96E] font-medium">{trackingNumber}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className={isLight ? 'text-[#7D766A]' : 'text-[#87837A]'}>Dispatched To</span>
                <span className={isLight ? 'text-[#1E1C18]' : 'text-[#E0DCCE]'}>{formData.address}, {formData.city}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className={isLight ? 'text-[#7D766A]' : 'text-[#87837A]'}>Notification Sent</span>
                <span className={isLight ? 'text-[#1E1C18]' : 'text-[#E0DCCE]'}>{formData.email}</span>
              </div>
            </div>

            <button
              onClick={handleFinish}
              className="px-8 py-3.5 bg-[#C9A96E] hover:bg-[#DFC287] text-[#090A0D] text-xs uppercase tracking-[0.18em] font-semibold rounded transition-colors cursor-pointer"
            >
              Return to Haute Parfumerie
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
