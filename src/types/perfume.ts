export interface OlfactoryNote {
  name: string;
  origin: string;
  scentCharacter: string;
}

export interface OlfactoryPyramid {
  top: OlfactoryNote[];
  heart: OlfactoryNote[];
  base: OlfactoryNote[];
}

export interface Perfume {
  id: string;
  name: string;
  subtitle: string;
  category: 'Extrait de Parfum' | 'Eau de Parfum';
  concentration: string;
  tagline: string;
  story: string;
  price50ml: number;
  price100ml: number;
  pyramid: OlfactoryPyramid;
  accords: { name: string; percentage: number }[];
  longevity: string;
  sillage: string;
  season: string;
  timeOfDay: string;
  liquidColor: string;
  liquidGradient: string;
  accentColor: string;
  bottleTheme: 'obsidian' | 'amber' | 'crystal' | 'emerald' | 'garnet';
  harvestNotes: string;
  featured?: boolean;
}

export interface CartItem {
  id: string;
  perfumeId: string;
  name: string;
  category: string;
  size: '50ml' | '100ml' | 'Discovery Coffret (3x10ml)';
  price: number;
  quantity: number;
  engraving?: string;
  liquidColor: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  subtitle: string;
  options: {
    label: string;
    description: string;
    affinity: string; // scent family
    scentId: string;
  }[];
}
