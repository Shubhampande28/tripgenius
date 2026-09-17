import type { City, MonthByMonth, ThingToDo } from './types';

type Destination = {
  slug: string;
  name: string;
  country: string;
  flag: string;
  tagline: string;
  description: string;
  coordinates: { lat: number; lng: number };
  bestTime: string;
  budget: string;
  language: string;
  currency: string;
  vibes: string[];
  accentColor: string;
  gradient: string;
  highlights: ThingToDo[];
  // Real thingsToDo already existed here (no thin/boilerplate issue - see
  // buildCity below) but isIndexableCity() also requires monthByMonth, which
  // this file never set - these 10 cities were noindexed for that reason
  // alone (2026-09 audit). Added per-destination below.
  monthByMonth?: MonthByMonth;
};

const destinations: Destination[] = [
  {
    slug: 'varna', name: 'Varna', country: 'Bulgaria', flag: '🇧🇬', tagline: 'Black Sea Culture & Beaches',
    description: 'Bulgaria’s maritime capital combines a long city beach and the Sea Garden with Roman baths and the Varna Gold, a prehistoric treasure displayed in its archaeological museum.',
    coordinates: { lat: 43.2141, lng: 27.9147 }, bestTime: 'May – Sep', budget: 'EUR 45–120/day',
    language: 'Bulgarian', currency: 'BGN (Lev)', vibes: ['Beach', 'History', 'Nightlife'],
    accentColor: '#0284C7', gradient: 'from-sky-700 to-cyan-400',
    highlights: [
      { name: 'Sea Garden', description: 'Walk the landmark seaside park linking central Varna with museums, viewpoints and the beach.', icon: '🌊', duration: '2–3 hours', category: 'Nature' },
      { name: 'Varna Archaeological Museum', description: 'See the Varna Gold and trace the Black Sea coast from prehistory through antiquity.', icon: '🏺', duration: '2 hours', category: 'Historical' },
      { name: 'Roman Thermae', description: 'Explore the substantial remains of one of the largest Roman bath complexes in the Balkans.', icon: '🏛️', duration: '1 hour', category: 'Historical' },
      { name: 'Dormition Cathedral', description: 'Visit Varna’s domed Orthodox cathedral and its richly painted interior near the centre.', icon: '⛪', duration: '45 minutes', category: 'Spiritual' },
      { name: 'Central Beach', description: 'Pair a Black Sea swim with the promenade, beach cafés and an evening walk.', icon: '🏖️', duration: 'Half day', category: 'Beach' },
      { name: 'Stone Forest', description: 'Take a half-day trip to the natural stone-column landscape at Pobiti Kamani.', icon: '🪨', duration: 'Half day', category: 'Nature' },
    ],
    monthByMonth: {
      summary: 'May-September is Varna\'s beach season, with July-August the warmest and busiest. Winter (November-March) is cold and grey by Black Sea standards, with most seasonal beach infrastructure closed — the archaeological museum and Roman baths remain the main draw then.',
      bestMonths: ['June', 'September', 'May'],
      avoidMonths: [],
      months: [
        { month: 'January', short: 'Jan', rating: 'average', weather: 'Cold, damp', temp: '6°C/1°C', crowds: 'Low', price: 'Low', highlight: 'Quiet season, museums without crowds' },
        { month: 'February', short: 'Feb', rating: 'average', weather: 'Cold', temp: '7°C/1°C', crowds: 'Low', price: 'Low', highlight: 'Cheapest month for stays' },
        { month: 'March', short: 'Mar', rating: 'average', weather: 'Cool, improving', temp: '11°C/4°C', crowds: 'Low', price: 'Low', highlight: 'Comfortable Sea Garden walking weather returns' },
        { month: 'April', short: 'Apr', rating: 'good', weather: 'Mild, breezy', temp: '16°C/8°C', crowds: 'Low', price: 'Low', highlight: 'Comfortable weather before beach season' },
        { month: 'May', short: 'May', rating: 'excellent', weather: 'Warm, pleasant', temp: '21°C/13°C', crowds: 'Moderate', price: 'Moderate', highlight: 'Sea warming up, before peak crowds' },
        { month: 'June', short: 'Jun', rating: 'excellent', weather: 'Warm summer', temp: '25°C/17°C', crowds: 'High', price: 'High', highlight: 'Ideal beach weather begins' },
        { month: 'July', short: 'Jul', rating: 'good', weather: 'Hot, dry', temp: '28°C/19°C', crowds: 'Peak', price: 'Peak', highlight: 'Peak Black Sea beach season' },
        { month: 'August', short: 'Aug', rating: 'good', weather: 'Hot, dry', temp: '28°C/20°C', crowds: 'Peak', price: 'Peak', highlight: 'Warmest sea temperatures of the year' },
        { month: 'September', short: 'Sep', rating: 'excellent', weather: 'Warm, drier', temp: '23°C/15°C', crowds: 'Moderate', price: 'Moderate', highlight: 'Still warm enough to swim, crowds thinning' },
        { month: 'October', short: 'Oct', rating: 'good', weather: 'Mild autumn', temp: '18°C/11°C', crowds: 'Low', price: 'Low', highlight: 'Comfortable sightseeing weather, most beach season winding down' },
        { month: 'November', short: 'Nov', rating: 'average', weather: 'Cool, rainy', temp: '12°C/6°C', crowds: 'Low', price: 'Low', highlight: 'Quiet month for the Roman baths and museum' },
        { month: 'December', short: 'Dec', rating: 'average', weather: 'Cold, damp', temp: '8°C/3°C', crowds: 'Low', price: 'Low', highlight: 'Quiet off-season, indoor sights are the priority' },
      ],
    },
  },
  {
    slug: 'ljubljana', name: 'Ljubljana', country: 'Slovenia', flag: '🇸🇮', tagline: 'Green Capital on the Ljubljanica',
    description: 'Slovenia’s compact capital is shaped by Jože Plečnik’s bridges and riverfront architecture, with a hilltop castle, food market and traffic-light old centre made for walking.',
    coordinates: { lat: 46.0569, lng: 14.5058 }, bestTime: 'Apr – Jun, Sep – Oct', budget: 'EUR 65–160/day',
    language: 'Slovene', currency: 'EUR', vibes: ['Architecture', 'Food', 'Green city'],
    accentColor: '#059669', gradient: 'from-emerald-700 to-lime-400',
    highlights: [
      { name: 'Ljubljana Castle', description: 'Ride the funicular or walk up Castle Hill for city and Alpine views.', icon: '🏰', duration: '2–3 hours', category: 'Historical' },
      { name: 'Triple Bridge & Prešeren Square', description: 'Start at Plečnik’s signature river crossing in the pedestrian heart of the city.', icon: '🌉', duration: '1 hour', category: 'Architecture' },
      { name: 'Central Market', description: 'Browse produce and local foods beside Plečnik’s riverside colonnade; check market days before visiting.', icon: '🥬', duration: '1–2 hours', category: 'Culinary' },
      { name: 'Dragon Bridge', description: 'Photograph the city’s Art Nouveau dragon landmark near the market.', icon: '🐉', duration: '30 minutes', category: 'Architecture' },
      { name: 'Ljubljanica Riverfront', description: 'Walk café-lined embankments and cross the city’s small pedestrian bridges.', icon: '🚶', duration: '2 hours', category: 'Walking' },
      { name: 'Tivoli Park', description: 'Escape into the capital’s largest green space and its tree-lined Jakopič Promenade.', icon: '🌳', duration: '2 hours', category: 'Nature' },
    ],
    monthByMonth: {
      summary: 'April-June and September-October are Ljubljana\'s best months for walking the riverfront and climbing to the castle. Summer (July-August) is warm and lively along the Ljubljanica. Winter (December-February) is cold with occasional snow; December\'s Christmas market along the river is a strong draw.',
      bestMonths: ['May', 'June', 'September'],
      avoidMonths: [],
      months: [
        { month: 'January', short: 'Jan', rating: 'average', weather: 'Cold, occasional snow', temp: '3°C/-2°C', crowds: 'Low', price: 'Low', highlight: 'Quiet season, castle without queues' },
        { month: 'February', short: 'Feb', rating: 'average', weather: 'Cold', temp: '6°C/-1°C', crowds: 'Low', price: 'Low', highlight: 'Cheapest month for stays' },
        { month: 'March', short: 'Mar', rating: 'good', weather: 'Mild, thawing', temp: '11°C/2°C', crowds: 'Low', price: 'Low', highlight: 'Comfortable riverfront walking weather returns' },
        { month: 'April', short: 'Apr', rating: 'excellent', weather: 'Mild, pleasant', temp: '16°C/6°C', crowds: 'Moderate', price: 'Moderate', highlight: 'Ideal weather before peak season' },
        { month: 'May', short: 'May', rating: 'excellent', weather: 'Warm, dry', temp: '20°C/10°C', crowds: 'Moderate', price: 'Moderate', highlight: 'Tivoli Park and riverfront cafes at their best' },
        { month: 'June', short: 'Jun', rating: 'excellent', weather: 'Warm summer', temp: '24°C/13°C', crowds: 'High', price: 'High', highlight: 'Long days for the Triple Bridge and castle hill' },
        { month: 'July', short: 'Jul', rating: 'good', weather: 'Warm, occasional rain', temp: '26°C/15°C', crowds: 'High', price: 'High', highlight: 'Peak summer season' },
        { month: 'August', short: 'Aug', rating: 'good', weather: 'Warm summer', temp: '26°C/15°C', crowds: 'High', price: 'High', highlight: 'Still warm, good for riverside dining' },
        { month: 'September', short: 'Sep', rating: 'excellent', weather: 'Mild, comfortable', temp: '21°C/11°C', crowds: 'Moderate', price: 'Moderate', highlight: 'Comfortable weather, crowds thinning from summer' },
        { month: 'October', short: 'Oct', rating: 'good', weather: 'Cool autumn', temp: '15°C/7°C', crowds: 'Low', price: 'Low', highlight: 'Comfortable sightseeing weather' },
        { month: 'November', short: 'Nov', rating: 'average', weather: 'Cold, grey', temp: '9°C/3°C', crowds: 'Low', price: 'Low', highlight: 'Quiet month ahead of Christmas market season' },
        { month: 'December', short: 'Dec', rating: 'good', weather: 'Cold, festive', temp: '4°C/-1°C', crowds: 'Moderate', price: 'Moderate', highlight: 'Christmas market along the Ljubljanica riverfront' },
      ],
    },
  },
  {
    slug: 'lake-bled', name: 'Lake Bled', country: 'Slovenia', flag: '🇸🇮', tagline: 'Julian Alps Postcard',
    description: 'Lake Bled’s island church, cliff-top castle and mountain backdrop form Slovenia’s best-known view, while lakeside paths and nearby gorges reward a longer stay.',
    coordinates: { lat: 46.3639, lng: 14.0938 }, bestTime: 'May – Jun, Sep – Oct', budget: 'EUR 75–180/day',
    language: 'Slovene', currency: 'EUR', vibes: ['Lake', 'Romantic', 'Hiking'],
    accentColor: '#0891B2', gradient: 'from-cyan-700 to-emerald-400',
    highlights: [
      { name: 'Lake Bled Circuit', description: 'Walk the roughly six-kilometre shore loop for changing views of island, castle and Alps.', icon: '🥾', duration: '2 hours', category: 'Walking' },
      { name: 'Bled Island & Pletna Boat', description: 'Cross by traditional pletna boat and climb to the island church.', icon: '🚣', duration: '2 hours', category: 'Cultural' },
      { name: 'Bled Castle', description: 'Visit Slovenia’s oldest castle on a cliff above the lake.', icon: '🏰', duration: '2 hours', category: 'Historical' },
      { name: 'Ojstrica Viewpoint', description: 'Take the short, steep forest hike for the classic elevated lake view.', icon: '⛰️', duration: '1–2 hours', category: 'Trekking' },
      { name: 'Vintgar Gorge', description: 'Follow boardwalks through the Radovna River gorge when the seasonal route is open.', icon: '💧', duration: 'Half day', category: 'Nature' },
      { name: 'Lake Bohinj Day Trip', description: 'Continue into Triglav National Park for a quieter alpine lake and mountain trails.', icon: '🏞️', duration: 'Full day', category: 'Day Trip' },
    ],
    monthByMonth: {
      summary: 'May-June and September-October offer the best balance of mild weather and manageable crowds for the lake circuit and Vintgar Gorge. July-August is warm enough to swim but the busiest. Winter (December-March) can be genuinely magical with snow and a frozen lake, though Vintgar Gorge typically closes for the season.',
      bestMonths: ['May', 'June', 'September'],
      avoidMonths: [],
      months: [
        { month: 'January', short: 'Jan', rating: 'good', weather: 'Cold, snowy', temp: '2°C/-6°C', crowds: 'Low', price: 'Low', highlight: 'Snow-covered scenery, though the gorge is typically closed' },
        { month: 'February', short: 'Feb', rating: 'good', weather: 'Cold, snowy', temp: '4°C/-5°C', crowds: 'Low', price: 'Low', highlight: 'Quiet season, photogenic frozen-lake conditions possible' },
        { month: 'March', short: 'Mar', rating: 'average', weather: 'Cool, thawing', temp: '9°C/-1°C', crowds: 'Low', price: 'Low', highlight: 'Vintgar Gorge typically reopens for the season' },
        { month: 'April', short: 'Apr', rating: 'good', weather: 'Mild, changeable', temp: '14°C/3°C', crowds: 'Moderate', price: 'Moderate', highlight: 'Comfortable lake-circuit walking weather returns' },
        { month: 'May', short: 'May', rating: 'excellent', weather: 'Mild, pleasant', temp: '18°C/7°C', crowds: 'Moderate', price: 'Moderate', highlight: 'Ideal weather before peak summer crowds' },
        { month: 'June', short: 'Jun', rating: 'excellent', weather: 'Warm, occasional rain', temp: '22°C/10°C', crowds: 'High', price: 'High', highlight: 'Lake warm enough for swimming' },
        { month: 'July', short: 'Jul', rating: 'good', weather: 'Warm summer', temp: '24°C/13°C', crowds: 'Peak', price: 'Peak', highlight: 'Peak season — book pletna boats and stays well ahead' },
        { month: 'August', short: 'Aug', rating: 'good', weather: 'Warm, occasional storms', temp: '24°C/13°C', crowds: 'Peak', price: 'Peak', highlight: 'Warmest lake temperatures for swimming' },
        { month: 'September', short: 'Sep', rating: 'excellent', weather: 'Mild, clearer', temp: '19°C/9°C', crowds: 'Moderate', price: 'Moderate', highlight: 'Comfortable weather, crowds thinning from summer' },
        { month: 'October', short: 'Oct', rating: 'excellent', weather: 'Cool, crisp', temp: '14°C/5°C', crowds: 'Low', price: 'Low', highlight: 'Fall colours around the lake circuit' },
        { month: 'November', short: 'Nov', rating: 'average', weather: 'Cold, damp', temp: '8°C/1°C', crowds: 'Low', price: 'Low', highlight: 'Quiet month, gorge access may be limited' },
        { month: 'December', short: 'Dec', rating: 'good', weather: 'Cold, snow possible', temp: '3°C/-3°C', crowds: 'Low', price: 'Low', highlight: 'Magical winter scenery on clear, snowy days' },
      ],
    },
  },
  {
    slug: 'piran', name: 'Piran', country: 'Slovenia', flag: '🇸🇮', tagline: 'Venetian Slovenia by the Sea',
    description: 'Piran is a compact Adriatic town of Venetian façades, steep lanes and salt-making heritage, centred on Tartini Square beneath St George’s bell tower.',
    coordinates: { lat: 45.5283, lng: 13.5683 }, bestTime: 'May – Jun, Sep', budget: 'EUR 65–160/day',
    language: 'Slovene, Italian', currency: 'EUR', vibes: ['Coastal', 'Historic', 'Food'],
    accentColor: '#0E7490', gradient: 'from-cyan-800 to-amber-400',
    highlights: [
      { name: 'Tartini Square', description: 'Begin in Piran’s marble main square, framed by civic buildings and Venetian details.', icon: '🎻', duration: '1 hour', category: 'Cultural' },
      { name: 'St George’s Church & Bell Tower', description: 'Climb above the old town for a clear view across tiled roofs and the Adriatic.', icon: '⛪', duration: '1 hour', category: 'Spiritual' },
      { name: 'Piran Town Walls', description: 'Walk surviving towers and ramparts for the town’s defining panorama.', icon: '🧱', duration: '1–2 hours', category: 'Historical' },
      { name: 'Punta Waterfront', description: 'Follow the seafront to Cape Madonna for sunset and open-water views.', icon: '🌅', duration: '1–2 hours', category: 'Scenic', idealTime: ['evening'] },
      { name: 'Maritime Museum', description: 'Learn how seafaring and salt shaped Piran and Slovenian Istria.', icon: '⚓', duration: '1–2 hours', category: 'Historical' },
      { name: 'Sečovlje Salt Pans', description: 'Visit the protected salt-pan landscape south of town and learn about traditional harvesting.', icon: '🧂', duration: 'Half day', category: 'Nature' },
    ],
    monthByMonth: {
      summary: 'May-June and September are Piran\'s best months — warm and Adriatic-swimmable, ahead of or behind peak crowds. July-August is hot and busy with Slovenian and Italian holidaymakers. Winter (November-March) is mild but quiet, with many seasonal restaurants closed.',
      bestMonths: ['May', 'June', 'September'],
      avoidMonths: [],
      months: [
        { month: 'January', short: 'Jan', rating: 'average', weather: 'Mild but windy, wet', temp: '9°C/4°C', crowds: 'Low', price: 'Low', highlight: 'Quiet season, many restaurants closed for winter' },
        { month: 'February', short: 'Feb', rating: 'average', weather: 'Mild, still wet', temp: '10°C/4°C', crowds: 'Low', price: 'Low', highlight: 'Cheapest month for stays' },
        { month: 'March', short: 'Mar', rating: 'good', weather: 'Mild, improving', temp: '13°C/6°C', crowds: 'Low', price: 'Low', highlight: 'Comfortable Tartini Square walking weather returns' },
        { month: 'April', short: 'Apr', rating: 'good', weather: 'Mild, pleasant', temp: '16°C/9°C', crowds: 'Moderate', price: 'Moderate', highlight: 'Comfortable weather before peak season' },
        { month: 'May', short: 'May', rating: 'excellent', weather: 'Warm, dry', temp: '21°C/13°C', crowds: 'Moderate', price: 'Moderate', highlight: 'Sea warming up, before peak crowds' },
        { month: 'June', short: 'Jun', rating: 'excellent', weather: 'Warm summer', temp: '25°C/17°C', crowds: 'High', price: 'High', highlight: 'Ideal weather for the town walls and waterfront' },
        { month: 'July', short: 'Jul', rating: 'good', weather: 'Hot, dry', temp: '27°C/19°C', crowds: 'Peak', price: 'Peak', highlight: 'Peak Adriatic coast season' },
        { month: 'August', short: 'Aug', rating: 'good', weather: 'Hot, dry', temp: '27°C/20°C', crowds: 'Peak', price: 'Peak', highlight: 'Warmest sea temperatures of the year' },
        { month: 'September', short: 'Sep', rating: 'excellent', weather: 'Warm, drier', temp: '23°C/16°C', crowds: 'Moderate', price: 'Moderate', highlight: 'Still warm enough to swim, crowds thinning' },
        { month: 'October', short: 'Oct', rating: 'good', weather: 'Mild autumn', temp: '18°C/12°C', crowds: 'Low', price: 'Low', highlight: 'Comfortable sightseeing weather' },
        { month: 'November', short: 'Nov', rating: 'average', weather: 'Mild but wet', temp: '14°C/9°C', crowds: 'Low', price: 'Low', highlight: 'Quiet town, many businesses closing for winter' },
        { month: 'December', short: 'Dec', rating: 'average', weather: 'Mild, wet', temp: '11°C/6°C', crowds: 'Low', price: 'Low', highlight: 'Quiet off-season, Maritime Museum a good indoor option' },
      ],
    },
  },
  {
    slug: 'belgrade', name: 'Belgrade', country: 'Serbia', flag: '🇷🇸', tagline: 'Fortress City at Two Rivers',
    description: 'Serbia’s capital sits where the Sava meets the Danube, mixing the ramparts of Kalemegdan with Orthodox landmarks, Yugoslav history and an energetic café and nightlife culture.',
    coordinates: { lat: 44.7866, lng: 20.4489 }, bestTime: 'Apr – Jun, Sep – Oct', budget: 'EUR 45–120/day',
    language: 'Serbian', currency: 'RSD (Dinar)', vibes: ['Nightlife', 'History', 'Food'],
    accentColor: '#DC2626', gradient: 'from-red-800 to-slate-500',
    highlights: [
      { name: 'Belgrade Fortress & Kalemegdan', description: 'Explore layered fortifications and viewpoints above the Sava–Danube confluence.', icon: '🏰', duration: '3 hours', category: 'Historical' },
      { name: 'Knez Mihailova Street', description: 'Walk the central pedestrian avenue between Republic Square and Kalemegdan.', icon: '🚶', duration: '1–2 hours', category: 'Walking' },
      { name: 'Church of Saint Sava', description: 'Visit one of the world’s largest Orthodox churches and its richly decorated crypt.', icon: '⛪', duration: '1–2 hours', category: 'Spiritual' },
      { name: 'Nikola Tesla Museum', description: 'See archival displays and demonstrations; reserve ahead when timed tours are required.', icon: '⚡', duration: '1–2 hours', category: 'Museum' },
      { name: 'Skadarlija', description: 'Spend an evening in the cobbled bohemian quarter known for traditional restaurants and music.', icon: '🎶', duration: '2–3 hours', category: 'Nightlife', idealTime: ['evening'] },
      { name: 'Zemun & Gardoš Tower', description: 'Cross to the Danube-side former Habsburg town for lanes, river restaurants and views.', icon: '🗼', duration: 'Half day', category: 'Neighbourhood' },
    ],
    monthByMonth: {
      summary: 'April-June and September-October are Belgrade\'s best months for walking Kalemegdan and the riverfront. Summer (July-August) is hot and the city\'s famous riverside nightlife (splavovi, floating clubs) is in full swing. Winter (December-February) is cold with occasional snow.',
      bestMonths: ['May', 'September', 'June'],
      avoidMonths: [],
      months: [
        { month: 'January', short: 'Jan', rating: 'average', weather: 'Cold, occasional snow', temp: '3°C/-3°C', crowds: 'Low', price: 'Low', highlight: 'Quiet season, Nikola Tesla Museum without queues' },
        { month: 'February', short: 'Feb', rating: 'average', weather: 'Cold', temp: '6°C/-2°C', crowds: 'Low', price: 'Low', highlight: 'Cheapest month for stays' },
        { month: 'March', short: 'Mar', rating: 'good', weather: 'Mild, thawing', temp: '12°C/2°C', crowds: 'Low', price: 'Low', highlight: 'Comfortable Kalemegdan walking weather returns' },
        { month: 'April', short: 'Apr', rating: 'excellent', weather: 'Mild, pleasant', temp: '17°C/7°C', crowds: 'Moderate', price: 'Moderate', highlight: 'Ideal weather before peak season' },
        { month: 'May', short: 'May', rating: 'excellent', weather: 'Warm, dry', temp: '22°C/11°C', crowds: 'Moderate', price: 'Moderate', highlight: 'Comfortable for Zemun and riverfront walks' },
        { month: 'June', short: 'Jun', rating: 'excellent', weather: 'Warm summer', temp: '26°C/15°C', crowds: 'High', price: 'High', highlight: 'Riverside splavovi nightlife season begins' },
        { month: 'July', short: 'Jul', rating: 'good', weather: 'Hot, dry', temp: '29°C/17°C', crowds: 'High', price: 'High', highlight: 'Belgrade Beer Fest typically held this month' },
        { month: 'August', short: 'Aug', rating: 'good', weather: 'Hot, dry', temp: '29°C/17°C', crowds: 'High', price: 'High', highlight: 'Peak riverside nightlife season' },
        { month: 'September', short: 'Sep', rating: 'excellent', weather: 'Warm, comfortable', temp: '23°C/13°C', crowds: 'Moderate', price: 'Moderate', highlight: 'Comfortable weather, crowds thinning from summer' },
        { month: 'October', short: 'Oct', rating: 'good', weather: 'Mild autumn', temp: '17°C/8°C', crowds: 'Low', price: 'Low', highlight: 'Comfortable sightseeing weather' },
        { month: 'November', short: 'Nov', rating: 'average', weather: 'Cool, grey', temp: '11°C/4°C', crowds: 'Low', price: 'Low', highlight: 'Quiet month, museums are the priority' },
        { month: 'December', short: 'Dec', rating: 'average', weather: 'Cold, occasional snow', temp: '5°C/0°C', crowds: 'Low', price: 'Low', highlight: 'Quiet off-season, Skadarlija is atmospheric in winter light' },
      ],
    },
  },
  {
    slug: 'novi-sad', name: 'Novi Sad', country: 'Serbia', flag: '🇷🇸', tagline: 'Culture on the Danube',
    description: 'Novi Sad pairs a relaxed Austro-Hungarian centre with the immense Petrovaradin Fortress across the Danube, plus easy access to Fruška Gora’s monasteries and wineries.',
    coordinates: { lat: 45.2671, lng: 19.8335 }, bestTime: 'Apr – Jun, Sep – Oct', budget: 'EUR 40–105/day',
    language: 'Serbian', currency: 'RSD (Dinar)', vibes: ['Culture', 'Danube', 'Relaxed'],
    accentColor: '#7C3AED', gradient: 'from-violet-800 to-sky-500',
    highlights: [
      { name: 'Petrovaradin Fortress', description: 'Explore the upper fortress, clock tower and sweeping Danube viewpoint.', icon: '🏰', duration: '3 hours', category: 'Historical' },
      { name: 'Underground Military Galleries', description: 'Join an authorised guided visit into part of the fortress tunnel system.', icon: '🔦', duration: '1–2 hours', category: 'Historical' },
      { name: 'Liberty Square', description: 'Start a walk through the pastel centre at City Hall and the Name of Mary Church.', icon: '⛪', duration: '1 hour', category: 'Architecture' },
      { name: 'Zmaj Jovina & Dunavska Streets', description: 'Follow the café-lined pedestrian core toward leafy Danube Park.', icon: '☕', duration: '2 hours', category: 'Walking' },
      { name: 'Museum of Vojvodina', description: 'Understand the region’s multi-layered archaeology, history and cultural mix.', icon: '🏺', duration: '2 hours', category: 'Museum' },
      { name: 'Fruška Gora Day Trip', description: 'Combine forest trails, Orthodox monasteries and the wine town of Sremski Karlovci.', icon: '🌲', duration: 'Full day', category: 'Day Trip' },
    ],
    monthByMonth: {
      summary: 'April-June and September-October are Novi Sad\'s best months for the fortress and riverfront. Summer (July-August) is warm, and the EXIT music festival (July) at Petrovaradin Fortress draws major international crowds. Winter (December-February) is cold with occasional snow.',
      bestMonths: ['May', 'September', 'July'],
      avoidMonths: [],
      months: [
        { month: 'January', short: 'Jan', rating: 'average', weather: 'Cold, occasional snow', temp: '2°C/-4°C', crowds: 'Low', price: 'Low', highlight: 'Quiet season, Museum of Vojvodina without queues' },
        { month: 'February', short: 'Feb', rating: 'average', weather: 'Cold', temp: '5°C/-3°C', crowds: 'Low', price: 'Low', highlight: 'Cheapest month for stays' },
        { month: 'March', short: 'Mar', rating: 'good', weather: 'Mild, thawing', temp: '11°C/1°C', crowds: 'Low', price: 'Low', highlight: 'Comfortable Liberty Square walking weather returns' },
        { month: 'April', short: 'Apr', rating: 'excellent', weather: 'Mild, pleasant', temp: '17°C/6°C', crowds: 'Moderate', price: 'Moderate', highlight: 'Ideal weather before peak season' },
        { month: 'May', short: 'May', rating: 'excellent', weather: 'Warm, dry', temp: '21°C/10°C', crowds: 'Moderate', price: 'Moderate', highlight: 'Comfortable for the Fruška Gora day trip' },
        { month: 'June', short: 'Jun', rating: 'good', weather: 'Warm summer', temp: '25°C/14°C', crowds: 'Moderate', price: 'Moderate', highlight: 'Comfortable ahead of EXIT festival crowds' },
        { month: 'July', short: 'Jul', rating: 'good', weather: 'Hot, dry', temp: '28°C/16°C', crowds: 'Peak', price: 'Peak', highlight: 'EXIT Festival at Petrovaradin Fortress — book far ahead' },
        { month: 'August', short: 'Aug', rating: 'good', weather: 'Hot, dry', temp: '28°C/16°C', crowds: 'Moderate', price: 'Moderate', highlight: 'Quieter than July, still warm for the fortress views' },
        { month: 'September', short: 'Sep', rating: 'excellent', weather: 'Warm, comfortable', temp: '22°C/12°C', crowds: 'Moderate', price: 'Moderate', highlight: 'Sremski Karlovci wine harvest season nearby' },
        { month: 'October', short: 'Oct', rating: 'good', weather: 'Mild autumn', temp: '16°C/7°C', crowds: 'Low', price: 'Low', highlight: 'Fruška Gora forest colours at their best' },
        { month: 'November', short: 'Nov', rating: 'average', weather: 'Cool, grey', temp: '10°C/3°C', crowds: 'Low', price: 'Low', highlight: 'Quiet month, museums are the priority' },
        { month: 'December', short: 'Dec', rating: 'average', weather: 'Cold, occasional snow', temp: '4°C/-1°C', crowds: 'Low', price: 'Low', highlight: 'Quiet off-season along the Danube' },
      ],
    },
  },
  {
    slug: 'kotor', name: 'Kotor', country: 'Montenegro', flag: '🇲🇪', tagline: 'Walled Town on Boka Bay',
    description: 'Kotor’s UNESCO-listed old town is wedged between a mountain wall and a fjord-like Adriatic bay, with lanes, churches and fortifications climbing toward San Giovanni.',
    coordinates: { lat: 42.4247, lng: 18.7712 }, bestTime: 'Apr – Jun, Sep – Oct', budget: 'EUR 65–170/day',
    language: 'Montenegrin', currency: 'EUR', vibes: ['UNESCO', 'Mountains', 'Coastal'],
    accentColor: '#0369A1', gradient: 'from-sky-900 to-emerald-500',
    highlights: [
      { name: 'Kotor Old Town', description: 'Wander the compact maze inside the Sea Gate before day-trip crowds peak.', icon: '🏘️', duration: '3 hours', category: 'Historical' },
      { name: 'San Giovanni Fortress Hike', description: 'Climb above the walls for a demanding but exceptional view across Boka Bay.', icon: '🥾', duration: '3–4 hours', category: 'Trekking' },
      { name: 'St Tryphon Cathedral', description: 'Visit Kotor’s Romanesque cathedral and treasury in the old town.', icon: '⛪', duration: '1 hour', category: 'Spiritual' },
      { name: 'Maritime Museum', description: 'Trace the seafaring families and trade routes that shaped the bay.', icon: '⚓', duration: '1–2 hours', category: 'Museum' },
      { name: 'Perast & Our Lady of the Rocks', description: 'Take a bay trip to baroque Perast and its small offshore church island.', icon: '🚤', duration: 'Half day', category: 'Day Trip' },
      { name: 'Boka Bay Boat Trip', description: 'See the mountain-ringed bay from the water, checking seasonal schedules in advance.', icon: '⛵', duration: 'Half day', category: 'Scenic' },
    ],
    monthByMonth: {
      summary: 'May-June and September-October are Kotor\'s best months — warm and swimmable, ahead of or behind peak cruise-ship crowds. July-August is hot and very busy, with the San Giovanni Fortress hike best done at dawn to beat both heat and crowds. Winter (November-March) is quiet and mild but wetter, being a bay town.',
      bestMonths: ['May', 'June', 'September'],
      avoidMonths: [],
      months: [
        { month: 'January', short: 'Jan', rating: 'average', weather: 'Mild but wet', temp: '11°C/5°C', crowds: 'Low', price: 'Low', highlight: 'Quiet Old Town, most boat tours paused for the season' },
        { month: 'February', short: 'Feb', rating: 'average', weather: 'Mild, still wet', temp: '12°C/5°C', crowds: 'Low', price: 'Low', highlight: 'Cheapest month for stays' },
        { month: 'March', short: 'Mar', rating: 'average', weather: 'Mild, improving', temp: '14°C/7°C', crowds: 'Low', price: 'Low', highlight: 'Comfortable Old Town walking weather returns' },
        { month: 'April', short: 'Apr', rating: 'good', weather: 'Warm, occasional rain', temp: '17°C/9°C', crowds: 'Moderate', price: 'Moderate', highlight: 'Comfortable for the San Giovanni Fortress hike' },
        { month: 'May', short: 'May', rating: 'excellent', weather: 'Warm, dry', temp: '22°C/13°C', crowds: 'Moderate', price: 'High', highlight: 'Sea warm enough to swim, before peak crowds' },
        { month: 'June', short: 'Jun', rating: 'excellent', weather: 'Warm summer', temp: '26°C/17°C', crowds: 'High', price: 'Peak', highlight: 'Ideal weather for Perast and Boka Bay boat trips' },
        { month: 'July', short: 'Jul', rating: 'good', weather: 'Hot, dry', temp: '29°C/20°C', crowds: 'Peak', price: 'Peak', highlight: 'Peak cruise-ship season — Old Town is busiest midday' },
        { month: 'August', short: 'Aug', rating: 'good', weather: 'Hot, dry', temp: '29°C/20°C', crowds: 'Peak', price: 'Peak', highlight: 'Warmest sea temperatures of the year' },
        { month: 'September', short: 'Sep', rating: 'excellent', weather: 'Warm, drier', temp: '25°C/17°C', crowds: 'Moderate', price: 'High', highlight: 'Cruise crowds thin while the sea is still warm' },
        { month: 'October', short: 'Oct', rating: 'good', weather: 'Mild, more rain', temp: '20°C/13°C', crowds: 'Low', price: 'Moderate', highlight: 'Comfortable Old Town weather, most boat tours still running' },
        { month: 'November', short: 'Nov', rating: 'average', weather: 'Mild but wet', temp: '15°C/9°C', crowds: 'Low', price: 'Low', highlight: 'Quiet town, many seasonal tours winding down' },
        { month: 'December', short: 'Dec', rating: 'average', weather: 'Mild, rainy', temp: '12°C/7°C', crowds: 'Low', price: 'Low', highlight: 'Quiet off-season around the fortified walls' },
      ],
    },
  },
  {
    slug: 'budva', name: 'Budva', country: 'Montenegro', flag: '🇲🇪', tagline: 'Adriatic Beaches & Old Town',
    description: 'Budva combines a tiny fortified old town with the beaches and summer nightlife of Montenegro’s busiest riviera, while monasteries and coastal viewpoints sit close by.',
    coordinates: { lat: 42.2911, lng: 18.8403 }, bestTime: 'May – Jun, Sep', budget: 'EUR 60–165/day',
    language: 'Montenegrin', currency: 'EUR', vibes: ['Beach', 'Nightlife', 'Old town'],
    accentColor: '#0D9488', gradient: 'from-teal-800 to-amber-400',
    highlights: [
      { name: 'Budva Old Town', description: 'Walk the fortified peninsula’s lanes, small squares and churches.', icon: '🏘️', duration: '2–3 hours', category: 'Historical' },
      { name: 'Citadel & City Walls', description: 'Climb above the tiled roofs for sea views and a compact lesson in Budva’s defences.', icon: '🏰', duration: '1–2 hours', category: 'Historical' },
      { name: 'Mogren Beach', description: 'Follow the coastal path from the old town to a sheltered pebble beach.', icon: '🏖️', duration: 'Half day', category: 'Beach' },
      { name: 'Sveti Stefan Viewpoints', description: 'See the famous islet from public roadside and coastal viewpoints; access rules can change.', icon: '📷', duration: '2 hours', category: 'Scenic' },
      { name: 'Praskvica Monastery', description: 'Visit a historic Orthodox monastery above the coast near Sveti Stefan.', icon: '⛪', duration: '1–2 hours', category: 'Spiritual' },
      { name: 'Budva Riviera Boat Trip', description: 'Use a licensed seasonal boat service to view beaches and coves from the Adriatic.', icon: '🚤', duration: 'Half day', category: 'Adventure' },
    ],
    monthByMonth: {
      summary: 'May-June and September are Budva\'s best months — warm and swimmable, ahead of or behind the peak nightlife-driven summer crowds. July-August is hot, very busy, and Montenegro\'s liveliest nightlife season. Winter (November-March) is quiet, with most beach clubs and boat tours closed.',
      bestMonths: ['June', 'September', 'May'],
      avoidMonths: [],
      months: [
        { month: 'January', short: 'Jan', rating: 'avoid', weather: 'Mild but wet, windy', temp: '10°C/5°C', crowds: 'Low', price: 'Low', highlight: 'Most beach clubs and boat tours closed for the season' },
        { month: 'February', short: 'Feb', rating: 'average', weather: 'Mild, still wet', temp: '11°C/5°C', crowds: 'Low', price: 'Low', highlight: 'Cheapest month, Old Town at its quietest' },
        { month: 'March', short: 'Mar', rating: 'average', weather: 'Mild, improving', temp: '14°C/7°C', crowds: 'Low', price: 'Low', highlight: 'Comfortable Old Town walking weather returns' },
        { month: 'April', short: 'Apr', rating: 'good', weather: 'Warm, occasional rain', temp: '17°C/9°C', crowds: 'Moderate', price: 'Moderate', highlight: 'Comfortable weather before beach season' },
        { month: 'May', short: 'May', rating: 'excellent', weather: 'Warm, dry', temp: '22°C/13°C', crowds: 'Moderate', price: 'High', highlight: 'Sea warm enough to swim, before peak crowds' },
        { month: 'June', short: 'Jun', rating: 'excellent', weather: 'Warm summer', temp: '26°C/17°C', crowds: 'High', price: 'Peak', highlight: 'Ideal Mogren Beach weather begins' },
        { month: 'July', short: 'Jul', rating: 'good', weather: 'Hot, dry', temp: '29°C/20°C', crowds: 'Peak', price: 'Peak', highlight: 'Peak nightlife and beach season on the riviera' },
        { month: 'August', short: 'Aug', rating: 'good', weather: 'Hot, dry', temp: '29°C/20°C', crowds: 'Peak', price: 'Peak', highlight: 'Warmest sea temperatures of the year' },
        { month: 'September', short: 'Sep', rating: 'excellent', weather: 'Warm, drier', temp: '25°C/17°C', crowds: 'Moderate', price: 'High', highlight: 'Crowds thin while the sea is still warm' },
        { month: 'October', short: 'Oct', rating: 'good', weather: 'Mild, more rain', temp: '20°C/13°C', crowds: 'Low', price: 'Moderate', highlight: 'Comfortable Old Town weather, quieter beaches' },
        { month: 'November', short: 'Nov', rating: 'average', weather: 'Mild but wet', temp: '15°C/9°C', crowds: 'Low', price: 'Low', highlight: 'Quiet town, most beach clubs closed for the season' },
        { month: 'December', short: 'Dec', rating: 'average', weather: 'Mild, rainy', temp: '12°C/7°C', crowds: 'Low', price: 'Low', highlight: 'Quiet off-season around the fortified Old Town' },
      ],
    },
  },
  {
    slug: 'bratislava', name: 'Bratislava', country: 'Slovakia', flag: '🇸🇰', tagline: 'Danube Capital in a Day',
    description: 'Bratislava is a small Danube capital with a walkable old town, castle views and an easy boat or bus excursion to the frontier ruins of Devín.',
    coordinates: { lat: 48.1486, lng: 17.1077 }, bestTime: 'Apr – Jun, Sep – Oct', budget: 'EUR 60–150/day',
    language: 'Slovak', currency: 'EUR', vibes: ['Old town', 'Castle', 'Danube'],
    accentColor: '#2563EB', gradient: 'from-blue-800 to-red-500',
    highlights: [
      { name: 'Bratislava Castle', description: 'Tour the hilltop complex and Baroque garden for broad Danube and old-town views.', icon: '🏰', duration: '2–3 hours', category: 'Historical' },
      { name: 'Old Town & Michael’s Gate', description: 'Walk compact medieval lanes from the surviving city gate to Main Square.', icon: '🚶', duration: '2 hours', category: 'Walking' },
      { name: 'St Martin’s Cathedral', description: 'Visit the former coronation church beneath the castle hill.', icon: '⛪', duration: '1 hour', category: 'Spiritual' },
      { name: 'Blue Church', description: 'See the distinctive Art Nouveau Church of St Elizabeth east of the centre.', icon: '💠', duration: '45 minutes', category: 'Architecture' },
      { name: 'Devín Castle', description: 'Take a bus or seasonal boat to dramatic ruins above the Danube–Morava confluence.', icon: '🏛️', duration: 'Half day', category: 'Day Trip' },
      { name: 'Slavín Memorial', description: 'Walk up to the memorial and one of the city’s widest skyline viewpoints.', icon: '🌆', duration: '1–2 hours', category: 'Historical' },
    ],
    monthByMonth: {
      summary: 'April-June and September-October are Bratislava\'s best months for walking the Old Town and castle grounds. December is excellent for the Christmas market on Main Square, one of Central Europe\'s most charming. Winter (December-February) is cold with occasional snow.',
      bestMonths: ['May', 'September', 'December'],
      avoidMonths: [],
      months: [
        { month: 'January', short: 'Jan', rating: 'average', weather: 'Cold, occasional snow', temp: '2°C/-3°C', crowds: 'Low', price: 'Low', highlight: 'Quiet season, castle without queues' },
        { month: 'February', short: 'Feb', rating: 'average', weather: 'Cold', temp: '4°C/-3°C', crowds: 'Low', price: 'Low', highlight: 'Cheapest month for stays' },
        { month: 'March', short: 'Mar', rating: 'good', weather: 'Mild, thawing', temp: '10°C/1°C', crowds: 'Low', price: 'Low', highlight: 'Comfortable Old Town walking weather returns' },
        { month: 'April', short: 'Apr', rating: 'excellent', weather: 'Mild, pleasant', temp: '15°C/5°C', crowds: 'Moderate', price: 'Moderate', highlight: 'Ideal weather before peak season' },
        { month: 'May', short: 'May', rating: 'excellent', weather: 'Warm, dry', temp: '19°C/9°C', crowds: 'Moderate', price: 'Moderate', highlight: 'Comfortable for the Devín Castle day trip' },
        { month: 'June', short: 'Jun', rating: 'excellent', weather: 'Warm summer', temp: '23°C/12°C', crowds: 'High', price: 'High', highlight: 'Long days for the castle hill and Danube views' },
        { month: 'July', short: 'Jul', rating: 'good', weather: 'Warm, occasional rain', temp: '25°C/14°C', crowds: 'High', price: 'High', highlight: 'Peak summer season' },
        { month: 'August', short: 'Aug', rating: 'good', weather: 'Warm summer', temp: '25°C/14°C', crowds: 'High', price: 'High', highlight: 'Still warm, good for riverside walks' },
        { month: 'September', short: 'Sep', rating: 'excellent', weather: 'Mild, comfortable', temp: '20°C/10°C', crowds: 'Moderate', price: 'Moderate', highlight: 'Comfortable weather, crowds thinning from summer' },
        { month: 'October', short: 'Oct', rating: 'good', weather: 'Cool autumn', temp: '14°C/6°C', crowds: 'Low', price: 'Low', highlight: 'Comfortable sightseeing weather' },
        { month: 'November', short: 'Nov', rating: 'average', weather: 'Cold, grey', temp: '8°C/2°C', crowds: 'Low', price: 'Low', highlight: 'Quiet month ahead of Christmas market season' },
        { month: 'December', short: 'Dec', rating: 'excellent', weather: 'Cold, festive', temp: '3°C/-2°C', crowds: 'High', price: 'High', highlight: 'Christmas market on Main Square, one of Central Europe\'s best' },
      ],
    },
  },
  {
    slug: 'tallinn', name: 'Tallinn', country: 'Estonia', flag: '🇪🇪', tagline: 'Medieval Walls, Nordic Ideas',
    description: 'Tallinn preserves one of Europe’s most atmospheric medieval old towns, then shifts quickly into creative districts, maritime museums and the palace gardens of Kadriorg.',
    coordinates: { lat: 59.437, lng: 24.7536 }, bestTime: 'May – Sep, Dec', budget: 'EUR 65–165/day',
    language: 'Estonian', currency: 'EUR', vibes: ['Medieval', 'Design', 'Food'],
    accentColor: '#2563EB', gradient: 'from-blue-900 to-slate-400',
    highlights: [
      { name: 'UNESCO Old Town', description: 'Explore Town Hall Square, guild lanes and surviving medieval walls on foot.', icon: '🏘️', duration: 'Half day', category: 'Historical' },
      { name: 'Toompea & Viewing Platforms', description: 'Climb to the upper town for churches, parliament buildings and rooftop views.', icon: '📷', duration: '2 hours', category: 'Scenic' },
      { name: 'Kiek in de Kök Fortifications', description: 'Visit defensive towers and museum passages; confirm which sections are open.', icon: '🧱', duration: '2 hours', category: 'Museum' },
      { name: 'Kadriorg Palace & Park', description: 'Pair the baroque palace art museum with formal gardens east of the centre.', icon: '🏛️', duration: 'Half day', category: 'Art & Culture' },
      { name: 'Telliskivi Creative City', description: 'Browse studios, design shops, restaurants and street art beyond the old walls.', icon: '🎨', duration: '2–3 hours', category: 'Neighbourhood' },
      { name: 'Seaplane Harbour', description: 'Explore Estonia’s maritime museum inside a landmark hangar complex.', icon: '⚓', duration: '2–3 hours', category: 'Museum' },
    ],
    monthByMonth: {
      summary: 'June-August offers Tallinn\'s mildest weather and nearly 19 hours of daylight around the solstice, ideal for the Old Town and Kadriorg Park. December brings one of Europe\'s most atmospheric Christmas markets to Town Hall Square. Winter (December-February) is genuinely cold with snow and short days.',
      bestMonths: ['June', 'July', 'December'],
      avoidMonths: ['February'],
      months: [
        { month: 'January', short: 'Jan', rating: 'average', weather: 'Cold, snowy, short days', temp: '-1°C/-5°C', crowds: 'Low', price: 'Low', highlight: 'Quiet season, Old Town under snow is genuinely picturesque' },
        { month: 'February', short: 'Feb', rating: 'avoid', weather: 'Coldest month, snowy', temp: '-1°C/-6°C', crowds: 'Low', price: 'Low', highlight: 'Coldest month — indoor museums are the priority' },
        { month: 'March', short: 'Mar', rating: 'average', weather: 'Cold, thawing', temp: '3°C/-3°C', crowds: 'Low', price: 'Low', highlight: 'Snow beginning to clear from the Old Town lanes' },
        { month: 'April', short: 'Apr', rating: 'good', weather: 'Cool, lengthening days', temp: '8°C/1°C', crowds: 'Low', price: 'Low', highlight: 'Comfortable walking weather returns' },
        { month: 'May', short: 'May', rating: 'good', weather: 'Mild, pleasant', temp: '14°C/6°C', crowds: 'Moderate', price: 'Moderate', highlight: 'Kadriorg Park in bloom, long daylight hours' },
        { month: 'June', short: 'Jun', rating: 'excellent', weather: 'Mild, near-endless daylight', temp: '18°C/10°C', crowds: 'High', price: 'High', highlight: 'White nights around the summer solstice' },
        { month: 'July', short: 'Jul', rating: 'excellent', weather: 'Mild, warmest month', temp: '20°C/13°C', crowds: 'Peak', price: 'Peak', highlight: 'Peak season, ideal Old Town and Telliskivi weather' },
        { month: 'August', short: 'Aug', rating: 'good', weather: 'Mild, still bright', temp: '19°C/12°C', crowds: 'High', price: 'High', highlight: 'Still warm, comfortable for Seaplane Harbour and the walls' },
        { month: 'September', short: 'Sep', rating: 'good', weather: 'Cool, darkening evenings', temp: '14°C/8°C', crowds: 'Moderate', price: 'Moderate', highlight: 'Comfortable weather, thinner crowds than summer' },
        { month: 'October', short: 'Oct', rating: 'average', weather: 'Cool, wetter', temp: '8°C/4°C', crowds: 'Low', price: 'Low', highlight: 'Comfortable for a quieter Old Town visit' },
        { month: 'November', short: 'Nov', rating: 'average', weather: 'Cold, short days', temp: '4°C/0°C', crowds: 'Low', price: 'Low', highlight: 'Quiet month ahead of Christmas market season' },
        { month: 'December', short: 'Dec', rating: 'excellent', weather: 'Cold, snowy, festive', temp: '1°C/-3°C', crowds: 'High', price: 'High', highlight: 'Town Hall Square Christmas market, among Europe\'s best' },
      ],
    },
  },
];

function buildCity(destination: Destination): City {
  const image = `/city-images/${destination.slug}.jpg`;
  return {
    ...destination,
    stub: false,
    heroDescription: destination.description,
    image,
    heroImage: image,
    stats: {
      bestTime: destination.bestTime,
      budget: destination.budget,
      language: destination.language,
      currency: destination.currency,
    },
    thingsToDo: destination.highlights,
    areas: [
      {
        name: 'Essential sights', emoji: '1', accentColor: destination.accentColor, image,
        tagline: 'The landmarks that define a first visit',
        spots: destination.highlights.slice(0, 3).map(({ name }) => ({ name, tag: 'Priority' })),
      },
      {
        name: 'Go deeper', emoji: '2', accentColor: destination.accentColor, image,
        tagline: 'Neighbourhoods, nature and worthwhile extensions',
        spots: destination.highlights.slice(3).map(({ name }) => ({ name, tag: 'Add-on' })),
      },
    ],
  };
}

export const tourismExpansionCities: City[] = destinations.map(buildCity);
