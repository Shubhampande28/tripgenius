import { readFileSync, writeFileSync } from 'node:fs';

const fetched = JSON.parse(readFileSync('audit/new-cities.json', 'utf8')) as Record<string, {
  title: string; extract: string; coordinates: { lat: number; lng: number } | null; image: string | null;
}>;

interface Thing { name: string; description: string; icon: string; duration: string; category: string }
interface Meta {
  name: string; state: string; tagline: string; description: string; heroDescription: string;
  bestTime: string; budget: string; language: string; vibes: string[]; accentColor: string; gradient: string;
  areaName: string; areaEmoji: string; areaTagline: string; things: Thing[];
  coordsOverride?: { lat: number; lng: number };
}

const t = (name: string, description: string, icon: string, category: string, duration = '1–2 hours'): Thing =>
  ({ name, description, icon, duration, category });

const META: Record<string, Meta> = {
  dehradun: {
    name: 'Dehradun', state: 'Uttarakhand',
    tagline: 'Gateway to the Doon Valley',
    description: "Uttarakhand's capital sits in the lush Doon Valley between the Himalayan foothills and the Shivalik range — a relaxed, leafy city famous for its boarding schools, river caves and as the launch point for Mussoorie and Rishikesh.",
    heroDescription: 'A green valley city of misty mornings, forested trails and limestone caves, perfectly placed as a base for the western Himalaya.',
    bestTime: 'Sep – Apr', budget: '₹1,500 – ₹4,000/day', language: 'Hindi, Garhwali',
    vibes: ['Nature', 'Adventure', 'Spiritual'], accentColor: '#059669', gradient: 'from-emerald-600 via-green-500 to-lime-400',
    areaName: 'Top Sights', areaEmoji: '⛰️', areaTagline: 'Caves, temples and valley views',
    things: [
      t('Robber’s Cave (Guchhupani)', 'A river-carved limestone gorge where a cold stream runs through a narrow cave — wade through ankle-deep water between towering rock walls.', '🕳️', 'Nature', '2–3 hours'),
      t('Sahastradhara', 'Sulphur springs and terraced limestone waterfalls on the edge of the city, popular for a refreshing dip and a ropeway ride.', '💦', 'Nature', '2–3 hours'),
      t('Forest Research Institute', 'A grand colonial-era building set in vast manicured grounds, ranked among the most striking campuses in India.', '🏛️', 'Cultural'),
      t('Tapkeshwar Temple', 'A cave shrine to Shiva beside a seasonal stream where water drips naturally onto the lingam.', '🛕', 'Cultural'),
    ],
  },
  trivandrum: {
    name: 'Thiruvananthapuram', state: 'Kerala',
    tagline: 'Kerala’s Coastal Capital',
    description: 'Also known as Trivandrum, Kerala’s capital blends golden beaches, the fabulously wealthy Padmanabhaswamy Temple and red-tiled colonial architecture on a string of seven hills by the Arabian Sea.',
    heroDescription: 'A laid-back coastal capital of temples, palaces and palm-fringed beaches at the southern tip of India.',
    bestTime: 'Sep – Mar', budget: '₹1,800 – ₹4,500/day', language: 'Malayalam',
    vibes: ['Cultural', 'Beach', 'Spiritual'], accentColor: '#0EA5E9', gradient: 'from-sky-600 via-cyan-500 to-teal-400',
    areaName: 'Top Sights', areaEmoji: '🏖️', areaTagline: 'Temples, museums and beaches',
    things: [
      t('Sree Padmanabhaswamy Temple', 'One of the holiest and richest Vishnu temples in India, an architectural marvel of Dravidian gopurams (strict dress code applies).', '🛕', 'Cultural'),
      t('Kovalam Beach', 'A famous crescent of sand below a candy-striped lighthouse, with calm coves for swimming and great seafood shacks.', '🏖️', 'Relaxation', 'Half day'),
      t('Napier Museum & Zoo', 'An ornate Indo-Saracenic museum housing bronzes and ivory carvings, set in shaded gardens.', '🏛️', 'Cultural'),
      t('Poovar & Veli Backwaters', 'Quiet estuary backwaters where the river meets the sea — explore by canoe past mangroves and a golden sandbar.', '🛶', 'Nature', '3–4 hours'),
    ],
  },
  kozhikode: {
    name: 'Kozhikode', state: 'Kerala',
    tagline: 'The City of Spices',
    description: 'Calicut, on Kerala’s Malabar Coast, is where Vasco da Gama first landed in India — today a warm, food-obsessed port city famous for Malabar biryani, sweet halwa and a long sunset beach.',
    heroDescription: 'A historic spice-trade port on the Malabar Coast, beloved for its food, beaches and easygoing charm.',
    bestTime: 'Oct – Mar', budget: '₹1,500 – ₹4,000/day', language: 'Malayalam',
    vibes: ['Foodie', 'Beach', 'Cultural'], accentColor: '#F59E0B', gradient: 'from-amber-600 via-orange-500 to-yellow-400',
    areaName: 'Top Sights', areaEmoji: '🌊', areaTagline: 'Beaches, boats and Malabar flavours',
    things: [
      t('Kozhikode Beach', 'A long city beach with an old pier, perfect for an evening stroll, kite-flying and street snacks at sunset.', '🏖️', 'Relaxation', 'Half day'),
      t('Beypore Port', 'A centuries-old shipyard where craftsmen still build traditional wooden uru dhows by hand.', '⚓', 'Cultural'),
      t('Kappad Beach', 'The quiet beach where Vasco da Gama landed in 1498, marked by a small monument.', '🏖️', 'Scenic'),
      t('Malabar Food Trail', 'Sample the city’s legendary Kozhikodan biryani, banana-chip stalls and the famous Kozhikode halwa.', '🍲', 'Culinary', '2–3 hours'),
    ],
  },
  thrissur: {
    name: 'Thrissur', state: 'Kerala',
    tagline: 'Cultural Capital of Kerala',
    description: 'Built around a temple-topped hill, Thrissur is the cultural heart of Kerala — home to the thunderous Thrissur Pooram festival, classical arts academies and the spectacular Athirappilly waterfalls nearby.',
    heroDescription: 'Kerala’s festival and arts capital, ringed by temples, palaces and jungle waterfalls.',
    bestTime: 'Sep – Mar', budget: '₹1,500 – ₹4,000/day', language: 'Malayalam',
    vibes: ['Cultural', 'Spiritual', 'Nature'], accentColor: '#DC2626', gradient: 'from-red-600 via-rose-500 to-orange-400',
    areaName: 'Top Sights', areaEmoji: '🛕', areaTagline: 'Temples, festivals and falls',
    things: [
      t('Vadakkunnathan Temple', 'An ancient Shiva temple of classic Kerala architecture crowning the hill at the city’s centre (a UNESCO heritage site).', '🛕', 'Cultural'),
      t('Athirappilly Falls', 'Kerala’s largest waterfall, an 80-foot curtain plunging through rainforest — often called the “Niagara of India”.', '💦', 'Nature', 'Half day'),
      t('Guruvayur Temple', 'One of India’s most important Krishna temples, drawing pilgrims from across the south.', '🛕', 'Cultural'),
      t('Kerala Kalamandalam', 'The renowned academy where you can watch Kathakali and Mohiniyattam dancers in training.', '🎭', 'Cultural', '2–3 hours'),
    ],
  },
  vrindavan: {
    name: 'Vrindavan', state: 'Uttar Pradesh',
    tagline: 'Land of Krishna',
    description: 'In the sacred Braj region near Mathura, Vrindavan is where Lord Krishna is said to have spent his childhood — a town of thousands of temples, devotional song and an unforgettable Holi.',
    heroDescription: 'A holy Krishna pilgrimage town of ancient temples, ringing bells and riotous colour at Holi.',
    bestTime: 'Oct – Mar', budget: '₹1,200 – ₹3,500/day', language: 'Hindi, Braj Bhasha',
    vibes: ['Spiritual', 'Cultural'], accentColor: '#8B5CF6', gradient: 'from-violet-600 via-purple-500 to-fuchsia-400',
    areaName: 'Top Sights', areaEmoji: '🛕', areaTagline: 'Temples of the Braj',
    things: [
      t('Banke Bihari Temple', 'The town’s most beloved temple, where the curtain before the deity opens only in glimpses amid joyful chanting.', '🛕', 'Cultural'),
      t('Prem Mandir', 'A vast white-marble temple that glows in shifting colours after dark, surrounded by illuminated gardens.', '🛕', 'Cultural'),
      t('ISKCON Vrindavan', 'The Krishna-Balaram Mandir, a serene hub of kirtan, prasad and international devotees.', '🛕', 'Cultural'),
      t('Nidhivan', 'A mysterious sacred grove of gnarled tulsi trees wrapped in centuries of Krishna legend.', '🌳', 'Nature'),
    ],
  },
  shirdi: {
    name: 'Shirdi', state: 'Maharashtra',
    tagline: 'Home of Sai Baba',
    description: 'A small Maharashtra town that became one of India’s biggest pilgrimage sites — the home of the 19th-century saint Sai Baba, drawing millions to his samadhi shrine each year.',
    heroDescription: 'A major pilgrimage town centred on the shrine of the beloved saint Shirdi Sai Baba.',
    bestTime: 'Oct – Mar', budget: '₹1,200 – ₹3,500/day', language: 'Marathi, Hindi',
    vibes: ['Spiritual', 'Pilgrimage'], accentColor: '#F97316', gradient: 'from-orange-600 via-amber-500 to-yellow-400',
    areaName: 'Top Sights', areaEmoji: '🛕', areaTagline: 'Shrines of Sai Baba',
    things: [
      t('Samadhi Mandir', 'The marble shrine housing Sai Baba’s tomb and a life-size statue, the spiritual centre of Shirdi.', '🛕', 'Cultural'),
      t('Dwarkamai Mosque', 'The mosque where Sai Baba lived and kept his ever-burning sacred fire (dhuni).', '🕌', 'Cultural'),
      t('Chavadi', 'The simple building where Sai Baba slept on alternate nights, now part of the daily processions.', '🏛️', 'Cultural'),
      t('Lendi Garden', 'A peaceful garden Sai Baba tended himself, with a lamp that has burned continuously for decades.', '🌳', 'Nature'),
    ],
  },
  patna: {
    name: 'Patna', state: 'Bihar',
    tagline: 'Ancient Pataliputra on the Ganges',
    description: 'One of the world’s oldest continuously inhabited cities, Bihar’s riverside capital was the mighty Pataliputra of the Maurya and Gupta empires — today a sprawling Ganges city of museums, a Sikh holy site and grand colonial relics.',
    heroDescription: 'A 2,000-year-old capital on the Ganges, layered with Mauryan history, Sikh heritage and great museums.',
    bestTime: 'Oct – Mar', budget: '₹1,500 – ₹4,000/day', language: 'Hindi, Bhojpuri, Magahi',
    vibes: ['Historical', 'Cultural', 'Spiritual'], accentColor: '#D97706', gradient: 'from-amber-600 via-yellow-500 to-orange-400',
    areaName: 'Top Sights', areaEmoji: '🏛️', areaTagline: 'History along the Ganges',
    things: [
      t('Takht Sri Patna Sahib', 'A golden-domed gurudwara marking the birthplace of Guru Gobind Singh, one of Sikhism’s five holiest seats.', '🛕', 'Cultural'),
      t('Bihar Museum', 'A world-class modern museum showcasing Mauryan bronzes, the famous Didarganj Yakshi and regional history.', '🏛️', 'Cultural', '2–3 hours'),
      t('Golghar', 'A giant beehive-shaped granary from 1786 with spiral stairs and sweeping views over the river.', '🏯', 'Scenic'),
      t('Kumhrar', 'Excavated ruins of ancient Pataliputra, including the pillared Mauryan assembly hall.', '🏛️', 'Historical'),
    ],
  },
  nagpur: {
    name: 'Nagpur', state: 'Maharashtra',
    tagline: 'The Orange City',
    description: 'At the geographic heart of India, Nagpur is famous for its oranges, fiery Saoji cuisine and Deekshabhoomi — and serves as the gateway to the tiger reserves of Tadoba and Pench.',
    heroDescription: 'Central India’s green, orderly “Orange City”, gateway to the country’s best tiger country.',
    bestTime: 'Oct – Mar', budget: '₹1,500 – ₹4,000/day', language: 'Marathi, Hindi',
    vibes: ['Cultural', 'Wildlife', 'Foodie'], accentColor: '#EA580C', gradient: 'from-orange-600 via-amber-500 to-yellow-400',
    areaName: 'Top Sights', areaEmoji: '🐯', areaTagline: 'Monuments, lakes and tiger gateways',
    coordsOverride: { lat: 21.1458, lng: 79.0882 },
    things: [
      t('Deekshabhoomi', 'A vast white-domed stupa marking where Dr B. R. Ambedkar embraced Buddhism with half a million followers in 1956.', '🛕', 'Cultural'),
      t('Sitabuldi Fort', 'A hilltop fort in the city centre, site of a decisive 1817 battle, with views across Nagpur.', '🏯', 'Historical'),
      t('Futala Lake', 'A century-old lake lit by musical fountains in the evening, lined with street-food stalls.', '🏞️', 'Relaxation'),
      t('Tadoba day trip', 'Drive to Tadoba-Andhari Tiger Reserve, among the best places in India to spot wild tigers.', '🐯', 'Nature', 'Full day'),
    ],
  },
  indore: {
    name: 'Indore', state: 'Madhya Pradesh',
    tagline: 'India’s Food Capital',
    description: 'Madhya Pradesh’s largest city and India’s cleanest, Indore pairs the palaces of the Holkar dynasty with a legendary street-food scene — from the all-day snacks of Chappan Dukan to the midnight feasts of Sarafa Bazaar.',
    heroDescription: 'A buzzing Holkar-era city famous for royal palaces and the best street food in India.',
    bestTime: 'Oct – Mar', budget: '₹1,500 – ₹4,000/day', language: 'Hindi, Malwi',
    vibes: ['Foodie', 'Cultural', 'Historical'], accentColor: '#DB2777', gradient: 'from-pink-600 via-rose-500 to-orange-400',
    areaName: 'Top Sights', areaEmoji: '🍲', areaTagline: 'Palaces and street-food legends',
    things: [
      t('Rajwada Palace', 'The seven-storey Holkar palace gateway, a fusion of Maratha, Mughal and French style overlooking the old city.', '🏰', 'Cultural'),
      t('Sarafa Bazaar', 'A jewellery market by day that transforms into a buzzing night food street after the shops shut.', '🍲', 'Culinary', '2–3 hours'),
      t('Lal Bagh Palace', 'An opulent Holkar mansion of European grandeur, with gilded halls and landscaped grounds.', '🏰', 'Cultural'),
      t('Chappan Dukan', 'A famous lane of 56 shops serving every Indori snack imaginable, from poha-jalebi to garadu.', '🍢', 'Culinary'),
    ],
  },
  raipur: {
    name: 'Raipur', state: 'Chhattisgarh',
    tagline: 'Capital of Chhattisgarh',
    description: 'A fast-growing capital in the heart of Chhattisgarh, Raipur is a handy base for the state’s temples, lakes and tribal-art museums, and a launch point for the waterfalls and forests of Bastar.',
    heroDescription: 'Chhattisgarh’s green capital — lakes, temples and museums, and a gateway to central India’s wilds.',
    bestTime: 'Oct – Feb', budget: '₹1,300 – ₹3,500/day', language: 'Hindi, Chhattisgarhi',
    vibes: ['Cultural', 'Nature'], accentColor: '#16A34A', gradient: 'from-green-600 via-emerald-500 to-teal-400',
    areaName: 'Top Sights', areaEmoji: '🏞️', areaTagline: 'Lakes, museums and temples',
    things: [
      t('Mahant Ghasidas Museum', 'A state museum rich in tribal art, ancient sculpture and Chhattisgarhi heritage.', '🏛️', 'Cultural'),
      t('Nandan Van Jungle Safari', 'A large safari park and zoo with herbivore and predator zones on the city’s edge.', '🦁', 'Nature', 'Half day'),
      t('Vivekananda Sarovar (Burha Talab)', 'A historic lake with a towering Swami Vivekananda statue, lit up in the evenings.', '🏞️', 'Relaxation'),
      t('Purkhauti Muktangan', 'An open-air museum recreating Chhattisgarh’s villages, tribal life and folk art.', '🎭', 'Cultural'),
    ],
  },
  vijayawada: {
    name: 'Vijayawada', state: 'Andhra Pradesh',
    tagline: 'The Place of Victory',
    description: 'On the banks of the Krishna River beneath the Indrakeeladri hill, Vijayawada is a major commercial hub crowned by the Kanaka Durga temple, ancient rock-cut caves and the long Prakasam Barrage.',
    heroDescription: 'A riverside Andhra city of hilltop temples, rock-cut caves and a barrage strung with lights.',
    bestTime: 'Oct – Mar', budget: '₹1,400 – ₹3,800/day', language: 'Telugu',
    vibes: ['Spiritual', 'Cultural'], accentColor: '#0891B2', gradient: 'from-cyan-600 via-sky-500 to-blue-400',
    areaName: 'Top Sights', areaEmoji: '🛕', areaTagline: 'Temples, caves and the Krishna',
    things: [
      t('Kanaka Durga Temple', 'The hilltop shrine to the goddess Durga on Indrakeeladri, with sweeping views over the river city.', '🛕', 'Cultural'),
      t('Undavalli Caves', 'Monolithic rock-cut caves from the 4th–5th century, including a huge reclining Vishnu carved from a single block.', '🕳️', 'Historical'),
      t('Prakasam Barrage', 'A kilometre-long barrage across the Krishna, lit up at night and lined with a lakefront promenade.', '🌉', 'Scenic'),
      t('Bhavani Island', 'One of India’s largest river islands, a green getaway for boating and picnics mid-river.', '🏝️', 'Relaxation', 'Half day'),
    ],
  },
  'port-blair': {
    name: 'Port Blair', state: 'Andaman & Nicobar Islands',
    tagline: 'Gateway to the Andamans',
    description: 'The island capital of the Andamans wraps colonial history and turquoise seas together — the haunting Cellular Jail, museum-lined harbour and ferries out to the white sands of Havelock and Neil.',
    heroDescription: 'A harbour capital of poignant history and tropical blue, and the launch point for the Andaman islands.',
    bestTime: 'Oct – May', budget: '₹2,500 – ₹6,000/day', language: 'Hindi, Bengali, Tamil, English',
    vibes: ['Beach', 'Historical', 'Adventure'], accentColor: '#0EA5E9', gradient: 'from-sky-600 via-cyan-500 to-teal-400',
    areaName: 'Top Sights', areaEmoji: '🏝️', areaTagline: 'History, harbours and island ferries',
    things: [
      t('Cellular Jail', 'The colonial-era “Kala Pani” prison, now a national memorial with a moving evening light-and-sound show.', '🏛️', 'Historical', '2–3 hours'),
      t('Ross Island', 'A short boat ride to the overgrown ruins of the former British administrative HQ, now roamed by deer and peacocks.', '🏝️', 'Historical', 'Half day'),
      t('Corbyn’s Cove Beach', 'The closest beach to town, a palm-lined cove good for a swim and watersports.', '🏖️', 'Relaxation'),
      t('Chidiya Tapu', 'A forest-and-shore sunset point famous for birdlife and golden-hour views.', '🌅', 'Scenic'),
    ],
  },
  ranchi: {
    name: 'Ranchi', state: 'Jharkhand',
    tagline: 'City of Waterfalls',
    description: 'The capital of Jharkhand sits on a cool plateau ringed by tumbling waterfalls and forested hills — a former colonial hill retreat that’s now a green, easygoing gateway to tribal heartland.',
    heroDescription: 'A breezy plateau capital encircled by waterfalls, hills and lakes in India’s tribal heartland.',
    bestTime: 'Oct – Mar', budget: '₹1,300 – ₹3,500/day', language: 'Hindi, Nagpuri',
    vibes: ['Nature', 'Adventure'], accentColor: '#0D9488', gradient: 'from-teal-600 via-emerald-500 to-green-400',
    areaName: 'Top Sights', areaEmoji: '💦', areaTagline: 'Waterfalls, hills and gardens',
    things: [
      t('Hundru Falls', 'A spectacular 98-metre waterfall where the Subarnarekha river plunges over rocky ledges.', '💦', 'Nature', 'Half day'),
      t('Rock Garden & Kanke Dam', 'Terraced rock gardens beside a scenic dam, a favourite spot for sunset and boating.', '🌳', 'Relaxation'),
      t('Tagore Hill', 'A historic hillock linked to the Tagore family, with a short climb to panoramic city views.', '⛰️', 'Scenic'),
      t('Jagannath Temple', 'A 17th-century hilltop temple modelled on Puri’s Jagannath shrine, with its own Rath Yatra.', '🛕', 'Cultural'),
    ],
  },
  salem: {
    name: 'Salem', state: 'Tamil Nadu',
    tagline: 'City Beneath the Eastern Ghats',
    description: 'Cradled by the Eastern Ghats on the Thirumanimutharu river, Salem is a steel-and-textile city best loved as the gateway to the orange-grove hill station of Yercaud and the vast Mettur Dam.',
    heroDescription: 'A Tamil city ringed by green hills, gateway to the cool coffee slopes of Yercaud.',
    bestTime: 'Oct – Mar', budget: '₹1,300 – ₹3,500/day', language: 'Tamil',
    vibes: ['Nature', 'Cultural'], accentColor: '#7C3AED', gradient: 'from-violet-600 via-indigo-500 to-blue-400',
    areaName: 'Top Sights', areaEmoji: '⛰️', areaTagline: 'Hills, dams and temples',
    things: [
      t('Yercaud', 'A quiet hill station 30 km away with coffee plantations, an orchid garden and a misty lake.', '⛰️', 'Nature', 'Full day'),
      t('Mettur Dam', 'One of India’s largest dams across the Kaveri, dramatic when the sluice gates open in season.', '🌊', 'Scenic'),
      t('Kottai Mariamman Temple', 'A revered city temple famous for its grand annual car festival.', '🛕', 'Cultural'),
      t('1008 Lingam Temple', 'A hillside Shiva temple complex carved with a thousand-and-eight lingams.', '🛕', 'Cultural'),
    ],
  },
};

const cities = Object.keys(META).map((slug) => {
  const m = META[slug];
  const f = fetched[slug];
  const coords = m.coordsOverride ?? f.coordinates;
  const img = f.image!;
  return {
    stub: false,
    slug,
    name: m.name,
    state: m.state,
    country: 'India',
    flag: '🇮🇳',
    tagline: m.tagline,
    description: m.description,
    heroDescription: m.heroDescription,
    ...(coords ? { coordinates: coords } : {}),
    stats: { bestTime: m.bestTime, budget: m.budget, language: m.language, currency: 'INR (Rupee)' },
    vibes: m.vibes,
    gradient: m.gradient,
    accentColor: m.accentColor,
    image: img,
    heroImage: img,
    areas: [{
      name: m.areaName, emoji: m.areaEmoji, accentColor: m.accentColor, image: img,
      tagline: m.areaTagline,
      spots: m.things.map((th) => ({ name: th.name, tag: th.category })),
    }],
    thingsToDo: m.things,
  };
});

// Emit the TS data file (JSON object literals are valid TS).
const body = cities.map((c) => JSON.stringify(c, null, 2)).join(',\n');
const file = `import { City } from './types';\n\n// 14 additional Indian cities — descriptions paraphrased from Wikipedia,\n// coordinates and lead images sourced from Wikipedia/Wikimedia Commons.\nexport const newIndianCities: City[] = [\n${body}\n];\n`;
writeFileSync('src/lib/newIndianCities.ts', file);

// Image map updates for verifiedCityImages (slug -> real URL).
const imgMap: Record<string, string> = {};
for (const slug of Object.keys(META)) imgMap[slug] = fetched[slug].image!;
writeFileSync('audit/new-city-images.json', JSON.stringify(imgMap, null, 2));

console.log(`Generated src/lib/newIndianCities.ts with ${cities.length} cities`);
console.log(`Wrote audit/new-city-images.json (${Object.keys(imgMap).length} image overrides)`);
