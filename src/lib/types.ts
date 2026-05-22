export interface AreaSpot {
  name: string;
  tag?: string;
}

export interface CityArea {
  name: string;
  emoji: string;
  accentColor: string;
  image: string;
  tagline: string;
  spots: AreaSpot[];
}

export interface CityStats {
  bestTime: string;
  budget: string;
  language: string;
  currency: string;
}

export interface ThingToDo {
  name: string;
  description: string;
  icon: string;
  duration: string;
  category: string;
}

export interface Hotel {
  name: string;
  description: string;
  priceRange: string;
  type: string;
  highlight: string;
}

export interface Restaurant {
  name: string;
  description: string;
  cuisine: string;
  priceRange: string;
  mustTry: string;
}

export interface Airport {
  name: string;
  code: string;
  note: string;
  distanceFromCity: string;
  transferTime: string;
  transferOptions: string[];
}

export interface FlightRoute {
  from: string;
  flag: string;
  duration: string;
  airlines: string;
  note?: string;
}

export interface GettingThere {
  summary: string;
  airports: Airport[];
  topRoutes: FlightRoute[];
  bestTimeToBuyTip: string;
  bookingTip: string;
}

export type MonthRating = 'excellent' | 'good' | 'average' | 'avoid';

export interface MonthInfo {
  month: string;
  short: string;
  rating: MonthRating;
  weather: string;
  temp: string;
  crowds: 'Low' | 'Moderate' | 'High' | 'Peak';
  price: 'Low' | 'Moderate' | 'High' | 'Peak';
  highlight: string;
}

export interface MonthByMonth {
  summary: string;
  bestMonths: string[];
  avoidMonths: string[];
  months: [MonthInfo, MonthInfo, MonthInfo, MonthInfo, MonthInfo, MonthInfo,
           MonthInfo, MonthInfo, MonthInfo, MonthInfo, MonthInfo, MonthInfo];
}

export interface BudgetTier {
  label: 'Budget' | 'Mid-range' | 'Luxury';
  icon: string;
  perDay: string;
  accommodation: string;
  food: string;
  transport: string;
  activities: string;
  tip: string;
}

export interface CityBudget {
  disclaimer: string;
  tiers: [BudgetTier, BudgetTier, BudgetTier];
}

export interface Neighbourhood {
  name: string;
  description: string;
  bestFor: string[];
  vibe: string;
  priceRange: '$' | '$$' | '$$$' | '$$$$';
  highlights: string[];
  notFor: string;
}

export interface OffbeatPlace {
  name: string;
  description: string;
  why: string;
  icon: string;
  type: string;
  tip: string;
}

export interface City {
  slug: string;
  name: string;
  country: string;
  flag: string;
  tagline: string;
  description: string;
  heroDescription: string;
  stats: CityStats;
  vibes: string[];
  gradient: string;
  accentColor: string;
  image: string;
  heroImage: string;
  visa?: string;
  state?: string;
  areas?: CityArea[];
  thingsToDo?: ThingToDo[];
  hotels?: Hotel[];
  restaurants?: Restaurant[];
  gettingAround?: string[];
  proTips?: string[];
  offbeatPlaces?: OffbeatPlace[];
  neighbourhoods?: Neighbourhood[];
  budgetBreakdown?: CityBudget;
  monthByMonth?: MonthByMonth;
  gettingThere?: GettingThere;
}

export interface TripPlanRequest {
  destination: string;
  startDate: string;
  endDate: string;
  people: number;
  style: string;
  interests: string[];
}

export interface DayActivity {
  time: string;
  activity: string;
  description: string;
  tip?: string;
}

export interface DayPlan {
  day: number;
  date: string;
  theme: string;
  morning: DayActivity;
  afternoon: DayActivity;
  evening: DayActivity;
}

export interface BudgetItem {
  category: string;
  amount: string;
  note: string;
}

export interface TripItinerary {
  destination: string;
  duration: string;
  style: string;
  overview: string;
  days: DayPlan[];
  budget: BudgetItem[];
  packingTips: string[];
  bestAdvice: string;
}
