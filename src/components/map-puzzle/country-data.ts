/** ISO 3166-1 numeric codes matching TopoJSON geo.id values */

export interface PuzzleCountry {
  numericId: string;
  name: string;
  continent: string;
  region: string;
  neighborIds: string[];
  centroid: [number, number]; // [lng, lat]
}

/**
 * ~28 large, recognizable, easy-to-tap countries.
 * Excludes tiny nations and island micro-states.
 */
export const PUZZLE_COUNTRIES: PuzzleCountry[] = [
  { numericId: "076", name: "Brazil", continent: "South America", region: "eastern South America", neighborIds: ["032", "858", "600", "068", "604", "170", "862", "328", "740"], centroid: [-51.9, -14.2] },
  { numericId: "032", name: "Argentina", continent: "South America", region: "southern South America", neighborIds: ["076", "858", "600", "068", "152"], centroid: [-63.6, -38.4] },
  { numericId: "170", name: "Colombia", continent: "South America", region: "northwestern South America", neighborIds: ["076", "862", "604", "218", "591"], centroid: [-74.3, 4.6] },
  { numericId: "604", name: "Peru", continent: "South America", region: "western South America", neighborIds: ["076", "170", "218", "152", "068"], centroid: [-75.0, -9.2] },
  { numericId: "840", name: "United States", continent: "North America", region: "North America", neighborIds: ["124", "484"], centroid: [-95.7, 37.1] },
  { numericId: "124", name: "Canada", continent: "North America", region: "North America", neighborIds: ["840"], centroid: [-106.3, 56.1] },
  { numericId: "484", name: "Mexico", continent: "North America", region: "Central America", neighborIds: ["840", "320", "084"], centroid: [-102.5, 23.6] },
  { numericId: "250", name: "France", continent: "Europe", region: "western Europe", neighborIds: ["276", "056", "442", "756", "380", "724", "020"], centroid: [2.2, 46.2] },
  { numericId: "276", name: "Germany", continent: "Europe", region: "central Europe", neighborIds: ["250", "056", "442", "756", "040", "203", "616", "208", "528"], centroid: [10.5, 51.2] },
  { numericId: "380", name: "Italy", continent: "Europe", region: "southern Europe", neighborIds: ["250", "756", "040"], centroid: [12.6, 41.9] },
  { numericId: "724", name: "Spain", continent: "Europe", region: "southwestern Europe", neighborIds: ["250", "620", "020"], centroid: [-3.7, 40.5] },
  { numericId: "826", name: "United Kingdom", continent: "Europe", region: "northwestern Europe", neighborIds: ["372"], centroid: [-1.2, 52.2] },
  { numericId: "616", name: "Poland", continent: "Europe", region: "eastern Europe", neighborIds: ["276", "203", "703", "804", "112", "440"], centroid: [19.1, 51.9] },
  { numericId: "804", name: "Ukraine", continent: "Europe", region: "eastern Europe", neighborIds: ["616", "703", "348", "642", "498", "112", "643"], centroid: [31.2, 48.4] },
  { numericId: "643", name: "Russia", continent: "Europe", region: "eastern Europe", neighborIds: ["804", "112", "440", "233", "246", "578", "156", "496", "398"], centroid: [105.3, 61.5] },
  { numericId: "356", name: "India", continent: "Asia", region: "southern Asia", neighborIds: ["586", "156", "524", "050", "144", "104"], centroid: [78.9, 20.6] },
  { numericId: "156", name: "China", continent: "Asia", region: "eastern Asia", neighborIds: ["356", "643", "496", "408", "104", "418", "704", "586", "398", "762", "417"], centroid: [104.2, 35.9] },
  { numericId: "392", name: "Japan", continent: "Asia", region: "eastern Asia", neighborIds: [], centroid: [138.3, 36.2] },
  { numericId: "764", name: "Thailand", continent: "Asia", region: "southeastern Asia", neighborIds: ["104", "418", "116", "458"], centroid: [100.5, 13.0] },
  { numericId: "360", name: "Indonesia", continent: "Asia", region: "southeastern Asia", neighborIds: ["458", "598", "626"], centroid: [113.9, -0.8] },
  { numericId: "682", name: "Saudi Arabia", continent: "Asia", region: "the Middle East", neighborIds: ["368", "400", "414", "634", "784", "512", "887"], centroid: [45.1, 23.9] },
  { numericId: "792", name: "Turkey", continent: "Asia", region: "the Middle East", neighborIds: ["268", "051", "364", "368", "760", "300", "100"], centroid: [35.2, 38.9] },
  { numericId: "818", name: "Egypt", continent: "Africa", region: "northeastern Africa", neighborIds: ["434", "736", "376"], centroid: [30.8, 26.8] },
  { numericId: "566", name: "Nigeria", continent: "Africa", region: "western Africa", neighborIds: ["120", "562", "204", "148"], centroid: [8.7, 9.1] },
  { numericId: "710", name: "South Africa", continent: "Africa", region: "southern Africa", neighborIds: ["508", "716", "072", "516", "426", "748"], centroid: [25.1, -30.6] },
  { numericId: "012", name: "Algeria", continent: "Africa", region: "northern Africa", neighborIds: ["504", "788", "434", "562", "466", "478", "732"], centroid: [1.7, 28.0] },
  { numericId: "036", name: "Australia", continent: "Oceania", region: "Oceania", neighborIds: [], centroid: [133.8, -25.3] },
  { numericId: "578", name: "Norway", continent: "Europe", region: "Scandinavia", neighborIds: ["752", "246", "643"], centroid: [8.5, 60.5] },
];

/**
 * Continent lookup for every TopoJSON country (ISO 3166-1 numeric).
 * Used to highlight continents during hints.
 */
export const CONTINENT_BY_ID: Record<string, string> = {
  // Africa
  "012": "Africa", "024": "Africa", "204": "Africa", "072": "Africa",
  "854": "Africa", "108": "Africa", "120": "Africa", "132": "Africa",
  "140": "Africa", "148": "Africa", "174": "Africa", "178": "Africa",
  "180": "Africa", "384": "Africa", "262": "Africa", "818": "Africa",
  "226": "Africa", "232": "Africa", "231": "Africa", "266": "Africa",
  "270": "Africa", "288": "Africa", "324": "Africa", "624": "Africa",
  "404": "Africa", "426": "Africa", "430": "Africa", "434": "Africa",
  "450": "Africa", "454": "Africa", "466": "Africa", "478": "Africa",
  "480": "Africa", "504": "Africa", "508": "Africa", "516": "Africa",
  "562": "Africa", "566": "Africa", "646": "Africa", "678": "Africa",
  "686": "Africa", "694": "Africa", "706": "Africa", "710": "Africa",
  "728": "Africa", "736": "Africa", "748": "Africa", "834": "Africa",
  "768": "Africa", "788": "Africa", "800": "Africa", "894": "Africa",
  "716": "Africa", "732": "Africa",
  // Asia
  "004": "Asia", "031": "Asia", "048": "Asia", "050": "Asia",
  "064": "Asia", "096": "Asia", "104": "Asia", "116": "Asia",
  "156": "Asia", "268": "Asia", "356": "Asia", "360": "Asia",
  "364": "Asia", "368": "Asia", "376": "Asia", "392": "Asia",
  "400": "Asia", "398": "Asia", "408": "Asia", "410": "Asia",
  "414": "Asia", "417": "Asia", "418": "Asia", "422": "Asia",
  "458": "Asia", "496": "Asia", "524": "Asia",
  "512": "Asia", "586": "Asia", "608": "Asia", "634": "Asia",
  "682": "Asia", "702": "Asia", "144": "Asia", "760": "Asia",
  "762": "Asia", "764": "Asia", "626": "Asia", "792": "Asia",
  "795": "Asia", "784": "Asia", "860": "Asia", "704": "Asia",
  "887": "Asia", "051": "Asia", "196": "Asia", "275": "Asia",
  "598": "Asia",
  // Europe
  "008": "Europe", "020": "Europe", "040": "Europe", "112": "Europe",
  "056": "Europe", "070": "Europe", "100": "Europe", "191": "Europe",
  "203": "Europe", "208": "Europe", "233": "Europe", "246": "Europe",
  "250": "Europe", "276": "Europe", "300": "Europe", "348": "Europe",
  "352": "Europe", "372": "Europe", "380": "Europe", "428": "Europe",
  "440": "Europe", "442": "Europe", "807": "Europe", "470": "Europe",
  "498": "Europe", "499": "Europe", "528": "Europe", "578": "Europe",
  "616": "Europe", "620": "Europe", "642": "Europe", "643": "Europe",
  "688": "Europe", "703": "Europe", "705": "Europe", "724": "Europe",
  "752": "Europe", "756": "Europe", "804": "Europe", "826": "Europe",
  // North America
  "028": "North America", "044": "North America", "052": "North America",
  "084": "North America", "124": "North America", "188": "North America",
  "192": "North America", "212": "North America", "214": "North America",
  "222": "North America", "308": "North America", "320": "North America",
  "332": "North America", "340": "North America", "388": "North America",
  "484": "North America", "558": "North America", "591": "North America",
  "630": "North America", "659": "North America", "662": "North America",
  "670": "North America", "780": "North America", "840": "North America",
  // South America
  "032": "South America", "068": "South America", "076": "South America",
  "152": "South America", "170": "South America", "218": "South America",
  "328": "South America", "600": "South America", "604": "South America",
  "740": "South America", "858": "South America", "862": "South America",
  // Oceania
  "036": "Oceania", "554": "Oceania", "090": "Oceania", "242": "Oceania",
  "296": "Oceania", "584": "Oceania", "583": "Oceania", "520": "Oceania",
  "585": "Oceania", "548": "Oceania", "882": "Oceania", "776": "Oceania",
  "798": "Oceania",
};

export function pickRandomCountry(): PuzzleCountry {
  return PUZZLE_COUNTRIES[Math.floor(Math.random() * PUZZLE_COUNTRIES.length)];
}
