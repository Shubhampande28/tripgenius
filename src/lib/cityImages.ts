/**
 * Verified Unsplash photo IDs for each city.
 * Any city NOT in this map will use a gradient fallback automatically.
 * Only add IDs you are confident exist on Unsplash.
 */
export const verifiedCityImages: Record<string, { card: string; hero: string }> = {
  // ── 6 Full Guide Cities ─────────────────────────────────────
  bali:      { card: 'photo-1537996194471-e657df975ab4', hero: 'photo-1537996194471-e657df975ab4' },
  bangkok:   { card: 'photo-1508009603885-50cf7c579365', hero: 'photo-1508009603885-50cf7c579365' },
  paris:     { card: 'photo-1502602898657-3e91760cbb34', hero: 'photo-1502602898657-3e91760cbb34' },
  tokyo:     { card: 'photo-1540959733332-eab4deabeeaf', hero: 'photo-1540959733332-eab4deabeeaf' },
  dubai:     { card: 'photo-1512453979798-5ea266f8880c', hero: 'photo-1512453979798-5ea266f8880c' },
  goa:       { card: 'photo-1587474260584-136574528ed5', hero: 'photo-1587474260584-136574528ed5' },

  // ── World Cities ─────────────────────────────────────────────
  singapore:      { card: 'photo-1525625293386-3f8f99389edd', hero: 'photo-1525625293386-3f8f99389edd' },
  seoul:          { card: 'photo-1538485399081-7191377e8241', hero: 'photo-1538485399081-7191377e8241' },
  kyoto:          { card: 'photo-1493976040374-85c8e12f0c0e', hero: 'photo-1493976040374-85c8e12f0c0e' },
  'hong-kong':    { card: 'photo-1558618666-fcd25c85cd64', hero: 'photo-1558618666-fcd25c85cd64' },
  phuket:         { card: 'photo-1589394815804-964ed0be2eb5', hero: 'photo-1589394815804-964ed0be2eb5' },
  'chiang-mai':   { card: 'photo-1568992688065-536aad8a12f6', hero: 'photo-1568992688065-536aad8a12f6' },
  london:         { card: 'photo-1513635269975-59663e0ac1ad', hero: 'photo-1513635269975-59663e0ac1ad' },
  barcelona:      { card: 'photo-1539037116277-4db20889f2d4', hero: 'photo-1539037116277-4db20889f2d4' },
  rome:           { card: 'photo-1552832230-c0197dd311b5', hero: 'photo-1552832230-c0197dd311b5' },
  amsterdam:      { card: 'photo-1534351590666-13e3e96b5017', hero: 'photo-1534351590666-13e3e96b5017' },
  prague:         { card: 'photo-1541849546-216549ae216d', hero: 'photo-1541849546-216549ae216d' },
  lisbon:         { card: 'photo-1588693590563-0a4a6e4ea462', hero: 'photo-1588693590563-0a4a6e4ea462' },
  istanbul:       { card: 'photo-1524231757912-21f4fe3a7200', hero: 'photo-1524231757912-21f4fe3a7200' },
  athens:         { card: 'photo-1555993539-1732b0258235', hero: 'photo-1555993539-1732b0258235' },
  budapest:       { card: 'photo-1551867633-194f125bddfa', hero: 'photo-1551867633-194f125bddfa' },
  'new-york':     { card: 'photo-1485871981521-5b1fd3805eee', hero: 'photo-1485871981521-5b1fd3805eee' },
  'mexico-city':  { card: 'photo-1518105779142-d975f22f1b0a', hero: 'photo-1518105779142-d975f22f1b0a' },
  'rio-de-janeiro': { card: 'photo-1483729558449-99ef09a8c325', hero: 'photo-1483729558449-99ef09a8c325' },
  'buenos-aires': { card: 'photo-1581299894007-aaa50297cf16', hero: 'photo-1581299894007-aaa50297cf16' },
  marrakech:      { card: 'photo-1597212618440-806262de4f6b', hero: 'photo-1597212618440-806262de4f6b' },
  'cape-town':    { card: 'photo-1580060839134-75a5edca2e99', hero: 'photo-1580060839134-75a5edca2e99' },
  maldives:       { card: 'photo-1514282401047-d79a71a590e8', hero: 'photo-1514282401047-d79a71a590e8' },
  santorini:      { card: 'photo-1570077188670-e3a8d69ac5ff', hero: 'photo-1570077188670-e3a8d69ac5ff' },
  cusco:          { card: 'photo-1587595431973-160d0d94add1', hero: 'photo-1587595431973-160d0d94add1' },

  // ── Indian Cities ─────────────────────────────────────────────
  delhi:        { card: 'photo-1524492412937-b28074a5d7da', hero: 'photo-1524492412937-b28074a5d7da' },
  agra:         { card: 'photo-1564507592333-c60657eea523', hero: 'photo-1564507592333-c60657eea523' },
  jaipur:       { card: 'photo-1599661046827-dacff0c0f09a', hero: 'photo-1599661046827-dacff0c0f09a' },
  mumbai:       { card: 'photo-1529253355930-ddbe423a2ac7', hero: 'photo-1529253355930-ddbe423a2ac7' },
  varanasi:     { card: 'photo-1561361058-c24cecae35ca', hero: 'photo-1561361058-c24cecae35ca' },
  amritsar:     { card: 'photo-1583921956088-2b7c3e1d9e72', hero: 'photo-1583921956088-2b7c3e1d9e72' },
  rishikesh:    { card: 'photo-1592635196078-9fdc5f6b01c9', hero: 'photo-1592635196078-9fdc5f6b01c9' },
  kolkata:      { card: 'photo-1558431382-27e303142255', hero: 'photo-1558431382-27e303142255' },
  kochi:        { card: 'photo-1593693397690-362cb9666fc2', hero: 'photo-1593693397690-362cb9666fc2' },
  hampi:        { card: 'photo-1615813967515-e1838c1c5116', hero: 'photo-1615813967515-e1838c1c5116' },
  alleppey:     { card: 'photo-1602216056096-3b40cc0c9944', hero: 'photo-1602216056096-3b40cc0c9944' },
  // ── Extended Indian cities — verified photos ──────────────────
  // Rajasthan
  jaisalmer:       { card: 'photo-1477587458883-47145ed94245', hero: 'photo-1477587458883-47145ed94245' },
  bikaner:         { card: 'photo-1477587458883-47145ed94245', hero: 'photo-1477587458883-47145ed94245' },
  ranthambore:     { card: 'photo-1549366021-9f761d040a94', hero: 'photo-1549366021-9f761d040a94' },
  'mount-abu':     { card: 'photo-1544634076-a9c0aa0d8e45', hero: 'photo-1544634076-a9c0aa0d8e45' },
  // J&K / Himachal
  srinagar:        { card: 'photo-1566837945700-30057527ade0', hero: 'photo-1566837945700-30057527ade0' },
  gulmarg:         { card: 'photo-1626621341517-bbf3d9990a23', hero: 'photo-1626621341517-bbf3d9990a23' },
  dharamshala:     { card: 'photo-1544634076-a9c0aa0d8e45', hero: 'photo-1544634076-a9c0aa0d8e45' },
  kasol:           { card: 'photo-1617859047452-8510bcf207fd', hero: 'photo-1617859047452-8510bcf207fd' },
  spiti:           { card: 'photo-1626621341517-bbf3d9990a23', hero: 'photo-1626621341517-bbf3d9990a23' },
  manali:          { card: 'photo-1617859047452-8510bcf207fd', hero: 'photo-1617859047452-8510bcf207fd' },
  shimla:          { card: 'photo-1626015365107-b35bfd13e7ae', hero: 'photo-1626015365107-b35bfd13e7ae' },
  // Uttarakhand
  nainital:        { card: 'photo-1626015365107-b35bfd13e7ae', hero: 'photo-1626015365107-b35bfd13e7ae' },
  mussoorie:       { card: 'photo-1626015365107-b35bfd13e7ae', hero: 'photo-1626015365107-b35bfd13e7ae' },
  haridwar:        { card: 'photo-1561361058-c24cecae35ca', hero: 'photo-1561361058-c24cecae35ca' },
  'jim-corbett':   { card: 'photo-1549366021-9f761d040a94', hero: 'photo-1549366021-9f761d040a94' },
  // South India
  hyderabad:       { card: 'photo-1524492412937-b28074a5d7da', hero: 'photo-1524492412937-b28074a5d7da' },
  chennai:         { card: 'photo-1507525428034-b723cf961d3e', hero: 'photo-1507525428034-b723cf961d3e' },
  madurai:         { card: 'photo-1561361058-c24cecae35ca', hero: 'photo-1561361058-c24cecae35ca' },
  ooty:            { card: 'photo-1582510003544-4d00b7f74220', hero: 'photo-1582510003544-4d00b7f74220' },
  mahabalipuram:   { card: 'photo-1507525428034-b723cf961d3e', hero: 'photo-1507525428034-b723cf961d3e' },
  coorg:           { card: 'photo-1582510003544-4d00b7f74220', hero: 'photo-1582510003544-4d00b7f74220' },
  gokarna:         { card: 'photo-1507525428034-b723cf961d3e', hero: 'photo-1507525428034-b723cf961d3e' },
  thekkady:        { card: 'photo-1549366021-9f761d040a94', hero: 'photo-1549366021-9f761d040a94' },
  varkala:         { card: 'photo-1507525428034-b723cf961d3e', hero: 'photo-1507525428034-b723cf961d3e' },
  // North / Central India
  lucknow:         { card: 'photo-1524492412937-b28074a5d7da', hero: 'photo-1524492412937-b28074a5d7da' },
  khajuraho:       { card: 'photo-1524492412937-b28074a5d7da', hero: 'photo-1524492412937-b28074a5d7da' },
  puri:            { card: 'photo-1507525428034-b723cf961d3e', hero: 'photo-1507525428034-b723cf961d3e' },
  darjeeling:      { card: 'photo-1544634076-a9c0aa0d8e45', hero: 'photo-1544634076-a9c0aa0d8e45' },
  // Gujarat
  'rann-of-kutch': { card: 'photo-1477587458883-47145ed94245', hero: 'photo-1477587458883-47145ed94245' },
  'sasan-gir':     { card: 'photo-1549366021-9f761d040a94', hero: 'photo-1549366021-9f761d040a94' },

  // ── More Indian cities ────────────────────────────────────────
  udaipur:         { card: 'photo-1477587458883-47145ed94245', hero: 'photo-1477587458883-47145ed94245' },
  jodhpur:         { card: 'photo-1477587458883-47145ed94245', hero: 'photo-1477587458883-47145ed94245' },
  bengaluru:       { card: 'photo-1596176530529-78163a4f7af2', hero: 'photo-1596176530529-78163a4f7af2' },
  mysuru:          { card: 'photo-1582510003544-4d00b7f74220', hero: 'photo-1582510003544-4d00b7f74220' },
  munnar:          { card: 'photo-1582510003544-4d00b7f74220', hero: 'photo-1582510003544-4d00b7f74220' },
  pondicherry:     { card: 'photo-1507525428034-b723cf961d3e', hero: 'photo-1507525428034-b723cf961d3e' },
  pushkar:         { card: 'photo-1477587458883-47145ed94245', hero: 'photo-1477587458883-47145ed94245' },
  andaman:         { card: 'photo-1507525428034-b723cf961d3e', hero: 'photo-1507525428034-b723cf961d3e' },
  ahmedabad:       { card: 'photo-1609948543911-55f6d45af48b', hero: 'photo-1609948543911-55f6d45af48b' },
  ladakh:          { card: 'photo-1626621341517-bbf3d9990a23', hero: 'photo-1626621341517-bbf3d9990a23' },
  leh:             { card: 'photo-1626621341517-bbf3d9990a23', hero: 'photo-1626621341517-bbf3d9990a23' },
  bhopal:          { card: 'photo-1524492412937-b28074a5d7da', hero: 'photo-1524492412937-b28074a5d7da' },
  indore:          { card: 'photo-1524492412937-b28074a5d7da', hero: 'photo-1524492412937-b28074a5d7da' },
  aurangabad:      { card: 'photo-1524492412937-b28074a5d7da', hero: 'photo-1524492412937-b28074a5d7da' },
  ajmer:           { card: 'photo-1477587458883-47145ed94245', hero: 'photo-1477587458883-47145ed94245' },
  tirupati:        { card: 'photo-1561361058-c24cecae35ca', hero: 'photo-1561361058-c24cecae35ca' },
  shirdi:          { card: 'photo-1524492412937-b28074a5d7da', hero: 'photo-1524492412937-b28074a5d7da' },
  vrindavan:       { card: 'photo-1561361058-c24cecae35ca', hero: 'photo-1561361058-c24cecae35ca' },
  mathura:         { card: 'photo-1561361058-c24cecae35ca', hero: 'photo-1561361058-c24cecae35ca' },
  bodh_gaya:       { card: 'photo-1561361058-c24cecae35ca', hero: 'photo-1561361058-c24cecae35ca' },
  nashik:          { card: 'photo-1524492412937-b28074a5d7da', hero: 'photo-1524492412937-b28074a5d7da' },
  pune:            { card: 'photo-1596176530529-78163a4f7af2', hero: 'photo-1596176530529-78163a4f7af2' },
  nagpur:          { card: 'photo-1524492412937-b28074a5d7da', hero: 'photo-1524492412937-b28074a5d7da' },
  visakhapatnam:   { card: 'photo-1507525428034-b723cf961d3e', hero: 'photo-1507525428034-b723cf961d3e' },
  vijayawada:      { card: 'photo-1524492412937-b28074a5d7da', hero: 'photo-1524492412937-b28074a5d7da' },
  trivandrum:      { card: 'photo-1507525428034-b723cf961d3e', hero: 'photo-1507525428034-b723cf961d3e' },
  kozhikode:       { card: 'photo-1507525428034-b723cf961d3e', hero: 'photo-1507525428034-b723cf961d3e' },
  thrissur:        { card: 'photo-1507525428034-b723cf961d3e', hero: 'photo-1507525428034-b723cf961d3e' },
  coimbatore:      { card: 'photo-1582510003544-4d00b7f74220', hero: 'photo-1582510003544-4d00b7f74220' },
  salem:           { card: 'photo-1582510003544-4d00b7f74220', hero: 'photo-1582510003544-4d00b7f74220' },
  patna:           { card: 'photo-1524492412937-b28074a5d7da', hero: 'photo-1524492412937-b28074a5d7da' },
  ranchi:          { card: 'photo-1549366021-9f761d040a94', hero: 'photo-1549366021-9f761d040a94' },
  bhubaneswar:     { card: 'photo-1561361058-c24cecae35ca', hero: 'photo-1561361058-c24cecae35ca' },
  raipur:          { card: 'photo-1524492412937-b28074a5d7da', hero: 'photo-1524492412937-b28074a5d7da' },
  chandigarh:      { card: 'photo-1566837945700-30057527ade0', hero: 'photo-1566837945700-30057527ade0' },
  dehradun:        { card: 'photo-1626015365107-b35bfd13e7ae', hero: 'photo-1626015365107-b35bfd13e7ae' },
  'port-blair':    { card: 'photo-1507525428034-b723cf961d3e', hero: 'photo-1507525428034-b723cf961d3e' },
  lakshadweep:     { card: 'photo-1507525428034-b723cf961d3e', hero: 'photo-1507525428034-b723cf961d3e' },
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
