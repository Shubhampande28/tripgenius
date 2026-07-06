/**
 * Prepends 3 new SEO-optimized blog posts to the top of allPosts in blog.ts.
 * Run once: node scripts/add-new-posts.mjs
 */
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { join, dirname } from 'path';

const __dir = dirname(fileURLToPath(import.meta.url));
const filePath = join(__dir, '../src/lib/blog.ts');

const MARKER = 'export const allPosts: BlogPost[] = [';

// ─── Helper: escape single quotes for TS string literals ──────────────────────
const q = (s) => s.replace(/'/g, "\\'");

// ─── Post data (plain JS objects → formatted as TS below) ─────────────────────

const posts = [

// ── POST 3: Bali vs Thailand ────────────────────────────────────────────────
{
  slug: 'bali-vs-thailand-indian-travellers',
  title: 'Bali vs Thailand: Which Is Better for Indian Travellers?',
  excerpt: 'Honest side-by-side comparison of Bali and Thailand for Indian tourists — visa, costs in INR, vegetarian food, weather, and the final verdict on which to visit first.',
  date: '2025-06-03',
  readTime: 8,
  category: 'Asia',
  tags: ['Bali', 'Thailand', 'Comparison', 'Indian Travellers', 'Asia', 'Budget'],
  coverPhoto: 'photo-1528360983277-13d401cdc186',
  citySlug: 'bali',
  content: [
    { type: 'p', text: 'Two of the most searched international destinations for Indian travellers. Bali and Thailand are often on the same shortlist — and for good reason. Both offer affordable prices, warm weather, visa on arrival for Indians, and a world-class travel experience. But they are fundamentally different places, and choosing the wrong one for your travel style can leave you disappointed. Here is the honest comparison.' },
    { type: 'h2', text: 'Visa: Which Is Easier for Indians?' },
    { type: 'p', text: 'Thailand gives Indians a 30-day visa-free entry (as of 2024, made permanent after a successful trial). No application, no fee — just land and go. Bali (Indonesia) requires a Visa on Arrival at the airport: USD 35 (approximately ₹2,900), paid in cash. Both are easy. Thailand wins slightly on convenience since you save the ₹2,900 and the queue at the VOA counter. For a 2-week trip combining Bali with other Indonesian islands, the VOA is still excellent value.' },
    { type: 'h2', text: 'Cost Comparison in INR' },
    { type: 'table', headers: ['Category', 'Bali (₹/day)', 'Thailand (₹/day)', 'Notes'], rows: [
      ['Budget hostel / dorm', '900–1,500', '700–1,200', 'Thailand hostels slightly cheaper'],
      ['Mid-range hotel', '2,500–5,000', '2,000–4,500', 'Similar overall'],
      ['Street food meal', '150–300', '100–250', 'Thailand street food cheaper'],
      ['Restaurant meal', '400–900', '350–800', 'On par'],
      ['Scooter rental/day', '550–700', '450–600', 'Bali slightly higher'],
      ['Grab/taxi (short ride)', '250–500', '200–400', 'Thailand marginally cheaper'],
      ['Return flights (India)', '25,000–40,000', '18,000–35,000', 'Thailand cheaper to fly to'],
    ]},
    { type: 'p', text: 'Thailand is marginally cheaper than Bali overall, especially on flights (Bangkok is better connected from Indian cities than Denpasar) and street food. The gap is not dramatic — a 7-day budget trip costs roughly ₹45,000–60,000 in Bali vs ₹38,000–55,000 in Thailand (excluding flights), per person.' },
    { type: 'h2', text: 'Vegetarian Food: A Critical Factor for Indian Travellers' },
    { type: 'p', text: 'This is where Bali clearly wins for vegetarians. Bali\'s Hindu culture means temples, offerings, and a deep respect for vegetarian cooking. Ubud has an entire neighbourhood of vegetarian and vegan restaurants. Tempeh, tofu, gado-gado, and nasi goreng can all be made meat-free. Thai food, while extraordinary, is heavily meat and seafood-based — fish sauce (nam pla) appears in almost everything including seemingly vegetarian dishes like som tam (green papaya salad). Strict vegetarians will find Bali significantly easier to navigate. Thai cities do have vegetarian festivals and dedicated "jay" (vegan) restaurants, but these require effort to find.' },
    { type: 'callout', emoji: '🥗', text: 'If you are a strict vegetarian or follow Jain dietary practices, Bali is the far better choice. Thailand requires careful navigation and clear communication — say "gin jay" (I eat vegan/vegetarian) when ordering, but even then fish sauce may be invisible in many dishes.' },
    { type: 'h2', text: 'Weather: When to Go' },
    { type: 'p', text: 'Both destinations are tropical, but their monsoons run on different schedules. Bali\'s dry season runs April to October — this overlaps perfectly with Indian school summer holidays (April–June). Thailand\'s dry season on the popular Gulf of Thailand side (Koh Samui, Koh Phangan) runs December to April; the Andaman side (Phuket, Krabi) is dry November to April. For an April–June trip from India, Bali is the better weather choice. For a December–February trip, both are excellent.' },
    { type: 'h2', text: 'Culture & Experiences' },
    { type: 'p', text: 'Bali\'s Hindu culture creates an immediate sense of familiarity for Indians — the temples (pura), offerings (canang sari) placed outside every shop, Balinese gamelan music, and festivals like Nyepi (the Day of Silence) and Galungan all resonate strongly with Indian visitors. Thailand\'s Buddhist culture is fascinating but less immediately recognisable. Bali wins on cultural alignment. Thailand wins on variety — Bangkok alone is a world unto itself (street food, rooftop bars, night markets, temples), and Thailand\'s island diversity (Phuket, Koh Samui, Koh Lanta, Koh Tao) is far greater than Bali\'s island options.' },
    { type: 'h2', text: 'The Verdict' },
    { type: 'p', text: 'Choose Bali if: you are a first-time international traveller wanting a soft landing, you are vegetarian, you want 7–10 days focused on one beautiful island, you appreciate Hindu cultural parallels, or you are travelling April–June. Choose Thailand if: you want more variety in one trip (city + multiple islands), you are flexible on food, you want a slightly cheaper option with better flight connectivity, or you are travelling December–March. Both are exceptional. If you can only go once, Bali is the more complete one-island experience. If you want scope and variety, Thailand wins.' },
  ],
  faqs: [
    { question: 'Is Bali or Thailand cheaper for Indians?', answer: 'Thailand is marginally cheaper overall — return flights from India are typically ₹5,000–8,000 less, street food is slightly cheaper, and the daily budget is around 10–15% lower than Bali. However, Bali\'s Visa on Arrival (₹2,900) adds a fixed cost that Thailand does not have. The difference is not dramatic for a 7-day trip.' },
    { question: 'Which is better for vegetarians — Bali or Thailand?', answer: 'Bali is significantly better for vegetarians. Its Hindu culture means vegetarian food is widely available, and Ubud has an excellent all-vegetarian restaurant scene. Thailand uses fish sauce in most dishes including apparently vegetarian ones. Indian vegetarians, especially those avoiding fish products, will find Bali much easier to navigate.' },
    { question: 'Do Indians need a visa for Bali and Thailand?', answer: 'For Thailand: no visa required — Indians get 30-day visa-free entry (as of 2024). For Bali (Indonesia): Visa on Arrival at the airport costs USD 35 (approximately ₹2,900), paid in cash, grants 30 days. Both are easy; Thailand is slightly more convenient as there is no fee or paperwork.' },
    { question: 'What is the best time to visit Bali vs Thailand from India?', answer: 'April to June is ideal for Bali (dry season, aligns with Indian school holidays). For Thailand, December to April is best for the Gulf of Thailand islands; November to April for Phuket/Krabi. For a May travel window from India, Bali is the better weather choice — Thailand\'s south is in its wet season during May–October.' },
    { question: 'Can I combine Bali and Thailand in one trip?', answer: 'Yes. A popular 2-week itinerary: fly into Bangkok, spend 3–4 days, take a domestic flight to Koh Samui or Phuket for 3 days, then fly from Thailand to Bali for 5–6 days and return home. Budget ₹80,000–1,20,000 for this combination trip including all regional flights. AirAsia and Scoot connect Thailand and Bali cheaply (often under ₹5,000 one way).' },
  ],
},

// ── POST 2: Visa-Free Countries ─────────────────────────────────────────────
{
  slug: 'visa-free-countries-indian-passport-2025',
  title: 'Visa-Free Countries for Indian Passport Holders in 2025',
  excerpt: 'Complete updated list of countries Indians can visit without a visa — visa on arrival, e-visa, and fully visa-free destinations with duration, conditions, and travel tips.',
  date: '2025-06-02',
  readTime: 8,
  category: 'Planning',
  tags: ['Visa Free', 'Indian Passport', 'Travel Planning', 'International Travel', '2025'],
  coverPhoto: 'photo-1488085061387-422e29b40080',
  content: [
    { type: 'p', text: 'Indian passport holders can travel to 57+ countries either completely visa-free or with a simple visa on arrival. While the Indian passport does not rank in the global top 50 for visa-free access, the options that are available include some of the world\'s most exciting travel destinations — Thailand, Bali, Sri Lanka, Nepal, Maldives, Mauritius, Kenya, and more. This is the complete, updated 2025 list.' },
    { type: 'callout', emoji: '📋', text: 'Conditions change frequently. Always verify entry requirements on the official embassy website or MoFA (Ministry of Foreign Affairs) of the destination country before booking. The information below is accurate as of mid-2025.' },
    { type: 'h2', text: 'Asia — Visa-Free & Visa on Arrival' },
    { type: 'table', headers: ['Country', 'Entry Type', 'Duration', 'Key Condition'], rows: [
      ['Thailand', 'Visa-Free', '30 days', 'No fee, return ticket required'],
      ['Indonesia (Bali)', 'Visa on Arrival', '30 days', 'USD 35 cash at airport'],
      ['Nepal', 'Visa-Free', 'Unlimited', 'Any Indian ID (no passport needed)'],
      ['Bhutan', 'e-Permit', 'Flexible', 'Sustainable Development Fee: USD 100/day'],
      ['Sri Lanka', 'Free e-Visa (ETA)', '30 days', 'Apply at eta.gov.lk before travel'],
      ['Maldives', 'Visa on Arrival', '30 days', 'Free, proof of accommodation needed'],
      ['Macau', 'Visa-Free', '30 days', 'Separate from mainland China'],
      ['Cambodia', 'Visa on Arrival / e-Visa', '30 days', 'USD 30 at airport or online'],
      ['Laos', 'Visa on Arrival', '30 days', 'USD 30–42 depending on nationality'],
      ['Myanmar', 'e-Visa', '28 days', 'Check current advisories before visiting'],
      ['Philippines', 'Visa-Free', '30 days', 'Return ticket required'],
      ['Iran', 'Visa on Arrival', '30 days', 'Check current travel advisories'],
      ['Jordan', 'Visa on Arrival', '30 days', 'JOD 40 at Amman airport'],
    ]},
    { type: 'h2', text: 'Africa — Strong Access for Indian Passport' },
    { type: 'table', headers: ['Country', 'Entry Type', 'Duration', 'Notes'], rows: [
      ['Kenya', 'e-Visa (ETA)', '90 days', 'USD 30, apply at etakenya.go.ke'],
      ['Tanzania', 'Visa on Arrival', '90 days', 'USD 50 at airport'],
      ['Rwanda', 'Visa on Arrival', '30 days', 'Free, extendable'],
      ['Uganda', 'e-Visa', '90 days', 'USD 50, apply online'],
      ['Ethiopia', 'e-Visa', '90 days', 'USD 82 online application'],
      ['Mauritius', 'Visa-Free', '90 days', 'One of India\'s best visa-free access points'],
      ['Seychelles', 'Visitor\'s Permit on Arrival', '30 days', 'Free, extendable'],
      ['Zimbabwe', 'Visa on Arrival', '90 days', 'USD 75 at airport'],
      ['Zambia', 'Visa on Arrival', '90 days', 'USD 50 single, USD 80 multi-entry'],
      ['Madagascar', 'Visa on Arrival', '30 days', 'EUR 35 equivalent'],
    ]},
    { type: 'h2', text: 'Americas & Caribbean — Accessible Islands' },
    { type: 'p', text: 'The USA, Canada, and most of South America require a formal visa application for Indian passport holders. However, several Caribbean and Latin American countries offer easy entry. Jamaica, El Salvador, Trinidad and Tobago, and Ecuador are visa-free for Indians. Bolivia, Haiti, and Dominica offer visa on arrival. For those who already hold a valid US visa, Argentina, Costa Rica, Panama, and several others open up as visa-free destinations — always check the specific US visa validity requirements.' },
    { type: 'h2', text: 'Europe — Schengen Is the Challenge' },
    { type: 'p', text: 'The Schengen zone (26 European countries including France, Germany, Spain, Italy) requires a formal visa application for Indian nationals — one of the biggest obstacles for Indian travellers. However, some European countries are accessible: Kosovo, Albania, Bosnia, North Macedonia, and Serbia are visa-free for Indians. Georgia (officially in the Caucasus region) is visa-free for up to 365 days. Turkey (a Schengen neighbour) requires an e-Visa (USD 50) available online. Once you hold a valid Schengen visa, the UK also becomes more accessible via a separate UK visitor visa.' },
    { type: 'callout', emoji: '🌍', text: 'Pro tip: A valid US, UK, EU Schengen, or Australian visa unlocks additional visa-free or visa-on-arrival access in many countries. For example, Indians with a valid US visa can enter Singapore visa-free for 96 hours in transit.' },
    { type: 'h2', text: 'Tips for Maximising Visa-Free Travel as an Indian' },
    { type: 'ul', items: [
      'Apply for a US B1/B2 visa: it unlocks additional access in Singapore, Argentina, Costa Rica, Panama, and several other countries that respect valid US visa holders.',
      'Nepal and Bhutan: completely hassle-free as an Indian — no visa, no passport needed for Nepal. These should be your first "international" trips for the experience.',
      'Sri Lanka ETA: apply online at eta.gov.lk at least 3 days before your trip. It is free and takes 24–48 hours. Do not use third-party sites that charge a fee for this free service.',
      'Maldives, Mauritius, and Seychelles: three Indian Ocean island paradises that are either visa-free or visa-on-arrival. All three are ideal for honeymoons and beach holidays.',
      'Keep a clean travel record: previous visa rejections, overstays, or immigration issues significantly affect your ability to get future visas. Always enter and exit legally within the granted period.',
    ]},
    { type: 'h2', text: 'Countries Opening Up for Indians in 2025' },
    { type: 'p', text: 'Thailand made its visa-free access for Indians permanent in 2024. Malaysia introduced an eNTRI and improved visa processes for Indians. Vietnam\'s e-visa now allows 90-day multiple-entry. The general trend for Indian passport access is improving year-on-year as India\'s economy and outbound tourism grow — expect more countries to simplify access for Indians in the coming years.' },
  ],
  faqs: [
    { question: 'How many countries can Indians visit without a visa?', answer: 'Indian passport holders can visit approximately 57–62 countries without a prior visa — either completely visa-free or with a simple visa on arrival at the airport. Top destinations include Thailand (visa-free), Maldives (free VOA), Sri Lanka (free e-Visa), Nepal (visa-free, no passport needed), Mauritius (visa-free 90 days), and Indonesia/Bali (VOA, USD 35).' },
    { question: 'Which is the easiest country for Indians to visit internationally?', answer: 'Nepal is the easiest — Indians need no visa, no passport (any government ID works), and can stay indefinitely. Thailand is the easiest truly "international" destination — 30-day visa-free entry with no fee. Sri Lanka is also very easy with a free e-Visa processed in 24–48 hours online.' },
    { question: 'Can Indians travel to Europe without a Schengen visa?', answer: 'Not to the 26 Schengen member states. Indian nationals must apply for a Schengen visa at the consulate of their primary destination. However, some non-Schengen European countries are accessible: Serbia, Albania, Bosnia, Kosovo, and North Macedonia are visa-free for Indians. Georgia (Caucasus) allows Indians to stay for up to 365 days without a visa.' },
    { question: 'Which visa-free countries are best for Indian tourists?', answer: 'Top picks: Thailand (beaches, food, culture), Maldives (luxury islands), Sri Lanka (close, affordable, beautiful), Nepal (Himalayas, cheap), Kenya (safari), Mauritius (Indian Ocean paradise), and Indonesia/Bali (Hindu culture, rice terraces). Each of these offers a dramatically different experience and is easy to access from India.' },
    { question: 'Does holding a US visa help Indian travellers?', answer: 'Yes. A valid US B1/B2 visa unlocks additional access for Indians in several countries, including Singapore (96-hour transit visa-free), Argentina, Costa Rica, Panama, and a few others that recognise valid US visa holders for visa-free or simplified entry. Always verify current rules at the time of booking.' },
  ],
},

// ── POST 1: Bali Itinerary for Indians ───────────────────────────────────────
{
  slug: 'bali-itinerary-indian-tourists',
  title: '7-Day Bali Itinerary for Indian Tourists (With Costs in INR)',
  excerpt: 'Complete day-by-day Bali itinerary for Indians — visa on arrival details, all costs in rupees, vegetarian food guide, and the best time to visit from India.',
  date: '2025-06-04',
  readTime: 10,
  category: 'Planning',
  tags: ['Bali', 'Indonesia', 'Itinerary', 'Indian Tourists', 'Budget', 'Asia'],
  coverPhoto: 'photo-1537996194471-e657df975ab4',
  citySlug: 'bali',
  content: [
    { type: 'p', text: 'Bali has become one of the most popular international destinations for Indian travellers — and for good reason. Visa on arrival, affordable prices, Hindu temples and culture that feel instantly familiar, and extraordinary food make it an easy, rewarding first international trip. This 7-day itinerary is specifically designed for Indian visitors: vegetarian food options are highlighted throughout, all costs are given in INR, and every practical detail is covered end-to-end.' },
    { type: 'p', text: 'The itinerary covers Seminyak, Canggu, Ubud, Nusa Penida, and Uluwatu — the five zones that together give you the complete Bali experience. It works for solo travellers, couples, and families.' },
    { type: 'h2', text: 'Bali Visa for Indian Passport Holders' },
    { type: 'p', text: 'Indians receive a Visa on Arrival (VOA) at Ngurah Rai International Airport, Bali. The fee is USD 35 (approximately ₹2,900 at current rates) and is paid in cash at a dedicated counter before immigration. USD is the preferred currency but IDR and sometimes INR are accepted. The VOA grants a 30-day single-entry stay and can be extended once at a local immigration office for another 30 days (same USD 35 fee). No prior application or email confirmation is required.' },
    { type: 'callout', emoji: '✈️', text: 'Carry exactly USD 35 in crisp notes specifically for the VOA counter. Credit cards are not accepted. Arrive with your return ticket printout and at least one hotel confirmation — immigration occasionally asks to see these.' },
    { type: 'h2', text: 'Day-by-Day 7-Night Bali Itinerary' },
    { type: 'h3', text: 'Day 1 — Arrive & Seminyak Sunset' },
    { type: 'p', text: 'Clear immigration (VOA queue takes 20–40 minutes), collect luggage, and take a Grab to Seminyak or Canggu (30–45 minutes, ₹600–900). Spend the afternoon settling in and walking the beach strip. Bali sunsets are genuinely spectacular — Petitenget Beach and Double Six Beach both face due west. Dinner at La Lucciola or Sari Organik Seminyak — both have excellent vegetarian menus. Budget accommodation in Seminyak starts at ₹1,000/night (hostel dorms) or ₹2,500 for a private room.' },
    { type: 'h3', text: 'Day 2 — Canggu & Beach Clubs' },
    { type: 'p', text: 'Rent a scooter (₹600/day, valid Indian driving licence accepted at most rental shops) or book a Grab to Canggu, Bali\'s most fashionable neighbourhood. Echo Beach and Batu Bolong Beach are beautiful for morning swimming. Lunch at Shady Shack or The Avocado Factory — both are 100% vegetarian, popular with Indian guests, and reasonably priced (₹800–1,200/meal). Afternoon: explore the independent boutiques and rice paddy walks around Jalan Pantai Berawa. Return to base before sunset.' },
    { type: 'h3', text: 'Day 3 — Ubud: Rice Terraces & Sacred Monkey Forest' },
    { type: 'p', text: 'Grab a private car to Ubud (1.5 hours, ₹1,200–1,500) — a much calmer, greener world than the coast. Start early at Tegalalang Rice Terraces (best before 9am, ₹200 entry) before the Instagram crowds descend. Visit the Sacred Monkey Forest Sanctuary (₹350 entry — keep snacks in your bag), Pura Taman Saraswati water temple (free, donate), and browse the Ubud Art Market for batik fabric, wood carvings, and silver jewellery. Dinner at Sayuri Healing Food — Ubud\'s best fully vegetarian restaurant.' },
    { type: 'h3', text: 'Day 4 — Ubud: Cooking Class & Waterfalls' },
    { type: 'p', text: 'Book a Balinese cooking class for the morning (₹2,500–3,500 per person including a local market tour and 5–6 dishes you cook and eat). Most classes accommodate vegetarians when requested at the time of booking — confirm in advance. Afternoon: visit Tukad Cepung Waterfall (₹400 entry, 20-minute walk) or Tibumana Falls — both are less crowded than the famous Tegenungan Falls and more atmospheric. Evening: walk the Campuhan Ridge Walk at golden hour for sweeping rice paddy views with no entry fee.' },
    { type: 'h3', text: 'Day 5 — Nusa Penida Full Day' },
    { type: 'p', text: 'The standout day of the trip. Take a speedboat from Sanur harbour (₹700–900 return, 45 minutes, book the day before) to Nusa Penida island. Hire a scooter (₹600/day) or private driver (₹1,800/day) to cover the west side highlights: Kelingking Beach (the famous T-Rex cliff viewpoint), Angel\'s Billabong natural infinity pool, Broken Beach arch, and Crystal Bay for snorkelling. Bring cash — Nusa Penida has very few ATMs and some accept only IDR. A packed vegetarian lunch from your Ubud hotel saves you from the limited food options on the island.' },
    { type: 'h3', text: 'Day 6 — Uluwatu Temple & Kecak Fire Dance' },
    { type: 'p', text: 'Head south to the Uluwatu peninsula — a dramatic limestone clifftop region with Bali\'s most spiritual temple (Pura Uluwatu, ₹300 entry, sarong provided at entrance). Arrive at 5pm to secure a good spot for the Kecak fire dance performed at the cliff edge as the sun sets directly behind the dancers (₹700–800 entry, one of Bali\'s unmissable experiences). Morning activities: Suluban Blue Point Beach (surfers\' beach, beautiful cove) or Padang Padang Beach (calm enough for families). Note: Jimbaran seafood warungs are nearby for non-vegetarians; vegetarians should bring snacks or eat before arriving.' },
    { type: 'h3', text: 'Day 7 — Tirta Empul & Departure' },
    { type: 'p', text: 'Final morning: visit Tirta Empul, Bali\'s most sacred Hindu water temple built around a freshwater spring (₹350 entry). Hindu devotees perform a purification ritual (melukat) in 13 sequential holy spring pools — the ceremony has direct parallels to kumbh and river bathing rituals that Indian visitors immediately recognise. Non-Hindu visitors are welcome to observe and photograph respectfully from the edges of the bathing area. Transfer to Ngurah Rai Airport (allow 2 hours for check-in and departure). Flight to India typically takes 5–6 hours direct.' },
    { type: 'h2', text: 'Bali 7-Day Trip Cost Breakdown in INR' },
    { type: 'table', headers: ['Expense', 'Budget (₹)', 'Mid-Range (₹)', 'Notes'], rows: [
      ['Return flights (India–Bali)', '25,000–35,000', '40,000–60,000', 'Book 3 months ahead for best fares'],
      ['Visa on Arrival (fixed)', '2,900', '2,900', 'USD 35, non-negotiable'],
      ['Accommodation (7 nights)', '7,000–14,000', '21,000–45,000', '₹1,000–6,500/night varies widely'],
      ['Food & drinks (7 days)', '7,000–10,500', '15,000–24,500', '₹1,000–3,500/day'],
      ['Transport (scooter + Grabs)', '4,200–7,000', '8,400–14,000', '₹600–2,000/day'],
      ['Activities & entry fees', '5,000–8,000', '10,000–15,000', 'Nusa Penida speedboat, temples, dance'],
      ['Total excluding flights', '26,100–40,000', '54,400–98,500', 'Per person for 7 days'],
    ]},
    { type: 'callout', emoji: '💸', text: 'Budget tip: book flights 3–4 months ahead for May or September travel. IndiGo, Air Asia, and Scoot often have Bali deals from Delhi/Mumbai under ₹25,000 return when booked early. Avoid booking in December — Christmas/NYE adds 40–60% to all prices.' },
    { type: 'h2', text: 'Vegetarian Food Guide for Indians in Bali' },
    { type: 'p', text: 'Bali is the most vegetarian-friendly country in Southeast Asia thanks to its Hindu roots. However, "vegetarian" is interpreted loosely in many local restaurants — fish sauce and chicken stock appear in dishes not labelled as such. The safest approach is to learn two phrases: "saya vegetarian" (I am vegetarian) and "tanpa daging" (without meat). Here are the best strategies for Indian vegetarians.' },
    { type: 'ul', items: [
      'Ubud is your best base for vegetarian food — it has more dedicated vegetarian and vegan restaurants than anywhere else in Southeast Asia outside India.',
      'Tempeh (fermented soybean cake) and tofu are native Balinese ingredients, naturally vegetarian, and available everywhere for ₹150–300 per dish.',
      'Gado-gado (vegetables in peanut sauce), nasi campur (rice with mixed sides), and cap cay (stir-fried vegetables) can all be ordered without meat.',
      'Avoid Jimbaran-style fish BBQ restaurants and most of the Kuta beachfront shacks — these are meat and seafood-heavy.',
      'Top vegetarian restaurants: Sayuri Healing Food (Ubud), Shady Shack (Canggu), Bali Buda (multiple locations), Zest Ubud, and Earth Cafe Ubud.',
      'Most upscale restaurants in Seminyak and Canggu have clearly labelled vegetarian sections — the international cafe scene here is very accommodating.',
    ]},
    { type: 'h2', text: 'Best Time to Visit Bali from India' },
    { type: 'p', text: 'April, May, and September are the ideal months for Indian travellers. April–May aligns with Indian school summer holidays and sits in Bali\'s dry season — sunny days, calm seas, and manageable crowd levels before the European school-holiday rush of July–August. September offers the same dry-season weather after the peak crowds have left, often with 20–30% lower accommodation prices than August. December–January is expensive and crowded due to global New Year travel. Avoid February–March for beach activities though the rice terraces are beautifully green.' },
  ],
  faqs: [
    { question: 'Is Bali safe for Indian tourists?', answer: 'Yes, Bali is very safe for Indian tourists. The island is one of Asia\'s most-visited destinations with excellent tourist infrastructure. The Hindu cultural parallels make Indians feel particularly at home. Main precautions: use Grab instead of street taxis to avoid overcharging, keep belongings secure at beach areas and markets, and avoid isolated beaches after dark.' },
    { question: 'How much does a 7-day Bali trip cost from India in INR?', answer: 'A budget 7-day Bali trip costs approximately ₹55,000–75,000 per person including return flights. A comfortable mid-range trip with a private hotel and restaurant meals runs ₹1,00,000–1,50,000 all-in. This includes return airfare, visa on arrival (₹2,900), accommodation, food, local transport, and entry fees to activities.' },
    { question: 'Can Indians get a Bali visa on arrival?', answer: 'Yes. Indian passport holders receive a Visa on Arrival at Ngurah Rai International Airport. The fee is USD 35 (approximately ₹2,900), paid in cash at a dedicated counter before immigration. It grants 30 days and is extendable for another 30 days. No prior application is needed — just carry a return ticket and accommodation proof.' },
    { question: 'Is vegetarian food easily available in Bali for Indians?', answer: 'Yes. Bali is Southeast Asia\'s most vegetarian-friendly destination due to its Hindu culture. Ubud has a large concentration of fully vegetarian and vegan restaurants. Local staples like tempeh, tofu, gado-gado, and nasi goreng are all available meat-free. Use the phrase "tanpa daging" (without meat) when ordering at local warungs to be safe.' },
    { question: 'What is the best time to visit Bali from India?', answer: 'April, May, and September are the best months. April–May falls in Bali\'s dry season and aligns with Indian school holidays — warm, sunny, and before peak European crowds arrive. September offers identical weather with lower prices after the July–August rush. Avoid December–January (expensive) and June–August (most crowded) unless you book well in advance.' },
  ],
},

]; // end of posts array

// ─── Inject into blog.ts ──────────────────────────────────────────────────────

let content = readFileSync(filePath, 'utf8');

const markerIdx = content.indexOf(MARKER);
if (markerIdx === -1) throw new Error('Could not find allPosts marker in blog.ts');

const insertAt = markerIdx + MARKER.length + 1; // after the opening [

// Check for duplicates
const existingSlugs = [...content.matchAll(/slug:\s*'([^']+)'/g)].map(m => m[1]);
const newPosts = posts.filter(p => {
  if (existingSlugs.includes(p.slug)) {
    console.log(`SKIP (duplicate): ${p.slug}`);
    return false;
  }
  return true;
});

if (newPosts.length === 0) {
  console.log('All posts already exist. Nothing to inject.');
  process.exit(0);
}

// Serialize each post to TypeScript source
function serializeValue(v, indent = 4) {
  const pad = ' '.repeat(indent);
  const pad2 = ' '.repeat(indent + 2);
  if (v === null || v === undefined) return 'undefined';
  if (typeof v === 'number') return String(v);
  if (typeof v === 'boolean') return String(v);
  if (typeof v === 'string') return `'${v.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
  if (Array.isArray(v)) {
    if (v.length === 0) return '[]';
    const items = v.map(item => `${pad2}${serializeValue(item, indent + 2)}`);
    return `[\n${items.join(',\n')},\n${pad}]`;
  }
  if (typeof v === 'object') {
    const entries = Object.entries(v).map(([k, val]) => {
      return `${pad2}${k}: ${serializeValue(val, indent + 2)}`;
    });
    return `{\n${entries.join(',\n')},\n${pad}}`;
  }
  return JSON.stringify(v);
}

const postsTs = newPosts.map(post => {
  const entries = Object.entries(post).map(([k, v]) => {
    return `    ${k}: ${serializeValue(v, 4)}`;
  });
  return `  {\n${entries.join(',\n')},\n  }`;
}).join(',\n');

const injection = '\n' + postsTs + ',\n';
content = content.slice(0, insertAt) + injection + content.slice(insertAt);

writeFileSync(filePath, content, 'utf8');
console.log(`\nInjected ${newPosts.length} post(s):`);
newPosts.forEach(p => console.log(`  + ${p.slug}`));
