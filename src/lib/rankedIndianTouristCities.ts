import { City } from './types';

type TouristSpec = {
  slug: string;
  name: string;
  state: string;
  focus: 'heritage' | 'nature' | 'spiritual' | 'adventure' | 'coast';
  highlights: string[];
};

const focusData = {
  heritage: { vibes: ['Historical', 'Cultural', 'Architecture'], gradient: 'from-amber-900 to-stone-900', accent: '#B45309', label: 'heritage monuments, local culture and historic landscapes' },
  nature: { vibes: ['Nature', 'Relaxation', 'Adventure'], gradient: 'from-emerald-900 to-sky-900', accent: '#047857', label: 'scenic landscapes, wildlife and outdoor experiences' },
  spiritual: { vibes: ['Spiritual', 'Cultural', 'Historical'], gradient: 'from-orange-900 to-amber-700', accent: '#C2410C', label: 'pilgrimage traditions, sacred architecture and local culture' },
  adventure: { vibes: ['Adventure', 'Nature', 'Cultural'], gradient: 'from-slate-900 to-cyan-900', accent: '#0E7490', label: 'mountain scenery, active travel and local communities' },
  coast: { vibes: ['Beach', 'Nature', 'Relaxation'], gradient: 'from-cyan-900 to-blue-800', accent: '#0284C7', label: 'coastal scenery, local food and waterside experiences' },
} as const;

const specs: TouristSpec[] = [
  { slug: 'valley-of-flowers', name: 'Valley of Flowers', state: 'Uttarakhand', focus: 'nature', highlights: ['Valley of Flowers trek', 'Ghangaria', 'Pushpawati Valley', 'Nanda Devi Biosphere', 'Hemkund trail'] },
  { slug: 'nubra-valley', name: 'Nubra Valley', state: 'Ladakh', focus: 'adventure', highlights: ['Khardung La', 'Hunder dunes', 'Diskit Monastery', 'Bactrian camel safari', 'Turtuk village'] },
  { slug: 'chitrakoot', name: 'Chitrakoot', state: 'Uttar Pradesh / Madhya Pradesh', focus: 'spiritual', highlights: ['Ram Ghat', 'Kamadgiri', 'Gupt Godavari', 'Hanuman Dhara', 'Sati Anasuya Ashram'] },
  { slug: 'aihole', name: 'Aihole', state: 'Karnataka', focus: 'heritage', highlights: ['Durga Temple', 'Lad Khan Temple', 'Ravana Phadi Cave', 'Meguti Jain Temple', 'Temple complex walk'] },
  { slug: 'ajanta-caves', name: 'Ajanta Caves', state: 'Maharashtra', focus: 'heritage', highlights: ['UNESCO cave complex', 'Buddhist murals', 'Cave 1', 'Cave 17', 'Waghora gorge viewpoint'] },
  { slug: 'ellora-caves', name: 'Ellora Caves', state: 'Maharashtra', focus: 'heritage', highlights: ['Kailasa Temple', 'Buddhist caves', 'Jain caves', 'Cave 10', 'Grishneshwar Temple'] },
  { slug: 'katra-vaishno-devi', name: 'Katra & Vaishno Devi', state: 'Jammu & Kashmir', focus: 'spiritual', highlights: ['Vaishno Devi shrine', 'Banganga', 'Ardhkuwari', 'Bhairavnath Temple', 'Sanjichhat'] },
  { slug: 'hogenakkal-falls', name: 'Hogenakkal Falls', state: 'Tamil Nadu', focus: 'nature', highlights: ['Hogenakkal cascades', 'Coracle ride', 'Melagiri Hills', 'Cauvery viewpoint', 'Local fish market'] },
  { slug: 'belur-halebidu', name: 'Belur & Halebidu', state: 'Karnataka', focus: 'heritage', highlights: ['Chennakeshava Temple', 'Hoysaleswara Temple', 'Kedareshwara Temple', 'Belavadi', 'Sculpture trail'] },
  { slug: 'srisailam', name: 'Srisailam', state: 'Andhra Pradesh', focus: 'spiritual', highlights: ['Mallikarjuna Temple', 'Srisailam Dam', 'Akkamahadevi Caves', 'Pathala Ganga', 'Nallamala forest'] },
  { slug: 'hanle', name: 'Hanle', state: 'Ladakh', focus: 'adventure', highlights: ['Indian Astronomical Observatory', 'Hanle Monastery', 'Dark Sky Reserve', 'Punguk village', 'Changthang landscape'] },
  { slug: 'lachung', name: 'Lachung', state: 'Sikkim', focus: 'nature', highlights: ['Yumthang Valley', 'Zero Point', 'Lachung Monastery', 'Shingba Rhododendron Sanctuary', 'Bhim Nala Falls'] },
  { slug: 'zanskar-valley', name: 'Zanskar Valley', state: 'Ladakh', focus: 'adventure', highlights: ['Padum', 'Phugtal Monastery', 'Zanskar River', 'Karsha Monastery', 'Chadar trek'] },
  { slug: 'dalhousie', name: 'Dalhousie', state: 'Himachal Pradesh', focus: 'nature', highlights: ['Dainkund Peak', 'Panchpula', 'Kalatop Sanctuary', 'St John Church', 'Bakrota walk'] },
  { slug: 'khajjiar', name: 'Khajjiar', state: 'Himachal Pradesh', focus: 'nature', highlights: ['Khajjiar meadow', 'Khajji Nag Temple', 'Kalatop forest', 'Dainkund trail', 'Paragliding'] },
  { slug: 'kinnaur-valley', name: 'Kinnaur Valley', state: 'Himachal Pradesh', focus: 'adventure', highlights: ['Sangla Valley', 'Chitkul', 'Kalpa', 'Kinnaur Kailash views', 'Kamru Fort'] },
  { slug: 'chopta', name: 'Chopta', state: 'Uttarakhand', focus: 'adventure', highlights: ['Tungnath Temple', 'Chandrashila trek', 'Deoria Tal', 'Rohini Bugyal', 'Kedarnath Wildlife Sanctuary'] },
  { slug: 'munsiyari', name: 'Munsiyari', state: 'Uttarakhand', focus: 'adventure', highlights: ['Panchachuli views', 'Khaliya Top', 'Birthi Falls', 'Darkot village', 'Thamri Kund'] },
  { slug: 'hemkund-sahib', name: 'Hemkund Sahib', state: 'Uttarakhand', focus: 'spiritual', highlights: ['Hemkund Sahib gurdwara', 'High-altitude lake', 'Ghangaria', 'Lakshman Temple', 'Pilgrimage trek'] },
  { slug: 'kausani', name: 'Kausani', state: 'Uttarakhand', focus: 'nature', highlights: ['Himalayan viewpoint', 'Anasakti Ashram', 'Baijnath Temple', 'Tea estate', 'Rudradhari Falls'] },
  { slug: 'almora', name: 'Almora', state: 'Uttarakhand', focus: 'heritage', highlights: ['Kasar Devi', 'Bright End Corner', 'Chitai Golu Devta Temple', 'Lala Bazaar', 'Binsar excursion'] },
  { slug: 'ranikhet', name: 'Ranikhet', state: 'Uttarakhand', focus: 'nature', highlights: ['Chaubatia Gardens', 'Jhula Devi Temple', 'Upat Golf Course', 'Haidakhan Temple', 'Himalayan viewpoints'] },
  { slug: 'patnitop', name: 'Patnitop', state: 'Jammu & Kashmir', focus: 'nature', highlights: ['Nathatop', 'Sanasar', 'Skyview gondola', 'Madhatop', 'Naag Temple'] },
  { slug: 'yusmarg', name: 'Yusmarg', state: 'Jammu & Kashmir', focus: 'nature', highlights: ['Yusmarg meadow', 'Doodh Ganga', 'Nilnag Lake', 'Sang-e-Safed Valley', 'Pony trails'] },
  { slug: 'elephanta-island', name: 'Elephanta Island', state: 'Maharashtra', focus: 'heritage', highlights: ['Great Cave', 'Trimurti sculpture', 'Cannon Hill', 'Island ferry', 'Archaeological museum'] },
  { slug: 'raigad-fort', name: 'Raigad Fort', state: 'Maharashtra', focus: 'heritage', highlights: ['Raigad ropeway', 'Maha Darwaja', 'Raj Sabha', 'Takmak Tok', 'Chhatrapati Shivaji memorial'] },
  { slug: 'matheran', name: 'Matheran', state: 'Maharashtra', focus: 'nature', highlights: ['Toy train', 'Panorama Point', 'Charlotte Lake', 'Louisa Point', 'Vehicle-free trails'] },
  { slug: 'panchgani', name: 'Panchgani', state: 'Maharashtra', focus: 'nature', highlights: ['Table Land', 'Sydney Point', 'Parsi Point', 'Devrai Art Village', 'Strawberry farms'] },
  { slug: 'kolhapur', name: 'Kolhapur', state: 'Maharashtra', focus: 'heritage', highlights: ['Mahalakshmi Temple', 'New Palace Museum', 'Panhala Fort', 'Rankala Lake', 'Kolhapuri food trail'] },
  { slug: 'champaner-pavagadh', name: 'Champaner-Pavagadh', state: 'Gujarat', focus: 'heritage', highlights: ['Jama Masjid', 'Pavagadh Hill', 'Kalika Mata Temple', 'Kevda Mosque', 'Fortified city ruins'] },
];

const remainingSpecs: TouristSpec[] = [
  { slug: 'modhera', name: 'Modhera', state: 'Gujarat', focus: 'heritage', highlights: ['Modhera Sun Temple', 'Surya Kund', 'Sabha Mandap', 'Heritage lighting', 'Patan excursion'] },
  { slug: 'palitana', name: 'Palitana', state: 'Gujarat', focus: 'spiritual', highlights: ['Shatrunjaya temples', 'Sacred hill climb', 'Adinath Temple', 'Jain museum', 'Sunrise pilgrimage'] },
  { slug: 'saputara', name: 'Saputara', state: 'Gujarat', focus: 'nature', highlights: ['Saputara Lake', 'Sunset Point', 'Gira Falls', 'Artist Village', 'Table Point'] },
  { slug: 'junagadh', name: 'Junagadh', state: 'Gujarat', focus: 'heritage', highlights: ['Uparkot Fort', 'Mahabat Maqbara', 'Girnar Hill', 'Ashokan Edicts', 'Darbar Hall Museum'] },
  { slug: 'shravanabelagola', name: 'Shravanabelagola', state: 'Karnataka', focus: 'spiritual', highlights: ['Gommateshwara statue', 'Vindhyagiri Hill', 'Chandragiri Hill', 'Jain basadis', 'Mahamastakabhisheka heritage'] },
  { slug: 'dandeli', name: 'Dandeli', state: 'Karnataka', focus: 'adventure', highlights: ['Kali River rafting', 'Dandeli Wildlife Sanctuary', 'Syntheri Rocks', 'Kavala Caves', 'Hornbill watching'] },
  { slug: 'jog-falls', name: 'Jog Falls', state: 'Karnataka', focus: 'nature', highlights: ['Jog Falls viewpoint', 'Waterfall steps', 'Sharavathi Valley', 'Linganamakki Dam', 'Sigandur excursion'] },
  { slug: 'belagavi', name: 'Belagavi', state: 'Karnataka', focus: 'heritage', highlights: ['Belagavi Fort', 'Kamal Basti', 'Gokak Falls', 'Military Mahadeva Temple', 'Kapileshwar Temple'] },
  { slug: 'velankanni', name: 'Velankanni', state: 'Tamil Nadu', focus: 'spiritual', highlights: ['Basilica of Our Lady of Good Health', 'Morning Star Church', 'Velankanni Beach', 'Museum of Offerings', 'Nagapattinam excursion'] },
  { slug: 'chettinad', name: 'Chettinad', state: 'Tamil Nadu', focus: 'heritage', highlights: ['Kanadukathan mansions', 'Athangudi tiles', 'Chettinad cuisine', 'Pillayarpatti Temple', 'Antique market'] },
  { slug: 'kumbakonam', name: 'Kumbakonam', state: 'Tamil Nadu', focus: 'spiritual', highlights: ['Adi Kumbeswarar Temple', 'Sarangapani Temple', 'Mahamaham Tank', 'Darasuram', 'Degree coffee trail'] },
  { slug: 'yercaud', name: 'Yercaud', state: 'Tamil Nadu', focus: 'nature', highlights: ['Yercaud Lake', 'Lady’s Seat', 'Pagoda Point', 'Kiliyur Falls', 'Coffee estates'] },
  { slug: 'lepakshi', name: 'Lepakshi', state: 'Andhra Pradesh', focus: 'heritage', highlights: ['Veerabhadra Temple', 'Hanging pillar', 'Monolithic Nandi', 'Frescoes', 'Jatayu legend sites'] },
  { slug: 'konaseema', name: 'Konaseema', state: 'Andhra Pradesh', focus: 'nature', highlights: ['Godavari backwaters', 'Coconut villages', 'Antarvedi', 'Dindi', 'Village boat rides'] },
  { slug: 'rajahmundry', name: 'Rajahmundry', state: 'Andhra Pradesh', focus: 'heritage', highlights: ['Godavari riverfront', 'Papikondalu cruise', 'Dowleswaram Barrage', 'ISKCON Temple', 'Kotilingeshwara Ghat'] },
  { slug: 'kushinagar', name: 'Kushinagar', state: 'Uttar Pradesh', focus: 'spiritual', highlights: ['Mahaparinirvana Temple', 'Ramabhar Stupa', 'Matha Kuar Shrine', 'Buddhist museums', 'International monasteries'] },
  { slug: 'unakoti', name: 'Unakoti', state: 'Tripura', focus: 'heritage', highlights: ['Unakotiswara relief', 'Rock-cut sculptures', 'Waterfall trail', 'Ashokashtami festival', 'Forest archaeology'] },
  { slug: 'champhai', name: 'Champhai', state: 'Mizoram', focus: 'nature', highlights: ['Mizo vineyards', 'Rih Dil excursion', 'Murlen National Park', 'Lengteng hills', 'Traditional villages'] },
  { slug: 'sivasagar', name: 'Sivasagar', state: 'Assam', focus: 'heritage', highlights: ['Rang Ghar', 'Talatal Ghar', 'Sivadol', 'Joysagar Tank', 'Ahom monuments'] },
  { slug: 'haflong', name: 'Haflong', state: 'Assam', focus: 'nature', highlights: ['Haflong Lake', 'Jatinga', 'Maibang ruins', 'Fiangpui Garden', 'Dima Hasao villages'] },
];

export const rankedIndianTouristCities: City[] = specs.map((spec) => {
  const theme = focusData[spec.focus];
  return {
    stub: true,
    slug: spec.slug,
    name: spec.name,
    state: spec.state,
    country: 'India',
    flag: '🇮🇳',
    tagline: spec.highlights[0],
    description: `${spec.name} is a high-priority Indian tourist destination for ${theme.label}.`,
    heroDescription: `Plan ${spec.name} around ${spec.highlights.slice(0, 3).join(', ')}, with practical guidance for a uniform TripGenius city guide.`,
    stats: { bestTime: 'Oct – Mar', budget: '$15–$70/day', language: 'Hindi, English, local languages', currency: 'INR (Rupee)' },
    vibes: [...theme.vibes],
    gradient: theme.gradient,
    accentColor: theme.accent,
    image: '',
    heroImage: '',
    areas: [{ name: 'Essential Stops', emoji: '📍', accentColor: theme.accent, image: '', tagline: theme.label, spots: spec.highlights.map((name) => ({ name, tag: 'Highlight' })) }],
  };
});

export const rankedIndianTouristSlugs = specs.map((spec) => spec.slug);

const focusImage = {
  heritage: '/city-images/hampi.jpg',
  nature: '/city-images/munnar.jpg',
  spiritual: '/city-images/varanasi.jpg',
  adventure: '/city-images/ladakh.jpg',
  coast: '/city-images/goa.jpg',
} as const;

export const rankedIndianTouristImageFallbacks = Object.fromEntries(
  specs.map((spec) => [spec.slug, { card: focusImage[spec.focus], hero: focusImage[spec.focus] }]),
);
