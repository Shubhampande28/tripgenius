import { City } from './types';

// 14 additional Indian cities — descriptions paraphrased from Wikipedia,
// coordinates and lead images sourced from Wikipedia/Wikimedia Commons.
export const newIndianCities: City[] = [
{
  "stub": false,
  "slug": "dehradun",
  "name": "Dehradun",
  "state": "Uttarakhand",
  "country": "India",
  "flag": "🇮🇳",
  "tagline": "Gateway to the Doon Valley",
  "description": "Uttarakhand's capital sits in the lush Doon Valley between the Himalayan foothills and the Shivalik range — a relaxed, leafy city famous for its boarding schools, river caves and as the launch point for Mussoorie and Rishikesh.",
  "heroDescription": "A green valley city of misty mornings, forested trails and limestone caves, perfectly placed as a base for the western Himalaya.",
  "coordinates": {
    "lat": 30.345,
    "lng": 78.029
  },
  "stats": {
    "bestTime": "Sep – Apr",
    "budget": "₹1,500 – ₹4,000/day",
    "language": "Hindi, Garhwali",
    "currency": "INR (Rupee)"
  },
  "vibes": [
    "Nature",
    "Adventure",
    "Spiritual"
  ],
  "gradient": "from-emerald-600 via-green-500 to-lime-400",
  "accentColor": "#059669",
  "image": "/city-images/dehradun.jpg",
  "heroImage": "/city-images/dehradun.jpg",
  "areas": [
    {
      "name": "Top Sights",
      "emoji": "⛰️",
      "accentColor": "#059669",
      "image": "/city-images/dehradun.jpg",
      "tagline": "Caves, temples and valley views",
      "spots": [
        {
          "name": "Robber’s Cave (Guchhupani)",
          "tag": "Nature"
        },
        {
          "name": "Sahastradhara",
          "tag": "Nature"
        },
        {
          "name": "Forest Research Institute",
          "tag": "Cultural"
        },
        {
          "name": "Tapkeshwar Temple",
          "tag": "Cultural"
        }
      ]
    }
  ],
  "thingsToDo": [
    {
      "name": "Robber’s Cave (Guchhupani)",
      "description": "A river-carved limestone gorge where a cold stream runs through a narrow cave — wade through ankle-deep water between towering rock walls.",
      "icon": "🕳️",
      "duration": "2–3 hours",
      "category": "Nature"
    },
    {
      "name": "Sahastradhara",
      "description": "Sulphur springs and terraced limestone waterfalls on the edge of the city, popular for a refreshing dip and a ropeway ride.",
      "icon": "💦",
      "duration": "2–3 hours",
      "category": "Nature"
    },
    {
      "name": "Forest Research Institute",
      "description": "A grand colonial-era building set in vast manicured grounds, ranked among the most striking campuses in India.",
      "icon": "🏛️",
      "duration": "1–2 hours",
      "category": "Cultural"
    },
    {
      "name": "Tapkeshwar Temple",
      "description": "A cave shrine to Shiva beside a seasonal stream where water drips naturally onto the lingam.",
      "icon": "🛕",
      "duration": "1–2 hours",
      "category": "Cultural"
    }
  ],
  "monthByMonth": {
    "summary": "Dehradun has a mild foothill climate — pleasant most of the year, with a cool winter, a hot pre-monsoon spring and a wet monsoon from July to September that keeps the valley green.",
    "bestMonths": ["October", "November", "March", "April"],
    "avoidMonths": ["July", "August"],
    "months": [
      { "month": "January", "short": "Jan", "rating": "good", "weather": "Cool and crisp, occasional light rain", "temp": "6–17°C", "crowds": "Moderate", "price": "Moderate", "highlight": "Frosty mornings, good for cave and valley walks" },
      { "month": "February", "short": "Feb", "rating": "excellent", "weather": "Mild, clear skies, blooming valley", "temp": "8–20°C", "crowds": "Moderate", "price": "Moderate", "highlight": "Comfortable sightseeing weather returns" },
      { "month": "March", "short": "Mar", "rating": "excellent", "weather": "Warm days, cool evenings", "temp": "12–25°C", "crowds": "Moderate", "price": "Moderate", "highlight": "Rhododendrons bloom on nearby slopes" },
      { "month": "April", "short": "Apr", "rating": "excellent", "weather": "Warm, dry, pleasant", "temp": "16–29°C", "crowds": "High", "price": "High", "highlight": "Peak season starts as plains heat up" },
      { "month": "May", "short": "May", "rating": "good", "weather": "Hot in the afternoons, cool nights", "temp": "20–33°C", "crowds": "High", "price": "High", "highlight": "Popular escape from the plains' heat" },
      { "month": "June", "short": "Jun", "rating": "average", "weather": "Hot with pre-monsoon showers", "temp": "22–34°C", "crowds": "Moderate", "price": "Moderate", "highlight": "Humidity builds ahead of the monsoon" },
      { "month": "July", "short": "Jul", "rating": "avoid", "weather": "Heavy monsoon rain, landslide risk on hill roads", "temp": "21–30°C", "crowds": "Low", "price": "Low", "highlight": "Lush but wet — caves and falls can be unsafe" },
      { "month": "August", "short": "Aug", "rating": "avoid", "weather": "Continued heavy rainfall", "temp": "21–29°C", "crowds": "Low", "price": "Low", "highlight": "Valley at its greenest but travel is disrupted" },
      { "month": "September", "short": "Sep", "rating": "average", "weather": "Rain tapering off, humid", "temp": "20–29°C", "crowds": "Low", "price": "Low", "highlight": "Waterfalls at their fullest as rains ease" },
      { "month": "October", "short": "Oct", "rating": "excellent", "weather": "Clear post-monsoon skies, mild", "temp": "16–27°C", "crowds": "High", "price": "High", "highlight": "Best all-round month, crisp mountain views" },
      { "month": "November", "short": "Nov", "rating": "excellent", "weather": "Cool, dry and sunny", "temp": "10–24°C", "crowds": "High", "price": "High", "highlight": "Ideal for Mussoorie and Rishikesh day trips" },
      { "month": "December", "short": "Dec", "rating": "good", "weather": "Cold, occasional fog", "temp": "5–18°C", "crowds": "Moderate", "price": "Moderate", "highlight": "Winter charm, possible snow on nearby peaks" }
    ]
  }
},
{
  "stub": false,
  "slug": "trivandrum",
  "name": "Thiruvananthapuram",
  "state": "Kerala",
  "country": "India",
  "flag": "🇮🇳",
  "tagline": "Kerala’s Coastal Capital",
  "description": "Also known as Trivandrum, Kerala’s capital blends golden beaches, the fabulously wealthy Padmanabhaswamy Temple and red-tiled colonial architecture on a string of seven hills by the Arabian Sea.",
  "heroDescription": "A laid-back coastal capital of temples, palaces and palm-fringed beaches at the southern tip of India.",
  "coordinates": {
    "lat": 8.52411111,
    "lng": 76.93661111
  },
  "stats": {
    "bestTime": "Sep – Mar",
    "budget": "₹1,800 – ₹4,500/day",
    "language": "Malayalam",
    "currency": "INR (Rupee)"
  },
  "vibes": [
    "Cultural",
    "Beach",
    "Spiritual"
  ],
  "gradient": "from-sky-600 via-cyan-500 to-teal-400",
  "accentColor": "#0EA5E9",
  "image": "/city-images/trivandrum.jpg",
  "heroImage": "/city-images/trivandrum.jpg",
  "areas": [
    {
      "name": "Top Sights",
      "emoji": "🏖️",
      "accentColor": "#0EA5E9",
      "image": "/city-images/trivandrum.jpg",
      "tagline": "Temples, museums and beaches",
      "spots": [
        {
          "name": "Sree Padmanabhaswamy Temple",
          "tag": "Cultural"
        },
        {
          "name": "Kovalam Beach",
          "tag": "Relaxation"
        },
        {
          "name": "Napier Museum & Zoo",
          "tag": "Cultural"
        },
        {
          "name": "Poovar & Veli Backwaters",
          "tag": "Nature"
        }
      ]
    }
  ],
  "thingsToDo": [
    {
      "name": "Sree Padmanabhaswamy Temple",
      "description": "One of the holiest and richest Vishnu temples in India, an architectural marvel of Dravidian gopurams (strict dress code applies).",
      "icon": "🛕",
      "duration": "1–2 hours",
      "category": "Cultural"
    },
    {
      "name": "Kovalam Beach",
      "description": "A famous crescent of sand below a candy-striped lighthouse, with calm coves for swimming and great seafood shacks.",
      "icon": "🏖️",
      "duration": "Half day",
      "category": "Relaxation"
    },
    {
      "name": "Napier Museum & Zoo",
      "description": "An ornate Indo-Saracenic museum housing bronzes and ivory carvings, set in shaded gardens.",
      "icon": "🏛️",
      "duration": "1–2 hours",
      "category": "Cultural"
    },
    {
      "name": "Poovar & Veli Backwaters",
      "description": "Quiet estuary backwaters where the river meets the sea — explore by canoe past mangroves and a golden sandbar.",
      "icon": "🛶",
      "duration": "3–4 hours",
      "category": "Nature"
    }
  ],
  "monthByMonth": {
    "summary": "Trivandrum has a tropical coastal climate — warm and humid year-round, with two monsoon spells (the main southwest monsoon June–August and a lighter northeast monsoon October–November) and a comfortable, drier window from December to February.",
    "bestMonths": ["December", "January", "February"],
    "avoidMonths": ["June", "July"],
    "months": [
      { "month": "January", "short": "Jan", "rating": "excellent", "weather": "Warm, dry and sunny", "temp": "23–31°C", "crowds": "High", "price": "High", "highlight": "Best beach weather of the year at Kovalam" },
      { "month": "February", "short": "Feb", "rating": "excellent", "weather": "Warm, humidity still low", "temp": "24–32°C", "crowds": "Moderate", "price": "Moderate", "highlight": "Comfortable temple and museum touring" },
      { "month": "March", "short": "Mar", "rating": "good", "weather": "Hot, humidity rising", "temp": "25–33°C", "crowds": "Moderate", "price": "Moderate", "highlight": "Attukal Pongala festival draws huge crowds" },
      { "month": "April", "short": "Apr", "rating": "average", "weather": "Hot and increasingly humid", "temp": "26–34°C", "crowds": "Low", "price": "Low", "highlight": "Best done early morning or evening only" },
      { "month": "May", "short": "May", "rating": "average", "weather": "Very humid, pre-monsoon showers build", "temp": "26–33°C", "crowds": "Low", "price": "Low", "highlight": "Thundery afternoon downpours begin" },
      { "month": "June", "short": "Jun", "rating": "avoid", "weather": "Southwest monsoon breaks, heavy rain", "temp": "24–29°C", "crowds": "Low", "price": "Low", "highlight": "Monsoon onset — dramatic but disruptive" },
      { "month": "July", "short": "Jul", "rating": "avoid", "weather": "Sustained heavy monsoon rainfall", "temp": "23–28°C", "crowds": "Low", "price": "Low", "highlight": "Wettest month, best for indoor sightseeing" },
      { "month": "August", "short": "Aug", "rating": "average", "weather": "Rain easing but still frequent", "temp": "23–29°C", "crowds": "Low", "price": "Low", "highlight": "Onam festival preparations begin" },
      { "month": "September", "short": "Sep", "rating": "good", "weather": "Rain tapering, lush greenery", "temp": "24–30°C", "crowds": "Moderate", "price": "Moderate", "highlight": "Onam harvest festival celebrations" },
      { "month": "October", "short": "Oct", "rating": "good", "weather": "Northeast monsoon brings scattered showers", "temp": "24–31°C", "crowds": "Moderate", "price": "Moderate", "highlight": "Intermittent rain, otherwise pleasant" },
      { "month": "November", "short": "Nov", "rating": "good", "weather": "Showers easing, warm and humid", "temp": "23–31°C", "crowds": "Moderate", "price": "Moderate", "highlight": "Backwater cruising conditions improve" },
      { "month": "December", "short": "Dec", "rating": "excellent", "weather": "Warm, dry and breezy", "temp": "23–31°C", "crowds": "High", "price": "High", "highlight": "Peak season — Christmas on the coast" }
    ]
  }
},
{
  "stub": false,
  "slug": "kozhikode",
  "name": "Kozhikode",
  "state": "Kerala",
  "country": "India",
  "flag": "🇮🇳",
  "tagline": "The City of Spices",
  "description": "Calicut, on Kerala’s Malabar Coast, is where Vasco da Gama first landed in India — today a warm, food-obsessed port city famous for Malabar biryani, sweet halwa and a long sunset beach.",
  "heroDescription": "A historic spice-trade port on the Malabar Coast, beloved for its food, beaches and easygoing charm.",
  "coordinates": {
    "lat": 11.24888889,
    "lng": 75.78388889
  },
  "stats": {
    "bestTime": "Oct – Mar",
    "budget": "₹1,500 – ₹4,000/day",
    "language": "Malayalam",
    "currency": "INR (Rupee)"
  },
  "vibes": [
    "Foodie",
    "Beach",
    "Cultural"
  ],
  "gradient": "from-amber-600 via-orange-500 to-yellow-400",
  "accentColor": "#F59E0B",
  "image": "/city-images/kozhikode.jpg",
  "heroImage": "/city-images/kozhikode.jpg",
  "areas": [
    {
      "name": "Top Sights",
      "emoji": "🌊",
      "accentColor": "#F59E0B",
      "image": "/city-images/kozhikode.jpg",
      "tagline": "Beaches, boats and Malabar flavours",
      "spots": [
        {
          "name": "Kozhikode Beach",
          "tag": "Relaxation"
        },
        {
          "name": "Beypore Port",
          "tag": "Cultural"
        },
        {
          "name": "Kappad Beach",
          "tag": "Scenic"
        },
        {
          "name": "Malabar Food Trail",
          "tag": "Culinary"
        }
      ]
    }
  ],
  "thingsToDo": [
    {
      "name": "Kozhikode Beach",
      "description": "A long city beach with an old pier, perfect for an evening stroll, kite-flying and street snacks at sunset.",
      "icon": "🏖️",
      "duration": "Half day",
      "category": "Relaxation"
    },
    {
      "name": "Beypore Port",
      "description": "A centuries-old shipyard where craftsmen still build traditional wooden uru dhows by hand.",
      "icon": "⚓",
      "duration": "1–2 hours",
      "category": "Cultural"
    },
    {
      "name": "Kappad Beach",
      "description": "The quiet beach where Vasco da Gama landed in 1498, marked by a small monument.",
      "icon": "🏖️",
      "duration": "1–2 hours",
      "category": "Scenic"
    },
    {
      "name": "Malabar Food Trail",
      "description": "Sample the city’s legendary Kozhikodan biryani, banana-chip stalls and the famous Kozhikode halwa.",
      "icon": "🍲",
      "duration": "2–3 hours",
      "category": "Culinary"
    }
  ],
  "monthByMonth": {
    "summary": "Kozhikode shares Kerala's tropical Malabar coast pattern — hot and humid with a dry, breezy window from December to February, building heat into April, then a heavy southwest monsoon from June through September.",
    "bestMonths": ["December", "January", "February"],
    "avoidMonths": ["June", "July"],
    "months": [
      { "month": "January", "short": "Jan", "rating": "excellent", "weather": "Warm, dry, low humidity", "temp": "23–31°C", "crowds": "High", "price": "High", "highlight": "Ideal beach and food-trail weather" },
      { "month": "February", "short": "Feb", "rating": "excellent", "weather": "Warm and pleasant, still fairly dry", "temp": "24–32°C", "crowds": "Moderate", "price": "Moderate", "highlight": "Great conditions for Beypore boatyard visits" },
      { "month": "March", "short": "Mar", "rating": "good", "weather": "Hot, humidity climbing", "temp": "25–33°C", "crowds": "Moderate", "price": "Moderate", "highlight": "Still workable with an early start" },
      { "month": "April", "short": "Apr", "rating": "average", "weather": "Hot and humid", "temp": "26–34°C", "crowds": "Low", "price": "Low", "highlight": "Best kept to mornings and evenings" },
      { "month": "May", "short": "May", "rating": "average", "weather": "Very humid, pre-monsoon storms build", "temp": "26–33°C", "crowds": "Low", "price": "Low", "highlight": "Mango season in local markets" },
      { "month": "June", "short": "Jun", "rating": "avoid", "weather": "Monsoon breaks with heavy rain", "temp": "24–29°C", "crowds": "Low", "price": "Low", "highlight": "One of the wettest starts on the Malabar coast" },
      { "month": "July", "short": "Jul", "rating": "avoid", "weather": "Sustained heavy rainfall", "temp": "23–28°C", "crowds": "Low", "price": "Low", "highlight": "Best spent on indoor food trails" },
      { "month": "August", "short": "Aug", "rating": "average", "weather": "Rain easing gradually", "temp": "23–29°C", "crowds": "Low", "price": "Low", "highlight": "Onam season shopping and sweets" },
      { "month": "September", "short": "Sep", "rating": "good", "weather": "Rain tapering, lush landscape", "temp": "24–30°C", "crowds": "Moderate", "price": "Moderate", "highlight": "Onam festivities continue" },
      { "month": "October", "short": "Oct", "rating": "good", "weather": "Scattered showers, otherwise pleasant", "temp": "24–31°C", "crowds": "Moderate", "price": "Moderate", "highlight": "Post-monsoon freshness returns" },
      { "month": "November", "short": "Nov", "rating": "good", "weather": "Showers easing, warm days", "temp": "23–31°C", "crowds": "Moderate", "price": "Moderate", "highlight": "Good beach walks resume at Kappad" },
      { "month": "December", "short": "Dec", "rating": "excellent", "weather": "Warm, dry, breezy evenings", "temp": "23–31°C", "crowds": "High", "price": "High", "highlight": "Peak season on the Malabar coast" }
    ]
  }
},
{
  "stub": false,
  "slug": "thrissur",
  "name": "Thrissur",
  "state": "Kerala",
  "country": "India",
  "flag": "🇮🇳",
  "tagline": "Cultural Capital of Kerala",
  "description": "Built around a temple-topped hill, Thrissur is the cultural heart of Kerala — home to the thunderous Thrissur Pooram festival, classical arts academies and the spectacular Athirappilly waterfalls nearby.",
  "heroDescription": "Kerala’s festival and arts capital, ringed by temples, palaces and jungle waterfalls.",
  "coordinates": {
    "lat": 10.52761111,
    "lng": 76.21438889
  },
  "stats": {
    "bestTime": "Sep – Mar",
    "budget": "₹1,500 – ₹4,000/day",
    "language": "Malayalam",
    "currency": "INR (Rupee)"
  },
  "vibes": [
    "Cultural",
    "Spiritual",
    "Nature"
  ],
  "gradient": "from-red-600 via-rose-500 to-orange-400",
  "accentColor": "#DC2626",
  "image": "/city-images/thrissur.jpg",
  "heroImage": "/city-images/thrissur.jpg",
  "areas": [
    {
      "name": "Top Sights",
      "emoji": "🛕",
      "accentColor": "#DC2626",
      "image": "/city-images/thrissur.jpg",
      "tagline": "Temples, festivals and falls",
      "spots": [
        {
          "name": "Vadakkunnathan Temple",
          "tag": "Cultural"
        },
        {
          "name": "Athirappilly Falls",
          "tag": "Nature"
        },
        {
          "name": "Guruvayur Temple",
          "tag": "Cultural"
        },
        {
          "name": "Kerala Kalamandalam",
          "tag": "Cultural"
        }
      ]
    }
  ],
  "thingsToDo": [
    {
      "name": "Vadakkunnathan Temple",
      "description": "An ancient Shiva temple of classic Kerala architecture crowning the hill at the city’s centre (a UNESCO heritage site).",
      "icon": "🛕",
      "duration": "1–2 hours",
      "category": "Cultural"
    },
    {
      "name": "Athirappilly Falls",
      "description": "Kerala’s largest waterfall, an 80-foot curtain plunging through rainforest — often called the “Niagara of India”.",
      "icon": "💦",
      "duration": "Half day",
      "category": "Nature"
    },
    {
      "name": "Guruvayur Temple",
      "description": "One of India’s most important Krishna temples, drawing pilgrims from across the south.",
      "icon": "🛕",
      "duration": "1–2 hours",
      "category": "Cultural"
    },
    {
      "name": "Kerala Kalamandalam",
      "description": "The renowned academy where you can watch Kathakali and Mohiniyattam dancers in training.",
      "icon": "🎭",
      "duration": "2–3 hours",
      "category": "Cultural"
    }
  ],
  "monthByMonth": {
    "summary": "Thrissur follows Kerala's coastal pattern of a dry, pleasant winter and a wet southwest monsoon June–September, but its calendar is anchored by Thrissur Pooram — the state's biggest temple festival — which falls in April or May depending on the Malayalam calendar.",
    "bestMonths": ["December", "January", "February", "April"],
    "avoidMonths": ["June", "July"],
    "months": [
      { "month": "January", "short": "Jan", "rating": "excellent", "weather": "Warm, dry, comfortable", "temp": "23–32°C", "crowds": "High", "price": "High", "highlight": "Peak season for temples and Athirappilly Falls" },
      { "month": "February", "short": "Feb", "rating": "excellent", "weather": "Warm days, dry", "temp": "24–33°C", "crowds": "Moderate", "price": "Moderate", "highlight": "Comfortable sightseeing before the heat builds" },
      { "month": "March", "short": "Mar", "rating": "good", "weather": "Hot, humidity rising", "temp": "25–34°C", "crowds": "Moderate", "price": "Moderate", "highlight": "Pooram preparations begin across the city" },
      { "month": "April", "short": "Apr", "rating": "excellent", "weather": "Hot but electric with festival energy", "temp": "26–35°C", "crowds": "Peak", "price": "Peak", "highlight": "Thrissur Pooram — Kerala's grandest temple festival, with elephant processions and fireworks" },
      { "month": "May", "short": "May", "rating": "average", "weather": "Very hot and humid, pre-monsoon storms", "temp": "26–34°C", "crowds": "Moderate", "price": "Moderate", "highlight": "Occasionally hosts a late Pooram; otherwise quiet" },
      { "month": "June", "short": "Jun", "rating": "avoid", "weather": "Monsoon breaks with heavy rain", "temp": "23–29°C", "crowds": "Low", "price": "Low", "highlight": "Athirappilly Falls swell dramatically but access can be limited" },
      { "month": "July", "short": "Jul", "rating": "avoid", "weather": "Sustained heavy monsoon rainfall", "temp": "23–28°C", "crowds": "Low", "price": "Low", "highlight": "Best kept to indoor museum and temple visits" },
      { "month": "August", "short": "Aug", "rating": "average", "weather": "Rain easing gradually", "temp": "23–29°C", "crowds": "Low", "price": "Low", "highlight": "Onam season begins" },
      { "month": "September", "short": "Sep", "rating": "good", "weather": "Rain tapering, green landscape", "temp": "24–30°C", "crowds": "Moderate", "price": "Moderate", "highlight": "Onam festivities across the district" },
      { "month": "October", "short": "Oct", "rating": "good", "weather": "Scattered post-monsoon showers", "temp": "24–31°C", "crowds": "Moderate", "price": "Moderate", "highlight": "Waterfalls still full and scenic" },
      { "month": "November", "short": "Nov", "rating": "good", "weather": "Showers easing, warm and pleasant", "temp": "23–31°C", "crowds": "Moderate", "price": "Moderate", "highlight": "Good conditions for Kalamandalam visits" },
      { "month": "December", "short": "Dec", "rating": "excellent", "weather": "Warm, dry, breezy", "temp": "23–32°C", "crowds": "High", "price": "High", "highlight": "Festive season, ideal touring weather" }
    ]
  }
},
{
  "stub": false,
  "slug": "vrindavan",
  "name": "Vrindavan",
  "state": "Uttar Pradesh",
  "country": "India",
  "flag": "🇮🇳",
  "tagline": "Land of Krishna",
  "description": "In the sacred Braj region near Mathura, Vrindavan is where Lord Krishna is said to have spent his childhood — a town of thousands of temples, devotional song and an unforgettable Holi.",
  "heroDescription": "A holy Krishna pilgrimage town of ancient temples, ringing bells and riotous colour at Holi.",
  "coordinates": {
    "lat": 27.58,
    "lng": 77.7
  },
  "stats": {
    "bestTime": "Oct – Mar",
    "budget": "₹1,200 – ₹3,500/day",
    "language": "Hindi, Braj Bhasha",
    "currency": "INR (Rupee)"
  },
  "vibes": [
    "Spiritual",
    "Cultural"
  ],
  "gradient": "from-violet-600 via-purple-500 to-fuchsia-400",
  "accentColor": "#8B5CF6",
  "image": "/city-images/vrindavan.jpg",
  "heroImage": "/city-images/vrindavan.jpg",
  "areas": [
    {
      "name": "Top Sights",
      "emoji": "🛕",
      "accentColor": "#8B5CF6",
      "image": "/city-images/vrindavan.jpg",
      "tagline": "Temples of the Braj",
      "spots": [
        {
          "name": "Banke Bihari Temple",
          "tag": "Cultural"
        },
        {
          "name": "Prem Mandir",
          "tag": "Cultural"
        },
        {
          "name": "ISKCON Vrindavan",
          "tag": "Cultural"
        },
        {
          "name": "Nidhivan",
          "tag": "Nature"
        }
      ]
    }
  ],
  "thingsToDo": [
    {
      "name": "Banke Bihari Temple",
      "description": "The town’s most beloved temple, where the curtain before the deity opens only in glimpses amid joyful chanting.",
      "icon": "🛕",
      "duration": "1–2 hours",
      "category": "Cultural"
    },
    {
      "name": "Prem Mandir",
      "description": "A vast white-marble temple that glows in shifting colours after dark, surrounded by illuminated gardens.",
      "icon": "🛕",
      "duration": "1–2 hours",
      "category": "Cultural"
    },
    {
      "name": "ISKCON Vrindavan",
      "description": "The Krishna-Balaram Mandir, a serene hub of kirtan, prasad and international devotees.",
      "icon": "🛕",
      "duration": "1–2 hours",
      "category": "Cultural"
    },
    {
      "name": "Nidhivan",
      "description": "A mysterious sacred grove of gnarled tulsi trees wrapped in centuries of Krishna legend.",
      "icon": "🌳",
      "duration": "1–2 hours",
      "category": "Nature"
    }
  ],
  "monthByMonth": {
    "summary": "Vrindavan sits on the North Indian plains — cold, foggy winters, a scorching summer from April to June, and a humid monsoon July–September. Holi, celebrated here with famously exuberant flower and colour play, is the single biggest draw (March).",
    "bestMonths": ["October", "November", "February", "March"],
    "avoidMonths": ["May", "June"],
    "months": [
      { "month": "January", "short": "Jan", "rating": "good", "weather": "Cold, foggy mornings", "temp": "7–18°C", "crowds": "High", "price": "High", "highlight": "Winter pilgrimage season, misty temple mornings" },
      { "month": "February", "short": "Feb", "rating": "excellent", "weather": "Mild and pleasant, fog clearing", "temp": "10–24°C", "crowds": "Moderate", "price": "Moderate", "highlight": "Comfortable temple-hopping weather" },
      { "month": "March", "short": "Mar", "rating": "excellent", "weather": "Warm, dry", "temp": "15–29°C", "crowds": "Peak", "price": "Peak", "highlight": "Holi — the most famous, riotous celebration of colour in India" },
      { "month": "April", "short": "Apr", "rating": "average", "weather": "Hot, dry days", "temp": "20–36°C", "crowds": "Low", "price": "Low", "highlight": "Heat builds quickly after Holi" },
      { "month": "May", "short": "May", "rating": "avoid", "weather": "Extreme heat", "temp": "26–42°C", "crowds": "Low", "price": "Low", "highlight": "Best avoided — punishing daytime temperatures" },
      { "month": "June", "short": "Jun", "rating": "avoid", "weather": "Hottest month, dry heat before rains", "temp": "28–43°C", "crowds": "Low", "price": "Low", "highlight": "Pre-monsoon heat at its peak" },
      { "month": "July", "short": "Jul", "rating": "average", "weather": "Monsoon rains bring relief", "temp": "26–36°C", "crowds": "Low", "price": "Low", "highlight": "Sudden showers cool the town down" },
      { "month": "August", "short": "Aug", "rating": "average", "weather": "Humid with regular rainfall", "temp": "25–34°C", "crowds": "Moderate", "price": "Moderate", "highlight": "Krishna Janmashtami — Vrindavan's other great festival" },
      { "month": "September", "short": "Sep", "rating": "good", "weather": "Rain easing, humid", "temp": "24–33°C", "crowds": "Moderate", "price": "Moderate", "highlight": "Post-monsoon greenery around the temples" },
      { "month": "October", "short": "Oct", "rating": "excellent", "weather": "Clear skies, warm days, cool nights", "temp": "18–32°C", "crowds": "High", "price": "High", "highlight": "Sharad Purnima and pleasant festival season" },
      { "month": "November", "short": "Nov", "rating": "excellent", "weather": "Cool and dry", "temp": "12–27°C", "crowds": "High", "price": "High", "highlight": "Diwali season, comfortable sightseeing" },
      { "month": "December", "short": "Dec", "rating": "good", "weather": "Cold, occasional dense fog", "temp": "6–20°C", "crowds": "Moderate", "price": "Moderate", "highlight": "Peaceful winter pilgrimage atmosphere" }
    ]
  }
},
{
  "stub": false,
  "slug": "shirdi",
  "name": "Shirdi",
  "state": "Maharashtra",
  "country": "India",
  "flag": "🇮🇳",
  "tagline": "Home of Sai Baba",
  "description": "A small Maharashtra town that became one of India’s biggest pilgrimage sites — the home of the 19th-century saint Sai Baba, drawing millions to his samadhi shrine each year.",
  "heroDescription": "A major pilgrimage town centred on the shrine of the beloved saint Shirdi Sai Baba.",
  "coordinates": {
    "lat": 19.77,
    "lng": 74.48
  },
  "stats": {
    "bestTime": "Oct – Mar",
    "budget": "₹1,200 – ₹3,500/day",
    "language": "Marathi, Hindi",
    "currency": "INR (Rupee)"
  },
  "vibes": [
    "Spiritual",
    "Pilgrimage"
  ],
  "gradient": "from-orange-600 via-amber-500 to-yellow-400",
  "accentColor": "#F97316",
  "image": "/city-images/shirdi.jpg",
  "heroImage": "/city-images/shirdi.jpg",
  "areas": [
    {
      "name": "Top Sights",
      "emoji": "🛕",
      "accentColor": "#F97316",
      "image": "/city-images/shirdi.jpg",
      "tagline": "Shrines of Sai Baba",
      "spots": [
        {
          "name": "Samadhi Mandir",
          "tag": "Cultural"
        },
        {
          "name": "Dwarkamai Mosque",
          "tag": "Cultural"
        },
        {
          "name": "Chavadi",
          "tag": "Cultural"
        },
        {
          "name": "Lendi Garden",
          "tag": "Nature"
        }
      ]
    }
  ],
  "thingsToDo": [
    {
      "name": "Samadhi Mandir",
      "description": "The marble shrine housing Sai Baba’s tomb and a life-size statue, the spiritual centre of Shirdi.",
      "icon": "🛕",
      "duration": "1–2 hours",
      "category": "Cultural"
    },
    {
      "name": "Dwarkamai Mosque",
      "description": "The mosque where Sai Baba lived and kept his ever-burning sacred fire (dhuni).",
      "icon": "🕌",
      "duration": "1–2 hours",
      "category": "Cultural"
    },
    {
      "name": "Chavadi",
      "description": "The simple building where Sai Baba slept on alternate nights, now part of the daily processions.",
      "icon": "🏛️",
      "duration": "1–2 hours",
      "category": "Cultural"
    },
    {
      "name": "Lendi Garden",
      "description": "A peaceful garden Sai Baba tended himself, with a lamp that has burned continuously for decades.",
      "icon": "🌳",
      "duration": "1–2 hours",
      "category": "Nature"
    }
  ],
  "monthByMonth": {
    "summary": "Shirdi has a warm interior-Maharashtra climate — a comfortable, dry winter, a hot summer peaking in April–May, and a moderate monsoon June–September. As a year-round pilgrimage town, crowds stay fairly steady, spiking around major festivals.",
    "bestMonths": ["November", "December", "January", "February"],
    "avoidMonths": ["April", "May"],
    "months": [
      { "month": "January", "short": "Jan", "rating": "excellent", "weather": "Cool mornings, warm dry days", "temp": "12–29°C", "crowds": "High", "price": "High", "highlight": "Best weather for the shrine queues" },
      { "month": "February", "short": "Feb", "rating": "excellent", "weather": "Mild and dry", "temp": "14–32°C", "crowds": "High", "price": "High", "highlight": "Comfortable pilgrimage conditions continue" },
      { "month": "March", "short": "Mar", "rating": "good", "weather": "Warming up, dry", "temp": "17–35°C", "crowds": "Moderate", "price": "Moderate", "highlight": "Ram Navami draws large crowds" },
      { "month": "April", "short": "Apr", "rating": "avoid", "weather": "Very hot, dry heat", "temp": "21–39°C", "crowds": "Moderate", "price": "Moderate", "highlight": "Punishing midday heat, visit shrine early morning" },
      { "month": "May", "short": "May", "rating": "avoid", "weather": "Peak summer heat", "temp": "24–41°C", "crowds": "Low", "price": "Low", "highlight": "Hottest month, best avoided if heat-sensitive" },
      { "month": "June", "short": "Jun", "rating": "average", "weather": "Pre-monsoon humidity, first showers", "temp": "23–36°C", "crowds": "Low", "price": "Low", "highlight": "Monsoon onset brings relief from the heat" },
      { "month": "July", "short": "Jul", "rating": "good", "weather": "Steady monsoon rain, cooler", "temp": "22–30°C", "crowds": "Moderate", "price": "Moderate", "highlight": "Guru Purnima draws devotees despite rain" },
      { "month": "August", "short": "Aug", "rating": "good", "weather": "Regular monsoon showers", "temp": "22–29°C", "crowds": "Moderate", "price": "Moderate", "highlight": "Greenery around town at its best" },
      { "month": "September", "short": "Sep", "rating": "good", "weather": "Rain easing, humid", "temp": "22–30°C", "crowds": "Moderate", "price": "Moderate", "highlight": "Ganesh Chaturthi season energy nearby" },
      { "month": "October", "short": "Oct", "rating": "excellent", "weather": "Clearing skies, warm days", "temp": "19–32°C", "crowds": "High", "price": "High", "highlight": "Vijayadashami and Dussehra pilgrimage rush" },
      { "month": "November", "short": "Nov", "rating": "excellent", "weather": "Cool and dry", "temp": "15–31°C", "crowds": "High", "price": "High", "highlight": "Ideal weather, Sai Baba Punyatithi in some years" },
      { "month": "December", "short": "Dec", "rating": "excellent", "weather": "Cool, pleasant days", "temp": "12–29°C", "crowds": "High", "price": "High", "highlight": "Comfortable winter pilgrimage season" }
    ]
  }
},
{
  "stub": false,
  "slug": "patna",
  "name": "Patna",
  "state": "Bihar",
  "country": "India",
  "flag": "🇮🇳",
  "tagline": "Ancient Pataliputra on the Ganges",
  "description": "One of the world’s oldest continuously inhabited cities, Bihar’s riverside capital was the mighty Pataliputra of the Maurya and Gupta empires — today a sprawling Ganges city of museums, a Sikh holy site and grand colonial relics.",
  "heroDescription": "A 2,000-year-old capital on the Ganges, layered with Mauryan history, Sikh heritage and great museums.",
  "coordinates": {
    "lat": 25.59388889,
    "lng": 85.1375
  },
  "stats": {
    "bestTime": "Oct – Mar",
    "budget": "₹1,500 – ₹4,000/day",
    "language": "Hindi, Bhojpuri, Magahi",
    "currency": "INR (Rupee)"
  },
  "vibes": [
    "Historical",
    "Cultural",
    "Spiritual"
  ],
  "gradient": "from-amber-600 via-yellow-500 to-orange-400",
  "accentColor": "#D97706",
  "image": "/city-images/patna.jpg",
  "heroImage": "/city-images/patna.jpg",
  "areas": [
    {
      "name": "Top Sights",
      "emoji": "🏛️",
      "accentColor": "#D97706",
      "image": "/city-images/patna.jpg",
      "tagline": "History along the Ganges",
      "spots": [
        {
          "name": "Takht Sri Patna Sahib",
          "tag": "Cultural"
        },
        {
          "name": "Bihar Museum",
          "tag": "Cultural"
        },
        {
          "name": "Golghar",
          "tag": "Scenic"
        },
        {
          "name": "Kumhrar",
          "tag": "Historical"
        }
      ]
    }
  ],
  "thingsToDo": [
    {
      "name": "Takht Sri Patna Sahib",
      "description": "A golden-domed gurudwara marking the birthplace of Guru Gobind Singh, one of Sikhism’s five holiest seats.",
      "icon": "🛕",
      "duration": "1–2 hours",
      "category": "Cultural"
    },
    {
      "name": "Bihar Museum",
      "description": "A world-class modern museum showcasing Mauryan bronzes, the famous Didarganj Yakshi and regional history.",
      "icon": "🏛️",
      "duration": "2–3 hours",
      "category": "Cultural"
    },
    {
      "name": "Golghar",
      "description": "A giant beehive-shaped granary from 1786 with spiral stairs and sweeping views over the river.",
      "icon": "🏯",
      "duration": "1–2 hours",
      "category": "Scenic"
    },
    {
      "name": "Kumhrar",
      "description": "Excavated ruins of ancient Pataliputra, including the pillared Mauryan assembly hall.",
      "icon": "🏛️",
      "duration": "1–2 hours",
      "category": "Historical"
    }
  ],
  "monthByMonth": {
    "summary": "Patna has an extreme Gangetic-plain climate — cold, foggy winters, a brutal summer from April to June, a humid monsoon July–September, and a lovely post-monsoon window that includes the region's biggest festival, Chhath Puja.",
    "bestMonths": ["November", "December", "January", "February"],
    "avoidMonths": ["May", "June"],
    "months": [
      { "month": "January", "short": "Jan", "rating": "good", "weather": "Cold, dense fog common", "temp": "8–19°C", "crowds": "Moderate", "price": "Moderate", "highlight": "Museums and riverside walks in crisp winter air" },
      { "month": "February", "short": "Feb", "rating": "excellent", "weather": "Mild, fog clearing", "temp": "12–25°C", "crowds": "Moderate", "price": "Moderate", "highlight": "Comfortable sightseeing weather" },
      { "month": "March", "short": "Mar", "rating": "good", "weather": "Warming quickly, dry", "temp": "17–31°C", "crowds": "Moderate", "price": "Moderate", "highlight": "Holi celebrated widely across the city" },
      { "month": "April", "short": "Apr", "rating": "average", "weather": "Hot, dry", "temp": "22–37°C", "crowds": "Low", "price": "Low", "highlight": "Heat builds fast — plan for mornings" },
      { "month": "May", "short": "May", "rating": "avoid", "weather": "Extreme pre-monsoon heat", "temp": "26–41°C", "crowds": "Low", "price": "Low", "highlight": "One of the hottest months on the Gangetic plain" },
      { "month": "June", "short": "Jun", "rating": "avoid", "weather": "Very hot and humid before monsoon breaks", "temp": "27–40°C", "crowds": "Low", "price": "Low", "highlight": "Oppressive humidity ahead of the rains" },
      { "month": "July", "short": "Jul", "rating": "average", "weather": "Monsoon rains, high humidity", "temp": "26–34°C", "crowds": "Low", "price": "Low", "highlight": "Ganges rises noticeably along the ghats" },
      { "month": "August", "short": "Aug", "rating": "average", "weather": "Heavy rainfall, flood-prone", "temp": "26–33°C", "crowds": "Low", "price": "Low", "highlight": "Independence Day events at the Bihar Museum" },
      { "month": "September", "short": "Sep", "rating": "good", "weather": "Rain tapering, humid", "temp": "25–33°C", "crowds": "Moderate", "price": "Moderate", "highlight": "Durga Puja preparations begin" },
      { "month": "October", "short": "Oct", "rating": "excellent", "weather": "Clear, warm days, cool nights", "temp": "19–31°C", "crowds": "High", "price": "High", "highlight": "Durga Puja festivities across the city" },
      { "month": "November", "short": "Nov", "rating": "excellent", "weather": "Cool and pleasant", "temp": "14–28°C", "crowds": "Peak", "price": "Peak", "highlight": "Chhath Puja — the city's grandest riverside festival, with huge crowds at the ghats" },
      { "month": "December", "short": "Dec", "rating": "good", "weather": "Cold, some fog", "temp": "9–23°C", "crowds": "Moderate", "price": "Moderate", "highlight": "Pleasant, quiet winter touring" }
    ]
  }
},
{
  "stub": false,
  "slug": "nagpur",
  "name": "Nagpur",
  "state": "Maharashtra",
  "country": "India",
  "flag": "🇮🇳",
  "tagline": "The Orange City",
  "description": "At the geographic heart of India, Nagpur is famous for its oranges, fiery Saoji cuisine and Deekshabhoomi — and serves as the gateway to the tiger reserves of Tadoba and Pench.",
  "heroDescription": "Central India’s green, orderly “Orange City”, gateway to the country’s best tiger country.",
  "coordinates": {
    "lat": 21.1458,
    "lng": 79.0882
  },
  "stats": {
    "bestTime": "Oct – Mar",
    "budget": "₹1,500 – ₹4,000/day",
    "language": "Marathi, Hindi",
    "currency": "INR (Rupee)"
  },
  "vibes": [
    "Cultural",
    "Wildlife",
    "Foodie"
  ],
  "gradient": "from-orange-600 via-amber-500 to-yellow-400",
  "accentColor": "#EA580C",
  "image": "/city-images/nagpur.jpg",
  "heroImage": "/city-images/nagpur.jpg",
  "areas": [
    {
      "name": "Top Sights",
      "emoji": "🐯",
      "accentColor": "#EA580C",
      "image": "/city-images/nagpur.jpg",
      "tagline": "Monuments, lakes and tiger gateways",
      "spots": [
        {
          "name": "Deekshabhoomi",
          "tag": "Cultural"
        },
        {
          "name": "Sitabuldi Fort",
          "tag": "Historical"
        },
        {
          "name": "Futala Lake",
          "tag": "Relaxation"
        },
        {
          "name": "Tadoba day trip",
          "tag": "Nature"
        }
      ]
    }
  ],
  "thingsToDo": [
    {
      "name": "Deekshabhoomi",
      "description": "A vast white-domed stupa marking where Dr B. R. Ambedkar embraced Buddhism with half a million followers in 1956.",
      "icon": "🛕",
      "duration": "1–2 hours",
      "category": "Cultural"
    },
    {
      "name": "Sitabuldi Fort",
      "description": "A hilltop fort in the city centre, site of a decisive 1817 battle, with views across Nagpur.",
      "icon": "🏯",
      "duration": "1–2 hours",
      "category": "Historical"
    },
    {
      "name": "Futala Lake",
      "description": "A century-old lake lit by musical fountains in the evening, lined with street-food stalls.",
      "icon": "🏞️",
      "duration": "1–2 hours",
      "category": "Relaxation"
    },
    {
      "name": "Tadoba day trip",
      "description": "Drive to Tadoba-Andhari Tiger Reserve, among the best places in India to spot wild tigers.",
      "icon": "🐯",
      "duration": "Full day",
      "category": "Nature"
    }
  ],
  "monthByMonth": {
    "summary": "Nagpur is notorious for one of India's harshest summers — dry, blistering heat from March through June, a moderate monsoon June–September, and a genuinely lovely winter that also happens to be the best season for Tadoba tiger safaris.",
    "bestMonths": ["November", "December", "January", "February"],
    "avoidMonths": ["April", "May"],
    "months": [
      { "month": "January", "short": "Jan", "rating": "excellent", "weather": "Cool, dry and sunny", "temp": "11–28°C", "crowds": "High", "price": "High", "highlight": "Peak season for Tadoba tiger safaris" },
      { "month": "February", "short": "Feb", "rating": "excellent", "weather": "Mild, warming gradually", "temp": "14–31°C", "crowds": "High", "price": "High", "highlight": "Still excellent for wildlife and city sightseeing" },
      { "month": "March", "short": "Mar", "rating": "average", "weather": "Heat builds rapidly", "temp": "19–37°C", "crowds": "Moderate", "price": "Moderate", "highlight": "Last comfortable window before extreme heat" },
      { "month": "April", "short": "Apr", "rating": "avoid", "weather": "Severe heat begins", "temp": "24–42°C", "crowds": "Low", "price": "Low", "highlight": "Among the hottest cities in India this month" },
      { "month": "May", "short": "May", "rating": "avoid", "weather": "Extreme, often India's hottest readings", "temp": "27–45°C", "crowds": "Low", "price": "Low", "highlight": "Frequently records some of the highest temperatures in the country" },
      { "month": "June", "short": "Jun", "rating": "avoid", "weather": "Scorching until monsoon arrives late in the month", "temp": "26–42°C", "crowds": "Low", "price": "Low", "highlight": "Relief only arrives with the monsoon's onset" },
      { "month": "July", "short": "Jul", "rating": "average", "weather": "Monsoon rains bring real relief", "temp": "23–31°C", "crowds": "Low", "price": "Low", "highlight": "Tiger reserves close for the breeding season" },
      { "month": "August", "short": "Aug", "rating": "average", "weather": "Steady monsoon rainfall", "temp": "23–30°C", "crowds": "Low", "price": "Low", "highlight": "City parks and lakes at their greenest" },
      { "month": "September", "short": "Sep", "rating": "good", "weather": "Rain easing, humid", "temp": "23–31°C", "crowds": "Moderate", "price": "Moderate", "highlight": "Tiger reserves reopen toward month's end" },
      { "month": "October", "short": "Oct", "rating": "excellent", "weather": "Clearing skies, warm days", "temp": "20–33°C", "crowds": "High", "price": "High", "highlight": "Orange harvest season begins" },
      { "month": "November", "short": "Nov", "rating": "excellent", "weather": "Cool, dry and comfortable", "temp": "15–30°C", "crowds": "High", "price": "High", "highlight": "Ideal for Deekshabhoomi and lake visits" },
      { "month": "December", "short": "Dec", "rating": "excellent", "weather": "Cool, pleasant days", "temp": "11–28°C", "crowds": "High", "price": "High", "highlight": "Peak season, Futala Lake illuminations" }
    ]
  }
},
{
  "stub": false,
  "slug": "indore",
  "name": "Indore",
  "state": "Madhya Pradesh",
  "country": "India",
  "flag": "🇮🇳",
  "tagline": "India’s Food Capital",
  "description": "Madhya Pradesh’s largest city and India’s cleanest, Indore pairs the palaces of the Holkar dynasty with a legendary street-food scene — from the all-day snacks of Chappan Dukan to the midnight feasts of Sarafa Bazaar.",
  "heroDescription": "A buzzing Holkar-era city famous for royal palaces and the best street food in India.",
  "coordinates": {
    "lat": 22.71861111,
    "lng": 75.855
  },
  "stats": {
    "bestTime": "Oct – Mar",
    "budget": "₹1,500 – ₹4,000/day",
    "language": "Hindi, Malwi",
    "currency": "INR (Rupee)"
  },
  "vibes": [
    "Foodie",
    "Cultural",
    "Historical"
  ],
  "gradient": "from-pink-600 via-rose-500 to-orange-400",
  "accentColor": "#DB2777",
  "image": "/city-images/indore.jpg",
  "heroImage": "/city-images/indore.jpg",
  "areas": [
    {
      "name": "Top Sights",
      "emoji": "🍲",
      "accentColor": "#DB2777",
      "image": "/city-images/indore.jpg",
      "tagline": "Palaces and street-food legends",
      "spots": [
        {
          "name": "Rajwada Palace",
          "tag": "Cultural"
        },
        {
          "name": "Sarafa Bazaar",
          "tag": "Culinary"
        },
        {
          "name": "Lal Bagh Palace",
          "tag": "Cultural"
        },
        {
          "name": "Chappan Dukan",
          "tag": "Culinary"
        }
      ]
    }
  ],
  "thingsToDo": [
    {
      "name": "Rajwada Palace",
      "description": "The seven-storey Holkar palace gateway, a fusion of Maratha, Mughal and French style overlooking the old city.",
      "icon": "🏰",
      "duration": "1–2 hours",
      "category": "Cultural"
    },
    {
      "name": "Sarafa Bazaar",
      "description": "A jewellery market by day that transforms into a buzzing night food street after the shops shut.",
      "icon": "🍲",
      "duration": "2–3 hours",
      "category": "Culinary"
    },
    {
      "name": "Lal Bagh Palace",
      "description": "An opulent Holkar mansion of European grandeur, with gilded halls and landscaped grounds.",
      "icon": "🏰",
      "duration": "1–2 hours",
      "category": "Cultural"
    },
    {
      "name": "Chappan Dukan",
      "description": "A famous lane of 56 shops serving every Indori snack imaginable, from poha-jalebi to garadu.",
      "icon": "🍢",
      "duration": "1–2 hours",
      "category": "Culinary"
    }
  ],
  "monthByMonth": {
    "summary": "Indore has a typical Malwa-plateau climate — a hot, dry summer peaking in May, a moderate monsoon June–September, and a long, comfortable winter that's ideal for its famous night food streets.",
    "bestMonths": ["October", "November", "December", "February"],
    "avoidMonths": ["April", "May"],
    "months": [
      { "month": "January", "short": "Jan", "rating": "good", "weather": "Cool, occasionally chilly at night", "temp": "9–24°C", "crowds": "Moderate", "price": "Moderate", "highlight": "Great weather for Sarafa Bazaar's night food crowds" },
      { "month": "February", "short": "Feb", "rating": "excellent", "weather": "Mild and dry", "temp": "13–29°C", "crowds": "Moderate", "price": "Moderate", "highlight": "Comfortable palace and market touring" },
      { "month": "March", "short": "Mar", "rating": "good", "weather": "Warming up, dry", "temp": "17–33°C", "crowds": "Moderate", "price": "Moderate", "highlight": "Holi celebrated with local flair" },
      { "month": "April", "short": "Apr", "rating": "avoid", "weather": "Hot, dry heat sets in", "temp": "21–38°C", "crowds": "Low", "price": "Low", "highlight": "Best kept to evenings at Chappan Dukan" },
      { "month": "May", "short": "May", "rating": "avoid", "weather": "Peak summer heat", "temp": "25–40°C", "crowds": "Low", "price": "Low", "highlight": "Hottest month, daytime sightseeing tough" },
      { "month": "June", "short": "Jun", "rating": "average", "weather": "Hot with pre-monsoon showers", "temp": "24–37°C", "crowds": "Low", "price": "Low", "highlight": "Relief arrives as the monsoon nears" },
      { "month": "July", "short": "Jul", "rating": "good", "weather": "Monsoon rains, cooler and green", "temp": "22–29°C", "crowds": "Moderate", "price": "Moderate", "highlight": "Lal Bagh Palace grounds turn lush" },
      { "month": "August", "short": "Aug", "rating": "good", "weather": "Steady monsoon showers", "temp": "22–28°C", "crowds": "Moderate", "price": "Moderate", "highlight": "Comfortable, rain-cooled city streets" },
      { "month": "September", "short": "Sep", "rating": "good", "weather": "Rain easing, humid", "temp": "22–30°C", "crowds": "Moderate", "price": "Moderate", "highlight": "Ganesh Chaturthi celebrated widely" },
      { "month": "October", "short": "Oct", "rating": "excellent", "weather": "Clear skies, warm days", "temp": "18–32°C", "crowds": "High", "price": "High", "highlight": "Navratri and Diwali food-market season" },
      { "month": "November", "short": "Nov", "rating": "excellent", "weather": "Cool and pleasant", "temp": "13–29°C", "crowds": "High", "price": "High", "highlight": "Peak season for the night food streets" },
      { "month": "December", "short": "Dec", "rating": "excellent", "weather": "Cool, crisp evenings", "temp": "9–26°C", "crowds": "High", "price": "High", "highlight": "Best month for Sarafa Bazaar and Rajwada evenings" }
    ]
  }
},
{
  "stub": false,
  "slug": "raipur",
  "name": "Raipur",
  "state": "Chhattisgarh",
  "country": "India",
  "flag": "🇮🇳",
  "tagline": "Capital of Chhattisgarh",
  "description": "A fast-growing capital in the heart of Chhattisgarh, Raipur is a handy base for the state’s temples, lakes and tribal-art museums, and a launch point for the waterfalls and forests of Bastar.",
  "heroDescription": "Chhattisgarh’s green capital — lakes, temples and museums, and a gateway to central India’s wilds.",
  "coordinates": {
    "lat": 21.24444444,
    "lng": 81.63055556
  },
  "stats": {
    "bestTime": "Oct – Feb",
    "budget": "₹1,300 – ₹3,500/day",
    "language": "Hindi, Chhattisgarhi",
    "currency": "INR (Rupee)"
  },
  "vibes": [
    "Cultural",
    "Nature"
  ],
  "gradient": "from-green-600 via-emerald-500 to-teal-400",
  "accentColor": "#16A34A",
  "image": "/city-images/raipur.jpg",
  "heroImage": "/city-images/raipur.jpg",
  "areas": [
    {
      "name": "Top Sights",
      "emoji": "🏞️",
      "accentColor": "#16A34A",
      "image": "/city-images/raipur.jpg",
      "tagline": "Lakes, museums and temples",
      "spots": [
        {
          "name": "Mahant Ghasidas Museum",
          "tag": "Cultural"
        },
        {
          "name": "Nandan Van Jungle Safari",
          "tag": "Nature"
        },
        {
          "name": "Vivekananda Sarovar (Burha Talab)",
          "tag": "Relaxation"
        },
        {
          "name": "Purkhauti Muktangan",
          "tag": "Cultural"
        }
      ]
    }
  ],
  "thingsToDo": [
    {
      "name": "Mahant Ghasidas Museum",
      "description": "A state museum rich in tribal art, ancient sculpture and Chhattisgarhi heritage.",
      "icon": "🏛️",
      "duration": "1–2 hours",
      "category": "Cultural"
    },
    {
      "name": "Nandan Van Jungle Safari",
      "description": "A large safari park and zoo with herbivore and predator zones on the city’s edge.",
      "icon": "🦁",
      "duration": "Half day",
      "category": "Nature"
    },
    {
      "name": "Vivekananda Sarovar (Burha Talab)",
      "description": "A historic lake with a towering Swami Vivekananda statue, lit up in the evenings.",
      "icon": "🏞️",
      "duration": "1–2 hours",
      "category": "Relaxation"
    },
    {
      "name": "Purkhauti Muktangan",
      "description": "An open-air museum recreating Chhattisgarh’s villages, tribal life and folk art.",
      "icon": "🎭",
      "duration": "1–2 hours",
      "category": "Cultural"
    }
  ],
  "monthByMonth": {
    "summary": "Raipur has a hot, humid central-Indian climate — a fierce dry summer through April–June, a heavy monsoon June–September, and a short but pleasant winter from October to February that is by far the best time to visit.",
    "bestMonths": ["November", "December", "January"],
    "avoidMonths": ["April", "May"],
    "months": [
      { "month": "January", "short": "Jan", "rating": "excellent", "weather": "Cool, dry mornings", "temp": "10–26°C", "crowds": "Moderate", "price": "Moderate", "highlight": "Best month for museum and lake visits" },
      { "month": "February", "short": "Feb", "rating": "good", "weather": "Mild, warming by month's end", "temp": "13–30°C", "crowds": "Moderate", "price": "Moderate", "highlight": "Still comfortable before the heat builds" },
      { "month": "March", "short": "Mar", "rating": "average", "weather": "Heat building quickly", "temp": "18–35°C", "crowds": "Low", "price": "Low", "highlight": "Holi celebrated across the city" },
      { "month": "April", "short": "Apr", "rating": "avoid", "weather": "Hot and dry", "temp": "23–40°C", "crowds": "Low", "price": "Low", "highlight": "Daytime heat makes sightseeing tough" },
      { "month": "May", "short": "May", "rating": "avoid", "weather": "Peak summer heat", "temp": "26–42°C", "crowds": "Low", "price": "Low", "highlight": "Hottest month of the year" },
      { "month": "June", "short": "Jun", "rating": "average", "weather": "Hot with pre-monsoon showers", "temp": "25–37°C", "crowds": "Low", "price": "Low", "highlight": "Monsoon relief arrives late in the month" },
      { "month": "July", "short": "Jul", "rating": "average", "weather": "Heavy monsoon rain", "temp": "24–31°C", "crowds": "Low", "price": "Low", "highlight": "Lakes and jungle-safari park turn lush" },
      { "month": "August", "short": "Aug", "rating": "average", "weather": "Sustained monsoon rainfall", "temp": "24–30°C", "crowds": "Low", "price": "Low", "highlight": "Green season around Purkhauti Muktangan" },
      { "month": "September", "short": "Sep", "rating": "good", "weather": "Rain easing, humid", "temp": "23–30°C", "crowds": "Moderate", "price": "Moderate", "highlight": "Ganesh festival season" },
      { "month": "October", "short": "Oct", "rating": "excellent", "weather": "Clearing skies, warm days", "temp": "19–32°C", "crowds": "High", "price": "High", "highlight": "Navratri and Durga Puja celebrations" },
      { "month": "November", "short": "Nov", "rating": "excellent", "weather": "Cool and dry", "temp": "13–29°C", "crowds": "High", "price": "High", "highlight": "Ideal season for Bastar day trips" },
      { "month": "December", "short": "Dec", "rating": "excellent", "weather": "Cool, pleasant days", "temp": "9–26°C", "crowds": "High", "price": "High", "highlight": "Best month overall, comfortable touring" }
    ]
  }
},
{
  "stub": false,
  "slug": "vijayawada",
  "name": "Vijayawada",
  "state": "Andhra Pradesh",
  "country": "India",
  "flag": "🇮🇳",
  "tagline": "The Place of Victory",
  "description": "On the banks of the Krishna River beneath the Indrakeeladri hill, Vijayawada is a major commercial hub crowned by the Kanaka Durga temple, ancient rock-cut caves and the long Prakasam Barrage.",
  "heroDescription": "A riverside Andhra city of hilltop temples, rock-cut caves and a barrage strung with lights.",
  "coordinates": {
    "lat": 16.5144,
    "lng": 80.6192
  },
  "stats": {
    "bestTime": "Oct – Mar",
    "budget": "₹1,400 – ₹3,800/day",
    "language": "Telugu",
    "currency": "INR (Rupee)"
  },
  "vibes": [
    "Spiritual",
    "Cultural"
  ],
  "gradient": "from-cyan-600 via-sky-500 to-blue-400",
  "accentColor": "#0891B2",
  "image": "/city-images/vijayawada.jpg",
  "heroImage": "/city-images/vijayawada.jpg",
  "areas": [
    {
      "name": "Top Sights",
      "emoji": "🛕",
      "accentColor": "#0891B2",
      "image": "/city-images/vijayawada.jpg",
      "tagline": "Temples, caves and the Krishna",
      "spots": [
        {
          "name": "Kanaka Durga Temple",
          "tag": "Cultural"
        },
        {
          "name": "Undavalli Caves",
          "tag": "Historical"
        },
        {
          "name": "Prakasam Barrage",
          "tag": "Scenic"
        },
        {
          "name": "Bhavani Island",
          "tag": "Relaxation"
        }
      ]
    }
  ],
  "thingsToDo": [
    {
      "name": "Kanaka Durga Temple",
      "description": "The hilltop shrine to the goddess Durga on Indrakeeladri, with sweeping views over the river city.",
      "icon": "🛕",
      "duration": "1–2 hours",
      "category": "Cultural"
    },
    {
      "name": "Undavalli Caves",
      "description": "Monolithic rock-cut caves from the 4th–5th century, including a huge reclining Vishnu carved from a single block.",
      "icon": "🕳️",
      "duration": "1–2 hours",
      "category": "Historical"
    },
    {
      "name": "Prakasam Barrage",
      "description": "A kilometre-long barrage across the Krishna, lit up at night and lined with a lakefront promenade.",
      "icon": "🌉",
      "duration": "1–2 hours",
      "category": "Scenic"
    },
    {
      "name": "Bhavani Island",
      "description": "One of India’s largest river islands, a green getaway for boating and picnics mid-river.",
      "icon": "🏝️",
      "duration": "Half day",
      "category": "Relaxation"
    }
  ],
  "monthByMonth": {
    "summary": "Vijayawada sits in one of coastal Andhra's hottest pockets — a brutal summer from March to June, a humid monsoon influenced by both southwest and northeast systems June–November, and a short, warm-but-comfortable winter.",
    "bestMonths": ["December", "January", "February"],
    "avoidMonths": ["April", "May"],
    "months": [
      { "month": "January", "short": "Jan", "rating": "excellent", "weather": "Warm days, cool nights", "temp": "17–29°C", "crowds": "High", "price": "High", "highlight": "Best month for the Kanaka Durga Temple and river views" },
      { "month": "February", "short": "Feb", "rating": "excellent", "weather": "Warm and dry", "temp": "20–32°C", "crowds": "Moderate", "price": "Moderate", "highlight": "Comfortable before the heat sets in" },
      { "month": "March", "short": "Mar", "rating": "average", "weather": "Heat rising quickly", "temp": "24–36°C", "crowds": "Low", "price": "Low", "highlight": "Best done in early morning or evening" },
      { "month": "April", "short": "Apr", "rating": "avoid", "weather": "Very hot and dry", "temp": "27–40°C", "crowds": "Low", "price": "Low", "highlight": "One of Andhra's hottest cities this month" },
      { "month": "May", "short": "May", "rating": "avoid", "weather": "Extreme pre-monsoon heat", "temp": "28–42°C", "crowds": "Low", "price": "Low", "highlight": "Hottest month, best avoided" },
      { "month": "June", "short": "Jun", "rating": "average", "weather": "Hot, first monsoon showers", "temp": "26–38°C", "crowds": "Low", "price": "Low", "highlight": "Krishna River begins to rise" },
      { "month": "July", "short": "Jul", "rating": "average", "weather": "Humid with monsoon rain", "temp": "25–33°C", "crowds": "Low", "price": "Low", "highlight": "Prakasam Barrage at its most dramatic" },
      { "month": "August", "short": "Aug", "rating": "average", "weather": "Continued monsoon rainfall", "temp": "24–32°C", "crowds": "Low", "price": "Low", "highlight": "Bhavani Island lush and green" },
      { "month": "September", "short": "Sep", "rating": "good", "weather": "Rain easing, still humid", "temp": "24–33°C", "crowds": "Moderate", "price": "Moderate", "highlight": "Vinayaka Chavithi celebrations citywide" },
      { "month": "October", "short": "Oct", "rating": "good", "weather": "Northeast monsoon brings scattered showers", "temp": "22–33°C", "crowds": "Moderate", "price": "Moderate", "highlight": "Dussehra festivities across the city" },
      { "month": "November", "short": "Nov", "rating": "good", "weather": "Showers easing, warm", "temp": "19–31°C", "crowds": "Moderate", "price": "Moderate", "highlight": "Cooler evenings return along the river" },
      { "month": "December", "short": "Dec", "rating": "excellent", "weather": "Warm days, pleasantly cool nights", "temp": "16–29°C", "crowds": "High", "price": "High", "highlight": "Best season for Undavalli Caves day trips" }
    ]
  }
},
{
  "stub": false,
  "slug": "port-blair",
  "name": "Port Blair",
  "state": "Andaman & Nicobar Islands",
  "country": "India",
  "flag": "🇮🇳",
  "tagline": "Gateway to the Andamans",
  "description": "The island capital of the Andamans wraps colonial history and turquoise seas together — the haunting Cellular Jail, museum-lined harbour and ferries out to the white sands of Havelock and Neil.",
  "heroDescription": "A harbour capital of poignant history and tropical blue, and the launch point for the Andaman islands.",
  "coordinates": {
    "lat": 11.66833333,
    "lng": 92.73777778
  },
  "stats": {
    "bestTime": "Oct – May",
    "budget": "₹2,500 – ₹6,000/day",
    "language": "Hindi, Bengali, Tamil, English",
    "currency": "INR (Rupee)"
  },
  "vibes": [
    "Beach",
    "Historical",
    "Adventure"
  ],
  "gradient": "from-sky-600 via-cyan-500 to-teal-400",
  "accentColor": "#0EA5E9",
  "image": "/city-images/port-blair.jpg",
  "heroImage": "/city-images/port-blair.jpg",
  "areas": [
    {
      "name": "Top Sights",
      "emoji": "🏝️",
      "accentColor": "#0EA5E9",
      "image": "/city-images/port-blair.jpg",
      "tagline": "History, harbours and island ferries",
      "spots": [
        {
          "name": "Cellular Jail",
          "tag": "Historical"
        },
        {
          "name": "Ross Island",
          "tag": "Historical"
        },
        {
          "name": "Corbyn’s Cove Beach",
          "tag": "Relaxation"
        },
        {
          "name": "Chidiya Tapu",
          "tag": "Scenic"
        }
      ]
    }
  ],
  "thingsToDo": [
    {
      "name": "Cellular Jail",
      "description": "The colonial-era “Kala Pani” prison, now a national memorial with a moving evening light-and-sound show.",
      "icon": "🏛️",
      "duration": "2–3 hours",
      "category": "Historical"
    },
    {
      "name": "Ross Island",
      "description": "A short boat ride to the overgrown ruins of the former British administrative HQ, now roamed by deer and peacocks.",
      "icon": "🏝️",
      "duration": "Half day",
      "category": "Historical"
    },
    {
      "name": "Corbyn’s Cove Beach",
      "description": "The closest beach to town, a palm-lined cove good for a swim and watersports.",
      "icon": "🏖️",
      "duration": "1–2 hours",
      "category": "Relaxation"
    },
    {
      "name": "Chidiya Tapu",
      "description": "A forest-and-shore sunset point famous for birdlife and golden-hour views.",
      "icon": "🌅",
      "duration": "1–2 hours",
      "category": "Scenic"
    }
  ],
  "monthByMonth": {
    "summary": "Port Blair has a tropical island climate that is completely different from mainland India — warm and humid nearly year-round with little temperature variation, split into a drier season from November to April and a wet season dominated by the southwest monsoon from May to September.",
    "bestMonths": ["December", "January", "February", "March"],
    "avoidMonths": ["June", "July", "August"],
    "months": [
      { "month": "January", "short": "Jan", "rating": "excellent", "weather": "Warm, dry, calm seas", "temp": "23–28°C", "crowds": "High", "price": "High", "highlight": "Best diving and ferry conditions to Havelock and Neil" },
      { "month": "February", "short": "Feb", "rating": "excellent", "weather": "Warm and dry, clear skies", "temp": "23–29°C", "crowds": "High", "price": "High", "highlight": "Excellent visibility for snorkelling and diving" },
      { "month": "March", "short": "Mar", "rating": "excellent", "weather": "Warm, humidity still manageable", "temp": "24–30°C", "crowds": "High", "price": "High", "highlight": "Peak season winding down but seas still calm" },
      { "month": "April", "short": "Apr", "rating": "good", "weather": "Hot and increasingly humid", "temp": "25–31°C", "crowds": "Moderate", "price": "Moderate", "highlight": "Warmest of the dry months, sea still swimmable" },
      { "month": "May", "short": "May", "rating": "average", "weather": "Very humid, pre-monsoon build-up", "temp": "25–31°C", "crowds": "Low", "price": "Low", "highlight": "Monsoon approaches, seas can turn choppy" },
      { "month": "June", "short": "Jun", "rating": "avoid", "weather": "Southwest monsoon breaks, heavy rain", "temp": "24–30°C", "crowds": "Low", "price": "Low", "highlight": "Ferries to outer islands frequently disrupted" },
      { "month": "July", "short": "Jul", "rating": "avoid", "weather": "Sustained monsoon rainfall, rough seas", "temp": "24–29°C", "crowds": "Low", "price": "Low", "highlight": "Poor visibility for diving, choppy inter-island ferries" },
      { "month": "August", "short": "Aug", "rating": "avoid", "weather": "Continued heavy rain", "temp": "24–29°C", "crowds": "Low", "price": "Low", "highlight": "Wettest stretch of the year" },
      { "month": "September", "short": "Sep", "rating": "average", "weather": "Rain easing but still frequent", "temp": "24–30°C", "crowds": "Low", "price": "Low", "highlight": "Transitional month, book activities flexibly" },
      { "month": "October", "short": "Oct", "rating": "good", "weather": "Rain tapering off, seas calming", "temp": "24–30°C", "crowds": "Moderate", "price": "Moderate", "highlight": "Diving conditions start improving" },
      { "month": "November", "short": "Nov", "rating": "good", "weather": "Occasional showers from a lighter northeast spell", "temp": "23–30°C", "crowds": "Moderate", "price": "Moderate", "highlight": "Good value before peak season begins" },
      { "month": "December", "short": "Dec", "rating": "excellent", "weather": "Dry, sunny, calm seas", "temp": "22–29°C", "crowds": "High", "price": "High", "highlight": "Peak season begins, ideal for island-hopping" }
    ]
  }
},
{
  "stub": false,
  "slug": "ranchi",
  "name": "Ranchi",
  "state": "Jharkhand",
  "country": "India",
  "flag": "🇮🇳",
  "tagline": "City of Waterfalls",
  "description": "The capital of Jharkhand sits on a cool plateau ringed by tumbling waterfalls and forested hills — a former colonial hill retreat that’s now a green, easygoing gateway to tribal heartland.",
  "heroDescription": "A breezy plateau capital encircled by waterfalls, hills and lakes in India’s tribal heartland.",
  "coordinates": {
    "lat": 23.36,
    "lng": 85.33
  },
  "stats": {
    "bestTime": "Oct – Mar",
    "budget": "₹1,300 – ₹3,500/day",
    "language": "Hindi, Nagpuri",
    "currency": "INR (Rupee)"
  },
  "vibes": [
    "Nature",
    "Adventure"
  ],
  "gradient": "from-teal-600 via-emerald-500 to-green-400",
  "accentColor": "#0D9488",
  "image": "/city-images/ranchi.jpg",
  "heroImage": "/city-images/ranchi.jpg",
  "areas": [
    {
      "name": "Top Sights",
      "emoji": "💦",
      "accentColor": "#0D9488",
      "image": "/city-images/ranchi.jpg",
      "tagline": "Waterfalls, hills and gardens",
      "spots": [
        {
          "name": "Hundru Falls",
          "tag": "Nature"
        },
        {
          "name": "Rock Garden & Kanke Dam",
          "tag": "Relaxation"
        },
        {
          "name": "Tagore Hill",
          "tag": "Scenic"
        },
        {
          "name": "Jagannath Temple",
          "tag": "Cultural"
        }
      ]
    }
  ],
  "thingsToDo": [
    {
      "name": "Hundru Falls",
      "description": "A spectacular 98-metre waterfall where the Subarnarekha river plunges over rocky ledges.",
      "icon": "💦",
      "duration": "Half day",
      "category": "Nature"
    },
    {
      "name": "Rock Garden & Kanke Dam",
      "description": "Terraced rock gardens beside a scenic dam, a favourite spot for sunset and boating.",
      "icon": "🌳",
      "duration": "1–2 hours",
      "category": "Relaxation"
    },
    {
      "name": "Tagore Hill",
      "description": "A historic hillock linked to the Tagore family, with a short climb to panoramic city views.",
      "icon": "⛰️",
      "duration": "1–2 hours",
      "category": "Scenic"
    },
    {
      "name": "Jagannath Temple",
      "description": "A 17th-century hilltop temple modelled on Puri’s Jagannath shrine, with its own Rath Yatra.",
      "icon": "🛕",
      "duration": "1–2 hours",
      "category": "Cultural"
    }
  ],
  "monthByMonth": {
    "summary": "Ranchi's plateau elevation gives it a noticeably milder climate than the neighbouring plains — a comfortable winter, a warm but manageable summer, and a proper monsoon from June to September that fills its many waterfalls.",
    "bestMonths": ["October", "November", "February", "March"],
    "avoidMonths": ["May", "June"],
    "months": [
      { "month": "January", "short": "Jan", "rating": "good", "weather": "Cold, crisp mornings", "temp": "8–22°C", "crowds": "Moderate", "price": "Moderate", "highlight": "Cool plateau air, good for hill viewpoints" },
      { "month": "February", "short": "Feb", "rating": "excellent", "weather": "Mild and pleasant", "temp": "12–26°C", "crowds": "Moderate", "price": "Moderate", "highlight": "Comfortable for waterfall and temple visits" },
      { "month": "March", "short": "Mar", "rating": "excellent", "weather": "Warm days, cool evenings", "temp": "16–30°C", "crowds": "Moderate", "price": "Moderate", "highlight": "Sarhul festival celebrated by local tribal communities" },
      { "month": "April", "short": "Apr", "rating": "good", "weather": "Warm, dry", "temp": "20–34°C", "crowds": "Low", "price": "Low", "highlight": "Milder than the plains thanks to plateau elevation" },
      { "month": "May", "short": "May", "rating": "avoid", "weather": "Hottest month, dry heat", "temp": "23–37°C", "crowds": "Low", "price": "Low", "highlight": "Best kept to early mornings" },
      { "month": "June", "short": "Jun", "rating": "avoid", "weather": "Hot with pre-monsoon humidity", "temp": "23–35°C", "crowds": "Low", "price": "Low", "highlight": "Relief arrives as monsoon nears" },
      { "month": "July", "short": "Jul", "rating": "average", "weather": "Monsoon rains, cooler", "temp": "22–29°C", "crowds": "Low", "price": "Low", "highlight": "Hundru Falls swells to full force" },
      { "month": "August", "short": "Aug", "rating": "average", "weather": "Steady monsoon rainfall", "temp": "22–28°C", "crowds": "Low", "price": "Low", "highlight": "Lush green plateau scenery" },
      { "month": "September", "short": "Sep", "rating": "good", "weather": "Rain easing, humid", "temp": "21–29°C", "crowds": "Moderate", "price": "Moderate", "highlight": "Waterfalls still flowing strong" },
      { "month": "October", "short": "Oct", "rating": "excellent", "weather": "Clear skies, warm days", "temp": "17–29°C", "crowds": "High", "price": "High", "highlight": "Durga Puja and Dussehra celebrations citywide" },
      { "month": "November", "short": "Nov", "rating": "excellent", "weather": "Cool and dry", "temp": "12–27°C", "crowds": "High", "price": "High", "highlight": "Best month overall for waterfalls and hills" },
      { "month": "December", "short": "Dec", "rating": "good", "weather": "Cold, clear nights", "temp": "8–24°C", "crowds": "Moderate", "price": "Moderate", "highlight": "Chilly but scenic, good for Tagore Hill sunsets" }
    ]
  }
},
{
  "stub": false,
  "slug": "salem",
  "name": "Salem",
  "state": "Tamil Nadu",
  "country": "India",
  "flag": "🇮🇳",
  "tagline": "City Beneath the Eastern Ghats",
  "description": "Cradled by the Eastern Ghats on the Thirumanimutharu river, Salem is a steel-and-textile city best loved as the gateway to the orange-grove hill station of Yercaud and the vast Mettur Dam.",
  "heroDescription": "A Tamil city ringed by green hills, gateway to the cool coffee slopes of Yercaud.",
  "coordinates": {
    "lat": 11.65,
    "lng": 78.15
  },
  "stats": {
    "bestTime": "Oct – Mar",
    "budget": "₹1,300 – ₹3,500/day",
    "language": "Tamil",
    "currency": "INR (Rupee)"
  },
  "vibes": [
    "Nature",
    "Cultural"
  ],
  "gradient": "from-violet-600 via-indigo-500 to-blue-400",
  "accentColor": "#7C3AED",
  "image": "/city-images/salem.jpg",
  "heroImage": "/city-images/salem.jpg",
  "areas": [
    {
      "name": "Top Sights",
      "emoji": "⛰️",
      "accentColor": "#7C3AED",
      "image": "/city-images/salem.jpg",
      "tagline": "Hills, dams and temples",
      "spots": [
        {
          "name": "Yercaud",
          "tag": "Nature"
        },
        {
          "name": "Mettur Dam",
          "tag": "Scenic"
        },
        {
          "name": "Kottai Mariamman Temple",
          "tag": "Cultural"
        },
        {
          "name": "1008 Lingam Temple",
          "tag": "Cultural"
        }
      ]
    }
  ],
  "thingsToDo": [
    {
      "name": "Yercaud",
      "description": "A quiet hill station 30 km away with coffee plantations, an orchid garden and a misty lake.",
      "icon": "⛰️",
      "duration": "Full day",
      "category": "Nature"
    },
    {
      "name": "Mettur Dam",
      "description": "One of India’s largest dams across the Kaveri, dramatic when the sluice gates open in season.",
      "icon": "🌊",
      "duration": "1–2 hours",
      "category": "Scenic"
    },
    {
      "name": "Kottai Mariamman Temple",
      "description": "A revered city temple famous for its grand annual car festival.",
      "icon": "🛕",
      "duration": "1–2 hours",
      "category": "Cultural"
    },
    {
      "name": "1008 Lingam Temple",
      "description": "A hillside Shiva temple complex carved with a thousand-and-eight lingams.",
      "icon": "🛕",
      "duration": "1–2 hours",
      "category": "Cultural"
    }
  ],
  "monthByMonth": {
    "summary": "Salem's interior location under the Eastern Ghats gives it a drier climate than coastal Tamil Nadu, with a hot summer April–June and rainfall concentrated in the northeast monsoon (October–December) rather than the southwest monsoon that soaks the coast.",
    "bestMonths": ["November", "December", "January", "February"],
    "avoidMonths": ["April", "May"],
    "months": [
      { "month": "January", "short": "Jan", "rating": "excellent", "weather": "Cool, dry and pleasant", "temp": "18–29°C", "crowds": "Moderate", "price": "Moderate", "highlight": "Ideal weather for Yercaud hill-station trips" },
      { "month": "February", "short": "Feb", "rating": "excellent", "weather": "Warm days, mild nights", "temp": "20–32°C", "crowds": "Moderate", "price": "Moderate", "highlight": "Comfortable touring before the heat builds" },
      { "month": "March", "short": "Mar", "rating": "good", "weather": "Warming up, dry", "temp": "23–35°C", "crowds": "Moderate", "price": "Moderate", "highlight": "Still manageable with an early start" },
      { "month": "April", "short": "Apr", "rating": "avoid", "weather": "Hot, dry heat", "temp": "26–38°C", "crowds": "Low", "price": "Low", "highlight": "Best escaped by heading up to Yercaud" },
      { "month": "May", "short": "May", "rating": "avoid", "weather": "Peak summer heat", "temp": "27–39°C", "crowds": "Low", "price": "Low", "highlight": "Hottest month on the plains below the Ghats" },
      { "month": "June", "short": "Jun", "rating": "average", "weather": "Hot with light southwest-monsoon showers", "temp": "25–36°C", "crowds": "Low", "price": "Low", "highlight": "Interior Salem sees less rain than the coast" },
      { "month": "July", "short": "Jul", "rating": "average", "weather": "Warm with scattered showers", "temp": "24–34°C", "crowds": "Low", "price": "Low", "highlight": "Mettur Dam catchment area starts filling" },
      { "month": "August", "short": "Aug", "rating": "average", "weather": "Warm, intermittent rain", "temp": "24–33°C", "crowds": "Low", "price": "Low", "highlight": "Good time to see the Kaveri feeding the dam" },
      { "month": "September", "short": "Sep", "rating": "good", "weather": "Cooling slightly, occasional showers", "temp": "23–32°C", "crowds": "Moderate", "price": "Moderate", "highlight": "Kottai Mariamman Temple festival season nears" },
      { "month": "October", "short": "Oct", "rating": "good", "weather": "Northeast monsoon brings the heaviest rain of the year", "temp": "21–31°C", "crowds": "Moderate", "price": "Moderate", "highlight": "Mettur Dam sluice gates often opened dramatically" },
      { "month": "November", "short": "Nov", "rating": "excellent", "weather": "Rain easing, cool and fresh", "temp": "19–29°C", "crowds": "High", "price": "High", "highlight": "Lush green hills around Yercaud" },
      { "month": "December", "short": "Dec", "rating": "excellent", "weather": "Cool and dry", "temp": "17–28°C", "crowds": "High", "price": "High", "highlight": "Best month overall, crisp Yercaud mornings" }
    ]
  }
}
];
