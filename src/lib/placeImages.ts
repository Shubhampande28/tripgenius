/**
 * Specific Unsplash photos for individual activities.
 * Key format: 'city-slug:place name lowercase'
 * Fallback: category-based images so no two cards look the same.
 */

// ── Category fallbacks — used when no specific photo exists ─────
// Each category gets its own generic but relevant image
export const CATEGORY_IMAGES: Record<string, string> = {
  Cultural:      'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=900&q=80',
  Nature:        'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=900&q=80',
  Adventure:     'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=900&q=80',
  Culinary:      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80',
  Scenic:        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=900&q=80',
  Iconic:        'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=900&q=80',
  Shopping:      'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=900&q=80',
  Relaxation:    'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=900&q=80',
  Entertainment: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=900&q=80',
  Walking:       'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=80',
  'Day Trip':    'https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=900&q=80',
  'Art & Culture':'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=900&q=80',
  Wellness:      'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=900&q=80',
  Historical:    'https://images.unsplash.com/photo-1509966756634-9c23dd6e6815?auto=format&fit=crop&w=900&q=80',
  Spiritual:     'https://images.unsplash.com/photo-1561361058-c24cecae35ca?auto=format&fit=crop&w=900&q=80',
  UNESCO:        'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=900&q=80',
  Festival:      'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=900&q=80',
  Nightlife:     'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=900&q=80',
  Photography:   'https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?auto=format&fit=crop&w=900&q=80',
  'Hidden gem':  'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=900&q=80',
  Unique:        'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=900&q=80',
  Landmark:      'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=900&q=80',
  Essential:     'https://images.unsplash.com/photo-1559060107-4c6cd22f1040?auto=format&fit=crop&w=900&q=80',
  'UNESCO Experience': 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=900&q=80',
  Trekking:      'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?auto=format&fit=crop&w=900&q=80',
  Wildlife:      'https://images.unsplash.com/photo-1535941339077-2dd1c7963098?auto=format&fit=crop&w=900&q=80',
};

// ── Specific place photos (verified Unsplash IDs) ───────────────
const PLACE_IMAGES: Record<string, string> = {
  // Bali
  'bali:tanah lot temple':           'https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?auto=format&fit=crop&w=900&q=80',
  'bali:tegallalang rice terraces':  'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=900&q=80',
  'bali:mount batur sunrise trek':   'https://images.unsplash.com/photo-1570739572266-d3a7eb00e88e?auto=format&fit=crop&w=900&q=80',
  'bali:uluwatu temple':             'https://images.unsplash.com/photo-1604842937136-1648761a6256?auto=format&fit=crop&w=900&q=80',
  'bali:nusa penida day trip':       'https://images.unsplash.com/photo-1557106160-c533b9d00071?auto=format&fit=crop&w=900&q=80',
  'bali:seminyak beach':             'https://images.unsplash.com/photo-1662950267280-0cdf5f7139b4?auto=format&fit=crop&w=900&q=80',
  'bali:jatiluwih rice terraces':    'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=900&q=80',
  'bali:sekumpul waterfall':         'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=900&q=80',
  'bali:kuta surf lessons':          'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80',

  // Bangkok
  'bangkok:grand palace & wat phra kaew': 'https://images.unsplash.com/photo-1586098311577-520120ba3df3?auto=format&fit=crop&w=900&q=80',
  'bangkok:wat pho — reclining buddha':   'https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=900&q=80',
  'bangkok:wat arun — temple of dawn':    'https://images.unsplash.com/photo-1563492065599-3520f775eeed?auto=format&fit=crop&w=900&q=80',
  'bangkok:chatuchak weekend market':     'https://images.unsplash.com/photo-1555400038-63f5ba517a47?auto=format&fit=crop&w=900&q=80',
  'bangkok:chao phraya river at dusk':    'https://images.unsplash.com/photo-1550814669-a61a9167084c?auto=format&fit=crop&w=900&q=80',
  'bangkok:street food tour – yaowarat':  'https://images.unsplash.com/photo-1513568720563-6a5b8c6caab3?auto=format&fit=crop&w=900&q=80',
  'bangkok:asiatique the riverfront':     'https://images.unsplash.com/photo-1519922639192-e73293ca430e?auto=format&fit=crop&w=900&q=80',

  // Paris
  'paris:eiffel tower at sunset':     'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=900&q=80',
  'paris:eiffel tower':               'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=900&q=80',
  'paris:the louvre':                 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=900&q=80',
  'paris:musée d\'orsay':             'https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&w=900&q=80',
  'paris:montmartre & sacré-cœur':    'https://images.unsplash.com/photo-1502558873756-72bb9a61cdad?auto=format&fit=crop&w=900&q=80',
  'paris:versailles day trip':        'https://images.unsplash.com/photo-1597733336794-12d05021d510?auto=format&fit=crop&w=900&q=80',
  'paris:arc de triomphe':            'https://images.unsplash.com/photo-1571068316344-75bc76f77890?auto=format&fit=crop&w=900&q=80',
  'paris:seine river cruise':         'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=900&q=80',
  'paris:sainte-chapelle':            'https://images.unsplash.com/photo-1580752300992-559f8e0734e0?auto=format&fit=crop&w=900&q=80',
  'paris:the paris catacombs':        'https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?auto=format&fit=crop&w=900&q=80',
  'paris:centre pompidou':            'https://images.unsplash.com/photo-1594394489098-74ac04c0fc2e?auto=format&fit=crop&w=900&q=80',

  // Tokyo
  'tokyo:shibuya crossing':           'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=900&q=80',
  'tokyo:senso-ji temple & asakusa':  'https://images.unsplash.com/photo-1553292770-c3d14b814242?auto=format&fit=crop&w=900&q=80',
  'tokyo:tokyo skytree':              'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=900&q=80',
  'tokyo:meiji jingu shrine':         'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=900&q=80',
  'tokyo:teamlab borderless':         'https://images.unsplash.com/photo-1518235506717-e1ed3306a89b?auto=format&fit=crop&w=900&q=80',
  'tokyo:shinjuku — kabukicho & golden gai': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=900&q=80',
  'tokyo:arashiyama bamboo grove':    'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?auto=format&fit=crop&w=900&q=80',
  'tokyo:ghibli museum':              'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=900&q=80',
  'tokyo:shinjuku gyoen national garden': 'https://images.unsplash.com/photo-1522383225653-ed111181a951?auto=format&fit=crop&w=900&q=80',
  'tokyo:tsukiji outer market':       'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80',
  'tokyo:akihabara electric town':    'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=900&q=80',

  // Dubai
  'dubai:burj khalifa at the top':    'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=900&q=80',
  'dubai:desert safari':              'https://images.unsplash.com/photo-1553796661-17b7fa359f49?auto=format&fit=crop&w=900&q=80',
  'dubai:dubai creek & gold souk':    'https://images.unsplash.com/photo-1636924271402-d639875aa2bb?auto=format&fit=crop&w=900&q=80',
  'dubai:museum of the future':       'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=900&q=80',
  'dubai:dubai fountain show':        'https://images.unsplash.com/photo-1694475634077-e6e4b623b574?auto=format&fit=crop&w=900&q=80',
  'dubai:dubai marina dhow cruise':   'https://images.unsplash.com/photo-1611577810610-642f8ac05c32?auto=format&fit=crop&w=900&q=80',
  'dubai:palm jumeirah':              'https://images.unsplash.com/photo-1697729749013-d5263b662999?auto=format&fit=crop&w=900&q=80',
  'dubai:ain dubai — world\'s tallest wheel': 'https://images.unsplash.com/photo-1611577810610-642f8ac05c32?auto=format&fit=crop&w=900&q=80',

  // Goa
  'goa:palolem beach kayaking':        'https://images.unsplash.com/photo-1614082242765-7c98ca0f3df3?auto=format&fit=crop&w=900&q=80',
  'goa:dudhsagar falls':               'https://images.unsplash.com/photo-1667760334198-d3958029a08b?auto=format&fit=crop&w=900&q=80',
  'goa:anjuna flea market':            'https://images.unsplash.com/photo-1541738679621-172e4575a81d?auto=format&fit=crop&w=900&q=80',
  'goa:old goa churches':              'https://images.unsplash.com/photo-1656155316674-d8fab9e65eab?auto=format&fit=crop&w=900&q=80',
  'goa:fort aguada':                   'https://images.unsplash.com/photo-1597820334272-af87b2d917c1?auto=format&fit=crop&w=900&q=80',
  'goa:chapora fort & vagator beach':  'https://images.unsplash.com/photo-1541738679621-172e4575a81d?auto=format&fit=crop&w=900&q=80',
  'goa:mandovi river sunset cruise':   'https://images.unsplash.com/photo-1614082242765-7c98ca0f3df3?auto=format&fit=crop&w=900&q=80',

  // Agra
  'agra:taj mahal at sunrise':         'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=900&q=80',
  'agra:agra fort':                    'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=900&q=80',
  'agra:mehtab bagh sunset':           'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=900&q=80',
  'agra:fatehpur sikri day trip':      'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=900&q=80',

  // Jaipur
  'jaipur:amber fort sunrise':         'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=900&q=80',
  'jaipur:hawa mahal photography':     'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=900&q=80',
  'jaipur:city palace museum':         'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=900&q=80',
  'jaipur:nahargarh fort sunset':      'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=900&q=80',

  // Varanasi
  'varanasi:ganga aarti at dashashwamedh ghat': 'https://images.unsplash.com/photo-1561361058-c24cecae35ca?auto=format&fit=crop&w=900&q=80',
  'varanasi:dawn boat ride on the ganges':       'https://images.unsplash.com/photo-1561361058-c24cecae35ca?auto=format&fit=crop&w=900&q=80',
  'varanasi:manikarnika ghat':                   'https://images.unsplash.com/photo-1561361058-c24cecae35ca?auto=format&fit=crop&w=900&q=80',
  'varanasi:sarnath day trip':                   'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=900&q=80',

  // Mumbai
  'mumbai:gateway of india at dawn':   'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?auto=format&fit=crop&w=900&q=80',
  'mumbai:elephanta caves':            'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?auto=format&fit=crop&w=900&q=80',
  'mumbai:marine drive evening':       'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?auto=format&fit=crop&w=900&q=80',

  // Delhi
  'delhi:red fort & chandni chowk':   'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=900&q=80',
  'delhi:humayun\'s tomb':             'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=900&q=80',
  'delhi:qutb minar':                  'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=900&q=80',
  'delhi:india gate & kartavya path':  'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=900&q=80',

  // Udaipur
  'udaipur:sunset boat ride on lake pichola': 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=900&q=80',
  'udaipur:city palace':                      'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=900&q=80',
  'udaipur:monsoon palace (sajjangarh) sunset':'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=900&q=80',

  // Amritsar
  'amritsar:golden temple at dawn':    'https://images.unsplash.com/photo-1692782428565-2041cd404ebd?auto=format&fit=crop&w=900&q=80',
  'amritsar:wagah border ceremony':    'https://images.unsplash.com/photo-1692782428565-2041cd404ebd?auto=format&fit=crop&w=900&q=80',
  'amritsar:jallianwala bagh':         'https://images.unsplash.com/photo-1692782428565-2041cd404ebd?auto=format&fit=crop&w=900&q=80',
};

function keyFor(citySlug: string, placeName: string) {
  return `${citySlug}:${placeName.toLowerCase()}`;
}

export function getPlaceImageUrl(
  citySlug: string,
  placeName: string,
  category?: string,
): string | undefined {
  // 1. Specific place photo
  const specific = PLACE_IMAGES[keyFor(citySlug, placeName)];
  if (specific) return specific;

  // 2. Category-based fallback — different per category, never the city hero
  if (category && CATEGORY_IMAGES[category]) return CATEGORY_IMAGES[category];

  // 3. No image — let the component decide (show gradient instead)
  return undefined;
}
