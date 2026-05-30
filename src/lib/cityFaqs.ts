export interface FAQ {
  q: string;
  a: string;
}

const cityFaqs: Record<string, FAQ[]> = {
  bali: [
    {
      q: 'Do I need a visa to visit Bali?',
      a: 'Most nationalities including India can obtain a Visa on Arrival (VOA) at Bali\'s Ngurah Rai International Airport. It costs $35 USD, grants a 30-day stay, and can be extended once for another 30 days at an immigration office. Some nationalities get a free 30-day visa. Check the Indonesian immigration website before travel as rules change.',
    },
    {
      q: 'Is Bali safe for solo travellers and solo female travellers?',
      a: 'Bali is generally very safe for solo travellers, including solo women. Violent crime is extremely rare. The main risks are petty theft, scams targeting tourists (especially around Kuta and Seminyak), and traffic accidents from motorbike rentals. Trust your instincts, lock your accommodation, and prefer reputable transport apps like Grab over unmarked taxis.',
    },
    {
      q: 'What is the best area to stay in Bali?',
      a: 'It depends on what you are after. Seminyak and Canggu suit stylish, café-hopping travellers. Ubud is best for rice terraces, yoga, and culture. Uluwatu is for surfers and clifftop sunset bars. Sanur is quieter and family-friendly with a calm beach. South Goa: Palolem-equivalent in Bali is the south, particularly Nusa Dua and Jimbaran for resorts. Avoid Kuta unless you specifically want the party-and-shopping strip.',
    },
    {
      q: 'How many days do I need in Bali?',
      a: 'Seven to ten days is ideal for a well-rounded Bali trip. Three days in Ubud covers the rice terraces, temples, and cooking classes. Three to four days on the coast (Seminyak, Canggu, or Uluwatu) covers beaches, beach clubs, and surfing. A day trip to Nusa Penida (for snorkelling and dramatic cliffs) is highly recommended if you have the time.',
    },
    {
      q: 'How expensive is Bali?',
      a: 'Bali is affordable by international standards. Budget travellers can manage on ₹1,500–2,500 per day (accommodation in a clean guesthouse, local warungs for food, renting a scooter). Mid-range travellers spending ₹4,000–7,000 per day get private villas with pools, good restaurants, and guided day trips. Luxury in Bali (₹15,000+/day) rivals the Maldives for resort quality at a fraction of the price.',
    },
    {
      q: 'Is it safe to eat street food in Bali?',
      a: 'Yes, with common sense precautions. Warung (small local restaurants) are generally safe and serve excellent food. Stick to freshly cooked dishes, avoid raw vegetables rinsed in tap water, and choose busy stalls with high turnover. Drink bottled water. The most common travel illness in Bali (Bali Belly) usually comes from contaminated water or ice rather than the food itself.',
    },
    {
      q: 'What currency is used in Bali, and should I bring cash?',
      a: 'The currency is the Indonesian Rupiah (IDR). Cash is essential — many local warungs, temples, and markets only accept cash. ATMs are widely available in tourist areas. Use ATMs attached to banks (BCA, Mandiri, BNI) rather than standalone machines to avoid high fees. Avoid money changers on the street; use authorised exchange counters instead.',
    },
  ],

  bangkok: [
    {
      q: 'Do Indian passport holders need a visa for Thailand?',
      a: 'Indian passport holders can get a Visa on Arrival for 300 THB (approximately ₹700) at major Thai airports including Suvarnabhumi and Don Mueang. This grants a 15-day stay. For longer trips, apply for a Tourist Visa at the Thai embassy before departure (valid for 60 days). The process is straightforward and worth it for trips longer than two weeks.',
    },
    {
      q: 'Is Bangkok safe for tourists?',
      a: 'Bangkok is generally safe for tourists. Violent crime against foreigners is rare. The main risks are scams — particularly the "temple is closed today" scam (a tuk-tuk driver takes you to gem shops instead), overpriced tuk-tuks, and inflated metered taxi fares. Always use Grab (the Uber of Southeast Asia) for reliable, metered fares. Be cautious around Patpong and Nana areas at night.',
    },
    {
      q: 'How do I get from Bangkok airports to the city?',
      a: 'From Suvarnabhumi (main international airport): The Airport Rail Link City Line takes 30 minutes to Phaya Thai station for 45 THB — this is the best option. From Don Mueang (low-cost carriers): Take the A1 or A2 bus to Mo Chit BTS station for 30 THB, then BTS to your destination. Taxis from both airports are metered and reliable — expect ₹400–700 including tolls. Avoid airport taxis that approach you before the official metered queue.',
    },
    {
      q: 'What is the best area to stay in Bangkok?',
      a: 'Sukhumvit (BTS Asok or Nana) is ideal for mid-range travellers — excellent transport links, great food options, and lively nightlife. Silom/Bangrak suits business travellers and those who prefer a quieter, more local atmosphere. Khao San Road is the classic backpacker zone: loud, social, and cheap but firmly in the tourist bubble. Ari neighbourhood is where young Bangkok locals live — excellent cafés, good value accommodation, and an authentic city feel.',
    },
    {
      q: 'How many days should I spend in Bangkok?',
      a: 'Three to five days covers the highlights comfortably. Day 1: Grand Palace and Wat Pho in the morning, Chao Phraya river boat to Chinatown for dinner. Day 2: Chatuchak Weekend Market (if Saturday/Sunday), afternoon at a rooftop bar, evening in Silom. Day 3: Day trip to Ayutthaya ancient temples (2 hours by train). Day 4-5: Damnoen Saduak floating market, final temple visits, shopping.',
    },
    {
      q: 'What should I wear when visiting temples in Bangkok?',
      a: 'You must cover your shoulders and knees to enter temples including Wat Pho and the Grand Palace. Sleeveless tops, shorts, and short skirts are not permitted. The Grand Palace provides sarongs to borrow, but the queue is long — dress appropriately to save time. Light linen trousers and a thin long-sleeved shirt are ideal for temple days in Bangkok\'s heat.',
    },
    {
      q: 'Is street food safe to eat in Bangkok?',
      a: 'Absolutely. Bangkok\'s street food is world-famous and generally safe. The street food scene won a Michelin distinction — not a specific restaurant, but the entire culture. Choose busy stalls with high turnover, watch that food is freshly cooked rather than sitting out, and carry your own water. The best street food areas: Yaowarat (Chinatown), Or Tor Kor market, and the stalls around Victory Monument.',
    },
  ],

  paris: [
    {
      q: 'Do Indian passport holders need a visa to visit Paris?',
      a: 'Yes. Indian passport holders require a Schengen visa to visit France (and all 27 Schengen Area countries). Apply at the French consulate or VFS Global at least 3–4 weeks before travel. You will need a confirmed accommodation booking, return flights, travel insurance, bank statements, and an ITR (Income Tax Return). The visa fee is approximately ₹7,000. Once issued, a Schengen visa typically allows travel across all 27 member countries.',
    },
    {
      q: 'Is Paris safe for tourists?',
      a: 'Paris is generally safe for tourists, but pickpocketing is common around major attractions including the Eiffel Tower, Sacré-Cœur, and the Metro. Keep your bags zipped and in front of you, avoid showing expensive items in crowded areas, and be wary of strangers who approach you with clipboards or petition forms. The areas around Châtelet–Les Halles and the northern arrondissements (18th, 19th) require more caution at night.',
    },
    {
      q: 'How expensive is Paris for tourists?',
      a: 'Paris can be expensive but is manageable with planning. Budget travellers spending €50–80/day (₹4,500–7,000) can stay in hostels, eat baguette sandwiches and crêpes, and visit free museums (many are free on the first Sunday of the month). Mid-range travellers (€120–200/day, ₹11,000–18,000) get comfortable hotels and bistro lunches. The Paris Museum Pass (€52 for 2 days, €66 for 4 days) covers the Louvre, Musée d\'Orsay, Versailles, and 50+ other sites.',
    },
    {
      q: 'What is the best time to visit Paris?',
      a: 'Spring (April–June) is widely considered the best time: mild weather, blooming parks, and the city\'s famous art and food scenes are in full swing. Autumn (September–November) is equally beautiful with golden parks and smaller crowds than summer. July and August are busy and hot with many Parisians on holiday themselves. Winter (December–February) is cold but magical with Christmas markets and smaller tourist crowds.',
    },
    {
      q: 'How do I use public transport in Paris?',
      a: 'Paris has one of the world\'s best metro systems. A single Metro/bus ticket costs €2.15 (₹200). For stays of a week, buy a Navigo Découverte pass (€30/week, ₹2,700) which gives unlimited travel on all Metro, bus, RER, and Transilien lines within Paris zones 1–5 — including the airport connection. Top up at any Metro ticket machine using a foreign card. Download the Bonjour RATP app for navigation.',
    },
    {
      q: 'Do I need to tip in Paris restaurants?',
      a: 'Tipping is not required in France — service is included in restaurant prices by law. However, leaving a few euros for good service at a sit-down restaurant is appreciated. In cafés, rounding up to the nearest euro is common. Never feel pressured to tip — unlike in the US, French service culture does not depend on it.',
    },
    {
      q: 'What are the most visited attractions in Paris?',
      a: 'The most visited attractions are: the Eiffel Tower (book tickets online weeks in advance to avoid queues), the Louvre Museum (home to the Mona Lisa — arrive when it opens at 9am), Musée d\'Orsay (Impressionist masterpieces, less crowded than the Louvre), Notre-Dame Cathedral (undergoing restoration, reopened December 2024), Sacré-Cœur in Montmartre (free entry, great views), and the Palace of Versailles (book online and arrive early).',
    },
  ],

  tokyo: [
    {
      q: 'Do Indian passport holders need a visa for Japan?',
      a: 'Yes. Indian passport holders require a visa to visit Japan. Apply at the Japanese embassy or a Japan Visa Application Centre (JVAC) in India. The process typically takes 5–7 working days. You will need a cover letter, confirmed hotel bookings, flight itinerary, bank statements, and an ITR. The tourist visa is free of charge. Japan eVisa is now available for Indian nationals via the official Japan eVisa website, making the process significantly faster.',
    },
    {
      q: 'Is Tokyo expensive to visit?',
      a: 'Japan has a reputation for being expensive, but it is often more affordable than major European cities for budget-conscious travellers. A bowl of ramen costs ¥700–1,000 (₹350–500). A set lunch at a mid-range restaurant is ¥900–1,300 (₹450–650). Capsule hotels cost ¥2,500–4,000/night (₹1,250–2,000). Budget travellers can manage on ₹4,000–6,000/day including accommodation. The expensive elements are accommodation in central Tokyo and high-end dining.',
    },
    {
      q: 'Is Tokyo safe for tourists?',
      a: 'Tokyo consistently ranks as one of the safest major cities in the world. Violent crime against tourists is extremely rare. You can leave a phone on a café table and return to find it there. However, take normal precautions: avoid leaving bags unattended, be aware of your surroundings, and use official taxis or Grab for late-night travel. The biggest risk most Tokyo visitors face is getting lost in the metro system.',
    },
    {
      q: 'What is the best time to visit Tokyo?',
      a: 'Spring (late March–early April) for cherry blossom season is the most popular time — the parks transform into pink canopies and the city feels magical, though accommodation prices rise significantly. Autumn (October–November) offers vivid foliage and comfortable temperatures. Avoid August (extreme heat and humidity) and Golden Week at the start of May (everywhere is crowded and expensive). Winter is cold but uncrowded, with excellent skiing day trips from Tokyo.',
    },
    {
      q: 'Should I buy a JR Pass for a Tokyo trip?',
      a: 'The JR Pass (7-day: ¥50,000, approximately ₹25,000) only makes financial sense if you are travelling between multiple cities. A Tokyo-Kyoto-Osaka-Tokyo shinkansen journey costs around ¥45,000–55,000 on its own, so the pass pays for itself. If you are staying mainly in Tokyo, skip the JR Pass and buy an IC card (Suica or Pasmo) instead — it covers all Tokyo metro lines and buses for standard fares.',
    },
    {
      q: 'What should I know about etiquette in Japan?',
      a: 'Key etiquette rules: Do not tip (it can be considered impolite). Stay quiet on trains — phone calls are discouraged. Carry your own rubbish as public bins are very scarce. Eat and drink while walking is frowned upon except at festivals. Remove shoes when entering traditional restaurants, temples, and most ryokan. Bow slightly when greeting — a 15-degree nod is appropriate for tourists. Queue patiently — Japanese queuing culture is very orderly.',
    },
    {
      q: 'How do I get around Tokyo?',
      a: 'Tokyo has one of the world\'s most comprehensive public transport systems. Get an IC card (Suica — add it to Apple/Google Wallet or buy at the airport) and use it on all Metro lines, JR lines, buses, and even at convenience stores. The Tokyo Metro app with offline maps is essential. Taxis are expensive and reliable. Cycling is increasingly popular — dockless bike-share services like HELLO CYCLING are available. Walking between neighbourhoods is often pleasant.',
    },
  ],

  dubai: [
    {
      q: 'Do Indian passport holders need a visa for Dubai?',
      a: 'Indians holding a valid US visa (multiple-entry), UK visa, EU Schengen visa, or a UK/US/EU residency permit can obtain a free 14-day visa on arrival in Dubai. Without these, Indian passport holders need a UAE tourist visa, which can be arranged through an airline, hotel, or approved travel agent. The 30-day single-entry visa costs approximately AED 250 (₹5,700) and the 60-day visa costs AED 500 (₹11,400).',
    },
    {
      q: 'What is the dress code in Dubai?',
      a: 'Dubai is relatively liberal by Gulf standards but dressing modestly in public is expected. In malls, souks, and on the street, avoid overly revealing clothing — shorts should be knee-length, and shoulders should be covered. At the beach, normal swimwear is fine on designated beaches. In mosques, both men and women must cover up fully (women need headscarves). On the Dubai Metro, a women-only carriage is available at the front of the train.',
    },
    {
      q: 'Is alcohol available in Dubai?',
      a: 'Alcohol is available in Dubai but only at licensed hotels, restaurants, and specific retail stores (like MMI and African+Eastern). You cannot drink alcohol in public spaces, on the beach, or in unlicensed restaurants. Drinking in public or being visibly intoxicated in public is a criminal offence. During Ramadan, alcohol service hours at licensed venues are restricted. Most tourists encounter no issues as hotel bars and restaurants serve freely.',
    },
    {
      q: 'What is the best time to visit Dubai?',
      a: 'October to April is the ideal time when daytime temperatures range from 20–30°C — perfect for outdoor activities, beach days, and exploring the city on foot. May to September is extremely hot (40°C+) and humid. The period from November to February is peak tourist season with Dubai Shopping Festival, outdoor events, and perfect beach weather. The Dubai Expo season (if running) also draws large crowds. Book accommodation 2–3 months ahead for the winter months.',
    },
    {
      q: 'Is Dubai safe for tourists?',
      a: 'Dubai has one of the lowest crime rates in the world and is extremely safe for tourists. The UAE has strict laws and enforcement. Solo female travellers consistently report feeling very safe. The main things to be aware of: laws around photography (avoid photographing government buildings, police, and people without permission), zero tolerance for drugs (even prescription medication quantities exceeding allowed limits), and public displays of affection can lead to fines.',
    },
    {
      q: 'How expensive is Dubai?',
      a: 'Dubai has a wide range of price points. At the budget end, the Dubai Metro is very affordable (AED 1.5–7.5 per trip, ₹35–170), street food in Deira and Karama costs AED 10–25 (₹230–580), and there are hostels from AED 60/night (₹1,400). Mid-range travellers (AED 400–700/day, ₹9,000–16,000) can stay in good 3-star hotels and eat at proper restaurants. Luxury Dubai (Burj Al Arab, sky-high dining) is expensive by any measure. Free attractions include Dubai Creek, the Gold Souk, Jumeirah Beach, and the Dubai Frame views.',
    },
    {
      q: 'What are the must-see attractions in Dubai?',
      a: 'Top attractions: Burj Khalifa (book the 124th or 148th floor observation deck online in advance — much cheaper than at the counter), Dubai Mall (world\'s largest mall with an indoor aquarium and ice rink), Palm Jumeirah and Atlantis Hotel (visit the view deck), Dubai Creek and the traditional souks (Gold Souk, Spice Souk), Al Fahidi Historical Neighbourhood (Dubai\'s old city), desert safari at sunset (4x4 dune bashing, camel rides, and a Bedouin camp dinner).',
    },
  ],

  goa: [
    {
      q: 'What is the best time to visit Goa?',
      a: 'October to February is peak season in Goa with warm, sunny days (27–32°C), calm seas perfect for swimming and water sports, and a lively tourist atmosphere. November and December bring the most visitors. March and April are hot but uncrowded. May to September is monsoon — heavy rain, rough seas, most beach shacks close, and the northern beaches become unsuitable for swimming. However, monsoon Goa has its own beauty: lush green landscapes and almost empty beaches, popular with long-stay travellers.',
    },
    {
      q: 'Which is better — North Goa or South Goa?',
      a: 'They are very different. North Goa (Calangute, Baga, Anjuna, Arambol) has the party scene, beach clubs, flea markets, nightlife, and the bulk of tourist activity. It is livelier and has more dining options but also more crowds and commercial development. South Goa (Palolem, Agonda, Colva) is calmer, cleaner, and more naturally beautiful. South Goa is better for couples, relaxation-seekers, and those who want a quieter beach holiday. Most travellers prefer South Goa for the beach quality but North Goa for the nightlife.',
    },
    {
      q: 'How many days is enough for Goa?',
      a: 'Four to five days covers the main highlights well. Day 1: Arrive, settle in, explore your beach area. Days 2–3: Beaches, water sports, beach shack lunches and sunsets. Day 4: Day trip to Old Goa (UNESCO Portuguese churches and the Basilica of Bom Jesus) and Panjim city. Day 5: Dudhsagar Falls (book a jeep tour from Mollem, approximately ₹1,200 per person). A week or more is ideal if you want to explore multiple areas at a relaxed pace.',
    },
    {
      q: 'Is Goa safe for tourists?',
      a: 'Goa is one of India\'s safest tourist destinations and is very accustomed to hosting solo female travellers and international visitors. Violent crime is rare. The main issues are petty theft on beaches (leave valuables in your room), motorcycle/scooter accidents (the leading cause of tourist injury in Goa — always wear a helmet), and drink-spiking at some clubs in North Goa. Stay with groups if partying late, use reputable taxis, and keep your accommodation locked.',
    },
    {
      q: 'What is the best way to get around Goa?',
      a: 'Renting a scooter (₹300–400/day) is the most popular and practical way to get around Goa — it gives you the freedom to reach beaches and attractions at your own pace. Always wear a helmet (mandatory by law and essential safety). For those who prefer not to ride, taxis are widely available and affordable. Hire a taxi for a full day (₹1,500–2,500) to cover Old Goa, Dudhsagar, and the northern or southern beaches in one trip. Goa has no Metro and local buses are slow.',
    },
    {
      q: 'Can I visit Goa during monsoon (June–September)?',
      a: 'Yes, and many travellers prefer it for the lush green scenery, empty beaches, and dramatically lower prices (accommodation can be 50–60% cheaper). The downsides: most beach shacks close, the sea is rough and unsafe for swimming, water sports stop, and some areas experience flooding. Inland Goa — the spice plantations, waterfalls, and the old Portuguese neighbourhoods of Panjim — is actually best during and just after monsoon when everything is green and cool.',
    },
    {
      q: 'What is the food like in Goa, and what must I try?',
      a: 'Goan food is uniquely influenced by 450 years of Portuguese rule and combines seafood, vinegar, coconut, and Indian spices. Must-try dishes: Fish curry rice (the unofficial state dish), prawn balchão (a spicy pickled prawn preparation), sorpotel (pork offal curry — an acquired taste but authentic), bebinca (a rich layered coconut dessert), and pork vindaloo (much more complex than the British-Indian version). For seafood, visit a local restaurant slightly away from the main beach strips — better quality, lower prices.',
    },
  ],
};

export function getCityFaqs(slug: string): FAQ[] {
  return cityFaqs[slug] ?? [];
}
