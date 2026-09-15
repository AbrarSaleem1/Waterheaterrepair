import type { CityInfo, StateInfo } from './locations';
import siteConfig from '../data/site-config.json';

// Deterministic string hasher to pick stable variations per city
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

// Regional water hardness classification by state abbreviation
const hardWaterStates = new Set(['AZ', 'CA', 'NV', 'TX', 'FL', 'IN', 'OH', 'IL', 'NM', 'UT', 'CO', 'KS', 'NE', 'WY', 'MT', 'ID', 'SD', 'ND', 'IA']);
const softWaterStates = new Set(['WA', 'OR', 'ME', 'VT', 'NH', 'MA', 'CT', 'RI', 'SC', 'NC', 'GA', 'AL', 'MS', 'LA', 'AR']);

export interface DiagnosticRow {
  symptom: string;
  cause: string;
  testMethod: string;
  localAction: string;
}

export interface CitySEOData {
  variationIndex: number;
  heroTitle: string;
  heroSubtitle: string;
  introHeading: string;
  introParagraph1: string;
  introParagraph2: string;
  waterProfile: {
    hardnessCategory: string;
    ppmEstimate: string;
    gpgEstimate: string;
    waterImpact: string;
    maintenanceTip: string;
    anodeRecommendation: string;
  };
  plumbingCodeNote: string;
  diagnosticMatrix: DiagnosticRow[];
  estimateProcess: {
    step1: string;
    step2: string;
    step3: string;
    step4: string;
  };
  localFaqs: { q: string; a: string }[];
  emergencyHighlight: string;
}

export function generateCitySEO(city: CityInfo, state: StateInfo): CitySEOData {
  const seed = hashString(`${city.name}-${state.abbr}`);
  // 8 distinct starting variations for diverse programmatic SEO
  const variationIndex = seed % 8;

  // 1. Water profile determination
  const isHard = hardWaterStates.has(state.abbr);
  const isSoft = softWaterStates.has(state.abbr);

  let hardnessCategory = 'Moderately Hard Water';
  let ppmEstimate = '120 – 175 PPM';
  let gpgEstimate = '7.0 – 10.2 Grains/Gal';
  let waterImpact = `In ${city.name}, dissolved calcium and magnesium ions gradually precipitate out of suspension at operating temperatures above 125°F. This creates an insulating mineral blanket across heating elements and bottom tank heads, trapping heat and increasing energy consumption by up to 18%.`;
  let maintenanceTip = `We recommend an annual power flush and sacrificial anode inspection every 2 to 3 years for ${city.name} households to maintain peak thermal transfer.`;
  let anodeRecommendation = 'Standard high-output magnesium or aluminum-zinc alloy anode rod.';

  if (isHard) {
    hardnessCategory = 'High to Very Hard Water';
    ppmEstimate = '210 – 380+ PPM';
    gpgEstimate = '12.3 – 22.2+ Grains/Gal';
    waterImpact = `Groundwater and municipal reservoirs supplying ${city.name} and ${state.name} carry severe concentrations of dissolved calcite, limestone, and gypsum. In traditional storage tanks, this mineral blanket thickens rapidly, causing aggressive popping sounds, element burnout, and early glass-lining failure. In tankless units, scale clogs narrow heat exchanger channels within 12 to 18 months.`;
    maintenanceTip = `Homes in ${city.name} require bi-annual sediment flushes, full-port brass drain valves, and annual recirculating vinegar descaling for tankless systems.`;
    anodeRecommendation = 'Heavy-duty powered titanium impressed-current anode rod or dual zinc-aluminum rods.';
  } else if (isSoft) {
    hardnessCategory = 'Soft to Moderately Soft Water';
    ppmEstimate = '35 – 85 PPM';
    gpgEstimate = '2.0 – 5.0 Grains/Gal';
    waterImpact = `While ${city.name} enjoys minimal mineral scale, naturally soft or slightly acidic surface water supplies carry higher dissolved oxygen and aggressive chloride ions. This chemistry accelerates galvanic corrosion between dissimilar copper and steel fittings, attacking tank seams and fittings from the inside out.`;
    maintenanceTip = `Ensure dielectric unions are installed on all copper-to-steel connections in ${city.name}, and inspect the sacrificial anode rod every 2.5 years to prevent internal tank oxidation.`;
    anodeRecommendation = 'Premium extruded pure magnesium rod for maximum cathodic attraction.';
  }

  // 2. Local plumbing code determination
  let plumbingCodeNote = `Under ${state.name} building standards and local ${city.name} municipal plumbing ordinances, all replacement water heaters must feature an ASME-rated temperature-and-pressure (T&P) relief valve routed to an approved air gap drain, lead-free brass ball shut-off valves, and thermal expansion tanks on closed municipal water meters.`;

  if (['CA', 'WA', 'OR', 'NV', 'UT'].includes(state.abbr)) {
    plumbingCodeNote = `Under ${state.name} seismic mitigation standards and local ${city.name} building codes, all storage water heaters must be anchored with two heavy-gauge seismic earthquake straps bolted directly into wall studs (top 1/3 and bottom 1/3), flexible corrugated stainless steel gas and water connectors, and an approved thermal expansion vessel.`;
  } else if (['FL', 'TX', 'LA', 'SC', 'NC', 'GA'].includes(state.abbr)) {
    plumbingCodeNote = `${state.name} building code regulations in ${city.name} mandate that water heaters installed in interior closets, utility rooms, or second-story attics sit inside watertight 24-gauge galvanized or composite drain pans with dedicated 3/4-inch indirect gravity drain lines routed to the building exterior.`;
  } else if (['NY', 'PA', 'OH', 'MI', 'IL', 'WI', 'MN', 'CO', 'MA', 'ME'].includes(state.abbr)) {
    plumbingCodeNote = `Due to harsh northern freezing temperatures in ${city.name}, local municipal codes require closed-cell thermal pipe insulation (R-3 minimum) on both supply lines, positive upward draft hood or direct-vent PVC flue configurations, and freeze-proof termination for the relief valve discharge line.`;
  }

  // 3. Technical Troubleshooting Matrix for City
  const diagnosticMatrix: DiagnosticRow[] = [
    {
      symptom: 'Loud popping or boiling kettle sounds during heating cycles',
      cause: `Trapped steam pockets violently boiling beneath a heavy ${city.name} calcium carbonate sediment blanket.`,
      testMethod: 'Thermal imaging camera scan of tank base & drain valve sediment sampling.',
      localAction: `High-velocity pressure flush and chemical descaling; replace bottom heating elements if scaled.`
    },
    {
      symptom: 'Water turns lukewarm after only 3 to 5 minutes of shower use',
      cause: 'Cracked or disintegrated polypropylene cold water dip tube dumping cold water into hot outlet.',
      testMethod: 'Flow temperature probe test and faucet aerator plastic debris check.',
      localAction: `Extract broken dip tube and install high-grade curved PEX replacement dip tube.`
    },
    {
      symptom: 'Standing water or slow seepage pooling under bottom tank jacket',
      cause: 'Internal glass-lined pressure vessel breach caused by thermal fatigue or anode depletion.',
      testMethod: 'Static pressure isolation check and moisture meter reading behind insulation.',
      localAction: `Emergency shut-off and same-day code-compliant tank replacement in ${city.name}.`
    },
    {
      symptom: 'Pilot flame extinguishes immediately when control knob is released',
      cause: 'Thermocouple millivolt drop (below 14mV), soot accumulation, or tripped thermal cutoff fuse.',
      testMethod: 'Multimeter closed-circuit millivoltage test under active pilot flame.',
      localAction: 'Clean pilot orifice, replace thermocouple, or install new sealed burner assembly.'
    }
  ];

  // 4. Service & Estimate Process (No prices mentioned, phone estimate model)
  const estimateProcess = {
    step1: `Call our 24/7 ${city.name} dispatch desk and describe your water heater symptoms or tank brand.`,
    step2: `Receive an immediate, transparent upfront phone estimate and confirmed technician arrival window.`,
    step3: `Our licensed technician inspects the system on-site, confirms diagnostics, and provides a clear written quote.`,
    step4: `Repairs or installation proceed only upon your approval, backed by comprehensive parts and labor warranty.`
  };

  // 5. Starting Point Variations (8 distinct angles authored by 25-year SEO master)
  let heroTitle = `Fast Water Heater Repair in ${city.name}, ${state.abbr}`;
  let heroSubtitle = `Licensed 24/7 master plumbers delivering same-day diagnostics, element repairs, and replacements across ${city.name}.`;
  let introHeading = `Expert Water Heater Services in ${city.name}, ${state.name}`;
  let introParagraph1 = '';
  let introParagraph2 = '';
  let emergencyHighlight = `Emergency master plumber available for 24/7 dispatch in ${city.name}, ${state.abbr}. Average arrival time is 45 to 75 minutes.`;

  switch (variationIndex) {
    case 0: // Hard Water & Mineral Scale Focus
      heroTitle = `Certified Water Heater Repair & Descaling in ${city.name}, ${state.abbr}`;
      heroSubtitle = `Protecting ${city.name} homes against mineral scale, heating element burnout, and sudden tank failures with rapid 24/7 service.`;
      introHeading = `Tackling Regional Mineral Hardness & Water Heater Strain in ${city.name}`;
      introParagraph1 = `For property owners across ${city.name}, local water chemistry is the primary factor dictating water heater reliability and equipment lifespan. Dissolved calcium carbonate and magnesium minerals continuously precipitate out of heated water, creating a dense, insulating sediment crust across bottom tank heads and electric heating elements.`;
      introParagraph2 = `When mineral scale insulates the heat source, the tank must burn significantly more energy to reach desired temperatures, triggering popping noises, high utility bills, and eventual thermal fatigue that cracks internal porcelain glass linings. Our licensed ${city.name} technicians arrive equipped with specialized descaling equipment, full-port brass drain valves, and commercial-grade replacement components.`;
      break;

    case 1: // 24/7 Rapid Emergency Breakdown Focus
      heroTitle = `24/7 Emergency Water Heater Repair in ${city.name}, ${state.abbr}`;
      heroSubtitle = `No hot water or an active leaking tank in ${city.name}? Our local on-call plumbers arrive rapidly with fully-stocked trucks.`;
      introHeading = `Rapid Emergency Hot Water Restoration Across ${city.name}`;
      introParagraph1 = `A water heater breakdown rarely occurs during convenient business hours. Discovering an icy shower before work or finding an active water leak spreading across your basement floor on a holiday requires an immediate, professional response. In ${city.name}, ${siteConfig.businessName} provides around-the-clock emergency dispatch with guaranteed upfront phone estimates.`;
      introParagraph2 = `Our mobile service trucks are fully stocked workshops carrying universal thermostats, thermocouples, 240V low-watt-density heating elements, ASME temperature-and-pressure relief valves, and replacement tanks. We diagnose the mechanical root cause on our initial visit, preventing costly secondary flood damage to your property.`;
      break;

    case 2: // Seasonal Groundwater & Thermal Stress Focus
      heroTitle = `Dependable Seasonal Water Heater Solutions in ${city.name}, ${state.abbr}`;
      heroSubtitle = `Engineered to withstand ${state.name}'s incoming groundwater temperatures and heavy household hot water demands.`;
      introHeading = `Countering Groundwater Temperature Shifts in ${city.name}`;
      introParagraph1 = `The temperature of incoming municipal water lines in ${city.name} fluctuates dramatically throughout the year. When winter temperatures cool incoming groundwater down to 40°F–50°F, water heaters must work up to 45% harder to deliver 120°F water to your showers and faucets, exposing hidden weaknesses in aging tanks.`;
      introParagraph2 = `From properly sizing burner BTU inputs and electrical wattages to calibrating thermostatic mixing valves that safely prevent scalding while expanding effective hot water capacity, our certified ${city.name} plumbers ensure your home maintains dependable, uninterrupted hot water year-round.`;
      break;

    case 3: // High-Efficiency & Tankless Conversion Focus
      heroTitle = `High-Efficiency & Tankless Water Heater Services in ${city.name}, ${state.abbr}`;
      heroSubtitle = `Lower monthly utility bills and enjoy continuous, endless hot water with certified repairs and modern upgrades in ${city.name}.`;
      introHeading = `Modernizing Hot Water Energy Efficiency for ${city.name} Homes`;
      introParagraph1 = `Water heating accounts for nearly 18% of the average residential utility bill. In ${city.name}, continuing to operate an obsolete, sediment-clogged 12-year-old storage tank results in substantial energy loss as heat continuously radiates away through the tank walls. Transitioning to an ultra-high-efficiency atmospheric unit or an on-demand tankless system delivers instant energy savings.`;
      introParagraph2 = `Our factory-trained technicians service and install leading tankless brands including Rinnai, Navien, Rheem, and Bradford White. We handle complete turnkey conversions in ${city.name}, including gas line capacity verification, dedicated direct-vent PVC flue routing, and annual descaling service.`;
      break;

    case 4: // Aging Infrastructure & Tank Burst Prevention Focus
      heroTitle = `Water Heater Replacement & Burst Tank Prevention in ${city.name}, ${state.abbr}`;
      heroSubtitle = `Prevent catastrophic basement floods and water damage with proactive inspections and upfront phone estimates in ${city.name}.`;
      introHeading = `Protecting Your ${city.name} Home from Catastrophic Tank Failure`;
      introParagraph1 = `The typical storage water heater in ${state.name} has a service life expectancy of 8 to 12 years. Once the sacrificial anode rod is consumed by natural electrochemical action, aggressive water starts eating through the glass-lined steel shell. In ${city.name}, a ruptured tank bottom can suddenly discharge 40 to 80 gallons of scalding water directly into your home.`;
      introParagraph2 = `Our licensed plumbers provide honest, transparent evaluations: if a minor replacement part like a thermocouple, heating element, or drain valve can reliably extend your unit's life, we fix it on the spot. If internal rust or tank seam corrosion makes repair unsafe, we provide clear replacement options over the phone.`;
      break;

    case 5: // Gas Venting, Draft & Combustion Safety Focus
      heroTitle = `Safe Gas Water Heater Repair & Venting in ${city.name}, ${state.abbr}`;
      heroSubtitle = `Certified gas plumbing specialists ensuring proper chimney drafting, pilot reliability, and carbon monoxide safety in ${city.name}.`;
      introHeading = `Rigorous Gas Safety & Flue Drafting Protocols in ${city.name}`;
      introParagraph1 = `Natural gas and propane water heaters require balanced air combustion and positive flue drafting to vent combustion byproducts safely out of your home. In ${city.name}, exhaust fan depressurization, unlined masonry chimneys, or aging draft hoods can cause toxic carbon monoxide backdrafting into living spaces.`;
      introParagraph2 = `Our technicians perform complete combustion safety checks on every service call in ${city.name}, verifying gas line manometer pressure, draft hood updraft, flame sensor current, and automatic gas shut-off valves. We keep your family safe while ensuring your burner fires at maximum thermal efficiency.`;
      break;

    case 6: // Commercial & High-Demand Multi-Family Focus
      heroTitle = `Commercial & Residential Water Heater Services in ${city.name}, ${state.abbr}`;
      heroSubtitle = `Heavy-duty recovery systems, ASME tanks, and multi-unit diagnostics for ${city.name} businesses and large households.`;
      introHeading = `High-Capacity Water Heating for ${city.name} Properties`;
      introParagraph1 = `Restaurants, multi-family apartment buildings, health clinics, and busy residential homes in ${city.name} require robust water heating systems with rapid recovery rates. Running out of hot water halts commercial operations and disrupts residential daily routines.`;
      introParagraph2 = `We service commercial-grade high-BTU atmospheric, power-vent, and multi-tank manifold systems throughout ${city.name}. Our commercial plumbing technicians handle emergency element replacements, circulating pump rebuilds, and preventative scale maintenance with minimal downtime.`;
      break;

    default: // Well Water, Sulfur Odor & Anode Protection Focus
      heroTitle = `Well Water & Municipal Water Heater Care in ${city.name}, ${state.abbr}`;
      heroSubtitle = `Eliminating rotten egg sulfur odors, discoloration, and rapid rust with advanced anode rods in ${city.name}.`;
      introHeading = `Specialized Water Quality & Corrosion Defense in ${city.name}`;
      introParagraph1 = `Homeowners in ${city.name} frequently battle smelly sulfur odors resembling rotten eggs when running hot water. This odor occurs when naturally occurring sulfate-reducing bacteria react with standard factory magnesium anode rods inside warm storage tanks, producing pungent hydrogen sulfide gas.`;
      introParagraph2 = `Our water treatment and plumbing specialists eradicate sulfur odors permanently by conducting hydrogen peroxide tank chlorination and installing specialized aluminum-zinc alloy rods or powered titanium anodes that protect your tank from corrosion without feeding bacteria.`;
      break;
  }

  // 6. City-specific FAQs (No prices mentioned, upfront phone estimate model)
  const localFaqs = [
    {
      q: `How quickly can a water heater plumber arrive in ${city.name}?`,
      a: `Our average dispatch response window in ${city.name}, ${state.abbr} is 45 to 75 minutes for emergency situations such as active tank leaks, gas odors, or complete loss of hot water. We have licensed plumbers on call 24 hours a day, 365 days a year.`
    },
    {
      q: `How do I obtain an estimate for water heater repair or replacement in ${city.name}?`,
      a: `We provide transparent upfront estimates directly over the phone based on your equipment brand, fuel type (gas or electric), and reported symptoms. Call our 24/7 hotline at ${siteConfig.phoneFormatted} to describe your issue and receive an estimate prior to technician dispatch.`
    },
    {
      q: `Do I need a plumbing permit to replace a water heater in ${city.name}?`,
      a: `Yes. Under ${state.name} building codes and municipal ${city.name} plumbing regulations, replacing a water heater requires a safety permit and post-installation inspection to verify thermal expansion compliance, seismic strapping, temperature-and-pressure relief routing, and gas ventilation safety. Our licensed team manages the entire permit process on your behalf.`
    },
    {
      q: `How does local water hardness in ${city.name} impact my water heater?`,
      a: `${waterImpact} ${maintenanceTip}`
    },
    {
      q: `What type of sacrificial anode rod should I use in ${city.name}?`,
      a: `Based on regional water testing across ${state.name}, we recommend: ${anodeRecommendation} Inspecting the rod every 2 to 3 years prevents premature tank wall rusting.`
    },
    {
      q: `Which postal codes do your service vehicles cover in ${city.name}?`,
      a: `We provide complete residential and commercial plumbing dispatch throughout ${city.name}, covering postal code${city.zips.length > 1 ? 's' : ''} ${city.zips.join(', ')} and surrounding neighboring districts.`
    }
  ];

  return {
    variationIndex,
    heroTitle,
    heroSubtitle,
    introHeading,
    introParagraph1,
    introParagraph2,
    waterProfile: {
      hardnessCategory,
      ppmEstimate,
      gpgEstimate,
      waterImpact,
      maintenanceTip,
      anodeRecommendation,
    },
    plumbingCodeNote,
    diagnosticMatrix,
    estimateProcess,
    localFaqs,
    emergencyHighlight,
  };
}
