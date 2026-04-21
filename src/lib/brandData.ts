/**
 * Brand-specific Model Data for enrichment
 * Extracted from official pricing/spec sheets provided by the user.
 */

export interface ModelEntry {
  capacity: string;   // in kW
  model: string;
  price: number;
  phase: '1Ph' | '3Ph';
  mppt?: string;
  notes?: string;
}

export const SOLPLANET_MODELS: ModelEntry[] = [
  { capacity: '3',  price: 15100,  model: 'ASW 3000S-S2',       phase: '1Ph', mppt: '1 MPPT' },
  { capacity: '3',  price: 17200,  model: 'ASW 3000-S-G2',      phase: '1Ph', mppt: '2 MPPT' },
  { capacity: '4',  price: 26900,  model: 'ASW 4000-S-G2',      phase: '1Ph', mppt: '2 MPPT' },
  { capacity: '5',  price: 27400,  model: 'ASW 5000-S-G2',      phase: '1Ph', mppt: '2 MPPT' },
  { capacity: '5',  price: 49400,  model: 'ASW 5K-LT-G2 Pro',   phase: '3Ph' },
  { capacity: '6',  price: 50600,  model: 'ASW 6K-LT-G2 Pro',   phase: '3Ph' },
  { capacity: '8',  price: 53900,  model: 'ASW 8K-LT-G2 Pro',   phase: '3Ph' },
  { capacity: '10', price: 57800,  model: 'ASW 10K-LT-G2 Pro',  phase: '3Ph' },
  { capacity: '12', price: 60900,  model: 'ASW 12K-LT-G2 Pro',  phase: '3Ph' },
  { capacity: '15', price: 63900,  model: 'ASW 15K-LT-G2 Pro',  phase: '3Ph' },
  { capacity: '17', price: 68900,  model: 'ASW 17K-LT-G2 Pro',  phase: '3Ph' },
  { capacity: '20', price: 71900,  model: 'ASW 20K-LT-G2 Pro',  phase: '3Ph' },
  { capacity: '25', price: 97900,  model: 'ASW 25K-LT-G3 W/ AFCI', phase: '3Ph' },
  { capacity: '30', price: 102500, model: 'ASW 30K-LT-G3 W/ AFCI', phase: '3Ph' },
  { capacity: '33', price: 105800, model: 'ASW 33K-LT-G3 W/ AFCI', phase: '3Ph' },
  { capacity: '36', price: 107800, model: 'ASW 36K-LT-G3 W/ AFCI', phase: '3Ph' },
  { capacity: '40', price: 109900, model: 'ASW 40K-LT-G3 W/ AFCI', phase: '3Ph' },
  { capacity: '50', price: 138900, model: 'ASW 50K-LT-G3',      phase: '3Ph' },
];

export const INVOLTICS_MODELS: ModelEntry[] = [
  // Solar On-Grid Inverters
  { capacity: '1.5', price: 13900, model: 'GT 1.5K-1P C01', phase: '1Ph', mppt: '1MPPT' },
  { capacity: '2.2', price: 13900, model: 'GT 2.2K-1P C01', phase: '1Ph', mppt: '1MPPT' },
  { capacity: '3',   price: 14250, model: 'GT 3.0K-1P C01', phase: '1Ph', mppt: '1MPPT' },
  { capacity: '3.3', price: 14500, model: 'GT 3.3K-1P C01', phase: '1Ph', mppt: '1MPPT' },
  { capacity: '4',   price: 17300, model: 'GT 4.0K-1P C01', phase: '1Ph', mppt: '1MPPT' },
  { capacity: '5',   price: 24500, model: 'GT 5.0K-1P C01', phase: '1Ph', mppt: '1MPPT' },
  { capacity: '6',   price: 25250, model: 'GT 6.0K-1P C01', phase: '1Ph', mppt: '1MPPT' },
  { capacity: '5',   price: 38350, model: 'GT 5.0K-3P C01', phase: '3Ph', mppt: '2MPPT' },
  { capacity: '6',   price: 39900, model: 'GT 6.0K-3P C01', phase: '3Ph', mppt: '2MPPT' },
  { capacity: '8',   price: 40300, model: 'GT 8.0K-3P C01', phase: '3Ph', mppt: '2MPPT' },
  { capacity: '10',  price: 41900, model: 'GT 10K-3P C01',  phase: '3Ph', mppt: '2MPPT' },
  { capacity: '12',  price: 43200, model: 'GT 12K-3P C01',  phase: '3Ph', mppt: '2MPPT' },
  { capacity: '15',  price: 50300, model: 'GT 15K-3P C01',  phase: '3Ph', mppt: '2MPPT' },
  { capacity: '20',  price: 61300, model: 'GT 20K-3P C01',  phase: '3Ph', mppt: '2MPPT' },
  { capacity: '25',  price: 66600, model: 'GT 25K-3P C01',  phase: '3Ph', mppt: '2MPPT' },
  
  // Solar Hybrid Inverters
  { capacity: '3',   price: 69000,  model: 'GTSI-0304K1P',   phase: '1Ph', mppt: '1MPPT' },
  { capacity: '3.6', price: 75000,  model: 'GTSI-3.605K1P',  phase: '1Ph', mppt: '2MPPT' },
  { capacity: '5',   price: 80500,  model: 'GTSI-0506K1P',   phase: '1Ph', mppt: '2MPPT' },
  { capacity: '6',   price: 85000,  model: 'GTSI-0608K1P',   phase: '1Ph', mppt: '2MPPT' },
  { capacity: '8',   price: 125000, model: 'GTSI-0810K1P',   phase: '1Ph', mppt: '2MPPT' },
  { capacity: '5',   price: 152000, model: 'GTSI-0506K-3P',  phase: '3Ph', mppt: '2MPPT' },
  { capacity: '6',   price: 155000, model: 'GTSI-0608K-3P',  phase: '3Ph', mppt: '2MPPT' },
  { capacity: '8',   price: 161000, model: 'GTSI-0810K-3P',  phase: '3Ph', mppt: '2MPPT' },
  { capacity: '10',  price: 168000, model: 'GTSI-1012K-3P',  phase: '3Ph', mppt: '2MPPT' },
  { capacity: '12',  price: 174000, model: 'GTSI-1215K-3P',  phase: '3Ph', mppt: '2MPPT' },
  { capacity: '15',  price: 220000, model: 'GTSI-1520K-3P',  phase: '3Ph', mppt: '2MPPT' },
  { capacity: '20',  price: 282000, model: 'GTSI-2025K-3P',  phase: '3Ph', mppt: '2MPPT' },
];

export const SUNWAYS_MODELS: ModelEntry[] = [
  { capacity: '3',  price: 64000,  model: 'STH-3KTL-LS',  phase: '1Ph' },
  { capacity: '5',  price: 68500,  model: 'STH-5KTL-LS',  phase: '1Ph' },
  { capacity: '8',  price: 92000,  model: 'STH-8KTL-LS',  phase: '1Ph' },
  { capacity: '6',  price: 86712,  model: 'STH-6KTL-HT',  phase: '3Ph' },
  { capacity: '8',  price: 106040, model: 'STH-8KTL-HT',  phase: '3Ph' },
  { capacity: '10', price: 130000, model: 'STH-10KTL-HT', phase: '3Ph' },
  { capacity: '15', price: 210619, model: 'STH-15KTL-HT', phase: '3Ph' },
  { capacity: '20', price: 240000, model: 'STH-20KTL-HT', phase: '3Ph' },
  { capacity: '25', price: 260000, model: 'STH-25KTL-HT', phase: '3Ph' },
  { capacity: '30', price: 275000, model: 'STH-30KTL-HT', phase: '3Ph' },
  { capacity: '33', price: 282000, model: 'STH-33KTL-HT', phase: '3Ph' },
];

export const DYNESS_MODELS: ModelEntry[] = [
  { capacity: '100Ah', model: 'DYNESS STACK 100', price: 0, phase: '1Ph' },
  { capacity: '14.33', model: 'POWER BRICK PRO LV', price: 0, phase: '1Ph', notes: '44.8V-57.6V' },
  { capacity: '7.68',  model: 'TOWER PRO TP7 HV',   price: 0, phase: '1Ph' },
  { capacity: '11.52', model: 'TOWER PRO TP11 HV',  price: 0, phase: '3Ph' },
  { capacity: '15.36', model: 'TOWER PRO TP15 HV',  price: 0, phase: '3Ph' },
  { capacity: '19.2',  model: 'TOWER PRO TP19 HV',  price: 0, phase: '3Ph' },
  { capacity: '23.04', model: 'TOWER PRO TP23 HV',  price: 0, phase: '3Ph' },
  { capacity: '5',     model: 'DL5.0C Pro',        price: 0, phase: '1Ph' },
  { capacity: '10.24', model: 'POWER BOX G2',      price: 0, phase: '1Ph' },
  { capacity: '14.33', model: 'STACK 280',         price: 0, phase: '1Ph', notes: '134V-876V' },
];

/**
 * Finds the correct model number based on brand, capacity, price, and phase.
 */
export const findBrandModel = (
  brand: string,
  capacity: string | number, 
  price: number, 
  phase?: string
): string | null => {
  const brandLower = brand.toLowerCase().trim();
  const capStr = String(capacity).replace(/[^\d.]/g, '');
  
  let modelList: ModelEntry[] = [];
  if (brandLower.includes('solplanet')) modelList = SOLPLANET_MODELS;
  else if (brandLower.includes('involtics')) {
    const fullCap = String(capacity).toLowerCase();
    if (fullCap.includes('100ah') || fullCap.includes('100 ah')) return 'INVOLTICS LV';
    modelList = INVOLTICS_MODELS;
  }
  else if (brandLower.includes('sunways')) modelList = SUNWAYS_MODELS;
  else if (brandLower.includes('turno volt')) {
    const fullCap = String(capacity).toLowerCase();
    if (fullCap.includes('200ah') || fullCap.includes('200 ah') || fullCap.includes('280ah') || fullCap.includes('280 ah') || fullCap.includes('10') || fullCap.includes('14')) {
      return 'Low Voltage';
    }
  }
  else if (brandLower.includes('dyness')) {
    // Special handling for Dyness which doesn't use price for matching
    const fullCap = String(capacity).toLowerCase();
    
    // Try to match based on the full capacity string first (to handle Ah vs kWh)
    if (fullCap.includes('100ah') && !fullCap.includes('5')) return 'DYNESS STACK 100';
    if (fullCap.includes('14.33')) {
      // Differentiate by operating voltage if possible (normally passed in phase or notes, but here we might just have capacity)
      if (fullCap.includes('134v') || fullCap.includes('876v')) return 'STACK 280';
      return 'POWER BRICK PRO LV'; // Default to Power Brick for 14.33
    }
    if (fullCap.includes('7.68')) return 'TOWER PRO TP7 HV';
    if (fullCap.includes('11.52')) return 'TOWER PRO TP11 HV';
    if (fullCap.includes('15.36')) return 'TOWER PRO TP15 HV';
    if (fullCap.includes('19.2')) return 'TOWER PRO TP19 HV';
    if (fullCap.includes('23.04')) return 'TOWER PRO TP23 HV';
    if (fullCap.includes('10.24')) return 'POWER BOX G2';
    if (fullCap.includes('5')) return 'DL5.0C Pro';
    
    return null;
  }

  if (modelList.length === 0) return null;

  // Try to find an exact match including price if possible
  const exactMatch = modelList.find(m => 
    m.capacity === capStr && 
    (Math.abs(m.price - price) < 2000) // Slightly larger tolerance for various distributors
  );
  if (exactMatch) return exactMatch.model;

  // Fallback to capacity and phase
  const isThreePhase = phase?.toLowerCase().includes('three') || phase?.toLowerCase().includes('3ph');
  const phaseMatch = modelList.find(m => 
    m.capacity === capStr && 
    (isThreePhase ? m.phase === '3Ph' : m.phase === '1Ph')
  );
  if (phaseMatch) return phaseMatch.model;

  // Last resort: just capacity
  const capMatch = modelList.find(m => m.capacity === capStr);
  return capMatch ? capMatch.model : null;
};
