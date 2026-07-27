import { City } from './types';
import { makeAddedCityGuide, AddedCityData } from './worldCities';

// Deepens the non-India catalogue: (1) fully new countries not yet in
// worldCities.ts / src/data/countries.ts, and (2) 2-4 more cities each for a
// handful of existing countries that only had a couple of entries. Same
// makeAddedCityGuide pattern as worldCities.ts — no month-by-month data, so
// these are treated like the rest of addedWorldCities (not indexable until
// hand-authored month data is added later).

const moreWorldCitiesData: AddedCityData[] = [
  // ===================== IRELAND (new) =====================
  {
    slug: 'dublin', name: 'Dublin', country: 'Ireland', flag: '🇮🇪', tagline: 'Literary Capital', gradient: 'from-emerald-700 to-slate-500', accentColor: '#047857', photo: 'photo-1516905041604-7f3f4b1ef50c', bestTime: 'May - Sep', budget: 'EUR 90-220/day', language: 'English, Irish', currency: 'EUR', vibes: ['Pubs', 'Literature', 'History'],
    heroDescription: 'Dublin is a compact capital built around the River Liffey, where Georgian squares, literary pubs, and Trinity College\'s medieval library sit within a twenty-minute walk of each other.',
    description: 'It rewards slow walking and pub conversation more than a checklist — the Guinness Storehouse and Book of Kells are the anchors, but the city\'s real character is in Temple Bar\'s side streets and traditional music sessions.',
    highlights: ['Trinity College & Book of Kells', 'Temple Bar', 'Guinness Storehouse', 'St Patrick\'s Cathedral', 'Grafton Street', 'Kilmainham Gaol', 'Phoenix Park', 'Ha\'penny Bridge', 'Dublin Castle', 'Christ Church Cathedral'],
  },
  {
    slug: 'galway', name: 'Galway', country: 'Ireland', flag: '🇮🇪', tagline: 'Gateway to the West', gradient: 'from-cyan-700 to-emerald-500', accentColor: '#0E7490', photo: 'photo-1544735716-392fe2489ffa', bestTime: 'May - Sep', budget: 'EUR 85-200/day', language: 'English, Irish', currency: 'EUR', vibes: ['Music', 'Coastal', 'Bohemian'],
    heroDescription: 'Galway is Ireland\'s festival city, a colourful harbour town on the edge of Connemara where traditional music spills out of pub doors most nights of the week.',
    description: 'Its real value is as a base — the Cliffs of Moher and the Aran Islands are both an easy day trip away, and the Latin Quarter itself is small enough to enjoy in an afternoon.',
    highlights: ['Latin Quarter', 'Galway Cathedral', 'Salthill Promenade', 'Spanish Arch', 'Cliffs of Moher day trip', 'Aran Islands ferry', 'Eyre Square', 'Galway City Museum', 'Connemara day trip', 'Traditional music pub crawl'],
  },
  {
    slug: 'killarney', name: 'Killarney', country: 'Ireland', flag: '🇮🇪', tagline: 'Lakes & Mountains', gradient: 'from-emerald-800 to-green-500', accentColor: '#065F46', photo: 'photo-1502989642968-94fbdc9b4bce', bestTime: 'May - Sep', budget: 'EUR 85-210/day', language: 'English, Irish', currency: 'EUR', vibes: ['Nature', 'Scenic drives', 'Lakes'],
    heroDescription: 'Killarney is the base camp for the Ring of Kerry and Killarney National Park, a small town wrapped around lakes, waterfalls, and Ireland\'s only wild native red deer herd.',
    description: 'Hire a jaunting car (horse and trap) for the national park, then give at least a full day to the Ring of Kerry loop drive.',
    highlights: ['Killarney National Park', 'Ring of Kerry', 'Muckross House & Gardens', 'Gap of Dunloe', 'Torc Waterfall', 'Ross Castle', 'Lakes of Killarney boat tour', 'Ladies View', 'Dingle Peninsula day trip', 'Jaunting car ride'],
  },
  {
    slug: 'cork', name: 'Cork', country: 'Ireland', flag: '🇮🇪', tagline: 'Ireland\'s Food Capital', gradient: 'from-red-700 to-amber-500', accentColor: '#B91C1C', photo: 'photo-1541943181603-d8fe267a5dcf', bestTime: 'May - Sep', budget: 'EUR 85-200/day', language: 'English, Irish', currency: 'EUR', vibes: ['Food', 'Heritage', 'Riverside'],
    heroDescription: 'Cork is Ireland\'s food capital, built around the covered stalls of the English Market and a hilly, riverside old town that locals will tell you is better than Dublin.',
    description: 'Blarney Castle is the famous day trip, but Cork itself — its market, its gaol, and Cobh\'s Titanic history nearby — is worth two unhurried days.',
    highlights: ['English Market', 'Blarney Castle & Stone', 'Cork City Gaol', 'St Fin Barre\'s Cathedral', 'Shandon Bells', 'Cobh Titanic departure port', 'Fitzgerald Park', 'Elizabeth Fort', 'Kinsale day trip', 'Crawford Art Gallery'],
  },
  {
    slug: 'kilkenny', name: 'Kilkenny', country: 'Ireland', flag: '🇮🇪', tagline: 'Medieval Ireland', gradient: 'from-slate-700 to-amber-500', accentColor: '#475569', photo: 'photo-1558618666-fcd25c85cd64', bestTime: 'May - Sep', budget: 'EUR 80-190/day', language: 'English, Irish', currency: 'EUR', vibes: ['Medieval', 'Small town', 'Crafts'],
    heroDescription: 'Kilkenny packs a Norman castle, a medieval cathedral, and a whole "Medieval Mile" of laneways into one of Ireland\'s smallest and best-preserved heritage towns.',
    description: 'It is an easy day trip from Dublin or a relaxed overnight stop, with the castle grounds and riverside walk filling a satisfying half-day.',
    highlights: ['Kilkenny Castle', 'Medieval Mile', 'St Canice\'s Cathedral', 'Kilkenny Design Centre', 'Smithwick\'s Experience', 'Rothe House', 'Kyteler\'s Inn', 'Dunmore Cave', 'Woodstock Gardens', 'Kilkenny Arts Festival venues'],
  },

  // ===================== AUSTRIA (new) =====================
  {
    slug: 'vienna', name: 'Vienna', country: 'Austria', flag: '🇦🇹', tagline: 'Imperial Capital', gradient: 'from-amber-700 to-slate-500', accentColor: '#B45309', photo: 'photo-1516747773236-7adb06e3c5bd', bestTime: 'Apr - Jun, Sep - Oct', budget: 'EUR 100-260/day', language: 'German', currency: 'EUR', vibes: ['Imperial', 'Music', 'Coffeehouses'],
    heroDescription: 'Vienna is the Habsburg empire\'s old capital, a city of palaces, opera houses, and coffeehouse culture that still runs on the rhythm of classical music.',
    description: 'Give the Schönbrunn and Hofburg palaces a full day between them, then slow down for a Naschmarkt lunch and an evening at the State Opera.',
    highlights: ['Schönbrunn Palace', 'St Stephen\'s Cathedral', 'Hofburg Palace', 'Belvedere Palace', 'Vienna State Opera', 'Naschmarkt', 'Prater amusement park', 'Ringstrasse tram loop', 'Kunsthistorisches Museum', 'Café Central'],
  },
  {
    slug: 'salzburg', name: 'Salzburg', country: 'Austria', flag: '🇦🇹', tagline: 'Sound of Music City', gradient: 'from-emerald-700 to-amber-500', accentColor: '#047857', photo: 'photo-1533105079780-92b9be482077', bestTime: 'May - Sep', budget: 'EUR 95-240/day', language: 'German', currency: 'EUR', vibes: ['Music', 'Baroque', 'Alpine'],
    heroDescription: 'Salzburg is Mozart\'s birthplace and the real-life set of The Sound of Music, a baroque old town squeezed between a fortress hill and the Salzach River.',
    description: 'The fortress cable car and a Sound of Music-themed walk cover most first-timers\' priorities, with day trips into the Salzkammergut lakes an easy add-on.',
    highlights: ['Hohensalzburg Fortress', 'Mirabell Palace & Gardens', 'Getreidegasse', 'Salzburg Cathedral', 'Sound of Music tour', 'Hellbrunn Palace', 'St Peter\'s Abbey', 'Salzach River walk', 'Mönchsberg viewpoint', 'Hangar-7'],
  },
  {
    slug: 'innsbruck', name: 'Innsbruck', country: 'Austria', flag: '🇦🇹', tagline: 'Alps in the City', gradient: 'from-sky-700 to-slate-500', accentColor: '#0369A1', photo: 'photo-1502989642968-94fbdc9b4bce', bestTime: 'Jun - Sep, Dec - Mar', budget: 'EUR 100-250/day', language: 'German', currency: 'EUR', vibes: ['Mountains', 'Skiing', 'Old town'],
    heroDescription: 'Innsbruck is the rare capital where a cable car from the old town drops you straight onto an alpine ridge, making it a two-time Winter Olympics host with a genuinely walkable medieval centre.',
    description: 'Ride the Nordkette cable car for mountain views, then spend the afternoon under the Golden Roof in the compact historic core.',
    highlights: ['Golden Roof', 'Nordkette cable car', 'Swarovski Crystal Worlds', 'Imperial Palace (Hofburg)', 'Ambras Castle', 'Maria-Theresien-Strasse', 'Bergisel Ski Jump', 'Tyrolean Folk Art Museum', 'Alpenzoo', 'Old Town walking tour'],
  },
  {
    slug: 'hallstatt', name: 'Hallstatt', country: 'Austria', flag: '🇦🇹', tagline: 'Lakeside Postcard', gradient: 'from-cyan-700 to-emerald-500', accentColor: '#0E7490', photo: 'photo-1560969184-10fe8719e047', bestTime: 'May - Sep', budget: 'EUR 100-260/day', language: 'German', currency: 'EUR', vibes: ['Lakes', 'Scenic', 'Alpine village'],
    heroDescription: 'Hallstatt is a tiny lakeside village pressed between mountain and water, famous for one of the oldest salt mines on earth and views that look staged even in person.',
    description: 'Arrive early or stay overnight to beat the day-tripper crowds at the Skywalk and the lakefront photo point.',
    highlights: ['Hallstatt Skywalk', 'Salt mine tour', 'Hallstätter See lakefront', 'Catholic parish church & bone house', 'Market square', 'Echern Valley', 'Five Fingers viewpoint', 'Ice cave day trip', 'Funicular railway', 'Lakeside photo point'],
  },
  {
    slug: 'graz', name: 'Graz', country: 'Austria', flag: '🇦🇹', tagline: 'Student City', gradient: 'from-rose-700 to-slate-500', accentColor: '#BE123C', photo: 'photo-1558618666-fcd25c85cd64', bestTime: 'Apr - Oct', budget: 'EUR 85-210/day', language: 'German', currency: 'EUR', vibes: ['Student city', 'Architecture', 'Relaxed'],
    heroDescription: 'Graz is Austria\'s second city and a UNESCO World Heritage old town, mixing a medieval clock tower with the futuristic bulge of the Kunsthaus art museum.',
    description: 'It moves at a slower, more affordable pace than Vienna, with a young university-town energy along the Mur River.',
    highlights: ['Schlossberg clock tower', 'Graz Old Town', 'Kunsthaus Graz', 'Eggenberg Palace', 'Graz Armoury', 'Murinsel bridge island', 'Graz farmers market', 'Herz-Jesu-Kirche', 'Graz Opera House', 'Piber stud farm day trip'],
  },

  // ===================== POLAND (new) =====================
  {
    slug: 'warsaw', name: 'Warsaw', country: 'Poland', flag: '🇵🇱', tagline: 'Rebuilt Capital', gradient: 'from-red-700 to-slate-500', accentColor: '#B91C1C', photo: 'photo-1516905041604-7f3f4b1ef50c', bestTime: 'May - Sep', budget: 'PLN 350-900/day', language: 'Polish', currency: 'PLN', vibes: ['History', 'Resilience', 'Urban'],
    heroDescription: 'Warsaw was rebuilt brick by brick after near-total wartime destruction, and its Old Town — a meticulous reconstruction — is now a UNESCO World Heritage Site in its own right.',
    description: 'The Warsaw Uprising Museum is essential context before wandering the Old Town Market Square, and Łazienki Park offers a green, peaceful counterpoint.',
    highlights: ['Old Town Market Square', 'Royal Castle', 'Warsaw Uprising Museum', 'Łazienki Park', 'Palace of Culture & Science', 'Wilanów Palace', 'Chopin Museum', 'Praga district', 'POLIN Museum', 'Vistula Boulevards'],
  },
  {
    slug: 'krakow', name: 'Krakow', country: 'Poland', flag: '🇵🇱', tagline: 'Poland\'s Cultural Soul', gradient: 'from-amber-700 to-slate-600', accentColor: '#B45309', photo: 'photo-1541943181603-d8fe267a5dcf', bestTime: 'May - Sep', budget: 'PLN 300-800/day', language: 'Polish', currency: 'PLN', vibes: ['Medieval', 'History', 'Nightlife'],
    heroDescription: 'Krakow escaped WWII largely intact, leaving Poland\'s grandest medieval square, a hilltop royal castle, and a Jewish quarter with a difficult, essential history.',
    description: 'Most visitors combine the Old Town with a sobering day trip to Auschwitz-Birkenau and the underground chambers of the Wieliczka Salt Mine.',
    highlights: ['Wawel Castle', 'Main Market Square', 'St Mary\'s Basilica', 'Kazimierz Jewish Quarter', 'Auschwitz-Birkenau day trip', 'Wieliczka Salt Mine', 'Cloth Hall', 'Schindler\'s Factory', 'Rynek Underground Museum', 'Wawel Dragon\'s Den'],
  },
  {
    slug: 'wroclaw', name: 'Wroclaw', country: 'Poland', flag: '🇵🇱', tagline: 'City of Bridges', gradient: 'from-emerald-700 to-slate-500', accentColor: '#047857', photo: 'photo-1558618666-fcd25c85cd64', bestTime: 'May - Sep', budget: 'PLN 280-700/day', language: 'Polish', currency: 'PLN', vibes: ['Riverside', 'Playful', 'Architecture'],
    heroDescription: 'Wroclaw sits on a dozen islands linked by more bridges than Venice, with a colourful market square and a scavenger-hunt gimmick of hundreds of tiny bronze dwarf statues hidden around town.',
    description: 'Climb the university tower for skyline views, then wander Ostrów Tumski, the cathedral island where the city began.',
    highlights: ['Wroclaw Market Square', 'Centennial Hall', 'Ostrów Tumski (Cathedral Island)', 'Dwarf statue hunt', 'Panorama Racławicka', 'Wroclaw University tower', 'Grunwaldzki Bridge', 'Botanical Garden', 'Wroclaw Zoo', 'Sand Island'],
  },
  {
    slug: 'gdansk', name: 'Gdansk', country: 'Poland', flag: '🇵🇱', tagline: 'Baltic Port City', gradient: 'from-cyan-700 to-amber-500', accentColor: '#0E7490', photo: 'photo-1547471080-7cc2caa01a7e', bestTime: 'May - Sep', budget: 'PLN 300-750/day', language: 'Polish', currency: 'PLN', vibes: ['Maritime', 'History', 'Amber'],
    heroDescription: 'Gdansk is a Hanseatic port city on the Baltic where the Solidarity movement began, its rebuilt merchant houses lining the Long Market above a working shipyard with real history.',
    description: 'Pair the amber-trading old town with the Solidarity museum at the shipyard gates, and take the extra half-day for Malbork, the largest brick castle in the world.',
    highlights: ['Long Market (Długi Targ)', 'St Mary\'s Church', 'Gdansk Shipyard & Solidarity Museum', 'Neptune\'s Fountain', 'Westerplatte', 'Malbork Castle day trip', 'Motława River promenade', 'Amber Museum', 'Gdansk Crane', 'Sopot pier day trip'],
  },

  // ===================== ICELAND (new) =====================
  {
    slug: 'reykjavik', name: 'Reykjavik', country: 'Iceland', flag: '🇮🇸', tagline: 'Northern Lights Capital', gradient: 'from-sky-700 to-slate-600', accentColor: '#0369A1', photo: 'photo-1502602898657-3e91760cbb34', bestTime: 'Jun - Aug (midnight sun), Sep - Mar (Northern Lights)', budget: 'USD 130-320/day', language: 'Icelandic, English', currency: 'ISK', vibes: ['Northern Lights', 'Geothermal', 'Quirky'],
    heroDescription: 'Reykjavik is the world\'s northernmost capital and the launchpad for the Golden Circle and the Blue Lagoon, a small, colourful harbour city that punches well above its size on design and food.',
    description: 'Base here for two or three nights, using it as a hub for day trips into geysers, waterfalls, and glacier country rather than a long standalone stay.',
    highlights: ['Hallgrímskirkja', 'Golden Circle day trip', 'Blue Lagoon', 'Harpa Concert Hall', 'Sun Voyager sculpture', 'Perlan Museum', 'Laugavegur shopping street', 'Northern Lights hunting', 'Reykjavik Old Harbour whale watching', 'Reykjadalur hot river hike'],
  },
  {
    slug: 'vik', name: 'Vik', country: 'Iceland', flag: '🇮🇸', tagline: 'Black Sand South Coast', gradient: 'from-slate-800 to-cyan-600', accentColor: '#1E293B', photo: 'photo-1502989642968-94fbdc9b4bce', bestTime: 'Jun - Sep', budget: 'USD 120-300/day', language: 'Icelandic, English', currency: 'ISK', vibes: ['Waterfalls', 'Black sand', 'Glaciers'],
    heroDescription: 'Vik is a tiny village on Iceland\'s dramatic south coast, wedged between the black-sand beach at Reynisfjara and a run of the country\'s most photographed waterfalls.',
    description: 'It works best as an overnight stop on a south coast road trip, with Skógafoss and Seljalandsfoss both within a short drive.',
    highlights: ['Reynisfjara black sand beach', 'Reynisdrangar sea stacks', 'Skógafoss waterfall', 'Seljalandsfoss waterfall', 'Dyrhólaey promontory', 'Vik church viewpoint', 'Mýrdalsjökull glacier hike', 'Katla ice cave', 'Sólheimajökull glacier walk', 'South Coast waterfall route'],
  },
  {
    slug: 'akureyri', name: 'Akureyri', country: 'Iceland', flag: '🇮🇸', tagline: 'Capital of the North', gradient: 'from-emerald-700 to-sky-600', accentColor: '#047857', photo: 'photo-1533105079780-92b9be482077', bestTime: 'Jun - Aug', budget: 'USD 120-290/day', language: 'Icelandic, English', currency: 'ISK', vibes: ['Fjords', 'Whales', 'Small city'],
    heroDescription: 'Akureyri is Iceland\'s second city, tucked at the head of a long fjord in the north and used as the base for the Lake Mývatn geothermal area and Arctic whale watching.',
    description: 'It is a good counterpoint to the south coast crowds, with easier access to Goðafoss and Húsavík\'s whale-watching boats.',
    highlights: ['Akureyrarkirkja church', 'Akureyri Botanical Garden', 'Lake Mývatn day trip', 'Goðafoss waterfall', 'Whale watching in Eyjafjörður', 'Hlíðarfjall ski area', 'Christmas House', 'Akureyri harbour', 'Dettifoss day trip', 'Húsavík whale watching add-on'],
  },

  // ===================== FIJI (new) =====================
  {
    slug: 'nadi', name: 'Nadi', country: 'Fiji', flag: '🇫🇯', tagline: 'Gateway to the Islands', gradient: 'from-teal-600 to-amber-400', accentColor: '#0D9488', photo: 'photo-1573408301185-9519eb7ef241', bestTime: 'May - Oct', budget: 'USD 60-220/day', language: 'English, Fijian, Hindi', currency: 'FJD', vibes: ['Beaches', 'Culture', 'Gateway'],
    heroDescription: 'Nadi is Fiji\'s international arrival point and, thanks to a large Indo-Fijian community, one of the few places in the South Pacific where a Hindi-speaking traveller will feel unexpectedly at home.',
    description: 'Most people transit straight to the outer islands, but the temple, market, and mud pools are worth a day either side of a flight.',
    highlights: ['Sri Siva Subramaniya Temple', 'Garden of the Sleeping Giant', 'Nadi Local Market', 'Sabeto Mud Pool & Hot Springs', 'Denarau Marina', 'Momi Bay snorkelling', 'Nadi Town shopping', 'Malolo Island day trip', 'Kava ceremony', 'Nausori Highlands village visit'],
  },
  {
    slug: 'denarau-island', name: 'Denarau Island', country: 'Fiji', flag: '🇫🇯', tagline: 'Resort Strip', gradient: 'from-cyan-500 to-teal-400', accentColor: '#0891B2', photo: 'photo-1559592413-7cec4d0cae2b', bestTime: 'May - Oct', budget: 'USD 100-350/day', language: 'English, Fijian, Hindi', currency: 'FJD', vibes: ['Resorts', 'Family', 'Marina'],
    heroDescription: 'Denarau Island is Fiji\'s purpose-built resort strip, a man-made peninsula of international hotel chains, golf, and a marina that launches boats to the Mamanuca islands.',
    description: 'It suits families wanting resort convenience with the outer islands still just a short ferry away.',
    highlights: ['Port Denarau Marina', 'Denarau golf course', 'Fiji Marriott lagoon pool', 'Sofitel private beach', 'Sunset catamaran cruise', 'South Sea Island day trip', 'Cloud 9 floating platform', 'Fijian cultural show', 'Kids\' water park', 'Inter-island ferry hub'],
  },
  {
    slug: 'suva', name: 'Suva', country: 'Fiji', flag: '🇫🇯', tagline: 'Fiji\'s Capital', gradient: 'from-emerald-700 to-slate-500', accentColor: '#047857', photo: 'photo-1571406252241-db0280bd36cd', bestTime: 'May - Oct', budget: 'USD 50-180/day', language: 'English, Fijian, Hindi', currency: 'FJD', vibes: ['Capital', 'Local life', 'Markets'],
    heroDescription: 'Suva is Fiji\'s real capital, a working port city with colonial buildings, a lively municipal market, and none of the polish of the resort strips — a useful counterweight for travellers who want to see Fijian daily life.',
    description: 'It is more humid and more rain-prone than the west coast, but the museum and market are genuinely worth a detour.',
    highlights: ['Fiji Museum', 'Thurston Botanical Gardens', 'Suva Municipal Market', 'Grand Pacific Hotel', 'Colo-i-Suva Forest Park', 'Suva Curio & Handicraft Centre', 'Albert Park', 'Suva Point seawall', 'Government Buildings', 'Suva Cathedral'],
  },
  {
    slug: 'taveuni', name: 'Taveuni', country: 'Fiji', flag: '🇫🇯', tagline: 'Garden Island', gradient: 'from-emerald-800 to-cyan-500', accentColor: '#065F46', photo: 'photo-1590674899484-d5640e854abe', bestTime: 'May - Oct', budget: 'USD 70-250/day', language: 'English, Fijian', currency: 'FJD', vibes: ['Diving', 'Rainforest', 'Off the beaten path'],
    heroDescription: 'Taveuni is Fiji\'s "Garden Island," a rainforest-covered volcanic outcrop straddling the international date line, prized by divers for the soft-coral walls of Rainbow Reef.',
    description: 'It stays wonderfully undeveloped — waterfalls, hiking trails, and dive shops rather than resort strips.',
    highlights: ['Bouma National Heritage Park', 'Tavoro Waterfalls', 'Waitavala natural water slide', 'Rainbow Reef diving', 'Lavena Coastal Walk', 'Taveuni Forest Reserve', 'Vuna Lagoon', 'International Date Line marker', 'Waitabu Marine Park', 'Somosomo village visit'],
  },

  // ===================== SEYCHELLES (new) =====================
  {
    slug: 'mahe', name: 'Mahé', country: 'Seychelles', flag: '🇸🇨', tagline: 'Main Island', gradient: 'from-emerald-600 to-cyan-500', accentColor: '#059669', photo: 'photo-1559826555-74c80bc3e7e2', bestTime: 'Apr - May, Oct - Nov', budget: 'USD 150-450/day', language: 'Seychellois Creole, English, French', currency: 'SCR', vibes: ['Beaches', 'Rainforest', 'Luxury'],
    heroDescription: 'Mahé is the largest and most developed Seychelles island, its granite peaks covered in rainforest and ringed by beaches regularly ranked among the world\'s best.',
    description: 'Most trips use it as the arrival hub before island-hopping to Praslin and La Digue, but Beau Vallon and the Morne Seychellois hikes justify a couple of nights on their own.',
    highlights: ['Victoria Market', 'Mission Lodge viewpoint', 'Beau Vallon Beach', 'Sans Souci Forest', 'Anse Intendance', 'Victoria Botanical Gardens', 'Morne Seychellois National Park hike', 'Le Jardin du Roi spice garden', 'Takamaka Rum Distillery', 'Sainte Anne Marine Park boat trip'],
  },
  {
    slug: 'praslin', name: 'Praslin', country: 'Seychelles', flag: '🇸🇨', tagline: 'Coco de Mer Island', gradient: 'from-teal-600 to-emerald-500', accentColor: '#0D9488', photo: 'photo-1573408301185-9519eb7ef241', bestTime: 'Apr - May, Oct - Nov', budget: 'USD 150-450/day', language: 'Seychellois Creole, English, French', currency: 'SCR', vibes: ['Beaches', 'Nature reserve', 'Quiet'],
    heroDescription: 'Praslin is home to the Vallée de Mai, a UNESCO-listed primeval palm forest sheltering the giant coco de mer nut, plus two beaches — Anse Lazio and Anse Georgette — regularly named among the finest on earth.',
    description: 'It moves at a slower pace than Mahé, with most days built around one beach and one forest walk.',
    highlights: ['Vallée de Mai (coco de mer palms)', 'Anse Lazio beach', 'Anse Georgette', 'Curieuse Island giant tortoises', 'Fond Ferdinand nature reserve', 'Anse Volbert', 'Praslin National Park hike', "Côte d'Or lagoon", 'Grand Anse', 'Glass-bottom boat snorkel trip'],
  },
  {
    slug: 'la-digue', name: 'La Digue', country: 'Seychelles', flag: '🇸🇨', tagline: 'Bicycle Island', gradient: 'from-cyan-600 to-teal-500', accentColor: '#0891B2', photo: 'photo-1559592413-7cec4d0cae2b', bestTime: 'Apr - May, Oct - Nov', budget: 'USD 140-420/day', language: 'Seychellois Creole, English, French', currency: 'SCR', vibes: ['Beaches', 'Cycling', 'Slow travel'],
    heroDescription: 'La Digue has almost no cars, so most people get around this granite-boulder island by bicycle or ox-cart, past the postcard beach of Anse Source d\'Argent.',
    description: 'Rent a bike at the jetty and treat the whole island as a slow, half-day loop between beaches.',
    highlights: ["L'Union Estate & Anse Source d'Argent", 'Ox-cart and bicycle rides', 'Grand Anse La Digue', 'Veuve Nature Reserve', 'Anse Cocos', 'La Digue Vanilla Plantation', "Nid d'Aigle viewpoint", 'Anse Patates', 'Island bicycle loop', 'Félicité Island day trip'],
  },

  // ===================== CUBA (new) =====================
  {
    slug: 'havana', name: 'Havana', country: 'Cuba', flag: '🇨🇺', tagline: 'Time-Capsule Capital', gradient: 'from-rose-600 to-sky-500', accentColor: '#E11D48', photo: 'photo-1533089860892-a7c6f0a88666', bestTime: 'Nov - Apr', budget: 'USD 50-150/day', language: 'Spanish', currency: 'CUP', vibes: ['Retro', 'Music', 'Architecture'],
    heroDescription: 'Havana is frozen and vivid all at once — 1950s American convertibles cruising past crumbling Spanish-colonial facades, live son music on every second corner, and a Malecón seafront that fills up every evening.',
    description: 'Cash and connectivity are both limited, so plan ahead: bring US dollars or euros to exchange, and treat a classic-car tour of Old Havana as day one.',
    highlights: ['Old Havana (Habana Vieja)', 'Malecón seafront', 'Classic convertible car tour', 'Plaza de la Catedral', 'Fábrica de Arte Cubano', 'El Capitolio', 'Callejón de Hamel', 'Hotel Nacional de Cuba', 'Fusterlandia', 'Partagás cigar factory tour'],
  },
  {
    slug: 'varadero', name: 'Varadero', country: 'Cuba', flag: '🇨🇺', tagline: 'All-Inclusive Beach', gradient: 'from-cyan-500 to-sky-300', accentColor: '#06B6D4', photo: 'photo-1559592413-7cec4d0cae2b', bestTime: 'Nov - Apr', budget: 'USD 70-220/day', language: 'Spanish', currency: 'CUP', vibes: ['Beach', 'Resorts', 'Relaxation'],
    heroDescription: 'Varadero is Cuba\'s resort peninsula, a 20-kilometre stretch of white sand lined almost entirely with all-inclusive hotels, popular with travellers who want beach time without organising the logistics of the rest of the country.',
    description: 'It is the easiest, most predictable Cuban beach base, with day trips to caves and cenotes breaking up the resort routine.',
    highlights: ['Varadero Beach', 'Bellamar Caves', 'Josone Park', 'Varadero Golf Club', 'Xanadu Mansion', 'Saturno Cave cenote', 'Catamaran sunset cruise', 'Delfinario dolphin show', 'Plaza América', 'Hicacos Peninsula'],
  },
  {
    slug: 'trinidad', name: 'Trinidad', country: 'Cuba', flag: '🇨🇺', tagline: 'Colonial Time Capsule', gradient: 'from-amber-600 to-rose-500', accentColor: '#D97706', photo: 'photo-1533089860892-a7c6f0a88666', bestTime: 'Nov - Apr', budget: 'USD 45-140/day', language: 'Spanish', currency: 'CUP', vibes: ['Colonial', 'Cobblestones', 'Music'],
    heroDescription: 'Trinidad is Cuba\'s best-preserved colonial town, a UNESCO site of cobblestone streets and pastel mansions built on sugar-plantation wealth, with live music around Plaza Mayor most evenings.',
    description: 'Pair the old town with the Valley of the Sugar Mills and a day at nearby Playa Ancón for a complete slice of central Cuba.',
    highlights: ['Plaza Mayor', 'Museo Romántico', 'Valley of the Sugar Mills (Valle de los Ingenios)', 'Manaca Iznaga Tower', 'Playa Ancón', 'Topes de Collantes hike', 'Casa de la Música steps', 'Cobblestone Calle Real', 'Sierra del Escambray', 'Horseback tobacco farm tour'],
  },
  {
    slug: 'vinales', name: 'Viñales', country: 'Cuba', flag: '🇨🇺', tagline: 'Tobacco Valley', gradient: 'from-emerald-700 to-amber-500', accentColor: '#047857', photo: 'photo-1502989642968-94fbdc9b4bce', bestTime: 'Nov - Apr', budget: 'USD 40-130/day', language: 'Spanish', currency: 'CUP', vibes: ['Countryside', 'Tobacco farms', 'Slow travel'],
    heroDescription: 'Viñales is Cuba\'s rural heartland, a valley of limestone mogote hills and red-earth tobacco farms where the country\'s finest cigars are still hand-rolled on the family farms that grow the leaf.',
    description: 'A horseback or jeep tour through the valley, ending at a working farm for a rolling demonstration, is the standard and best way to see it.',
    highlights: ['Viñales Valley mogotes', 'Mural de la Prehistoria', 'Tobacco farm & cigar-rolling demo', 'Cueva del Indio', 'Los Jazmines viewpoint', 'Gran Caverna de Santo Tomás', 'El Palenque de los Cimarrones', 'Oxen-plough farm walk', 'Sunset horseback ride', 'Casa de Don Tomás'],
  },

  // ===================== COLOMBIA (new) =====================
  {
    slug: 'bogota', name: 'Bogotá', country: 'Colombia', flag: '🇨🇴', tagline: 'Andean Capital', gradient: 'from-amber-700 to-slate-600', accentColor: '#B45309', photo: 'photo-1533089860892-a7c6f0a88666', bestTime: 'Dec - Mar, Jul - Aug', budget: 'USD 40-130/day', language: 'Spanish', currency: 'COP', vibes: ['Culture', 'Street art', 'High-altitude'],
    heroDescription: 'Bogotá sits at 2,600 metres in the Andes, a sprawling capital where colonial La Candelaria, world-class gold and Botero museums, and a cable car up Monserrate all sit within reach of each other.',
    description: 'Acclimatise for a day before Monserrate\'s altitude, and don\'t skip the Sunday market at Usaquén or a Zipaquirá salt cathedral day trip.',
    highlights: ['La Candelaria', 'Monserrate', 'Gold Museum (Museo del Oro)', 'Botero Museum', 'Plaza de Bolívar', 'Usaquén Sunday market', 'Zipaquirá Salt Cathedral day trip', 'Paloquemao Market', 'La Puerta Falsa', 'Graffiti street art tour'],
  },
  {
    slug: 'cartagena', name: 'Cartagena', country: 'Colombia', flag: '🇨🇴', tagline: 'Walled Caribbean Jewel', gradient: 'from-orange-600 to-cyan-400', accentColor: '#EA580C', photo: 'photo-1559826555-74c80bc3e7e2', bestTime: 'Dec - Apr', budget: 'USD 50-160/day', language: 'Spanish', currency: 'COP', vibes: ['Colonial', 'Caribbean', 'Colourful'],
    heroDescription: 'Cartagena is a UNESCO-listed walled city on the Caribbean coast, its balconied streets painted in every colour and its ramparts built to fend off pirates and English fleets.',
    description: 'Walk the Ciudad Amurallada in the cool morning, then take a boat to the Rosario Islands to escape the afternoon heat.',
    highlights: ['Walled City (Ciudad Amurallada)', 'Getsemaní street art', 'Castillo San Felipe de Barajas', 'Rosario Islands boat trip', 'Café del Mar sunset', 'Palacio de la Inquisición', 'Bocagrande beach', 'Las Bóvedas', 'Plaza Santo Domingo', 'Totumo mud volcano'],
  },
  {
    slug: 'medellin', name: 'Medellín', country: 'Colombia', flag: '🇨🇴', tagline: 'City of Eternal Spring', gradient: 'from-emerald-600 to-amber-500', accentColor: '#059669', photo: 'photo-1516905041604-7f3f4b1ef50c', bestTime: 'Dec - Mar', budget: 'USD 35-120/day', language: 'Spanish', currency: 'COP', vibes: ['Innovation', 'Nightlife', 'Mountain views'],
    heroDescription: 'Medellín has transformed from its troubled past into a hillside city known for a public cable-car transit system, outdoor escalators through the once-notorious Comuna 13, and a genuinely warm climate year-round.',
    description: 'The Comuna 13 graffiti tour is the essential orientation, and Guatapé\'s rainbow-coloured lakeside town makes for a full-day trip.',
    highlights: ['Comuna 13 graffiti tour & escalators', 'Metrocable ride', 'Plaza Botero', 'Parque Arví', 'Pueblito Paisa', 'Guatapé & El Peñol day trip', 'Botanical Garden', 'Jardín del Té', 'Parque Lleras nightlife', 'Museum of Antioquia'],
  },
  {
    slug: 'san-andres', name: 'San Andrés', country: 'Colombia', flag: '🇨🇴', tagline: 'Caribbean Island Escape', gradient: 'from-cyan-500 to-teal-400', accentColor: '#06B6D4', photo: 'photo-1573408301185-9519eb7ef241', bestTime: 'Dec - Apr', budget: 'USD 55-170/day', language: 'Spanish, English Creole', currency: 'COP', vibes: ['Beach', 'Snorkelling', 'Island'],
    heroDescription: 'San Andrés is a Colombian island closer to Nicaragua than to the mainland, known locally as the "Sea of Seven Colours" for its bands of turquoise water and easy snorkelling reefs.',
    description: 'It is compact enough to circle by golf cart in a day, with Johnny Cay and the blowhole at Hoyo Soplador as the standout stops.',
    highlights: ['Johnny Cay', 'Spratt Bight Beach', 'Hoyo Soplador blowhole', 'West View snorkelling', 'San Luis Beach', 'La Piscinita', 'El Cove', "Morgan's Cave", 'San Andrés golf cart island tour', 'Acuario & Haynes Cay'],
  },
  {
    slug: 'santa-marta', name: 'Santa Marta', country: 'Colombia', flag: '🇨🇴', tagline: 'Gateway to Tayrona', gradient: 'from-emerald-700 to-cyan-500', accentColor: '#047857', photo: 'photo-1590674899484-d5640e854abe', bestTime: 'Dec - Mar', budget: 'USD 40-140/day', language: 'Spanish', currency: 'COP', vibes: ['Beaches', 'Jungle', 'Trekking'],
    heroDescription: 'Santa Marta is the launchpad for Tayrona National Park\'s jungle-backed beaches and the multi-day trek to the Lost City (Ciudad Perdida), a pre-Columbian ruin older than Machu Picchu.',
    description: 'Balance a beach day at Tayrona with the cooler hills of Minca before deciding whether to commit to the Lost City trek.',
    highlights: ['Tayrona National Park', 'Lost City (Ciudad Perdida) trek', 'Minca cloud forest', 'Rodadero Beach', 'Cabo San Juan', 'Historic centre & Simón Bolívar house', 'Palomino tubing', 'Playa Cristal', 'Quinta de San Pedro Alejandrino', 'Taganga fishing village'],
  },

  // ===================== CHILE (new) =====================
  {
    slug: 'santiago', name: 'Santiago', country: 'Chile', flag: '🇨🇱', tagline: 'Andes Backdrop Capital', gradient: 'from-slate-700 to-amber-500', accentColor: '#334155', photo: 'photo-1502989642968-94fbdc9b4bce', bestTime: 'Sep - Nov, Mar - May', budget: 'USD 45-140/day', language: 'Spanish', currency: 'CLP', vibes: ['Wine', 'Mountains', 'Urban'],
    heroDescription: 'Santiago sits in a valley with the snow-capped Andes as a permanent backdrop, a modern capital that doubles as the gateway to Chile\'s wine valleys and the Pacific coast.',
    description: 'Ride the funicular up Cerro San Cristóbal for the skyline-and-mountains view, then day-trip to Valparaíso or the Cajón del Maipo canyon.',
    highlights: ['Cerro San Cristóbal', 'Plaza de Armas', "La Chascona (Neruda's house)", 'Mercado Central', 'Bellavista neighbourhood', 'Costanera Center Sky Costanera', 'Cajón del Maipo day trip', 'Palacio de La Moneda', 'Barrio Lastarria', 'Valparaíso day trip combo'],
  },
  {
    slug: 'san-pedro-de-atacama', name: 'San Pedro de Atacama', country: 'Chile', flag: '🇨🇱', tagline: 'World\'s Driest Desert', gradient: 'from-orange-700 to-rose-500', accentColor: '#C2410C', photo: 'photo-1548013146-72479768bada', bestTime: 'Oct - Feb', budget: 'USD 50-180/day', language: 'Spanish', currency: 'CLP', vibes: ['Desert', 'Stargazing', 'Geysers'],
    heroDescription: 'San Pedro de Atacama is a small adobe town on the edge of the driest non-polar desert on earth, used as the base for moon-like salt flats, high-altitude geysers, and some of the clearest night skies anywhere.',
    description: 'The Tatio Geysers require a 4am start, so build in a rest afternoon at the Cejar lagoon or a stargazing tour to balance it.',
    highlights: ['Valle de la Luna', 'Tatio Geysers at dawn', 'Laguna Cejar', 'Salar de Atacama flamingo watching', 'Piedras Rojas', 'San Pedro village church', 'ALMA Observatory stargazing tour', 'Laguna Chaxa', 'Machuca village', 'Puritama Hot Springs'],
  },
  {
    slug: 'valparaiso', name: 'Valparaíso', country: 'Chile', flag: '🇨🇱', tagline: 'Hillside Street Art Port', gradient: 'from-rose-600 to-cyan-500', accentColor: '#E11D48', photo: 'photo-1533089860892-a7c6f0a88666', bestTime: 'Sep - Nov, Mar - May', budget: 'USD 40-130/day', language: 'Spanish', currency: 'CLP', vibes: ['Street art', 'Bohemian', 'Coastal'],
    heroDescription: 'Valparaíso tumbles down a run of steep hills to the Pacific in a jumble of colourful houses, funiculars, and some of South America\'s best street art, earning it UNESCO status and a devoted following among artists.',
    description: 'Ride the historic funiculars between hills, and don\'t plan too tightly — getting pleasantly lost is the point.',
    highlights: ['Cerro Alegre & Cerro Concepción funiculars', 'Street art walking tour', "La Sebastiana (Neruda's house)", 'Muelle Prat', 'Paseo Yugoslavo', 'Mercado Puerto', 'Plaza Sotomayor', 'Colourful hillside houses', 'Naval Museum', 'Viña del Mar day trip'],
  },
  {
    slug: 'puerto-varas', name: 'Puerto Varas', country: 'Chile', flag: '🇨🇱', tagline: 'Chilean Lake District', gradient: 'from-emerald-700 to-sky-500', accentColor: '#047857', photo: 'photo-1502989642968-94fbdc9b4bce', bestTime: 'Nov - Mar', budget: 'USD 45-150/day', language: 'Spanish, German', currency: 'CLP', vibes: ['Lakes', 'Volcanoes', 'German heritage'],
    heroDescription: 'Puerto Varas sits on Lake Llanquihue with the perfect cone of Osorno Volcano across the water, its German-colonial architecture a legacy of 19th-century settlers.',
    description: 'It is the base for Vicente Pérez Rosales National Park and the boat-and-bus crossing to Bariloche in Argentina, one of the most scenic border crossings in South America.',
    highlights: ['Lake Llanquihue', 'Osorno Volcano viewpoint', 'Petrohué Waterfalls', 'Todos los Santos Lake boat crossing', 'Vicente Pérez Rosales National Park', 'German colonial architecture walk', 'Frutillar lakeside town', 'Saltos del Petrohué', 'Puerto Varas Casino & waterfront', 'Chiloé day trip'],
  },
  {
    slug: 'easter-island', name: 'Easter Island', country: 'Chile', flag: '🇨🇱', tagline: 'Land of the Moai', gradient: 'from-amber-700 to-cyan-500', accentColor: '#B45309', photo: 'photo-1590674899484-d5640e854abe', bestTime: 'Oct - Apr', budget: 'USD 90-280/day', language: 'Rapa Nui, Spanish', currency: 'CLP', vibes: ['Ancient history', 'Remote', 'Volcanic'],
    heroDescription: 'Easter Island (Rapa Nui) is one of the most isolated inhabited islands on earth, its cliffs and grassy volcanic craters dotted with the nearly 900 stone moai carved by its Polynesian settlers.',
    description: 'A rental car or guided tour covering Rano Raraku (the quarry) and Ahu Tongariki (the famous 15-moai row) at sunrise is the trip\'s centrepiece.',
    highlights: ['Rano Raraku moai quarry', 'Ahu Tongariki (15 moai)', 'Rano Kau volcano crater', 'Orongo ceremonial village', 'Anakena Beach', 'Ahu Akivi', 'Puna Pau red-stone quarry', 'Te Pito Kura', 'Tahai Ceremonial Complex sunset', 'Vaihu ahu ruins'],
  },

  // ===================== COSTA RICA (new) =====================
  {
    slug: 'san-jose', name: 'San José', country: 'Costa Rica', flag: '🇨🇷', tagline: 'Central Valley Capital', gradient: 'from-emerald-700 to-amber-500', accentColor: '#047857', photo: 'photo-1502989642968-94fbdc9b4bce', bestTime: 'Dec - Apr', budget: 'USD 45-140/day', language: 'Spanish', currency: 'CRC', vibes: ['Coffee', 'Volcanoes', 'Gateway'],
    heroDescription: 'San José is Costa Rica\'s low-rise capital in the Central Valley, more a practical base and coffee-culture stop than a headline destination, with active volcanoes an hour away in either direction.',
    description: 'Most travellers spend one or two nights here before heading to Arenal or Manuel Antonio, using the time for the National Theatre and a Poás Volcano day trip.',
    highlights: ['Teatro Nacional', 'Central Market', 'Museo del Oro Precolombino', 'Barrio Escalante food scene', 'Poás Volcano day trip', 'San José Cathedral', 'Jade Museum', 'La Sabana Park', 'Irazú Volcano day trip', 'Cartago Basilica day trip'],
  },
  {
    slug: 'la-fortuna', name: 'La Fortuna', country: 'Costa Rica', flag: '🇨🇷', tagline: 'Arenal Volcano Town', gradient: 'from-emerald-700 to-slate-600', accentColor: '#047857', photo: 'photo-1502989642968-94fbdc9b4bce', bestTime: 'Dec - Apr', budget: 'USD 50-160/day', language: 'Spanish', currency: 'CRC', vibes: ['Volcano', 'Hot springs', 'Adventure'],
    heroDescription: 'La Fortuna sits in the shadow of the near-perfect cone of Arenal Volcano, its slopes dotted with hot springs and hanging bridges that make it Costa Rica\'s most popular adventure base.',
    description: 'Split time between an Arenal Volcano hike, a hanging-bridges canopy walk, and an evening soak at Tabacón\'s thermal pools.',
    highlights: ['Arenal Volcano viewpoint', 'Arenal Hanging Bridges', 'La Fortuna Waterfall', 'Tabacón Hot Springs', 'Arenal Lake kayaking', 'Mistico Park', 'Cerro Chato hike', 'Ecocentro Danaus', 'ATV volcano tour', 'Río Celeste day trip'],
  },
  {
    slug: 'manuel-antonio', name: 'Manuel Antonio', country: 'Costa Rica', flag: '🇨🇷', tagline: 'Rainforest Meets Beach', gradient: 'from-emerald-800 to-cyan-500', accentColor: '#065F46', photo: 'photo-1590674899484-d5640e854abe', bestTime: 'Dec - Apr', budget: 'USD 55-180/day', language: 'Spanish', currency: 'CRC', vibes: ['Beach', 'Wildlife', 'National park'],
    heroDescription: 'Manuel Antonio is where Costa Rica\'s rainforest runs straight into the Pacific, its compact national park packing sloths, monkeys, and iguanas onto trails that end at some of the country\'s best beaches.',
    description: 'Book a national park entry slot early morning for the best wildlife spotting before the afternoon heat and crowds build up.',
    highlights: ['Manuel Antonio National Park', 'Playa Espadilla', 'Sloth spotting canopy walk', 'Playa Manuel Antonio', 'Catamaran sunset cruise with dolphins', 'Rainmaker Park', 'Playa Biesanz', 'Damas Island mangrove tour', 'Ziplining canopy tour', 'Punta Catedral viewpoint'],
  },
  {
    slug: 'monteverde', name: 'Monteverde', country: 'Costa Rica', flag: '🇨🇷', tagline: 'Cloud Forest', gradient: 'from-emerald-800 to-slate-500', accentColor: '#065F46', photo: 'photo-1502989642968-94fbdc9b4bce', bestTime: 'Dec - Apr', budget: 'USD 50-170/day', language: 'Spanish', currency: 'CRC', vibes: ['Cloud forest', 'Wildlife', 'Ziplining'],
    heroDescription: 'Monteverde is a misty cloud forest reserve founded by Quaker settlers, home to resplendent quetzals, hanging bridges above the canopy, and some of Central America\'s best ziplining.',
    description: 'Book a guided dawn walk for the best chance at wildlife, and save the adrenaline zipline circuits for the afternoon.',
    highlights: ['Monteverde Cloud Forest Reserve', 'Selvatura hanging bridges & zipline', 'Santa Elena Reserve', 'Curi-Cancha Reserve birdwatching', 'Monteverde Butterfly Garden', 'Night Walk wildlife tour', 'Ficus tree walk', 'Coffee-Chocolate-Sugar tour', 'Bat Jungle', 'Orchid Garden'],
  },

  // ===================== LAOS (new) =====================
  {
    slug: 'vientiane', name: 'Vientiane', country: 'Laos', flag: '🇱🇦', tagline: 'Sleepy Riverside Capital', gradient: 'from-amber-600 to-rose-500', accentColor: '#D97706', photo: 'photo-1528181304800-259b08848526', bestTime: 'Nov - Feb', budget: 'USD 30-90/day', language: 'Lao', currency: 'LAK', vibes: ['Temples', 'Relaxed', 'Riverside'],
    heroDescription: 'Vientiane is one of Southeast Asia\'s smallest and quietest capitals, a low-rise riverside town of golden stupas and French-colonial buildings on the banks of the Mekong.',
    description: 'A day is usually enough to cover the temples and the Mekong promenade before moving on to Luang Prabang or Vang Vieng.',
    highlights: ['Pha That Luang', 'Patuxai monument', 'Wat Sisaket', 'Buddha Park (Xieng Khuan)', 'Talat Sao morning market', 'COPE Visitor Centre', 'Mekong riverside promenade', 'Wat Si Muang', 'Presidential Palace', 'Night market food stalls'],
  },
  {
    slug: 'luang-prabang', name: 'Luang Prabang', country: 'Laos', flag: '🇱🇦', tagline: 'UNESCO Temple Town', gradient: 'from-amber-700 to-emerald-500', accentColor: '#B45309', photo: 'photo-1528181304800-259b08848526', bestTime: 'Nov - Feb', budget: 'USD 35-110/day', language: 'Lao', currency: 'LAK', vibes: ['Monks', 'Waterfalls', 'Heritage'],
    heroDescription: 'Luang Prabang is a UNESCO World Heritage town at the meeting of the Mekong and Nam Khan rivers, its gilded temples and saffron-robed monks setting a pace that has barely changed in decades.',
    description: 'Rise before dawn for the alms-giving ceremony, then spend the heat of the day cooling off at Kuang Si Falls\' turquoise pools.',
    highlights: ['Kuang Si Falls', 'Mount Phousi sunset', 'Alms-giving ceremony (Tak Bat)', 'Royal Palace Museum', 'Wat Xieng Thong', 'Luang Prabang night market', 'Pak Ou Caves boat trip', 'Mekong sunset cruise', 'Living Land Farm', 'UXO Lao Visitor Centre'],
  },
  {
    slug: 'vang-vieng', name: 'Vang Vieng', country: 'Laos', flag: '🇱🇦', tagline: 'Karst River Valley', gradient: 'from-emerald-700 to-cyan-500', accentColor: '#047857', photo: 'photo-1590674899484-d5640e854abe', bestTime: 'Nov - Feb', budget: 'USD 25-90/day', language: 'Lao', currency: 'LAK', vibes: ['Adventure', 'Rivers', 'Limestone karst'],
    heroDescription: 'Vang Vieng sits in a valley of dramatic limestone karsts along the Nam Song River, once known purely for riverside tubing parties and now equally popular for hot-air balloon sunrises and cave-and-lagoon day trips.',
    description: 'Balance one adventure-heavy day (kayaking, caving) with one slow day taking in the karst views from a riverside cafe.',
    highlights: ['Blue Lagoon tubing', 'Nam Song River kayaking', 'Tham Chang Cave', 'Hot air balloon sunrise', 'Pha Ngern viewpoint hike', 'Tham Poukham cave lagoon', 'Countryside cycling tour', 'Organic Mulberry Farm', 'Nam Xay Viewpoint', 'Riverside bamboo bridge'],
  },

  // ===================== MYANMAR (new) =====================
  {
    slug: 'yangon', name: 'Yangon', country: 'Myanmar', flag: '🇲🇲', tagline: 'City of Golden Pagodas', gradient: 'from-amber-700 to-rose-500', accentColor: '#B45309', photo: 'photo-1528181304800-259b08848526', bestTime: 'Nov - Feb', budget: 'USD 30-100/day', language: 'Burmese', currency: 'MMK', vibes: ['Pagodas', 'Colonial', 'Markets'],
    heroDescription: 'Yangon is dominated by the gold-plated spire of Shwedagon Pagoda, glowing over a city that still runs colonial-era trams and a circular commuter train through its downtown markets.',
    description: 'Visit Shwedagon at both sunset and after dark, since the changing light on the gold stupa is the city\'s single best experience.',
    highlights: ['Shwedagon Pagoda', 'Sule Pagoda', 'Yangon Circular Train', 'Bogyoke Aung San Market', 'Chauk Htat Gyi reclining Buddha', 'Colonial downtown walking tour', 'Kandawgyi Lake', 'Botataung Pagoda', 'National Museum of Myanmar', 'Karaweik Palace'],
  },
  {
    slug: 'bagan', name: 'Bagan', country: 'Myanmar', flag: '🇲🇲', tagline: 'Plain of 2,000 Temples', gradient: 'from-orange-700 to-amber-400', accentColor: '#C2410C', photo: 'photo-1528181304800-259b08848526', bestTime: 'Nov - Feb', budget: 'USD 35-120/day', language: 'Burmese', currency: 'MMK', vibes: ['Temples', 'Sunrise', 'Ancient'],
    heroDescription: 'Bagan scatters more than two thousand Buddhist temples and stupas across a dusty plain beside the Irrawaddy River, a skyline best seen from a hot-air balloon at first light or an e-bike at dusk.',
    description: 'A sunrise balloon ride is the signature experience, but a full day of temple-hopping by horse-cart or e-bike is just as rewarding and far cheaper.',
    highlights: ['Sunrise balloon ride over the temples', 'Ananda Temple', 'Shwesandaw Pagoda sunset', 'Horse-cart temple tour', 'Bagan Archaeological Museum', 'Dhammayangyi Temple', 'Irrawaddy River sunset cruise', 'Mount Popa day trip', 'Nyaung-U morning market', 'Lacquerware workshop visit'],
  },
  {
    slug: 'mandalay', name: 'Mandalay', country: 'Myanmar', flag: '🇲🇲', tagline: 'Last Royal Capital', gradient: 'from-rose-700 to-amber-500', accentColor: '#BE123C', photo: 'photo-1528181304800-259b08848526', bestTime: 'Nov - Feb', budget: 'USD 30-100/day', language: 'Burmese', currency: 'MMK', vibes: ['Royal history', 'Monasteries', 'Riverside'],
    heroDescription: 'Mandalay was Burma\'s last royal capital before British annexation, and it still holds the country\'s largest monastic population, the world\'s longest teak footbridge, and a moated royal palace.',
    description: 'Cross U Bein Bridge at sunset for the classic silhouette shot, then explore Sagaing\'s hilltop monasteries the following morning.',
    highlights: ['Mandalay Hill sunset', 'Mahamuni Buddha Temple', 'U Bein Bridge at Amarapura', "Kuthodaw Pagoda (world's largest book)", 'Mandalay Palace', 'Sagaing Hill monasteries', 'Shwenandaw Monastery', 'Mandalay moat walk', 'Gold-leaf workshop', 'Ava (Inwa) ancient city day trip'],
  },
  {
    slug: 'inle-lake', name: 'Inle Lake', country: 'Myanmar', flag: '🇲🇲', tagline: 'Floating Villages', gradient: 'from-emerald-700 to-cyan-500', accentColor: '#047857', photo: 'photo-1590674899484-d5640e854abe', bestTime: 'Nov - Feb', budget: 'USD 30-110/day', language: 'Burmese, Shan', currency: 'MMK', vibes: ['Floating villages', 'Weaving', 'Lake life'],
    heroDescription: 'Inle Lake is home to Intha fishermen who row standing on one leg, stilt-house villages, and floating vegetable gardens that make a full-day boat tour the only way to see it properly.',
    description: 'Hire a long-tail boat for a full day to combine the weaving villages, temples, and market stops around the lake.',
    highlights: ['Floating gardens boat tour', 'Indein village & pagoda ruins', 'Leg-rowing fishermen', 'In Phaw Khone weaving village', 'Nga Phe Chaung Monastery', 'Phaung Daw Oo Pagoda', 'Red Mountain Estate vineyard', 'Maing Thauk stilt village', 'Kaung Daing hot springs', 'Inthein market'],
  },
  {
    slug: 'ngapali-beach', name: 'Ngapali Beach', country: 'Myanmar', flag: '🇲🇲', tagline: 'Untouched Bay of Bengal Coast', gradient: 'from-cyan-500 to-amber-400', accentColor: '#06B6D4', photo: 'photo-1573408301185-9519eb7ef241', bestTime: 'Nov - Mar', budget: 'USD 40-140/day', language: 'Burmese', currency: 'MMK', vibes: ['Beach', 'Fishing villages', 'Quiet'],
    heroDescription: 'Ngapali Beach is Myanmar\'s quietest, least-developed beach escape on the Bay of Bengal, backed by fishing villages rather than high-rises.',
    description: 'Days here run on beach time and fresh seafood, with a village walk or snorkelling trip as the only real agenda items.',
    highlights: ['Ngapali main beach', 'Lin Thar village walk', 'Pae Village fishing boats', 'Sunset horseback ride', 'Snorkelling boat trip', 'Nga Yoke Kaung Pagoda', 'Sandoway coastal drive', 'Seafood BBQ dinner on the beach', 'Thandwe local market', 'Catamaran sunset cruise'],
  },

  // ===================== SAUDI ARABIA (new) =====================
  {
    slug: 'riyadh', name: 'Riyadh', country: 'Saudi Arabia', flag: '🇸🇦', tagline: 'Modern Desert Capital', gradient: 'from-amber-700 to-slate-700', accentColor: '#B45309', photo: 'photo-1548013146-72479768bada', bestTime: 'Nov - Mar', budget: 'USD 60-200/day', language: 'Arabic', currency: 'SAR', vibes: ['Modern', 'Heritage', 'Desert'],
    heroDescription: 'Riyadh mixes glass-tower skyline with the mudbrick fort where the Saudi state began, and it has opened rapidly to tourism in recent years with new museums, entertainment districts, and desert drives.',
    description: 'Combine the Edge of the World desert drive with a walk through the restored Diriyah district for old and new Riyadh in one trip.',
    highlights: ['Kingdom Centre Sky Bridge', 'Masmak Fortress', 'Diriyah historical district', 'Edge of the World cliff drive', 'National Museum of Saudi Arabia', 'Boulevard Riyadh City', 'Wadi Hanifah', 'Souq Al Zal', 'Murabba Palace', 'Riyadh Season events'],
  },
  {
    slug: 'jeddah', name: 'Jeddah', country: 'Saudi Arabia', flag: '🇸🇦', tagline: 'Gateway to Mecca', gradient: 'from-cyan-700 to-amber-500', accentColor: '#0E7490', photo: 'photo-1573408301185-9519eb7ef241', bestTime: 'Nov - Mar', budget: 'USD 55-190/day', language: 'Arabic', currency: 'SAR', vibes: ['Red Sea', 'Historic souks', 'Coastal'],
    heroDescription: 'Jeddah is Saudi Arabia\'s Red Sea gateway, historically the port for Mecca-bound pilgrims, with a UNESCO-listed old town of coral-stone merchant houses and a modern corniche lined with public art.',
    description: 'Walk Al-Balad in the evening when the old coral houses are lit up, and set aside a separate day for Red Sea diving or snorkelling.',
    highlights: ['Al-Balad historic district', 'Jeddah Corniche', "King Fahd's Fountain", 'Jeddah Floating Mosque', 'Red Sea diving day trip', 'Al Rahma Mosque', 'Fakieh Aquarium', 'Jeddah Waterfront art sculptures', 'Al Tayebat International City Museum', 'Souk Al Alawi'],
  },
  {
    slug: 'alula', name: 'AlUla', country: 'Saudi Arabia', flag: '🇸🇦', tagline: 'Arabia\'s Petra', gradient: 'from-orange-700 to-rose-500', accentColor: '#C2410C', photo: 'photo-1548013146-72479768bada', bestTime: 'Oct - Mar', budget: 'USD 80-250/day', language: 'Arabic', currency: 'SAR', vibes: ['Ancient tombs', 'Desert', 'Rock formations'],
    heroDescription: 'AlUla is home to Hegra, Saudi Arabia\'s first UNESCO World Heritage Site, where Nabatean tombs are carved directly into sandstone outcrops in a desert valley that rivals Jordan\'s Petra.',
    description: 'Book Hegra access through an official tour, and add a sunrise or sunset visit to Elephant Rock for the valley\'s other signature formation.',
    highlights: ["Hegra (Mada'in Salih) Nabatean tombs", 'Elephant Rock', 'AlUla Old Town', 'Maraya Concert Hall', 'Harrat Uwayrid escarpment drive', 'Jabal Ikmah rock inscriptions', 'Hot air balloon ride', 'Ashar Valley', 'Dadan archaeological site', 'AlUla Arts Festival venues'],
  },
  {
    slug: 'diriyah', name: 'Diriyah', country: 'Saudi Arabia', flag: '🇸🇦', tagline: 'Birthplace of the Saudi State', gradient: 'from-amber-800 to-stone-600', accentColor: '#92400E', photo: 'photo-1548013146-72479768bada', bestTime: 'Nov - Mar', budget: 'USD 60-200/day', language: 'Arabic', currency: 'SAR', vibes: ['Heritage', 'Mudbrick architecture', 'Dining'],
    heroDescription: 'Diriyah, on the edge of Riyadh, is the restored mudbrick capital where the first Saudi state was founded in 1744, now a UNESCO site paired with a fast-growing dining and arts quarter.',
    description: 'Tour At-Turaif\'s restored clay palaces in daylight, then return after dark for dinner along the Bujairi Terrace with the illuminated ruins as a backdrop.',
    highlights: ['At-Turaif UNESCO district', 'Salwa Palace ruins', 'Wadi Hanifah walking trails', 'Diriyah Gate development', 'Bujairi Terrace dining strip', 'Diriyah Museum', 'Traditional Najdi mudbrick architecture walk', 'Historic souk', 'King Abdulaziz history sites', 'Diriyah Season events'],
  },

  // ===================== NAMIBIA (new) =====================
  {
    slug: 'windhoek', name: 'Windhoek', country: 'Namibia', flag: '🇳🇦', tagline: 'Desert Capital', gradient: 'from-amber-700 to-slate-600', accentColor: '#B45309', photo: 'photo-1547471080-7cc2caa01a7e', bestTime: 'May - Oct', budget: 'USD 45-140/day', language: 'English, Afrikaans, German', currency: 'NAD', vibes: ['Colonial', 'Gateway', 'Markets'],
    heroDescription: 'Windhoek is a small, orderly capital with German colonial architecture left over from a century-old occupation, mostly used as the start and end point of a Namibian desert road trip.',
    description: 'A day covers the city comfortably before heading out to Sossusvlei or Etosha; the craft markets are the best place to buy Namibian textiles and carvings.',
    highlights: ['Christuskirche', 'Independence Memorial Museum', 'Katutura township tour', 'Windhoek Craft Market', 'Alte Feste', 'Namibia Craft Centre', 'Post Street Mall', 'Windhoek Botanic Garden', "Heroes' Acre day trip", 'Gustav Voigts Centre'],
  },
  {
    slug: 'sossusvlei', name: 'Sossusvlei', country: 'Namibia', flag: '🇳🇦', tagline: 'Red Dunes of the Namib', gradient: 'from-orange-700 to-rose-600', accentColor: '#C2410C', photo: 'photo-1548013146-72479768bada', bestTime: 'May - Oct', budget: 'USD 70-220/day', language: 'English, Afrikaans', currency: 'NAD', vibes: ['Desert', 'Dunes', 'Photography'],
    heroDescription: 'Sossusvlei sits at the heart of the Namib-Naukluft, home to some of the tallest sand dunes on earth and the ghostly white clay pan of Deadvlei, ringed by centuries-old dead camel-thorn trees.',
    description: 'Arrive before sunrise to climb Dune 45 or Big Daddy while the sand is cool, then walk out to Deadvlei before the midday heat.',
    highlights: ['Dune 45 sunrise climb', 'Deadvlei clay pan', 'Sesriem Canyon', 'Big Daddy dune hike', 'Namib-Naukluft National Park drive', 'Elim Dune', 'Hot-air balloon safari', 'Sossusvlei Lodge stargazing', 'Namib Desert quad biking', 'Solitaire village stop'],
  },
  {
    slug: 'swakopmund', name: 'Swakopmund', country: 'Namibia', flag: '🇳🇦', tagline: 'Coastal Desert Town', gradient: 'from-cyan-700 to-amber-500', accentColor: '#0E7490', photo: 'photo-1547471080-7cc2caa01a7e', bestTime: 'Nov - Mar', budget: 'USD 55-170/day', language: 'English, German, Afrikaans', currency: 'NAD', vibes: ['Adventure', 'Coastal desert', 'Wildlife'],
    heroDescription: 'Swakopmund is a Bavarian-looking seaside town where the Namib Desert\'s dunes run straight into the cold Atlantic surf, making it Namibia\'s adventure-sports capital.',
    description: 'Sandboard the dunes in the morning, then take an afternoon boat trip to see the seal colony and dolphins near Walvis Bay.',
    highlights: ['Swakopmund Jetty', 'Skeleton Coast day trip', 'Living Desert Adventure tour', 'Dune 7 sandboarding', 'Walvis Bay lagoon flamingos', 'Swakopmund Museum', 'Cape Cross seal colony day trip', 'Moon Landscape drive', 'Quad biking in the dunes', 'Swakopmund Craft Market'],
  },

  // ===================== RWANDA (new) =====================
  {
    slug: 'kigali', name: 'Kigali', country: 'Rwanda', flag: '🇷🇼', tagline: 'Land of a Thousand Hills Capital', gradient: 'from-emerald-700 to-slate-600', accentColor: '#047857', photo: 'photo-1516905041604-7f3f4b1ef50c', bestTime: 'Jun - Sep, Dec - Feb', budget: 'USD 40-140/day', language: 'Kinyarwanda, English, French', currency: 'RWF', vibes: ['History', 'Clean city', 'Coffee'],
    heroDescription: 'Kigali is one of Africa\'s cleanest, most orderly capitals, its hillside neighbourhoods anchored by the sobering Genocide Memorial that is essential to understanding modern Rwanda.',
    description: 'Give the memorial a full morning, then spend the afternoon in Nyamirambo\'s markets and coffee cooperatives before heading to the volcanoes.',
    highlights: ['Kigali Genocide Memorial', 'Kimironko Market', 'Inema Arts Center', 'Kigali Convention Centre', 'Nyamirambo neighbourhood walking tour', 'Presidential Palace Museum', 'Caplaki Craft Village', 'Kigali Genocide Memorial gardens', 'Camp Kigali Belgian memorial', 'Local coffee cooperative tour'],
  },
  {
    slug: 'musanze', name: 'Musanze', country: 'Rwanda', flag: '🇷🇼', tagline: 'Gorilla Trekking Base', gradient: 'from-emerald-800 to-slate-500', accentColor: '#065F46', photo: 'photo-1502989642968-94fbdc9b4bce', bestTime: 'Jun - Sep, Dec - Feb', budget: 'USD 100-400/day', language: 'Kinyarwanda, English, French', currency: 'RWF', vibes: ['Gorillas', 'Volcanoes', 'Trekking'],
    heroDescription: 'Musanze is the base for Volcanoes National Park, where a permit-controlled trek through bamboo forest leads to face-to-face encounters with mountain gorillas — one of the most sought-after wildlife experiences on the planet.',
    description: 'Gorilla permits must be booked well in advance and are expensive, but a golden monkey trek the following day offers a similar thrill at a fraction of the cost.',
    highlights: ['Volcanoes National Park gorilla trekking', 'Musanze Caves', 'Twin Lakes (Burera & Ruhondo)', 'Golden Monkey trekking', 'Dian Fossey tomb hike', "Iby'Iwacu Cultural Village", 'Kinigi gorilla trek briefing centre', 'Bisoke Volcano hike', 'Ngezi crater lake', 'Local Irish-potato farm walk'],
  },
  {
    slug: 'lake-kivu', name: 'Lake Kivu', country: 'Rwanda', flag: '🇷🇼', tagline: 'Great Lakes Retreat', gradient: 'from-cyan-700 to-emerald-500', accentColor: '#0E7490', photo: 'photo-1502989642968-94fbdc9b4bce', bestTime: 'Jun - Sep, Dec - Feb', budget: 'USD 50-180/day', language: 'Kinyarwanda, English, French', currency: 'RWF', vibes: ['Lake', 'Coffee', 'Slow travel'],
    heroDescription: 'Lake Kivu is one of Africa\'s Great Lakes, its shoreline towns of Gisenyi and Kibuye offering a genuinely relaxed counterpoint after days of gorilla trekking in the nearby volcanoes.',
    description: 'A day or two here, cycling the Congo Nile Trail or touring a lakeside coffee plantation, rounds out a Rwanda itinerary well.',
    highlights: ['Lake Kivu boat cruise', 'Gisenyi beach', 'Napoleon Island bat colony', 'Kibuye peninsula', 'Congo Nile Trail cycling', 'Coffee & tea plantation tour', 'Rubavu hot springs', 'Local fishing boat sunset', 'Nyungwe Forest day trip', 'Symphony of Lake Kivu music festival'],
  },

  // ===================== BAHRAIN (new) =====================
  {
    slug: 'manama', name: 'Manama', country: 'Bahrain', flag: '🇧🇭', tagline: 'Pearl of the Gulf', gradient: 'from-amber-700 to-cyan-500', accentColor: '#B45309', photo: 'photo-1548013146-72479768bada', bestTime: 'Nov - Mar', budget: 'USD 60-190/day', language: 'Arabic, English', currency: 'BHD', vibes: ['Souks', 'Modern skyline', 'Heritage'],
    heroDescription: 'Manama pairs a modern skyline of wind-tower towers with a centuries-old souk and one of the oldest inhabited forts in the Gulf, reflecting Bahrain\'s long history as a pearl-diving and trading hub.',
    description: 'A day covers the fort and souk comfortably, with the Grand Mosque and financial harbour rounding out a second half-day.',
    highlights: ['Bahrain National Museum', "Bahrain Fort (Qal'at al-Bahrain)", 'Manama Souq', 'Bab Al Bahrain', 'Al Fateh Grand Mosque', 'Bahrain World Trade Center', 'Avenues Bahrain mall', 'Bahrain Bay waterfront walk', 'Isa Cultural Centre', 'Pearl diving heritage tour'],
  },
  {
    slug: 'muharraq', name: 'Muharraq', country: 'Bahrain', flag: '🇧🇭', tagline: 'Old Pearling Capital', gradient: 'from-stone-600 to-cyan-500', accentColor: '#57534E', photo: 'photo-1548013146-72479768bada', bestTime: 'Nov - Mar', budget: 'USD 55-170/day', language: 'Arabic, English', currency: 'BHD', vibes: ['Heritage', 'Pearling history', 'Old town'],
    heroDescription: 'Muharraq was Bahrain\'s capital until the 1920s and holds the UNESCO-listed Pearling Path, a trail of restored merchant houses and oyster beds tracing the kingdom\'s pre-oil pearl-diving economy.',
    description: 'Walk the Pearling Path from Bab Al Bahrain\'s side of the causeway through restored courtyard houses to the old fort by the sea.',
    highlights: ['Sheikh Isa bin Ali House', 'Pearling Path UNESCO trail', 'Muharraq Souq', 'Arad Fort', 'Shaikh Ebrahim Center', 'Al Muharraq Cultural Hall', 'Busaad Art Gallery', 'Traditional dhow-building yard', 'Bin Matar House', "Qal'at Abu Mahir fort"],
  },

  // ===================== NEPAL (deepen) =====================
  {
    slug: 'chitwan', name: 'Chitwan', country: 'Nepal', flag: '🇳🇵', tagline: 'Jungle Safari', gradient: 'from-emerald-700 to-amber-500', accentColor: '#047857', photo: 'photo-1547471080-7cc2caa01a7e', bestTime: 'Oct - Mar', budget: 'NPR 3000-10000/day', language: 'Nepali, Tharu', currency: 'NPR', vibes: ['Wildlife', 'Jungle', 'Culture'],
    heroDescription: 'Chitwan National Park is Nepal\'s lowland jungle counterpart to the Himalayan trekking circuit, a UNESCO reserve where one-horned rhinos, wild elephants, and Bengal tigers still roam sal forest and grassland.',
    description: 'A jeep safari and a canoe ride along the Rapti River cover the wildlife highlights, while a Tharu village visit adds cultural context to the trip.',
    highlights: ['Chitwan National Park jeep safari', 'Canoe ride on Rapti River', 'Elephant breeding centre', 'Tharu cultural dance show', 'Jungle walk with a guide', 'Tharu village tour', 'Bird watching at Bishazari Tal', 'Twenty Thousand Lakes area', 'Sunset over the Rapti River', 'Gharial crocodile breeding centre'],
  },
  {
    slug: 'lumbini', name: 'Lumbini', country: 'Nepal', flag: '🇳🇵', tagline: 'Birthplace of Buddha', gradient: 'from-amber-600 to-emerald-500', accentColor: '#D97706', photo: 'photo-1528181304800-259b08848526', bestTime: 'Oct - Mar', budget: 'NPR 2500-8000/day', language: 'Nepali', currency: 'NPR', vibes: ['Pilgrimage', 'Peaceful', 'Buddhist heritage'],
    heroDescription: 'Lumbini is the UNESCO-listed birthplace of Siddhartha Gautama, marked by the Maya Devi Temple and a sprawling monastic zone where countries from Myanmar to Germany have each built their own temple in national style.',
    description: 'Rent a bicycle to cover the long monastic zone at an unhurried pace between the Sacred Garden and the Peace Pagoda.',
    highlights: ['Maya Devi Temple', 'Ashoka Pillar', 'Sacred Garden', 'World Peace Pagoda', 'Lumbini Museum', 'Monastic zone temple walk', 'Puskarini sacred pond', 'Lumbini International Research Institute', 'Eternal Peace Flame', 'Crane Sanctuary'],
  },
  {
    slug: 'nagarkot', name: 'Nagarkot', country: 'Nepal', flag: '🇳🇵', tagline: 'Himalayan Sunrise Point', gradient: 'from-sky-700 to-emerald-500', accentColor: '#0369A1', photo: 'photo-1544735716-392fe2489ffa', bestTime: 'Oct - Apr', budget: 'NPR 2000-7000/day', language: 'Nepali', currency: 'NPR', vibes: ['Sunrise views', 'Hiking', 'Village'],
    heroDescription: 'Nagarkot is a ridge-top village outside Kathmandu prized for one of the best accessible Himalayan panoramas in Nepal, with Everest visible on a clear day alongside the closer Langtang range.',
    description: 'Stay overnight for the dawn viewpoint, then walk or drive down through Changu Narayan\'s ancient temple on the way back to the valley.',
    highlights: ['Sunrise Himalayan viewpoint over the Everest range', 'Nagarkot View Tower', 'Changu Narayan Temple day trip', 'Countryside hiking trail to Sundarijal', 'Tea garden walk', 'Nagarkot to Dhulikhel trek', 'Paragliding', 'Mountain-view guesthouse terrace', 'Sunset viewpoint', 'Village homestay experience'],
  },

  // ===================== MALAYSIA (deepen) =====================
  {
    slug: 'malacca', name: 'Malacca', country: 'Malaysia', flag: '🇲🇾', tagline: 'Straits Heritage City', gradient: 'from-rose-700 to-amber-500', accentColor: '#BE123C', photo: 'photo-1562602833-0f4ab2fc46e5', bestTime: 'Dec - Mar', budget: 'MYR 150-450/day', language: 'Malay, English, Mandarin, Tamil', currency: 'MYR', vibes: ['Heritage', 'Food', 'Riverside'],
    heroDescription: 'Malacca is a UNESCO World Heritage port town where Portuguese, Dutch, British, and Peranakan influences all left their mark, densely packed into a walkable riverside old town.',
    description: 'Jonker Street\'s night market and the Baba Nyonya heritage houses are the best introduction to Malacca\'s uniquely blended culture.',
    highlights: ['Jonker Street night market', 'A Famosa fort ruins', 'Malacca River cruise', 'Baba Nyonya Heritage Museum', 'Christ Church Malacca', "St Paul's Hill", 'Malacca Straits Mosque', 'Kampung Morten village', 'Cendol and satay celup food trail', 'Cheng Hoon Teng Temple'],
  },
  {
    slug: 'kota-kinabalu', name: 'Kota Kinabalu', country: 'Malaysia', flag: '🇲🇾', tagline: 'Borneo Gateway', gradient: 'from-cyan-700 to-emerald-500', accentColor: '#0E7490', photo: 'photo-1574482620826-5f3c61c4a9d9', bestTime: 'Mar - Aug', budget: 'MYR 170-500/day', language: 'Malay, English', currency: 'MYR', vibes: ['Mountains', 'Islands', 'Wildlife'],
    heroDescription: 'Kota Kinabalu is the launchpad for Mount Kinabalu, Southeast Asia\'s highest peak outside the Himalayas, and for a scatter of coral islands just offshore in the Tunku Abdul Rahman Marine Park.',
    description: 'Combine an island-hopping snorkel day with a Sunday market visit on Gaya Street, and add a Kinabalu Park canopy walk if time allows.',
    highlights: ['Mount Kinabalu day trip', 'Tunku Abdul Rahman Marine Park island hopping', 'Kota Kinabalu Wetland Centre', 'Signal Hill Observatory sunset', 'Gaya Street Sunday Market', 'Mari Mari Cultural Village', 'Tanjung Aru Beach sunset', 'Sabah Museum', 'Poring Hot Springs', 'Kinabalu Park canopy walkway'],
  },
  {
    slug: 'cameron-highlands', name: 'Cameron Highlands', country: 'Malaysia', flag: '🇲🇾', tagline: 'Tea Country', gradient: 'from-emerald-700 to-slate-500', accentColor: '#047857', photo: 'photo-1544735716-392fe2489ffa', bestTime: 'Dec - Feb', budget: 'MYR 140-400/day', language: 'Malay, English, Tamil', currency: 'MYR', vibes: ['Tea plantations', 'Cool climate', 'Nature'],
    heroDescription: 'Cameron Highlands is Malaysia\'s cool-climate tea country, its rolling BOH plantation hills a welcome break from the tropical heat below, with strawberry farms and a mossy cloud forest to explore.',
    description: 'A tea plantation tour paired with the Mossy Forest boardwalk covers the two signature experiences in a single day.',
    highlights: ['BOH Tea Plantation', 'Mossy Forest boardwalk', 'Strawberry farms', 'Cameron Valley tea house', 'Butterfly Garden', 'Kea Farm night market', 'Time Tunnel Museum', 'Sam Poh Temple', 'Robinson Waterfall hike', 'Orchid nursery visit'],
  },

  // ===================== SOUTH AFRICA (deepen) =====================
  {
    slug: 'durban', name: 'Durban', country: 'South Africa', flag: '🇿🇦', tagline: 'Indian Ocean Coast', gradient: 'from-cyan-600 to-amber-500', accentColor: '#0891B2', photo: 'photo-1500530855697-b586d89ba3ee', bestTime: 'Mar - May, Sep - Nov', budget: 'ZAR 800-2500/day', language: 'English, Zulu, Afrikaans', currency: 'ZAR', vibes: ['Beach', 'Indian heritage', 'Warm water'],
    heroDescription: 'Durban has the largest Indian population outside India itself, and its bunny chow and biryani food culture, alongside a warm Indian Ocean beachfront, make it one of the most instantly familiar cities in South Africa for Indian travellers.',
    description: 'Walk the Golden Mile promenade, then head inland to the Victoria Street Market for spices and curry powders that rival anything back home.',
    highlights: ['Golden Mile beachfront', 'uShaka Marine World', 'Victoria Street Market', 'Durban Botanic Gardens', 'Moses Mabhida Stadium SkyCar', 'Florida Road dining strip', 'Umgeni River Bird Park', 'KwaMuhle Museum', 'Bunny chow food trail', 'Phezulu Safari Park'],
  },
  {
    slug: 'stellenbosch', name: 'Stellenbosch', country: 'South Africa', flag: '🇿🇦', tagline: 'Cape Winelands', gradient: 'from-amber-700 to-emerald-500', accentColor: '#B45309', photo: 'photo-1500530855697-b586d89ba3ee', bestTime: 'Oct - Apr', budget: 'ZAR 900-3000/day', language: 'English, Afrikaans', currency: 'ZAR', vibes: ['Wine', 'Cape Dutch architecture', 'Countryside'],
    heroDescription: 'Stellenbosch is the heart of the Cape Winelands, a university town of oak-lined streets and whitewashed Cape Dutch gables surrounded by some of South Africa\'s oldest wine estates.',
    description: 'A half-day wine route tour by car or bicycle, followed by an afternoon in the historic Dorp Street quarter, covers it well.',
    highlights: ['Stellenbosch wine route tastings', 'Oude Libertas amphitheatre', 'Dorp Street historic walk', 'Village Museum', 'Rhodes Fruit Farms', 'Jonkershoek Nature Reserve hike', 'Eikestad Mall', 'Stellenbosch University Botanical Garden', 'Boschendal Estate', 'Franschhoek day trip'],
  },
  {
    slug: 'knysna', name: 'Knysna', country: 'South Africa', flag: '🇿🇦', tagline: 'Garden Route Lagoon Town', gradient: 'from-emerald-700 to-cyan-500', accentColor: '#047857', photo: 'photo-1500530855697-b586d89ba3ee', bestTime: 'Nov - Mar', budget: 'ZAR 900-2800/day', language: 'English, Afrikaans', currency: 'ZAR', vibes: ['Lagoon', 'Forest', 'Garden Route'],
    heroDescription: 'Knysna sits on a lagoon guarded by two sandstone cliffs known as the Knysna Heads, the unofficial capital of the Garden Route and a base for forest hikes, oyster tastings, and elephant encounters.',
    description: 'Take a lagoon cruise to the Heads, then spend an afternoon at the Featherbed Nature Reserve on the western headland.',
    highlights: ['Knysna Lagoon boat cruise', 'Knysna Heads viewpoint', 'Featherbed Nature Reserve', 'Knysna Elephant Park', 'Robberg Nature Reserve hike', 'Knysna Waterfront', 'Tsitsikamma Canopy Tour day trip', 'Oyster tasting tour', 'Diepwalle Forest walk', 'Buffalo Bay Beach'],
  },

  // ===================== SOUTH KOREA (deepen) =====================
  {
    slug: 'gyeongju', name: 'Gyeongju', country: 'South Korea', flag: '🇰🇷', tagline: 'Museum Without Walls', gradient: 'from-amber-700 to-slate-500', accentColor: '#B45309', photo: 'photo-1608647819349-a75e11b40d08', bestTime: 'Apr - Jun, Sep - Nov', budget: 'KRW 70000-200000/day', language: 'Korean', currency: 'KRW', vibes: ['Ancient history', 'Temples', 'Royal tombs'],
    heroDescription: 'Gyeongju was the thousand-year capital of the Silla Kingdom, and it is often called a "museum without walls" for the sheer density of royal tombs, temples, and observatories scattered across the town.',
    description: 'Cycle between the grassy Tumuli tomb mounds and Bulguksa Temple, then walk the illuminated Anapji Pond after dark for one of Korea\'s prettiest night views.',
    highlights: ['Bulguksa Temple', 'Seokguram Grotto', 'Gyeongju National Museum', 'Cheomseongdae Observatory', 'Tumuli Park royal tombs', 'Anapji Pond at night', 'Bomun Lake Resort', 'Yangdong Folk Village', 'Gameunsa Temple site', 'Daereungwon Ancient Tomb Complex'],
  },
  {
    slug: 'jeonju', name: 'Jeonju', country: 'South Korea', flag: '🇰🇷', tagline: 'Korea\'s Food Capital', gradient: 'from-orange-700 to-amber-500', accentColor: '#C2410C', photo: 'photo-1578272531112-e6741da1a95a', bestTime: 'Apr - Jun, Sep - Nov', budget: 'KRW 65000-190000/day', language: 'Korean', currency: 'KRW', vibes: ['Food', 'Hanok village', 'Traditional'],
    heroDescription: 'Jeonju is the birthplace of bibimbap and home to Korea\'s largest hanok village, nearly 800 traditional wooden houses that now hold tea houses, hanbok rental shops, and some of the country\'s best regional cooking.',
    description: 'Rent a hanbok for the day and wander the hanok village, saving room for a proper Jeonju bibimbap at a market stall.',
    highlights: ['Jeonju Hanok Village', 'Nambu Traditional Market', 'Bibimbap food tour', 'Jeondong Catholic Church', 'Gyeonggijeon Shrine', 'Omokdae Pavilion', 'Jeonju Hyanggyo Confucian school', 'Korean traditional wine museum', 'Jaman Mural Village', 'Hanbok rental photo walk'],
  },
  {
    slug: 'suwon', name: 'Suwon', country: 'South Korea', flag: '🇰🇷', tagline: 'Fortress City', gradient: 'from-slate-700 to-amber-500', accentColor: '#475569', photo: 'photo-1608647819349-a75e11b40d08', bestTime: 'Apr - Jun, Sep - Nov', budget: 'KRW 65000-190000/day', language: 'Korean', currency: 'KRW', vibes: ['Fortress walls', 'History', 'Day trip'],
    heroDescription: 'Suwon\'s Hwaseong Fortress is a complete 18th-century walled city, its watchtowers and gates still standing intact around a UNESCO-listed 5.7-kilometre wall walk just south of Seoul.',
    description: 'It is an easy day trip from Seoul, best done as a full loop of the fortress wall combined with a stop at the Hwaseong Haenggung Palace.',
    highlights: ['Hwaseong Fortress walk', 'Hwaseong Haenggung Palace', 'Suwon Fortress night walking tour', 'Suwon Hwaseong Museum', 'Paldalmun Gate', 'Namsomun Market', 'Korean Folk Village day trip', 'Yeonmudae Pavilion archery', 'City wall train (Land Train)', 'Suwon Cheonggye Stream walk'],
  },

  // ===================== PORTUGAL (deepen) =====================
  {
    slug: 'porto', name: 'Porto', country: 'Portugal', flag: '🇵🇹', tagline: 'Port Wine City', gradient: 'from-rose-700 to-amber-500', accentColor: '#BE123C', photo: 'photo-1541943181603-d8fe267a5dcf', bestTime: 'Apr - Jun, Sep - Oct', budget: 'EUR 70-190/day', language: 'Portuguese', currency: 'EUR', vibes: ['Port wine', 'Riverside', 'Historic'],
    heroDescription: 'Porto gave its name to port wine, and the cellars across the river in Vila Nova de Gaia are still the best place in the world to taste it, overlooking the tiled rooftops of the Ribeira district below.',
    description: 'Cross the double-decker Dom Luís I Bridge on foot for the classic river view, and don\'t skip Livraria Lello, one of the most photographed bookstores anywhere.',
    highlights: ['Ribeira district', 'Livraria Lello bookstore', 'Dom Luís I Bridge', 'Port wine cellar tours in Vila Nova de Gaia', 'Clérigos Tower', 'São Bento train station azulejos', 'Bolhão Market', 'Douro River cruise', 'Casa da Música', 'Foz do Douro beachfront'],
  },
  {
    slug: 'sintra', name: 'Sintra', country: 'Portugal', flag: '🇵🇹', tagline: 'Fairytale Palaces', gradient: 'from-emerald-700 to-rose-500', accentColor: '#047857', photo: 'photo-1541943181603-d8fe267a5dcf', bestTime: 'Apr - Jun, Sep - Oct', budget: 'EUR 75-200/day', language: 'Portuguese', currency: 'EUR', vibes: ['Palaces', 'Forest', 'Day trip'],
    heroDescription: 'Sintra is a UNESCO-listed hill town outside Lisbon where 19th-century royalty built a cluster of fantastical palaces in the misty forest — the candy-coloured Pena Palace being the most photographed of them all.',
    description: 'Book Pena Palace tickets for the first morning slot to beat the crowds, and budget a full day since the sites are spread across steep hills.',
    highlights: ['Pena Palace', 'Quinta da Regaleira', 'Moorish Castle', 'Sintra National Palace', 'Monserrate Palace', 'Cabo da Roca', 'Historic centre walking tour', 'Seteais Palace gardens', 'Convento dos Capuchos', 'Praia das Maçãs day trip'],
  },
  {
    slug: 'faro', name: 'Faro', country: 'Portugal', flag: '🇵🇹', tagline: 'Algarve Gateway', gradient: 'from-cyan-600 to-amber-400', accentColor: '#0891B2', photo: 'photo-1571406252241-db0280bd36cd', bestTime: 'May - Sep', budget: 'EUR 70-190/day', language: 'Portuguese', currency: 'EUR', vibes: ['Coastal', 'Lagoons', 'Beaches'],
    heroDescription: 'Faro is the Algarve\'s main gateway, a walled old town surrounded by the Ria Formosa lagoon system, its barrier islands hiding some of Portugal\'s quietest beaches just a boat ride from the airport.',
    description: 'Take a Ria Formosa boat tour before heading further along the coast, and set aside a separate day for the sea caves at Benagil.',
    highlights: ['Faro Old Town (Cidade Velha)', 'Ria Formosa Natural Park boat tour', 'Faro Cathedral', 'Capela dos Ossos (Bone Chapel)', 'Praia de Faro', 'Ilha Deserta boat trip', 'Faro Municipal Museum', 'Arco da Vila', 'Benagil Cave day trip', 'Tavira day trip'],
  },

  // ===================== TURKEY (deepen) =====================
  {
    slug: 'cappadocia', name: 'Cappadocia', country: 'Turkey', flag: '🇹🇷', tagline: 'Hot Air Balloon Capital', gradient: 'from-orange-700 to-rose-500', accentColor: '#C2410C', photo: 'photo-1548013146-72479768bada', bestTime: 'Apr - Jun, Sep - Nov', budget: 'USD 45-140/day', language: 'Turkish', currency: 'TRY', vibes: ['Balloons', 'Cave hotels', 'Otherworldly'],
    heroDescription: 'Cappadocia\'s volcanic rock has eroded into fairy chimneys and honeycombed cave dwellings, and its skies fill with hundreds of hot air balloons at dawn — one of the most photographed sights in travel.',
    description: 'Book a balloon ride for the first clear morning of your stay as a backup for weather cancellations, and spend at least one night in a cave hotel.',
    highlights: ['Sunrise hot air balloon ride', 'Göreme Open Air Museum', 'Derinkuyu underground city', 'Uçhisar Castle', 'Love Valley hike', 'Pasabag Fairy Chimneys', 'Red Valley sunset hike', 'ATV desert tour', 'Avanos pottery workshop', 'Cave hotel stay'],
  },
  {
    slug: 'antalya', name: 'Antalya', country: 'Turkey', flag: '🇹🇷', tagline: 'Turquoise Coast Capital', gradient: 'from-cyan-600 to-amber-500', accentColor: '#0891B2', photo: 'photo-1548013146-72479768bada', bestTime: 'Apr - Jun, Sep - Oct', budget: 'USD 40-130/day', language: 'Turkish', currency: 'TRY', vibes: ['Beach', 'Ancient ruins', 'Coastal'],
    heroDescription: 'Antalya anchors Turkey\'s Turquoise Coast, its Roman-era harbour and old town of Kaleiçi sitting right above beach clubs and some of the best-preserved ancient theatres in the Mediterranean.',
    description: 'Split time between Kaleiçi\'s old harbour, a beach afternoon at Konyaaltı, and a half-day trip to the Roman ruins at Aspendos or Perge.',
    highlights: ['Kaleiçi old town', 'Düden Waterfalls', 'Antalya Archaeological Museum', 'Konyaaltı Beach', 'Aspendos Ancient Theatre', "Hadrian's Gate", 'Antalya Aquarium', 'Perge ancient city day trip', 'Termessos ruins hike', 'Boat trip along the Turquoise Coast'],
  },
  {
    slug: 'pamukkale', name: 'Pamukkale', country: 'Turkey', flag: '🇹🇷', tagline: 'Cotton Castle Terraces', gradient: 'from-cyan-500 to-slate-400', accentColor: '#06B6D4', photo: 'photo-1548013146-72479768bada', bestTime: 'Apr - Jun, Sep - Oct', budget: 'USD 35-110/day', language: 'Turkish', currency: 'TRY', vibes: ['Hot springs', 'Ancient ruins', 'Unique landscape'],
    heroDescription: 'Pamukkale\'s white, mineral-rich travertine terraces cascade down a hillside like frozen waterfalls, with the Roman spa city of Hierapolis built directly above them.',
    description: 'Walk the terraces barefoot as required, then explore Hierapolis\' ruins and take a dip in Cleopatra\'s Antique Pool among submerged Roman columns.',
    highlights: ['Pamukkale travertine terraces', 'Hierapolis ancient city ruins', "Cleopatra's Antique Pool", 'Pamukkale Archaeology Museum', 'Necropolis walk', 'Hierapolis Theatre', 'Karahayit red springs', 'Paragliding over the terraces', 'Laodicea ancient city day trip', 'Sunset terrace viewpoint'],
  },

  // ===================== INDONESIA (deepen) =====================
  {
    slug: 'bandung', name: 'Bandung', country: 'Indonesia', flag: '🇮🇩', tagline: 'Paris van Java', gradient: 'from-emerald-700 to-slate-500', accentColor: '#047857', photo: 'photo-1585503418537-88331351ad99', bestTime: 'May - Sep', budget: 'IDR 500000-1500000/day', language: 'Indonesian, Sundanese', currency: 'IDR', vibes: ['Volcanoes', 'Cool climate', 'Shopping'],
    heroDescription: 'Bandung sits in a cool highland basin ringed by volcanoes, nicknamed the "Paris van Java" for its art deco heritage architecture and now equally known for factory-outlet shopping and crater day trips.',
    description: 'A sunrise trip to the Tangkuban Perahu crater and Kawah Putih\'s turquoise lake covers the natural highlights before an afternoon on Braga Street.',
    highlights: ['Tangkuban Perahu volcano', 'Kawah Putih crater lake', 'Braga Street heritage walk', 'Floating Market Lembang', 'Dago Dream Park', 'Farmhouse Susu Lembang', 'Gedung Sate', 'Factory outlet shopping strip', 'Trans Studio Bandung', 'Ciwidey tea plantations'],
  },
  {
    slug: 'gili-islands', name: 'Gili Islands', country: 'Indonesia', flag: '🇮🇩', tagline: 'Car-Free Island Trio', gradient: 'from-cyan-500 to-emerald-400', accentColor: '#06B6D4', photo: 'photo-1571406252241-db0280bd36cd', bestTime: 'May - Sep', budget: 'IDR 400000-1500000/day', language: 'Indonesian, Sasak', currency: 'IDR', vibes: ['Islands', 'Snorkelling', 'Car-free'],
    heroDescription: 'The three Gili Islands off Lombok have no cars or motorbikes, only bicycles and horse-drawn carts, ranging from Gili Trawangan\'s party scene to Gili Meno\'s near-empty lagoons.',
    description: 'Island-hop by boat to sample all three, since each has a distinctly different pace despite being only a few minutes apart by water.',
    highlights: ['Gili Trawangan sunset swing', 'Snorkelling with sea turtles', 'Gili Air cycling loop', 'Gili Meno lagoon', 'Night market food stalls', 'Glass-bottom boat tour', 'Horse-cart (cidomo) island transport', 'Freediving courses', 'Gili T sunset bar strip', 'Island-hopping snorkel trip'],
  },
  {
    slug: 'raja-ampat', name: 'Raja Ampat', country: 'Indonesia', flag: '🇮🇩', tagline: 'World\'s Richest Reefs', gradient: 'from-teal-700 to-emerald-500', accentColor: '#0F766E', photo: 'photo-1573408301185-9519eb7ef241', bestTime: 'Oct - Apr', budget: 'IDR 800000-3000000/day', language: 'Indonesian, Papuan', currency: 'IDR', vibes: ['Diving', 'Remote', 'Karst islands'],
    heroDescription: 'Raja Ampat, off the far eastern tip of Indonesia, holds the most biodiverse coral reefs on the planet, its limestone karst islands rising straight out of impossibly clear water.',
    description: 'It takes real effort to reach — flights to Sorong plus a boat transfer — but divers and snorkellers consider it worth every leg of the journey.',
    highlights: ['Piaynemo viewpoint', 'Wayag Islands boat trip', 'Arborek Village snorkelling', 'Manta ray point at Manta Sandy', 'Pianemo karst islands', 'Kabui Bay mangrove tour', 'Yenbuba village homestay', 'Cape Kri diving', 'Blue Water Mangrove', 'Sunset over Waisai harbour'],
  },

  // ===================== MEXICO (deepen) =====================
  {
    slug: 'cancun', name: 'Cancún', country: 'Mexico', flag: '🇲🇽', tagline: 'Caribbean Resort Strip', gradient: 'from-cyan-500 to-emerald-400', accentColor: '#06B6D4', photo: 'photo-1559592413-7cec4d0cae2b', bestTime: 'Nov - Apr', budget: 'USD 60-220/day', language: 'Spanish', currency: 'MXN', vibes: ['Beach', 'Resorts', 'Nightlife'],
    heroDescription: 'Cancún\'s Hotel Zone strings all-inclusive resorts along a narrow strip between a turquoise lagoon and the Caribbean Sea, with easy access to an underwater sculpture museum and the Mayan ruins of Chichén Itzá.',
    description: 'Use it as a comfortable base for day trips to Chichén Itzá and the cenotes further down the Riviera Maya.',
    highlights: ['Playa Delfines', 'Cancun Underwater Museum (MUSA)', 'Isla Mujeres ferry day trip', 'Xcaret eco-park', 'Cancun Hotel Zone nightlife', 'El Rey ruins', 'Chichén Itzá day trip', 'Nichupté Lagoon', 'Coco Bongo show', 'Cenote snorkelling day trip'],
  },
  {
    slug: 'playa-del-carmen', name: 'Playa del Carmen', country: 'Mexico', flag: '🇲🇽', tagline: 'Riviera Maya Hub', gradient: 'from-emerald-600 to-cyan-500', accentColor: '#059669', photo: 'photo-1559592413-7cec4d0cae2b', bestTime: 'Nov - Apr', budget: 'USD 55-200/day', language: 'Spanish', currency: 'MXN', vibes: ['Beach clubs', 'Cenotes', 'Ferry gateway'],
    heroDescription: 'Playa del Carmen is more walkable and less package-tourist than Cancún, its Fifth Avenue pedestrian strip leading straight to the ferry docks for Cozumel and a ring of world-class cenotes just inland.',
    description: 'Base here for cenote diving and a Cozumel snorkelling day trip, both easier logistically than from Cancún.',
    highlights: ['Quinta Avenida (Fifth Avenue)', 'Xcaret and Xplor parks', 'Cozumel ferry day trip', 'Cenote diving at Dos Ojos', 'Playa del Carmen beach clubs', 'Río Secreto underground river', 'Tulum day trip', 'Coco Bongo Playa show', 'Mamitas Beach Club', 'Punta Venado snorkelling'],
  },
  {
    slug: 'oaxaca', name: 'Oaxaca', country: 'Mexico', flag: '🇲🇽', tagline: 'Culinary Capital', gradient: 'from-amber-700 to-rose-500', accentColor: '#B45309', photo: 'photo-1533089860892-a7c6f0a88666', bestTime: 'Oct - Apr', budget: 'USD 40-140/day', language: 'Spanish, Zapotec', currency: 'MXN', vibes: ['Food', 'Craft markets', 'Ruins'],
    heroDescription: 'Oaxaca is widely considered Mexico\'s culinary capital, its markets stacked with seven kinds of mole and mezcal distilleries, all built around a colonial centre near the hilltop ruins of Monte Albán.',
    description: 'Combine a Monte Albán morning with an afternoon market crawl through Benito Juárez market and a mezcal tasting.',
    highlights: ['Monte Albán ruins', 'Hierve el Agua petrified waterfalls', 'Oaxaca mezcal distillery tour', 'Santo Domingo Church & Museum', 'Oaxaca Mercado Benito Juárez', 'Tlacolula Sunday market', 'Teotitlán del Valle weaving village', 'Zócalo main square', 'Mitla archaeological site', 'Mole and chocolate food tour'],
  },
  {
    slug: 'tulum', name: 'Tulum', country: 'Mexico', flag: '🇲🇽', tagline: 'Clifftop Mayan Ruins', gradient: 'from-cyan-500 to-amber-400', accentColor: '#06B6D4', photo: 'photo-1559592413-7cec4d0cae2b', bestTime: 'Nov - Apr', budget: 'USD 55-210/day', language: 'Spanish', currency: 'MXN', vibes: ['Ruins', 'Boho beach', 'Cenotes'],
    heroDescription: 'Tulum is the only major Mayan site built directly on the Caribbean coast, its clifftop ruins overlooking a beach now lined with boho-chic hotels and some of the region\'s best cenotes.',
    description: 'Visit the ruins at opening time before the heat and crowds, then spend the rest of the day cenote-hopping or at a beach club.',
    highlights: ['Tulum Ruins clifftop Mayan site', 'Gran Cenote', 'Playa Paraíso', 'Sian Ka\'an Biosphere Reserve boat tour', 'Tulum beach clubs', 'Cobá ruins bike tour', 'Cenote Calavera', 'Aldea Zama shopping strip', 'Casa Cenote snorkelling', 'Muyil ruins & lagoon float'],
  },

  // ===================== NETHERLANDS (deepen) =====================
  {
    slug: 'rotterdam', name: 'Rotterdam', country: 'Netherlands', flag: '🇳🇱', tagline: 'Modern Architecture City', gradient: 'from-slate-700 to-cyan-500', accentColor: '#334155', photo: 'photo-1516905041604-7f3f4b1ef50c', bestTime: 'Apr - Sep', budget: 'EUR 90-230/day', language: 'Dutch', currency: 'EUR', vibes: ['Architecture', 'Harbour', 'Modern'],
    heroDescription: 'Rotterdam was almost entirely rebuilt after WWII bombing, and it used the clean slate to become the Netherlands\' testing ground for bold modern architecture, from the tilted Cube Houses to the market-hall-meets-apartment-block Markthal.',
    description: 'A harbour boat tour puts Europe\'s largest port in context, and the Markthal is worth a stop for lunch under its painted ceiling.',
    highlights: ['Cube Houses (Kubuswoningen)', 'Markthal', 'Erasmus Bridge', 'Euromast tower', 'Rotterdam harbour boat tour', 'Museum Boijmans Van Beuningen', 'Delfshaven historic quarter', 'Witte de Withstraat nightlife', 'Miniworld Rotterdam', 'Hotel New York'],
  },
  {
    slug: 'utrecht', name: 'Utrecht', country: 'Netherlands', flag: '🇳🇱', tagline: 'Canal Wharfs & Student Life', gradient: 'from-amber-600 to-cyan-500', accentColor: '#D97706', photo: 'photo-1516905041604-7f3f4b1ef50c', bestTime: 'Apr - Sep', budget: 'EUR 85-220/day', language: 'Dutch', currency: 'EUR', vibes: ['Canals', 'University town', 'Cycling'],
    heroDescription: 'Utrecht\'s Oudegracht canal is unique in the Netherlands for its two-level wharves, with cafes and bars built directly into the old cellar warehouses at water level below the street.',
    description: 'Climb the Dom Tower for the best view of the wharf layout, then spend an evening at a canal-level terrace bar.',
    highlights: ['Dom Tower', 'Oudegracht canal wharfs', 'Centraal Museum', 'Utrecht University Botanic Gardens', 'Rietveld Schröder House', 'Trajectum Lumen light art trail', 'Utrecht Cathedral', 'Museum Speelklok', 'Springhaver Quarter', 'Kasteel de Haar day trip'],
  },
  {
    slug: 'giethoorn', name: 'Giethoorn', country: 'Netherlands', flag: '🇳🇱', tagline: 'Village Without Roads', gradient: 'from-emerald-700 to-cyan-500', accentColor: '#047857', photo: 'photo-1544735716-392fe2489ffa', bestTime: 'Apr - Sep', budget: 'EUR 80-200/day', language: 'Dutch', currency: 'EUR', vibes: ['Canals', 'Thatched cottages', 'Quiet'],
    heroDescription: 'Giethoorn has no roads through its historic centre — thatched-roof farmhouses are linked only by canals and wooden footbridges, earning it the nickname "Venice of the Netherlands."',
    description: 'Rent a quiet electric "whisper boat" and punt yourself through the canals at your own pace rather than joining a group tour.',
    highlights: ['Canal boat (whisper boat) cruise', 'Thatched-roof farmhouse walk', "Museum Giethoorn 't Olde Maat Uus", 'De Oude Aarde rock museum', 'Wooden footbridges walk', 'Punting through the reed marshes', 'De Wieden nature reserve', 'Bike tour along the canals', 'Local pancake restaurant stop', 'Sunset canal photo cruise'],
  },
];

export const moreWorldCities: City[] = moreWorldCitiesData.map(makeAddedCityGuide);
