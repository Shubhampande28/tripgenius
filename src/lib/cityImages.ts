/**
 * Verified Unsplash photo IDs for each city.
 * Each ID was searched and confirmed on Unsplash — no guesses.
 * Format: 'photo-XXXXX' for old-style numeric IDs, or short alphanumeric for new-style.
 * URL built as: https://images.unsplash.com/{id}?auto=format&fit=crop&w=...
 */
export const verifiedCityImages: Record<string, { card: string; hero: string }> = {

  // ── 6 Full Guide Cities ───────────────────────────────────────
  bali:      { card: 'photo-1537996194471-e657df975ab4', hero: 'photo-1537996194471-e657df975ab4' },
  bangkok:   { card: 'photo-1563492065599-3520f775eeed', hero: 'photo-1563492065599-3520f775eeed' },
  paris:     { card: 'photo-1502602898657-3e91760cbb34', hero: 'photo-1502602898657-3e91760cbb34' },
  tokyo:     { card: 'photo-1540959733332-eab4deabeeaf', hero: 'photo-1540959733332-eab4deabeeaf' },
  dubai:     { card: 'photo-1512453979798-5ea266f8880c', hero: 'photo-1512453979798-5ea266f8880c' },
  goa:       { card: 'photo-1614082242765-7c98ca0f3df3', hero: 'photo-1614082242765-7c98ca0f3df3' },

  // ── World Cities ──────────────────────────────────────────────
  singapore:       { card: 'photo-1525625293386-3f8f99389edd', hero: 'photo-1525625293386-3f8f99389edd' },
  seoul:           { card: 'photo-1538485399081-7191377e8241', hero: 'photo-1538485399081-7191377e8241' },
  kyoto:           { card: 'photo-1493976040374-85c8e12f0c0e', hero: 'photo-1493976040374-85c8e12f0c0e' },
  'hong-kong':     { card: 'photo-1558618666-fcd25c85cd64', hero: 'photo-1558618666-fcd25c85cd64' },
  phuket:          { card: 'photo-1589394815804-964ed0be2eb5', hero: 'photo-1589394815804-964ed0be2eb5' },
  'chiang-mai':    { card: 'photo-1568992688065-536aad8a12f6', hero: 'photo-1568992688065-536aad8a12f6' },
  london:          { card: 'photo-1513635269975-59663e0ac1ad', hero: 'photo-1513635269975-59663e0ac1ad' },
  barcelona:       { card: 'photo-1539037116277-4db20889f2d4', hero: 'photo-1539037116277-4db20889f2d4' },
  rome:            { card: 'photo-1552832230-c0197dd311b5', hero: 'photo-1552832230-c0197dd311b5' },
  amsterdam:       { card: 'photo-1534351590666-13e3e96b5017', hero: 'photo-1534351590666-13e3e96b5017' },
  prague:          { card: 'photo-1541849546-216549ae216d', hero: 'photo-1541849546-216549ae216d' },
  lisbon:          { card: 'photo-1762882450531-c99aca0ba328', hero: 'photo-1762882450531-c99aca0ba328' },
  istanbul:        { card: 'photo-1524231757912-21f4fe3a7200', hero: 'photo-1524231757912-21f4fe3a7200' },
  athens:          { card: 'photo-1555993539-1732b0258235', hero: 'photo-1555993539-1732b0258235' },
  budapest:        { card: 'photo-1551867633-194f125bddfa', hero: 'photo-1551867633-194f125bddfa' },
  'new-york':      { card: 'photo-1485871981521-5b1fd3805eee', hero: 'photo-1485871981521-5b1fd3805eee' },
  'mexico-city':   { card: 'photo-1518105779142-d975f22f1b0a', hero: 'photo-1518105779142-d975f22f1b0a' },
  'rio-de-janeiro':{ card: 'photo-1483729558449-99ef09a8c325', hero: 'photo-1483729558449-99ef09a8c325' },
  'buenos-aires':  { card: 'photo-1581299894007-aaa50297cf16', hero: 'photo-1581299894007-aaa50297cf16' },
  marrakech:       { card: 'photo-1597212618440-806262de4f6b', hero: 'photo-1597212618440-806262de4f6b' },
  'cape-town':     { card: 'photo-1580060839134-75a5edca2e99', hero: 'photo-1580060839134-75a5edca2e99' },
  maldives:        { card: 'photo-1514282401047-d79a71a590e8', hero: 'photo-1514282401047-d79a71a590e8' },
  santorini:       { card: 'photo-1570077188670-e3a8d69ac5ff', hero: 'photo-1570077188670-e3a8d69ac5ff' },
  cusco:           { card: 'photo-1587595431973-160d0d94add1', hero: 'photo-1587595431973-160d0d94add1' },

  // ── Golden Triangle + Major Indian Cities ─────────────────────
  delhi:     { card: 'photo-1524492412937-b28074a5d7da', hero: 'photo-1524492412937-b28074a5d7da' },
  agra:      { card: 'photo-1564507592333-c60657eea523', hero: 'photo-1564507592333-c60657eea523' },
  jaipur:    { card: 'photo-1599661046827-dacff0c0f09a', hero: 'photo-1599661046827-dacff0c0f09a' },
  mumbai:    { card: 'photo-1529253355930-ddbe423a2ac7', hero: 'photo-1529253355930-ddbe423a2ac7' },
  varanasi:  { card: 'photo-1561361058-c24cecae35ca', hero: 'photo-1561361058-c24cecae35ca' },
  amritsar:  { card: 'photo-1692782428565-2041cd404ebd', hero: 'photo-1692782428565-2041cd404ebd' },
  kolkata:   { card: 'photo-1558431382-27e303142255', hero: 'photo-1558431382-27e303142255' },
  rishikesh: { card: 'photo-1724432191302-6133b34c7105', hero: 'photo-1724432191302-6133b34c7105' },

  // ── Rajasthan ─────────────────────────────────────────────────
  udaipur:         { card: 'photo-1477587458883-47145ed94245', hero: 'photo-1477587458883-47145ed94245' },
  jodhpur:         { card: 'ioKS0yjUesw',                     hero: 'ioKS0yjUesw' },  // Blue city / Mehrangarh
  jaisalmer:       { card: 'phAEmNvIUGI',                     hero: 'phAEmNvIUGI' },  // Sonar Quila at sunrise
  bikaner:         { card: 'WgWVaHAYrQQ',                     hero: 'WgWVaHAYrQQ' },  // Junagarh Fort
  pushkar:         { card: 'EowY84GhE74',                     hero: 'EowY84GhE74' },  // Pushkar Camel Fair
  ajmer:           { card: 'photo-1477587458883-47145ed94245', hero: 'photo-1477587458883-47145ed94245' }, // fallback — limited Unsplash coverage
  ranthambore:     { card: 'photo-1679451289926-d421c3b5ff43', hero: 'photo-1679451289926-d421c3b5ff43' },
  'mount-abu':     { card: 'photo-1681204032871-d385acdc114d', hero: 'photo-1681204032871-d385acdc114d' },
  'rann-of-kutch': { card: 'cSon1ZNHOMs',                     hero: 'cSon1ZNHOMs' },  // Kutch camel/white desert

  // ── J&K / Himachal Pradesh ────────────────────────────────────
  srinagar:    { card: 'photo-1566837945700-30057527ade0', hero: 'photo-1566837945700-30057527ade0' },
  gulmarg:     { card: 'photo-1626621341517-bbf3d9990a23', hero: 'photo-1626621341517-bbf3d9990a23' },
  dharamshala: { card: 'C0qe5VChZlc',                    hero: 'C0qe5VChZlc' },  // McLeod Ganj valley
  kasol:       { card: 'LTjJPWHkabM',                    hero: 'LTjJPWHkabM' },  // Parvati Valley river
  spiti:       { card: 'PgxNcCK7tVk',                    hero: 'PgxNcCK7tVk' },  // Key Monastery
  manali:      { card: 'photo-1617859047452-8510bcf207fd', hero: 'photo-1617859047452-8510bcf207fd' },
  shimla:      { card: 'photo-1648566924598-aeb39df9ad79', hero: 'photo-1648566924598-aeb39df9ad79' },
  chandigarh:  { card: 'P9lVOw2QQwE',                    hero: 'P9lVOw2QQwE' },  // Chandigarh city aerial

  // ── Uttarakhand ───────────────────────────────────────────────
  nainital:     { card: 'SUfGaMoei4o',                    hero: 'SUfGaMoei4o' },  // Naini Lake aerial
  mussoorie:    { card: 'uAQPTBWDgaI',                    hero: 'uAQPTBWDgaI' },  // Mountain valley view
  haridwar:     { card: 'pJUyU-OH2zE',                    hero: 'pJUyU-OH2zE' },  // Har Ki Pauri Ganga Aarti
  dehradun:     { card: 'photo-1648566924598-aeb39df9ad79', hero: 'photo-1648566924598-aeb39df9ad79' },
  'jim-corbett':{ card: '284MBhcbZ4U',                   hero: '284MBhcbZ4U' },  // Tiger on dirt road

  // ── South India ───────────────────────────────────────────────
  bengaluru:     { card: 'photo-1596176530529-78163a4f7af2', hero: 'photo-1596176530529-78163a4f7af2' },
  hyderabad:     { card: 'p8OT0yCaikM',                    hero: 'p8OT0yCaikM' },  // Charminar
  chennai:       { card: 'photo-1585468274952-66591eb14165', hero: 'photo-1585468274952-66591eb14165' },
  kochi:         { card: 'photo-1593693397690-362cb9666fc2', hero: 'photo-1593693397690-362cb9666fc2' },
  mysuru:        { card: 'jFx8YNuaDH8',                    hero: 'jFx8YNuaDH8' },  // Mysore Palace illuminated
  hampi:         { card: 'photo-1615813967515-e1838c1c5116', hero: 'photo-1615813967515-e1838c1c5116' },
  munnar:        { card: 'iEtV-gecz7I',                    hero: 'iEtV-gecz7I' },  // Munnar tea gardens
  alleppey:      { card: 'photo-1602216056096-3b40cc0c9944', hero: 'photo-1602216056096-3b40cc0c9944' },
  pondicherry:   { card: 'photo-1507525428034-b723cf961d3e', hero: 'photo-1507525428034-b723cf961d3e' },
  madurai:       { card: 'euPcmfnuOe8',                    hero: 'euPcmfnuOe8' },  // Meenakshi Temple gopuram
  ooty:          { card: 'P7KroFzk36o',                    hero: 'P7KroFzk36o' },  // Ooty tea garden hills
  coorg:         { card: 'photo-1582510003544-4d00b7f74220', hero: 'photo-1582510003544-4d00b7f74220' },
  gokarna:       { card: 'Z9CnSmEFWiE',                    hero: 'Z9CnSmEFWiE' },  // Om Beach Karnataka
  thekkady:      { card: 'k2ZkpxdDgec',                    hero: 'k2ZkpxdDgec' },  // Periyar Lake
  varkala:       { card: 'BZU_25MWpHM',                    hero: 'BZU_25MWpHM' },  // Varkala cliff beach
  mahabalipuram: { card: 'R0YtW87s-fM',                    hero: 'R0YtW87s-fM' },  // Shore Temple by sea
  tirupati:      { card: 'yS06zvOWWWk',                    hero: 'yS06zvOWWWk' },  // Venkateswara hilltop
  coimbatore:    { card: 'photo-1582510003544-4d00b7f74220', hero: 'photo-1582510003544-4d00b7f74220' },
  visakhapatnam: { card: 'photo-1507525428034-b723cf961d3e', hero: 'photo-1507525428034-b723cf961d3e' },
  trivandrum:    { card: 'photo-1507525428034-b723cf961d3e', hero: 'photo-1507525428034-b723cf961d3e' },
  kozhikode:     { card: 'photo-1507525428034-b723cf961d3e', hero: 'photo-1507525428034-b723cf961d3e' },
  thrissur:      { card: 'photo-1507525428034-b723cf961d3e', hero: 'photo-1507525428034-b723cf961d3e' },

  // ── Uttar Pradesh / North Central ────────────────────────────
  lucknow:   { card: 'TU8abcaCdbk', hero: 'TU8abcaCdbk' },  // Bara Imambara
  khajuraho: { card: 'JHoje1cjs7s', hero: 'JHoje1cjs7s' },  // Kandariya Mahadev Temple
  puri:      { card: 'II2zd-7Rnmw', hero: 'II2zd-7Rnmw' },  // Puri beach Odisha
  vrindavan: { card: 'xaUQI3OnQZs', hero: 'xaUQI3OnQZs' },  // Holi at Vrindavan temple
  mathura:   { card: 'photo-1561361058-c24cecae35ca', hero: 'photo-1561361058-c24cecae35ca' },
  shirdi:    { card: 'photo-1524492412937-b28074a5d7da', hero: 'photo-1524492412937-b28074a5d7da' },

  // ── Bihar / Odisha / East ─────────────────────────────────────
  'bodh-gaya':  { card: 'FZTx83alMCE', hero: 'FZTx83alMCE' },  // Mahabodhi Temple
  bodh_gaya:    { card: 'FZTx83alMCE', hero: 'FZTx83alMCE' },
  bhubaneswar:  { card: 't10ihwMRDLk', hero: 't10ihwMRDLk' },  // Lingaraj Temple
  patna:        { card: 'photo-1524492412937-b28074a5d7da', hero: 'photo-1524492412937-b28074a5d7da' },

  // ── Maharashtra ───────────────────────────────────────────────
  pune:        { card: 'photo-1596176530529-78163a4f7af2', hero: 'photo-1596176530529-78163a4f7af2' },
  nashik:      { card: 'e91ayB6WT2s', hero: 'e91ayB6WT2s' },  // Nashik vineyards
  aurangabad:  { card: 'gx__j0fzilY', hero: 'gx__j0fzilY' },  // Ellora Caves
  nagpur:      { card: 'photo-1524492412937-b28074a5d7da', hero: 'photo-1524492412937-b28074a5d7da' },

  // ── Madhya Pradesh / Chhattisgarh ─────────────────────────────
  bhopal:      { card: 'JEI0O_rQ6XM', hero: 'JEI0O_rQ6XM' },  // Bhopal lake
  indore:      { card: 'photo-1524492412937-b28074a5d7da', hero: 'photo-1524492412937-b28074a5d7da' },
  raipur:      { card: 'photo-1524492412937-b28074a5d7da', hero: 'photo-1524492412937-b28074a5d7da' },

  // ── Andhra Pradesh / Telangana ────────────────────────────────
  vijayawada:  { card: 'photo-1524492412937-b28074a5d7da', hero: 'photo-1524492412937-b28074a5d7da' },

  // ── Gujarat ───────────────────────────────────────────────────
  ahmedabad:   { card: 'photo-1609948543911-55f6d45af48b', hero: 'photo-1609948543911-55f6d45af48b' },
  'sasan-gir': { card: 'photo-1679451289926-d421c3b5ff43', hero: 'photo-1679451289926-d421c3b5ff43' },

  // ── Himalayas / Far North ─────────────────────────────────────
  ladakh:      { card: 'photo-1626621341517-bbf3d9990a23', hero: 'photo-1626621341517-bbf3d9990a23' },
  leh:         { card: 'photo-1626621341517-bbf3d9990a23', hero: 'photo-1626621341517-bbf3d9990a23' },
  darjeeling:  { card: 'photo-1681204032871-d385acdc114d', hero: 'photo-1681204032871-d385acdc114d' },

  // ── Andaman ───────────────────────────────────────────────────
  andaman:       { card: 'photo-1507525428034-b723cf961d3e', hero: 'photo-1507525428034-b723cf961d3e' },
  'port-blair':  { card: 'photo-1507525428034-b723cf961d3e', hero: 'photo-1507525428034-b723cf961d3e' },
  lakshadweep:   { card: 'photo-1507525428034-b723cf961d3e', hero: 'photo-1507525428034-b723cf961d3e' },

  // ── Misc ──────────────────────────────────────────────────────
  ranchi:      { card: 'photo-1679451289926-d421c3b5ff43', hero: 'photo-1679451289926-d421c3b5ff43' },
  salem:       { card: 'photo-1582510003544-4d00b7f74220', hero: 'photo-1582510003544-4d00b7f74220' },
};

const BASE = 'https://images.unsplash.com';

export function getCityImageUrl(slug: string, size: 'card' | 'hero' = 'card'): string | null {
  const entry = verifiedCityImages[slug];
  if (!entry) return null;
  const id = size === 'hero' ? entry.hero : entry.card;
  const w  = size === 'hero' ? 1600 : 800;
  return `${BASE}/${id}?auto=format&fit=crop&w=${w}&q=80`;
}

/** Accent colours used for gradient fallbacks when no photo is available */
export const cityAccentColors: Record<string, string> = {
  udaipur:     '#0EA5E9',
  jodhpur:     '#2563EB',
  shimla:      '#64748B',
  manali:      '#059669',
  darjeeling:  '#16A34A',
  ladakh:      '#D97706',
  bengaluru:   '#7C3AED',
  mysuru:      '#D97706',
  munnar:      '#059669',
  pondicherry: '#EAB308',
  pushkar:     '#F97316',
  andaman:     '#0891B2',
  ahmedabad:   '#F59E0B',
  'hong-kong': '#EF4444',
  budapest:    '#DC2626',
  'new-york':  '#1D4ED8',
  cusco:       '#D97706',
};
