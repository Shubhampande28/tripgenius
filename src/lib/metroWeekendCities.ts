// Batch 3 — metro weekend-getaway gap (2026-09). Confirmed zero coverage for
// the three largest urban search populations (Mumbai/Pune, Delhi/NCR,
// Bengaluru) despite these being the highest-volume "weekend trip from
// [metro]" destinations. Full hand-authored monthByMonth + thingsToDo from
// the start (not the generic enrichCity fallback), same quality bar as
// existing Zone 4 cities — see docs/ga4-bot-traffic-2026-09.md sibling audit
// note in the visit-template review for why stub:true / no monthByMonth
// pages are deliberately excluded from the index.
//
// 5 of these (Alibaug, Khandala, Chail, Lansdowne, Nandi Hills) are wholly
// new entries. The other 5 (Dalhousie, Chopta, Matheran, Panchgani, Yercaud)
// existed as generic stub entries in rankedIndianTouristCities.ts (removed
// from there — see that file's diff) with no real month/things-to-do data;
// they're upgraded here to full authored city pages.

import type { City } from './types';

const U = 'https://images.unsplash.com';

// Reuses the same category-fallback approach as indianCitiesExtended.ts's
// categoryPhoto() (verified, already-working Unsplash IDs used elsewhere in
// the codebase) so every page gets a real, working hero image.
function categoryPhoto(vibes: string[]): string {
  if (vibes.includes('Beach')) return `${U}/photo-1507525428034-b723cf961d3e`;
  if (vibes.includes('Adventure') && vibes.includes('Nature')) return `${U}/photo-1626621341517-bbf3d9990a23`;
  return `${U}/photo-1681204032871-d385acdc114d`; // Nature default
}

function img(vibes: string[]): { image: string; heroImage: string } {
  const base = categoryPhoto(vibes);
  return { image: `${base}?auto=format&fit=crop&w=800&q=80`, heroImage: `${base}?auto=format&fit=crop&w=1600&q=85` };
}

export const metroWeekendCities: City[] = [
  // ── Mumbai/Pune belt ──────────────────────────────────────────────
  {
    slug: 'khandala', name: 'Khandala', country: 'India', state: 'Maharashtra', flag: '🇮🇳',
    tagline: 'Lonavala\'s Quieter Twin',
    description: 'The smaller, quieter half of the Lonavala–Khandala hill-station pair on the Mumbai–Pune expressway — the same Western Ghats waterfalls and viewpoints with noticeably thinner crowds.',
    heroDescription: 'Five kilometres from Lonavala on the Sahyadri escarpment, Khandala trades some of its twin\'s crowds for quieter viewpoints and the same monsoon drama — Duke\'s Nose, Tiger\'s Leap, and forest drives above the Mumbai-Pune expressway.',
    ...img(['Nature', 'Romantic']),
    stats: { bestTime: 'Jun – Sep (monsoon) · Oct – Feb', budget: '$15–$65/day', language: 'Marathi, Hindi', currency: 'INR (Rupee)' },
    vibes: ['Nature', 'Romantic', 'Adventure'],
    gradient: 'from-green-800 to-stone-800', accentColor: '#16A34A',
    areas: [
      { name: 'Khandala Viewpoints', emoji: '🏔️', accentColor: '#16A34A', image: img(['Nature']).image, tagline: 'Cliff-edge views over the Sahyadris', spots: [{ name: 'Duke\'s Nose (Nagphani)', tag: 'Trek + view' }, { name: 'Khandala Point', tag: 'Sunset' }, { name: 'Reversing Station', tag: 'Colonial-era rail' }] },
    ],
    thingsToDo: [
      { name: 'Duke\'s Nose (Nagphani)', description: 'A dramatic cliff shaped like a nose jutting from the ridge, reached by a moderate trek — a favourite rock-climbing and rappelling spot with sweeping valley views.', icon: '⛰️', duration: '3-4 hrs', category: 'Adventure' },
      { name: 'Khandala Point', description: 'The town\'s signature viewpoint over the Sahyadri gorge and the old Bhor Ghat road, especially atmospheric with monsoon mist rolling through the valley.', icon: '🌄', duration: '30-45 min', category: 'Scenic' },
      { name: 'Reversing Station', description: 'A quirky colonial-era railway relic where trains once reversed direction to climb the steep ghat — now a quiet viewpoint with valley views and old rail infrastructure.', icon: '🚂', duration: '30 min', category: 'Historical' },
      { name: 'Rajmachi Point', description: 'A roadside viewpoint looking toward Rajmachi Fort across the valley, framed by the Ulhas river gorge below — busiest but most reliable monsoon vista.', icon: '🏞️', duration: '30 min', category: 'Scenic' },
      { name: 'Kune Falls Drive-By', description: 'One of India\'s tallest waterfalls sits just outside town on the old Mumbai-Pune highway — a roadside stop rather than a hike, best seen July-September.', icon: '🌊', duration: '30 min', category: 'Nature' },
      { name: 'Della Adventure Park Day Trip', description: 'A short drive away in Lonavala, offering ziplining, go-karting and other adrenaline activities — the easiest half-day add-on to a Khandala base.', icon: '🎢', duration: '2-3 hrs', category: 'Entertainment' },
    ],
    monthByMonth: {
      summary: 'Like Lonavala next door, June–September (monsoon) is when Khandala is at its greenest and busiest with day-trippers, while October–February is the calmer, comfortable season for viewpoint walks. March–May is hot and best skipped.',
      bestMonths: ['July', 'August', 'September'],
      avoidMonths: ['April', 'May'],
      months: [
        { month: 'January', short: 'Jan', rating: 'good', weather: 'Cool and dry (24°C)', temp: '24°C', crowds: 'Moderate', price: 'Moderate', highlight: 'Clear views from Duke\'s Nose and Khandala Point' },
        { month: 'February', short: 'Feb', rating: 'good', weather: 'Warming, dry (27°C)', temp: '27°C', crowds: 'Moderate', price: 'Moderate', highlight: 'Comfortable trekking weather before the heat' },
        { month: 'March', short: 'Mar', rating: 'average', weather: 'Hot, dry (32°C)', temp: '32°C', crowds: 'Low', price: 'Low', highlight: 'Quiet and cheap, but waterfalls have dried up' },
        { month: 'April', short: 'Apr', rating: 'avoid', weather: 'Very hot (36°C)', temp: '36°C', crowds: 'Low', price: 'Low', highlight: 'Too hot for viewpoint treks' },
        { month: 'May', short: 'May', rating: 'avoid', weather: 'Peak heat (37°C)', temp: '37°C', crowds: 'Low', price: 'Low', highlight: 'Hottest month of the year' },
        { month: 'June', short: 'Jun', rating: 'good', weather: 'Monsoon arrives (28°C)', temp: '28°C', crowds: 'High', price: 'High', highlight: 'First waterfalls and mist begin' },
        { month: 'July', short: 'Jul', rating: 'excellent', weather: 'Full monsoon (25°C)', temp: '25°C', crowds: 'Peak', price: 'Peak', highlight: 'Kune Falls and the valley viewpoints at their best' },
        { month: 'August', short: 'Aug', rating: 'excellent', weather: 'Heavy rain, lush (25°C)', temp: '25°C', crowds: 'Peak', price: 'Peak', highlight: 'Quieter than Lonavala at the same peak-green moment' },
        { month: 'September', short: 'Sep', rating: 'excellent', weather: 'Rain easing, green (26°C)', temp: '26°C', crowds: 'High', price: 'High', highlight: 'Waterfalls still full as crowds start to thin' },
        { month: 'October', short: 'Oct', rating: 'good', weather: 'Post-monsoon, warm (28°C)', temp: '28°C', crowds: 'Moderate', price: 'Moderate', highlight: 'Clear skies, lingering greenery' },
        { month: 'November', short: 'Nov', rating: 'good', weather: 'Cooling, pleasant (26°C)', temp: '26°C', crowds: 'Moderate', price: 'Moderate', highlight: 'Comfortable weekend-drive weather' },
        { month: 'December', short: 'Dec', rating: 'good', weather: 'Cool and pleasant (23°C)', temp: '23°C', crowds: 'High', price: 'High', highlight: 'New Year weekend crowds — book ahead' },
      ],
    },
  },
  {
    slug: 'alibaug', name: 'Alibaug', country: 'India', state: 'Maharashtra', flag: '🇮🇳',
    tagline: 'Mumbai\'s Beach Escape',
    description: 'A laid-back Konkan coast beach town a short ferry ride from Mumbai — black-sand beaches, a low-tide walk to a 17th-century sea fort, and weekend farmhouse culture.',
    heroDescription: 'Reached by a 1-hour catamaran from Gateway of India or a 2-3 hour drive, Alibaug is Mumbai\'s default weekend beach — Kolaba Fort accessible on foot at low tide, quiet Konkan beaches, and a growing scene of boutique stays and farmhouses.',
    ...img(['Beach']),
    stats: { bestTime: 'Nov – Feb', budget: '$25–$90/day', language: 'Marathi, Hindi', currency: 'INR (Rupee)' },
    vibes: ['Beach', 'Relaxation', 'Nature'],
    gradient: 'from-cyan-900 to-blue-800', accentColor: '#0284C7',
    areas: [
      { name: 'Alibaug Beaches & Fort', emoji: '🏖️', accentColor: '#0284C7', image: img(['Beach']).image, tagline: 'Konkan coast beaches and a sea fort', spots: [{ name: 'Kolaba Fort', tag: 'Low-tide walk' }, { name: 'Alibaug Beach', tag: 'Main beach' }, { name: 'Kihim Beach', tag: 'Quieter' }] },
    ],
    thingsToDo: [
      { name: 'Kolaba Fort', description: 'A 17th-century sea fort built by Maratha admiral Kanhoji Angre, reachable on foot across the sea bed only during low tide — check tide timings before setting out.', icon: '🏰', duration: '1.5 hrs', category: 'Historical' },
      { name: 'Alibaug Beach', description: 'The main black-sand town beach — busy on weekends with horse rides and beachside snack stalls, and the launch point for the Kolaba Fort walk.', icon: '🏖️', duration: '1-2 hrs', category: 'Relaxation' },
      { name: 'Kihim Beach', description: 'A quieter, casuarina-lined beach a short drive from town, popular for its calmer waters and sunset views without Alibaug\'s weekend crowds.', icon: '🌅', duration: '1-2 hrs', category: 'Relaxation' },
      { name: 'Nagaon Beach', description: 'A wide, cleaner beach favoured for water sports (banana boat, jet ski) and beach shacks — the liveliest of Alibaug\'s beaches on weekends.', icon: '🏄', duration: '2 hrs', category: 'Adventure' },
      { name: 'Kanakeshwar Temple Trek', description: 'A forested hill climb of about 500 steps to a hilltop Shiva temple, with views over the Konkan coastline — a good half-day outing away from the beaches.', icon: '🛕', duration: '2-3 hrs', category: 'Spiritual' },
      { name: 'Farmhouse & Winery Visits', description: 'The Alibaug hinterland has become Mumbai\'s weekend-farmhouse belt, with several boutique wineries and farm-stay properties open for day visits and tastings.', icon: '🍷', duration: '2-3 hrs', category: 'Relaxation' },
    ],
    monthByMonth: {
      summary: 'November–February is peak season — dry, sunny, and comfortable for the beaches and the Kolaba Fort walk. March–May turns hot and humid. June–September is monsoon, when the sea is rough and the fort walk is unsafe (surf and tide unpredictable); the town itself turns lush green.',
      bestMonths: ['November', 'December', 'January'],
      avoidMonths: ['July', 'August'],
      months: [
        { month: 'January', short: 'Jan', rating: 'excellent', weather: 'Cool, dry, sunny (26°C)', temp: '26°C', crowds: 'High', price: 'High', highlight: 'Best beach weather of the year' },
        { month: 'February', short: 'Feb', rating: 'excellent', weather: 'Warm, dry (29°C)', temp: '29°C', crowds: 'High', price: 'High', highlight: 'Still comfortable before the humidity builds' },
        { month: 'March', short: 'Mar', rating: 'good', weather: 'Warm, humidity rising (31°C)', temp: '31°C', crowds: 'Moderate', price: 'Moderate', highlight: 'Good early mornings, hotter by midday' },
        { month: 'April', short: 'Apr', rating: 'average', weather: 'Hot and humid (33°C)', temp: '33°C', crowds: 'Low', price: 'Low', highlight: 'Beach visits work best at dawn or dusk' },
        { month: 'May', short: 'May', rating: 'average', weather: 'Very hot, humid (34°C)', temp: '34°C', crowds: 'Low', price: 'Low', highlight: 'Pre-monsoon heat — least crowded month' },
        { month: 'June', short: 'Jun', rating: 'avoid', weather: 'Monsoon arrives, rough sea (29°C)', temp: '29°C', crowds: 'Low', price: 'Low', highlight: 'Kolaba Fort walk unsafe — surf and tides unpredictable' },
        { month: 'July', short: 'Jul', rating: 'avoid', weather: 'Heavy monsoon (27°C)', temp: '27°C', crowds: 'Low', price: 'Low', highlight: 'Beaches largely unusable, but the coast turns lush green' },
        { month: 'August', short: 'Aug', rating: 'avoid', weather: 'Continuous rain (27°C)', temp: '27°C', crowds: 'Low', price: 'Low', highlight: 'Farmhouse stays and monsoon greenery over beach time' },
        { month: 'September', short: 'Sep', rating: 'average', weather: 'Rain easing (28°C)', temp: '28°C', crowds: 'Low', price: 'Low', highlight: 'Sea starts calming toward month-end' },
        { month: 'October', short: 'Oct', rating: 'good', weather: 'Post-monsoon, warm (30°C)', temp: '30°C', crowds: 'Moderate', price: 'Moderate', highlight: 'Fort walk reopens as the sea calms' },
        { month: 'November', short: 'Nov', rating: 'excellent', weather: 'Cooling, pleasant (28°C)', temp: '28°C', crowds: 'High', price: 'High', highlight: 'Ideal weekend-getaway weather returns' },
        { month: 'December', short: 'Dec', rating: 'excellent', weather: 'Cool, dry (27°C)', temp: '27°C', crowds: 'Peak', price: 'Peak', highlight: 'Christmas/New Year weekend rush — book ferries ahead' },
      ],
    },
  },
  {
    slug: 'matheran', name: 'Matheran', country: 'India', state: 'Maharashtra', flag: '🇮🇳',
    tagline: 'India\'s Only Vehicle-Free Hill Station',
    description: 'A tiny Western Ghats hill station where motor vehicles are banned entirely — get around by foot, horse, or the century-old toy train, past dozens of named viewpoints over the Mumbai/Pune plains.',
    heroDescription: 'Reached by toy train or a steep walk up from Neral station, Matheran bans all motor vehicles inside town — its red laterite paths, over 30 named viewpoints, and total quiet make it unlike any other Mumbai-area getaway.',
    ...img(['Nature']),
    stats: { bestTime: 'Oct – Mar', budget: '$18–$70/day', language: 'Marathi, Hindi', currency: 'INR (Rupee)' },
    vibes: ['Nature', 'Relaxation', 'Adventure'],
    gradient: 'from-emerald-900 to-stone-800', accentColor: '#059669',
    areas: [
      { name: 'Matheran Viewpoints', emoji: '🌳', accentColor: '#059669', image: img(['Nature']).image, tagline: 'Vehicle-free trails and 30+ named viewpoints', spots: [{ name: 'Panorama Point', tag: 'Best 360° view' }, { name: 'Charlotte Lake', tag: 'Water source' }, { name: 'Louisa Point', tag: 'Sunset' }] },
    ],
    thingsToDo: [
      { name: 'Matheran Toy Train', description: 'A narrow-gauge heritage railway (UNESCO-nominated) climbing from Neral through 120-degree hairpin curves and tunnels — the classic, if slow, way to arrive.', icon: '🚂', duration: '2 hrs one-way', category: 'Iconic' },
      { name: 'Panorama Point', description: 'The highest and widest viewpoint in Matheran, with a 360-degree sweep over the Sahyadri ranges — best at sunrise before the haze builds.', icon: '🌄', duration: '1 hr', category: 'Scenic' },
      { name: 'Charlotte Lake', description: 'The town\'s main water source and a peaceful forest-lake walk, especially full and scenic just after monsoon.', icon: '🏞️', duration: '1 hr', category: 'Nature' },
      { name: 'Louisa Point', description: 'A cliff-edge sunset viewpoint facing the neighbouring Peb Fort and the plains below — one of the most-visited of Matheran\'s 30-odd named points.', icon: '🌅', duration: '45 min', category: 'Scenic' },
      { name: 'One Tree Hill Point', description: 'A quieter viewpoint reached by a pleasant forest walk, less crowded than Louisa or Panorama Point but with comparable views.', icon: '🌲', duration: '1 hr', category: 'Scenic' },
      { name: 'Horse Riding & Hand-Pulled Rickshaw', description: 'With no motor vehicles allowed, horses and hand-pulled rickshaws are the local way to cover longer distances between viewpoints.', icon: '🐴', duration: 'Varies', category: 'Adventure' },
    ],
    monthByMonth: {
      summary: 'October–March is the reliable, comfortable window for exploring on foot. April–May gets hot but is bearable thanks to the altitude and dense forest cover. June–September (monsoon) is genuinely spectacular — mist, waterfalls, forest at its most lush — but red laterite paths turn slippery and leech-prone.',
      bestMonths: ['November', 'December', 'February'],
      avoidMonths: ['July', 'August'],
      months: [
        { month: 'January', short: 'Jan', rating: 'excellent', weather: 'Cool and dry (22°C)', temp: '22°C', crowds: 'High', price: 'High', highlight: 'Best walking weather across all viewpoints' },
        { month: 'February', short: 'Feb', rating: 'excellent', weather: 'Mild, clear (25°C)', temp: '25°C', crowds: 'High', price: 'High', highlight: 'Clear panoramas from Panorama Point' },
        { month: 'March', short: 'Mar', rating: 'good', weather: 'Warming (28°C)', temp: '28°C', crowds: 'Moderate', price: 'Moderate', highlight: 'Still comfortable in the forest shade' },
        { month: 'April', short: 'Apr', rating: 'good', weather: 'Warm (31°C)', temp: '31°C', crowds: 'Moderate', price: 'Moderate', highlight: 'Altitude keeps it cooler than Mumbai below' },
        { month: 'May', short: 'May', rating: 'average', weather: 'Hot (33°C)', temp: '33°C', crowds: 'Moderate', price: 'Moderate', highlight: 'Summer-holiday crowds despite the heat' },
        { month: 'June', short: 'Jun', rating: 'average', weather: 'Monsoon arrives, humid (27°C)', temp: '27°C', crowds: 'Low', price: 'Low', highlight: 'First rains green up the forest quickly' },
        { month: 'July', short: 'Jul', rating: 'avoid', weather: 'Heavy monsoon (24°C)', temp: '24°C', crowds: 'Low', price: 'Low', highlight: 'Laterite paths get slippery and leeches appear' },
        { month: 'August', short: 'Aug', rating: 'avoid', weather: 'Continuous rain (24°C)', temp: '24°C', crowds: 'Low', price: 'Low', highlight: 'Toy train service is often suspended for the season' },
        { month: 'September', short: 'Sep', rating: 'average', weather: 'Rain easing, very green (25°C)', temp: '25°C', crowds: 'Low', price: 'Low', highlight: 'Mist and waterfalls linger as rain tapers off' },
        { month: 'October', short: 'Oct', rating: 'good', weather: 'Post-monsoon, warm (27°C)', temp: '27°C', crowds: 'Moderate', price: 'Moderate', highlight: 'Toy train resumes, forest still lush' },
        { month: 'November', short: 'Nov', rating: 'excellent', weather: 'Cool, ideal (23°C)', temp: '23°C', crowds: 'High', price: 'High', highlight: 'Best month overall — clear air, lingering greenery' },
        { month: 'December', short: 'Dec', rating: 'excellent', weather: 'Cool, crisp (21°C)', temp: '21°C', crowds: 'High', price: 'High', highlight: 'Popular winter weekend escape from Mumbai/Pune' },
      ],
    },
  },
  {
    slug: 'panchgani', name: 'Panchgani', country: 'India', state: 'Maharashtra', flag: '🇮🇳',
    tagline: 'Table Land & Strawberry Country',
    description: 'A Western Ghats hill station named for the five hills that surround it — best known for Table Land, Asia\'s second-largest volcanic plateau, and the strawberry farms shared with neighbouring Mahabaleshwar.',
    heroDescription: 'A quieter, smaller counterpart to nearby Mahabaleshwar, Panchgani centres on Table Land\'s flat volcanic plateau and a scattering of colonial-era boarding schools, with strawberry season drawing weekend crowds each spring.',
    ...img(['Nature']),
    stats: { bestTime: 'Oct – Jun', budget: '$18–$70/day', language: 'Marathi, Hindi', currency: 'INR (Rupee)' },
    vibes: ['Nature', 'Relaxation', 'Adventure'],
    gradient: 'from-lime-900 to-green-800', accentColor: '#65A30D',
    areas: [
      { name: 'Panchgani Viewpoints', emoji: '🌾', accentColor: '#65A30D', image: img(['Nature']).image, tagline: 'Table Land and colonial-era hill views', spots: [{ name: 'Table Land', tag: 'Volcanic plateau' }, { name: 'Sydney Point', tag: 'Valley view' }, { name: 'Parsi Point', tag: 'Sunset' }] },
    ],
    thingsToDo: [
      { name: 'Table Land', description: 'A vast, flat volcanic plateau — reportedly Asia\'s second-largest — offering wide-open walking, horse rides, and views over the Krishna Valley; can get very windy.', icon: '🏔️', duration: '1-2 hrs', category: 'Scenic' },
      { name: 'Sydney Point', description: 'A viewpoint looking down into the Dhom Dam valley and surrounding hills, quieter than Table Land but comparably scenic.', icon: '🌄', duration: '30-45 min', category: 'Scenic' },
      { name: 'Parsi Point', description: 'A cliff-edge sunset spot facing the Krishna Valley, named for the Parsi community that once summered here — one of the classic viewpoint stops.', icon: '🌅', duration: '30-45 min', category: 'Scenic' },
      { name: 'Devrai Art Village', description: 'A crafts village showcasing tribal art from across Maharashtra, with workshops and pieces for sale — a change of pace from the viewpoint circuit.', icon: '🎨', duration: '1 hr', category: 'Cultural' },
      { name: 'Strawberry Farm Visits', description: 'Panchgani shares Mahabaleshwar\'s strawberry belt — pick-your-own farms and roadside stalls selling strawberries-and-cream are a February-April highlight.', icon: '🍓', duration: '1 hr', category: 'Culinary' },
      { name: 'Kamalgad Fort Trek', description: 'A lesser-visited hill fort near town with a moderate climb and views over the Panchgani plateau — a good half-day trek for those wanting to skip the viewpoint crowds.', icon: '🏰', duration: '3 hrs', category: 'Adventure' },
    ],
    monthByMonth: {
      summary: 'October–June is the broad comfortable season (this hill station stays cooler than the plains even in summer), with February–April adding strawberry season. July–September is heavy monsoon — Table Land gets extremely windy and misty, and views are largely obscured.',
      bestMonths: ['October', 'November', 'March'],
      avoidMonths: ['July', 'August'],
      months: [
        { month: 'January', short: 'Jan', rating: 'excellent', weather: 'Cool and clear (19°C)', temp: '19°C', crowds: 'High', price: 'High', highlight: 'Best visibility from Table Land and Parsi Point' },
        { month: 'February', short: 'Feb', rating: 'excellent', weather: 'Mild, dry (21°C)', temp: '21°C', crowds: 'High', price: 'High', highlight: 'Strawberry season begins' },
        { month: 'March', short: 'Mar', rating: 'excellent', weather: 'Pleasant (25°C)', temp: '25°C', crowds: 'High', price: 'High', highlight: 'Peak strawberry-picking month' },
        { month: 'April', short: 'Apr', rating: 'good', weather: 'Warm days (28°C)', temp: '28°C', crowds: 'High', price: 'High', highlight: 'Last of the strawberry season, summer crowds build' },
        { month: 'May', short: 'May', rating: 'good', weather: 'Warm (29°C)', temp: '29°C', crowds: 'Peak', price: 'Peak', highlight: 'Busiest month — school-holiday hill escape' },
        { month: 'June', short: 'Jun', rating: 'average', weather: 'Pre-monsoon showers (24°C)', temp: '24°C', crowds: 'Moderate', price: 'Moderate', highlight: 'Crowds thin as first rains arrive' },
        { month: 'July', short: 'Jul', rating: 'avoid', weather: 'Heavy monsoon, windy (21°C)', temp: '21°C', crowds: 'Low', price: 'Low', highlight: 'Table Land gets dangerously windy and foggy' },
        { month: 'August', short: 'Aug', rating: 'avoid', weather: 'Continuous rain (21°C)', temp: '21°C', crowds: 'Low', price: 'Low', highlight: 'Most viewpoints obscured by cloud' },
        { month: 'September', short: 'Sep', rating: 'average', weather: 'Rain easing (22°C)', temp: '22°C', crowds: 'Low', price: 'Low', highlight: 'Valley turns deep green as rain tapers off' },
        { month: 'October', short: 'Oct', rating: 'excellent', weather: 'Clear, cool (23°C)', temp: '23°C', crowds: 'High', price: 'High', highlight: 'Sharpest post-monsoon views of the year' },
        { month: 'November', short: 'Nov', rating: 'excellent', weather: 'Cool, ideal (20°C)', temp: '20°C', crowds: 'High', price: 'High', highlight: 'Best all-round month for the viewpoint circuit' },
        { month: 'December', short: 'Dec', rating: 'excellent', weather: 'Cold nights, crisp days (17°C)', temp: '17°C', crowds: 'High', price: 'High', highlight: 'New Year rush — book stays early' },
      ],
    },
  },

  // ── Delhi/NCR hill belt ───────────────────────────────────────────
  {
    slug: 'dalhousie', name: 'Dalhousie', country: 'India', state: 'Himachal Pradesh', flag: '🇮🇳',
    tagline: 'Colonial-Era Pine Hill Station',
    description: 'A former British colonial retreat spread across five hills at 2,000m, with pine and deodar forests, Tibetan-influenced Khajjiar nearby, and snowfall through winter.',
    heroDescription: 'Named after a 19th-century British Viceroy, Dalhousie retains its colonial-era churches and cottages spread across five hills — a quieter, less-crowded alternative to Shimla with easy access to the meadow of Khajjiar.',
    ...img(['Nature']),
    stats: { bestTime: 'Mar – Jun · Sep – Nov', budget: '$20–$80/day', language: 'Hindi, Pahari', currency: 'INR (Rupee)' },
    vibes: ['Nature', 'Relaxation', 'Historical'],
    gradient: 'from-slate-800 to-emerald-900', accentColor: '#0F766E',
    areas: [
      { name: 'Dalhousie Hills', emoji: '⛰️', accentColor: '#0F766E', image: img(['Nature']).image, tagline: 'Colonial hill station across five peaks', spots: [{ name: 'Dainkund Peak', tag: 'Highest point' }, { name: 'Panchpula', tag: 'Streams & memorial' }, { name: 'Kalatop Sanctuary', tag: 'Forest wildlife' }] },
    ],
    thingsToDo: [
      { name: 'Dainkund Peak', description: 'The highest point around Dalhousie, known as the "Singing Hill" for the sound of wind through the pines — a moderate trek rewarded with Chamba Valley and snow-peak views.', icon: '🏔️', duration: '3-4 hrs', category: 'Adventure' },
      { name: 'Panchpula', description: 'A scenic spot where five streams converge into small waterfalls, also home to a memorial to freedom fighter Sardar Ajit Singh — a popular, easy walk from town.', icon: '💧', duration: '1 hr', category: 'Scenic' },
      { name: 'Kalatop Wildlife Sanctuary', description: 'A dense deodar and pine forest reserve home to Himalayan black bear and leopard (rarely sighted) — the forest walk itself is the main draw.', icon: '🌲', duration: '2-3 hrs', category: 'Nature' },
      { name: 'St. John\'s Church', description: 'A 19th-century colonial-era church in the Gandhi Chowk area, one of several churches that mark Dalhousie\'s British hill-station past.', icon: '⛪', duration: '30 min', category: 'Historical' },
      { name: 'Khajjiar Day Trip', description: 'A saucer-shaped meadow 22km away, often marketed as "Mini Switzerland" — golf-course-flat grass ringed by cedar forest, an easy half-day excursion.', icon: '🌾', duration: 'Half day', category: 'Day Trip' },
      { name: 'Bakrota Hills Walk', description: 'A gentle circular walking trail through forest around the Bakrota hill area, popular for its quiet and views without a strenuous climb.', icon: '🥾', duration: '1.5 hrs', category: 'Nature' },
    ],
    monthByMonth: {
      summary: 'March–June is peak season — pleasant escape-the-plains-heat weather. July–September (monsoon) brings heavy rain and landslide risk on approach roads. December–February brings snowfall, appealing for a snow experience but with road-access risk. September–November is a clear, quieter shoulder season.',
      bestMonths: ['April', 'May', 'October'],
      avoidMonths: ['July', 'August'],
      months: [
        { month: 'January', short: 'Jan', rating: 'average', weather: 'Snow likely, freezing (2°C)', temp: '2°C', crowds: 'Moderate', price: 'Moderate', highlight: 'Snow-covered pines, but roads can close after heavy falls' },
        { month: 'February', short: 'Feb', rating: 'average', weather: 'Cold, snow possible (5°C)', temp: '5°C', crowds: 'Moderate', price: 'Moderate', highlight: 'Last of the winter snow, fewer road closures than January' },
        { month: 'March', short: 'Mar', rating: 'excellent', weather: 'Mild, snow melting (11°C)', temp: '11°C', crowds: 'Moderate', price: 'Moderate', highlight: 'Snowmelt streams at Panchpula run full' },
        { month: 'April', short: 'Apr', rating: 'excellent', weather: 'Pleasant, clear (16°C)', temp: '16°C', crowds: 'High', price: 'High', highlight: 'Best all-round trekking and sightseeing weather' },
        { month: 'May', short: 'May', rating: 'excellent', weather: 'Warm days, cool nights (20°C)', temp: '20°C', crowds: 'Peak', price: 'Peak', highlight: 'Peak summer-holiday season — book ahead' },
        { month: 'June', short: 'Jun', rating: 'good', weather: 'Warm, pre-monsoon (22°C)', temp: '22°C', crowds: 'High', price: 'High', highlight: 'Last reliably dry month before monsoon' },
        { month: 'July', short: 'Jul', rating: 'avoid', weather: 'Heavy monsoon (19°C)', temp: '19°C', crowds: 'Low', price: 'Low', highlight: 'Landslide risk on the Pathankot approach road' },
        { month: 'August', short: 'Aug', rating: 'avoid', weather: 'Continuous rain (18°C)', temp: '18°C', crowds: 'Low', price: 'Low', highlight: 'Kalatop forest trails become slippery and unsafe' },
        { month: 'September', short: 'Sep', rating: 'good', weather: 'Rain easing, clear (16°C)', temp: '16°C', crowds: 'Moderate', price: 'Moderate', highlight: 'First clear mountain views since June' },
        { month: 'October', short: 'Oct', rating: 'excellent', weather: 'Crisp, clear (13°C)', temp: '13°C', crowds: 'Moderate', price: 'Moderate', highlight: 'Sharpest views of the Dhauladhar range' },
        { month: 'November', short: 'Nov', rating: 'good', weather: 'Cold, dry (8°C)', temp: '8°C', crowds: 'Low', price: 'Low', highlight: 'Quiet month before winter snow arrives' },
        { month: 'December', short: 'Dec', rating: 'average', weather: 'Cold, first snow (4°C)', temp: '4°C', crowds: 'Moderate', price: 'Moderate', highlight: 'Christmas snow-chasers, but road access can be unreliable' },
      ],
    },
  },
  {
    slug: 'chail', name: 'Chail', country: 'India', state: 'Himachal Pradesh', flag: '🇮🇳',
    tagline: 'The Maharaja\'s Quiet Hill Retreat',
    description: 'A former royal summer capital of Patiala state, home to the world\'s highest cricket ground and a former Maharaja\'s palace — a quieter alternative to nearby Shimla, 45km away.',
    heroDescription: 'Built as Maharaja Bhupinder Singh of Patiala\'s summer retreat after he was barred from Shimla, Chail sits at 2,250m surrounded by cedar forest, with the Chail Cricket Ground — the world\'s highest — as its best-known landmark.',
    ...img(['Nature']),
    stats: { bestTime: 'Mar – Jun · Sep – Nov', budget: '$20–$75/day', language: 'Hindi, Pahari', currency: 'INR (Rupee)' },
    vibes: ['Nature', 'Historical', 'Relaxation'],
    gradient: 'from-emerald-950 to-slate-800', accentColor: '#065F46',
    areas: [
      { name: 'Chail Forest & Palace', emoji: '🌲', accentColor: '#065F46', image: img(['Nature']).image, tagline: 'Royal cricket ground and cedar forest', spots: [{ name: 'Chail Cricket Ground', tag: 'World\'s highest' }, { name: 'Chail Palace', tag: 'Former royal residence' }, { name: 'Kali Ka Tibba', tag: 'Temple + view' }] },
    ],
    thingsToDo: [
      { name: 'Chail Cricket Ground', description: 'At roughly 2,444m, the world\'s highest cricket pitch, built by Maharaja Bhupinder Singh — surrounded by cedar forest, it doubles as a polo ground and helipad.', icon: '🏏', duration: '45 min', category: 'Historical' },
      { name: 'Chail Palace', description: 'The Maharaja\'s former summer palace, now partly a heritage hotel — visitors can walk its terraced gardens and forest grounds even without staying there.', icon: '🏰', duration: '1 hr', category: 'Historical' },
      { name: 'Kali Ka Tibba', description: 'A hilltop Kali temple at Chail\'s highest point, reached by a short forested climb, with panoramic views of the Shivalik ranges and, on clear days, the Himalayan snow line.', icon: '🛕', duration: '1.5 hrs', category: 'Spiritual' },
      { name: 'Chail Wildlife Sanctuary', description: 'A forest reserve of deodar, oak and pine surrounding the town, home to Himalayan goral and pheasant — best explored on the walking trails near the palace.', icon: '🦌', duration: '2 hrs', category: 'Nature' },
      { name: 'Sadhupul Picnic Spot', description: 'A riverside picnic spot on the Chail-Kandaghat road with a stream and forest setting, popular for a relaxed roadside stop.', icon: '🏞️', duration: '1 hr', category: 'Relaxation' },
      { name: 'Sidh Baba Ka Mandir', description: 'A small forest temple near the palace grounds, part of a pleasant, quiet walking circuit through Chail\'s cedar woods.', icon: '🛕', duration: '45 min', category: 'Spiritual' },
    ],
    monthByMonth: {
      summary: 'March–June is the main season — pleasant temperatures and clear cedar-forest walks. July–September (monsoon) brings heavy rain and slippery forest trails. December–February brings occasional snow, appealing but with the same access unpredictability as nearby Himachal hill towns. September–November is a clear, quiet shoulder window.',
      bestMonths: ['April', 'May', 'October'],
      avoidMonths: ['July', 'August'],
      months: [
        { month: 'January', short: 'Jan', rating: 'average', weather: 'Cold, snow possible (3°C)', temp: '3°C', crowds: 'Low', price: 'Low', highlight: 'Occasional snow on the cricket ground and palace grounds' },
        { month: 'February', short: 'Feb', rating: 'average', weather: 'Cold, clearing (6°C)', temp: '6°C', crowds: 'Low', price: 'Low', highlight: 'Quiet month, good value stays' },
        { month: 'March', short: 'Mar', rating: 'excellent', weather: 'Mild (12°C)', temp: '12°C', crowds: 'Moderate', price: 'Moderate', highlight: 'Forest walks at their most pleasant' },
        { month: 'April', short: 'Apr', rating: 'excellent', weather: 'Pleasant, clear (16°C)', temp: '16°C', crowds: 'High', price: 'High', highlight: 'Best weather for the palace grounds and Kali Ka Tibba climb' },
        { month: 'May', short: 'May', rating: 'excellent', weather: 'Warm days, cool nights (20°C)', temp: '20°C', crowds: 'Peak', price: 'Peak', highlight: 'Summer-holiday peak — book Chail Palace stays early' },
        { month: 'June', short: 'Jun', rating: 'good', weather: 'Warm, pre-monsoon (22°C)', temp: '22°C', crowds: 'High', price: 'High', highlight: 'Last dry month before the rains' },
        { month: 'July', short: 'Jul', rating: 'avoid', weather: 'Heavy monsoon (19°C)', temp: '19°C', crowds: 'Low', price: 'Low', highlight: 'Cedar forest trails become slippery' },
        { month: 'August', short: 'Aug', rating: 'avoid', weather: 'Continuous rain (18°C)', temp: '18°C', crowds: 'Low', price: 'Low', highlight: 'Least visited month of the year' },
        { month: 'September', short: 'Sep', rating: 'good', weather: 'Rain easing (16°C)', temp: '16°C', crowds: 'Moderate', price: 'Moderate', highlight: 'Forest turns freshly green as rain tapers off' },
        { month: 'October', short: 'Oct', rating: 'excellent', weather: 'Crisp, clear (13°C)', temp: '13°C', crowds: 'Moderate', price: 'Moderate', highlight: 'Clearest Shivalik views of the year' },
        { month: 'November', short: 'Nov', rating: 'good', weather: 'Cold, dry (8°C)', temp: '8°C', crowds: 'Low', price: 'Low', highlight: 'Quiet, comfortable month before winter cold sets in' },
        { month: 'December', short: 'Dec', rating: 'average', weather: 'Cold, first snow possible (4°C)', temp: '4°C', crowds: 'Moderate', price: 'Moderate', highlight: 'Christmas snow-chasers, road access can be unpredictable' },
      ],
    },
  },
  {
    slug: 'lansdowne', name: 'Lansdowne', country: 'India', state: 'Uttarakhand', flag: '🇮🇳',
    tagline: 'Quiet Cantonment in the Pines',
    description: 'A colonial-era Garhwal Rifles cantonment town kept deliberately low-key — no large hotels, day-visitor limits, and dense oak-and-pine forest walks, roughly equidistant from Delhi and Dehradun.',
    heroDescription: 'Still an active military cantonment, Lansdowne caps development and day-tripper numbers by design — the result is one of the quietest hill towns in reach of Delhi, with colonial-era churches, a war memorial, and forest walks with almost no crowds even in season.',
    ...img(['Nature']),
    stats: { bestTime: 'Mar – Jun · Sep – Nov', budget: '$18–$70/day', language: 'Hindi, Garhwali', currency: 'INR (Rupee)' },
    vibes: ['Nature', 'Historical', 'Relaxation'],
    gradient: 'from-stone-800 to-green-900', accentColor: '#166534',
    areas: [
      { name: 'Lansdowne Cantonment', emoji: '🌲', accentColor: '#166534', image: img(['Nature']).image, tagline: 'Colonial cantonment in oak-pine forest', spots: [{ name: 'Tip in Top Point', tag: 'Best view' }, { name: 'Bhulla Tal', tag: 'Boating lake' }, { name: 'War Memorial', tag: 'Garhwal Rifles' }] },
    ],
    thingsToDo: [
      { name: 'Tip in Top Point', description: 'Lansdowne\'s best viewpoint, offering a wide panorama over the Garhwal Himalayan foothills — quiet even on weekends thanks to the town\'s low visitor caps.', icon: '🌄', duration: '1 hr', category: 'Scenic' },
      { name: 'Bhulla Tal Lake', description: 'A small, tidy artificial lake maintained by the Garhwal Rifles regiment, with paddle-boating and a walking path — the town\'s central leisure spot.', icon: '🚣', duration: '1 hr', category: 'Relaxation' },
      { name: 'Garhwal Rifles War Memorial', description: 'A memorial and small museum honouring the Garhwal Rifles regiment, reflecting Lansdowne\'s continued role as an active army cantonment.', icon: '🎖️', duration: '45 min', category: 'Historical' },
      { name: 'St. Mary\'s Church', description: 'A weathered colonial-era church built in 1896, one of several surviving British-era buildings that give Lansdowne its unhurried, old-cantonment feel.', icon: '⛪', duration: '30 min', category: 'Historical' },
      { name: 'Tarkeshwar Mahadev Temple', description: 'A forest temple roughly 8km from town, reached by a scenic drive through dense oak woods — a good half-day excursion away from the cantonment core.', icon: '🛕', duration: 'Half day', category: 'Spiritual' },
      { name: 'Snow View Point / Oak Forest Walk', description: 'A network of quiet walking trails through century-old oak and pine forest connecting the town\'s viewpoints — the main appeal is simply how few people you\'ll meet.', icon: '🥾', duration: '1.5-2 hrs', category: 'Nature' },
    ],
    monthByMonth: {
      summary: 'March–June and September–November are the two comfortable windows for forest walks and viewpoints. July–September (monsoon) brings heavy, humid rain that can obscure the Himalayan views. December–February is cold with occasional light snow, still walkable but chilly.',
      bestMonths: ['April', 'May', 'October'],
      avoidMonths: ['July', 'August'],
      months: [
        { month: 'January', short: 'Jan', rating: 'average', weather: 'Cold, occasional light snow (7°C)', temp: '7°C', crowds: 'Low', price: 'Low', highlight: 'Quietest month — near-empty viewpoints' },
        { month: 'February', short: 'Feb', rating: 'good', weather: 'Cold, clearing (10°C)', temp: '10°C', crowds: 'Low', price: 'Low', highlight: 'Clear, crisp forest walks' },
        { month: 'March', short: 'Mar', rating: 'excellent', weather: 'Mild, pleasant (16°C)', temp: '16°C', crowds: 'Moderate', price: 'Moderate', highlight: 'Comfortable start to the main season' },
        { month: 'April', short: 'Apr', rating: 'excellent', weather: 'Warm days, cool nights (20°C)', temp: '20°C', crowds: 'Moderate', price: 'Moderate', highlight: 'Best combination of clear skies and mild heat' },
        { month: 'May', short: 'May', rating: 'excellent', weather: 'Warm (24°C)', temp: '24°C', crowds: 'High', price: 'High', highlight: 'Peak summer-holiday season by Lansdowne\'s (modest) standards' },
        { month: 'June', short: 'Jun', rating: 'good', weather: 'Warm, pre-monsoon (25°C)', temp: '25°C', crowds: 'Moderate', price: 'Moderate', highlight: 'Last reliably dry month' },
        { month: 'July', short: 'Jul', rating: 'avoid', weather: 'Heavy monsoon, humid (22°C)', temp: '22°C', crowds: 'Low', price: 'Low', highlight: 'Views frequently obscured by cloud' },
        { month: 'August', short: 'Aug', rating: 'avoid', weather: 'Continuous rain (21°C)', temp: '21°C', crowds: 'Low', price: 'Low', highlight: 'Forest trails at their muddiest' },
        { month: 'September', short: 'Sep', rating: 'good', weather: 'Rain easing (19°C)', temp: '19°C', crowds: 'Low', price: 'Low', highlight: 'First clear Himalayan glimpses since June' },
        { month: 'October', short: 'Oct', rating: 'excellent', weather: 'Crisp, clear (16°C)', temp: '16°C', crowds: 'Moderate', price: 'Moderate', highlight: 'Sharpest foothill views of the year' },
        { month: 'November', short: 'Nov', rating: 'excellent', weather: 'Cool, dry (12°C)', temp: '12°C', crowds: 'Moderate', price: 'Moderate', highlight: 'Comfortable, clear month before winter cold' },
        { month: 'December', short: 'Dec', rating: 'average', weather: 'Cold, first snow possible (8°C)', temp: '8°C', crowds: 'Moderate', price: 'Moderate', highlight: 'Christmas visitors, occasional light snow' },
      ],
    },
  },
  {
    slug: 'chopta', name: 'Chopta', country: 'India', state: 'Uttarakhand', flag: '🇮🇳',
    tagline: 'The Mini Switzerland of Uttarakhand',
    description: 'A high-altitude meadow base camp at 2,680m for the Tungnath-Chandrashila trek — the highest Shiva temple in the world and a summit with 360° Himalayan views, reachable as a demanding day hike.',
    heroDescription: 'Little more than a cluster of camps and dhabas, Chopta exists as the trailhead for Tungnath temple and the Chandrashila summit — one of the most accessible high-altitude Himalayan panoramas in India, framed by Nanda Devi, Kedarnath and Chaukhamba peaks.',
    ...img(['Adventure', 'Nature']),
    stats: { bestTime: 'Mar – Jun · Sep – Nov', budget: '$20–$70/day', language: 'Hindi, Garhwali', currency: 'INR (Rupee)' },
    vibes: ['Adventure', 'Nature', 'Spiritual'],
    gradient: 'from-slate-900 to-cyan-900', accentColor: '#0E7490',
    areas: [
      { name: 'Chopta-Tungnath Trail', emoji: '🏔️', accentColor: '#0E7490', image: img(['Adventure']).image, tagline: 'High-altitude meadows and Himalayan summit trek', spots: [{ name: 'Tungnath Temple', tag: 'Highest Shiva temple' }, { name: 'Chandrashila Summit', tag: '360° Himalaya view' }, { name: 'Deoria Tal', tag: 'Reflection lake' }] },
    ],
    thingsToDo: [
      { name: 'Tungnath Temple Trek', description: 'A 3.5km trek to the highest Shiva temple in the world (3,680m), one of the Panch Kedar shrines, through rhododendron forest and alpine meadow.', icon: '🛕', duration: '3-4 hrs round trip', category: 'Spiritual' },
      { name: 'Chandrashila Summit', description: 'A further 1.5km climb past Tungnath to a 3,680m+ summit delivering a 360° panorama of Nanda Devi, Kedarnath, Chaukhamba and Trishul peaks — best at sunrise.', icon: '🏔️', duration: '5-6 hrs round trip from Chopta', category: 'Adventure' },
      { name: 'Deoria Tal', description: 'A pristine alpine lake that mirrors the Chaukhamba massif on clear mornings, reached by a separate 2.5km trek from Sari village near Chopta.', icon: '🏞️', duration: '3-4 hrs round trip', category: 'Nature' },
      { name: 'Rohini Bugyal', description: 'A high-altitude meadow (bugyal) near Chopta, less crowded than the main Tungnath trail, good for a shorter walk with similar mountain-meadow scenery.', icon: '🌾', duration: '2-3 hrs', category: 'Nature' },
      { name: 'Kedarnath Wildlife Sanctuary', description: 'The forest and alpine reserve surrounding Chopta, home to the elusive musk deer and Himalayan monal — birdwatchers and naturalists linger here beyond the main trek.', icon: '🦌', duration: 'Half day', category: 'Nature' },
      { name: 'Camping at Chopta Meadows', description: 'Tented camps set directly in the meadows below Tungnath, with clear night skies far from any light pollution — the overnight base for a sunrise Chandrashila summit push.', icon: '⛺', duration: 'Overnight', category: 'Adventure' },
    ],
    monthByMonth: {
      summary: 'March–June is the main trekking season as snow melts off the Tungnath trail. July–September (monsoon) brings leeches, landslides and low visibility — best avoided. December–February brings heavy snow, appealing to snow-trekkers but requiring proper gear and local guides. September–November is a clear, quieter shoulder window.',
      bestMonths: ['April', 'May', 'October'],
      avoidMonths: ['July', 'August'],
      months: [
        { month: 'January', short: 'Jan', rating: 'average', weather: 'Heavy snow, freezing (-3°C)', temp: '-3°C', crowds: 'Low', price: 'Low', highlight: 'Snow-trekking possible but demands proper gear and a guide' },
        { month: 'February', short: 'Feb', rating: 'average', weather: 'Snow persists, cold (-1°C)', temp: '-1°C', crowds: 'Low', price: 'Low', highlight: 'Tungnath temple itself is often snowbound and closed' },
        { month: 'March', short: 'Mar', rating: 'good', weather: 'Snow melting, cold (4°C)', temp: '4°C', crowds: 'Moderate', price: 'Moderate', highlight: 'Trail reopens as snow clears from the upper section' },
        { month: 'April', short: 'Apr', rating: 'excellent', weather: 'Mild, clear (10°C)', temp: '10°C', crowds: 'High', price: 'High', highlight: 'Rhododendrons bloom along the Tungnath trail' },
        { month: 'May', short: 'May', rating: 'excellent', weather: 'Pleasant (13°C)', temp: '13°C', crowds: 'Peak', price: 'Peak', highlight: 'Peak trekking season — clearest Chandrashila summit views' },
        { month: 'June', short: 'Jun', rating: 'good', weather: 'Warm days (15°C)', temp: '15°C', crowds: 'High', price: 'High', highlight: 'Last reliably dry month before monsoon' },
        { month: 'July', short: 'Jul', rating: 'avoid', weather: 'Monsoon, leeches (13°C)', temp: '13°C', crowds: 'Low', price: 'Low', highlight: 'Trail becomes slippery and leech-heavy' },
        { month: 'August', short: 'Aug', rating: 'avoid', weather: 'Heavy rain, landslide risk (12°C)', temp: '12°C', crowds: 'Low', price: 'Low', highlight: 'Approach roads from Ukhimath can wash out' },
        { month: 'September', short: 'Sep', rating: 'good', weather: 'Rain easing, clearer (11°C)', temp: '11°C', crowds: 'Moderate', price: 'Moderate', highlight: 'First clear Chandrashila views since June' },
        { month: 'October', short: 'Oct', rating: 'excellent', weather: 'Crisp, clear (7°C)', temp: '7°C', crowds: 'High', price: 'High', highlight: 'Sharpest Himalayan visibility of the year' },
        { month: 'November', short: 'Nov', rating: 'good', weather: 'Cold, dry (2°C)', temp: '2°C', crowds: 'Moderate', price: 'Moderate', highlight: 'Last month before heavy snow closes the upper trail' },
        { month: 'December', short: 'Dec', rating: 'average', weather: 'Snow arrives, freezing (-2°C)', temp: '-2°C', crowds: 'Low', price: 'Low', highlight: 'Snow-trekking begins for experienced, well-equipped hikers' },
      ],
    },
  },

  // ── Bengaluru belt ────────────────────────────────────────────────
  {
    slug: 'nandi-hills', name: 'Nandi Hills', country: 'India', state: 'Karnataka', flag: '🇮🇳',
    tagline: 'Bengaluru\'s Sunrise Getaway',
    description: 'A hilltop fortress-and-temple complex 60km from Bengaluru at 1,478m, famous for its sunrise views and as Tipu Sultan\'s former summer retreat — the city\'s default early-morning weekend drive.',
    heroDescription: 'Just under 2 hours from Bengaluru, Nandi Hills draws weekend crowds well before dawn for its sunrise viewpoint over a sea of clouds — the hilltop also holds Tipu Sultan\'s summer palace ruins and Bhoga Nandeeshwara Temple at its base.',
    ...img(['Nature']),
    stats: { bestTime: 'Oct – Feb', budget: '$15–$60/day', language: 'Kannada, English', currency: 'INR (Rupee)' },
    vibes: ['Nature', 'Relaxation', 'Historical'],
    gradient: 'from-orange-900 to-slate-800', accentColor: '#C2410C',
    areas: [
      { name: 'Nandi Hills Summit', emoji: '🌄', accentColor: '#C2410C', image: img(['Nature']).image, tagline: 'Sunrise viewpoint and Tipu Sultan heritage', spots: [{ name: 'Sunrise Point', tag: 'Main draw' }, { name: "Tipu's Drop", tag: 'Fort ruins' }, { name: 'Bhoga Nandeeshwara Temple', tag: 'At the base' }] },
    ],
    thingsToDo: [
      { name: 'Sunrise Point', description: 'The main reason people drive up before dawn — on good mornings, the valley below fills with a sea of clouds as the sun rises over the Nandi range.', icon: '🌅', duration: '1 hr', category: 'Scenic' },
      { name: "Tipu's Drop", description: 'A sheer cliff-edge point named for the (disputed) legend that Tipu Sultan pushed prisoners off it — now a photo stop with valley views.', icon: '🏰', duration: '30 min', category: 'Historical' },
      { name: "Tipu Sultan's Summer Palace", description: 'The ruined remains of a summer retreat built for Tipu Sultan, reflecting the hill\'s role as a cool-weather escape even in the 18th century.', icon: '🏛️', duration: '30-45 min', category: 'Historical' },
      { name: 'Bhoga Nandeeshwara Temple', description: 'A 9th-century Chola/Ganga/Hoysala-era temple complex at the base of the hill, one of the oldest and most architecturally significant temples near Bengaluru.', icon: '🛕', duration: '1 hr', category: 'Spiritual' },
      { name: 'Amrita Sarovara & Nandi Fort Walls', description: 'The fortifications built by Hyder Ali and Tipu Sultan encircle much of the hilltop, with a small reservoir (Amrita Sarovara) and walking paths along the old walls.', icon: '🧱', duration: '1 hr', category: 'Historical' },
      { name: 'Cycling to Nandi Hills', description: 'A popular pre-dawn cycling route from Bengaluru\'s outskirts up the hill, drawing a dedicated weekend cyclist community for the sunrise reward at the top.', icon: '🚴', duration: '2-3 hrs', category: 'Adventure' },
    ],
    monthByMonth: {
      summary: 'Being close to Bengaluru\'s own mild climate, Nandi Hills is workable most of the year, but October–February gives the clearest skies and best odds of a cloud-sea sunrise. June–September (monsoon) is lush and green but sunrise viewing is a gamble against cloud cover. March–May is warmer but still bearable at altitude.',
      bestMonths: ['November', 'December', 'January'],
      avoidMonths: ['July'],
      months: [
        { month: 'January', short: 'Jan', rating: 'excellent', weather: 'Cool, clear (20°C)', temp: '20°C', crowds: 'High', price: 'High', highlight: 'Best sunrise-viewing odds of the year' },
        { month: 'February', short: 'Feb', rating: 'excellent', weather: 'Mild, dry (23°C)', temp: '23°C', crowds: 'High', price: 'High', highlight: 'Still crisp mornings before the heat builds' },
        { month: 'March', short: 'Mar', rating: 'good', weather: 'Warming (26°C)', temp: '26°C', crowds: 'Moderate', price: 'Moderate', highlight: 'Comfortable early mornings, warmer by mid-day' },
        { month: 'April', short: 'Apr', rating: 'good', weather: 'Warm (28°C)', temp: '28°C', crowds: 'Moderate', price: 'Moderate', highlight: 'Sunrise trips still pleasant despite daytime heat' },
        { month: 'May', short: 'May', rating: 'good', weather: 'Warm, pre-monsoon (28°C)', temp: '28°C', crowds: 'Moderate', price: 'Moderate', highlight: 'Occasional pre-monsoon showers cool the air' },
        { month: 'June', short: 'Jun', rating: 'good', weather: 'Monsoon begins, green (24°C)', temp: '24°C', crowds: 'Moderate', price: 'Moderate', highlight: 'Hills turn green, though sunrise views get cloudier' },
        { month: 'July', short: 'Jul', rating: 'avoid', weather: 'Heavy monsoon (22°C)', temp: '22°C', crowds: 'Low', price: 'Low', highlight: 'Sunrise point often fully clouded over' },
        { month: 'August', short: 'Aug', rating: 'average', weather: 'Rain continues (22°C)', temp: '22°C', crowds: 'Low', price: 'Low', highlight: 'Lush greenery, but plan for a cloudy sunrise' },
        { month: 'September', short: 'Sep', rating: 'good', weather: 'Rain easing (23°C)', temp: '23°C', crowds: 'Moderate', price: 'Moderate', highlight: 'Clearer skies return by month-end' },
        { month: 'October', short: 'Oct', rating: 'excellent', weather: 'Clear, cool (22°C)', temp: '22°C', crowds: 'High', price: 'High', highlight: 'Reliable clear-sky sunrise season begins' },
        { month: 'November', short: 'Nov', rating: 'excellent', weather: 'Cool, ideal (21°C)', temp: '21°C', crowds: 'High', price: 'High', highlight: 'Best month for the cloud-sea sunrise effect' },
        { month: 'December', short: 'Dec', rating: 'excellent', weather: 'Cool, clear (20°C)', temp: '20°C', crowds: 'Peak', price: 'Peak', highlight: 'Popular year-end weekend drive from Bengaluru' },
      ],
    },
  },
  {
    slug: 'yercaud', name: 'Yercaud', country: 'India', state: 'Tamil Nadu', flag: '🇮🇳',
    tagline: 'The Poor Man\'s Ooty',
    description: 'A quieter, less-commercialised hill station in the Shevaroy Hills — coffee and orange estates, a central lake, and cooler air within easy reach of Salem and Bengaluru.',
    heroDescription: 'Overshadowed by Ooty and Kodaikanal but genuinely comparable in scenery, Yercaud sits at 1,515m in the Shevaroy Hills — coffee plantations climb its slopes, a small lake anchors the town centre, and it stays noticeably less crowded than Tamil Nadu\'s bigger hill stations.',
    ...img(['Nature']),
    stats: { bestTime: 'Oct – Jun', budget: '$18–$65/day', language: 'Tamil, English', currency: 'INR (Rupee)' },
    vibes: ['Nature', 'Relaxation', 'Romantic'],
    gradient: 'from-green-900 to-lime-800', accentColor: '#4D7C0F',
    areas: [
      { name: 'Yercaud Hills', emoji: '☕', accentColor: '#4D7C0F', image: img(['Nature']).image, tagline: 'Coffee estates and Shevaroy Hills viewpoints', spots: [{ name: 'Yercaud Lake', tag: 'Town centre' }, { name: "Lady's Seat", tag: 'Best view' }, { name: 'Kiliyur Falls', tag: 'Waterfall' }] },
    ],
    thingsToDo: [
      { name: 'Yercaud Lake', description: 'A spring-fed lake at the centre of town with boating and a walking path — the natural gathering point for an evening stroll.', icon: '🚣', duration: '1 hr', category: 'Relaxation' },
      { name: "Lady's Seat", description: 'The most-visited viewpoint in Yercaud, overlooking the plains toward Salem — busiest at sunset when the haze often clears.', icon: '🌅', duration: '30-45 min', category: 'Scenic' },
      { name: 'Pagoda Point', description: 'A rock-formation viewpoint named for pagoda-like natural stone shapes, offering views distinct from Lady\'s Seat with noticeably fewer visitors.', icon: '🏔️', duration: '45 min', category: 'Scenic' },
      { name: 'Kiliyur Falls', description: 'A 300-foot waterfall reached by a steep flight of roughly 700 steps down a forested gorge — fullest and most dramatic just after monsoon.', icon: '🌊', duration: '1.5-2 hrs', category: 'Nature' },
      { name: 'Coffee Estate Walks', description: 'Yercaud\'s slopes are lined with coffee, orange and pepper plantations — several estates allow walk-through visits and tastings, a quieter alternative to formal tours.', icon: '☕', duration: '1-2 hrs', category: 'Culinary' },
      { name: 'Shevaroyan Temple', description: 'A hilltop temple dedicated to the deity believed to have given the Shevaroy Hills their name, with views over the surrounding coffee country.', icon: '🛕', duration: '1 hr', category: 'Spiritual' },
    ],
    monthByMonth: {
      summary: 'October–June covers most of the comfortable season, since Yercaud stays workable even in the Tamil Nadu summer thanks to its altitude — March–May draws the most visitors escaping plains heat. July–September (southwest monsoon) is wetter and greener, good for the waterfall but with more overcast days.',
      bestMonths: ['October', 'November', 'April'],
      avoidMonths: ['August'],
      months: [
        { month: 'January', short: 'Jan', rating: 'excellent', weather: 'Cool, clear (18°C)', temp: '18°C', crowds: 'Moderate', price: 'Moderate', highlight: 'Comfortable, clear viewpoint weather' },
        { month: 'February', short: 'Feb', rating: 'excellent', weather: 'Mild (20°C)', temp: '20°C', crowds: 'Moderate', price: 'Moderate', highlight: 'Coffee blossoms appear on the estates' },
        { month: 'March', short: 'Mar', rating: 'good', weather: 'Warming (23°C)', temp: '23°C', crowds: 'Moderate', price: 'Moderate', highlight: 'Still noticeably cooler than the plains below' },
        { month: 'April', short: 'Apr', rating: 'excellent', weather: 'Warm days, cool nights (25°C)', temp: '25°C', crowds: 'High', price: 'High', highlight: 'Peak summer-escape season begins' },
        { month: 'May', short: 'May', rating: 'good', weather: 'Warm (26°C)', temp: '26°C', crowds: 'High', price: 'High', highlight: 'Busiest month — Tamil Nadu summer-holiday crowds' },
        { month: 'June', short: 'Jun', rating: 'good', weather: 'Monsoon showers begin (24°C)', temp: '24°C', crowds: 'Moderate', price: 'Moderate', highlight: 'Crowds ease as first rains arrive' },
        { month: 'July', short: 'Jul', rating: 'average', weather: 'Rain, cooler (22°C)', temp: '22°C', crowds: 'Low', price: 'Low', highlight: 'Kiliyur Falls starts filling up' },
        { month: 'August', short: 'Aug', rating: 'avoid', weather: 'Heaviest rain (21°C)', temp: '21°C', crowds: 'Low', price: 'Low', highlight: 'Wettest month — viewpoints often clouded' },
        { month: 'September', short: 'Sep', rating: 'good', weather: 'Rain easing (22°C)', temp: '22°C', crowds: 'Low', price: 'Low', highlight: 'Kiliyur Falls at its fullest and most dramatic' },
        { month: 'October', short: 'Oct', rating: 'excellent', weather: 'Clear, cool (21°C)', temp: '21°C', crowds: 'Moderate', price: 'Moderate', highlight: 'Best all-round month — clear views, full waterfall' },
        { month: 'November', short: 'Nov', rating: 'excellent', weather: 'Cool, pleasant (19°C)', temp: '19°C', crowds: 'Moderate', price: 'Moderate', highlight: 'Coffee harvest season on the estates' },
        { month: 'December', short: 'Dec', rating: 'good', weather: 'Cool (18°C)', temp: '18°C', crowds: 'High', price: 'High', highlight: 'Year-end holiday crowds, book ahead' },
      ],
    },
  },
];
