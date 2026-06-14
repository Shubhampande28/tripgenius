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
  ]
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
  ]
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
  ]
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
  ]
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
  ]
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
  ]
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
  ]
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
  ]
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
  ]
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
  ]
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
  ]
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
  ]
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
  ]
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
  ]
}
];
