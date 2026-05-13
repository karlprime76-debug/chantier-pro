export type MoneyCfa = number;

export type FoundationsCommonPricingInput = {
  priceConcretePerM3?: number;
  priceSteelPerKg?: number;
};

export type IsolatedFootingInput = FoundationsCommonPricingInput & {
  lengthM: number;
  widthM: number;
  heightM: number;
  quantity: number;
  blindingThicknessM: number;
  blindingOverhangM: number;
  steelRatioKgPerM3?: number;
};

export type StripFootingInput = FoundationsCommonPricingInput & {
  totalLengthM: number;
  widthM: number;
  heightM: number;
  blindingThicknessM: number;
  blindingWidthM: number;
  trenchWidthM: number;
  trenchDepthM: number;
  steelRatioKgPerM3?: number;
};

export type GroundBeamInput = FoundationsCommonPricingInput & {
  totalLengthM: number;
  widthM: number;
  heightM: number;
  steelRatioKgPerM3?: number;
  formworkEnabled: boolean;
};

export type RaftInput = FoundationsCommonPricingInput & {
  lengthM: number;
  widthM: number;
  thicknessM: number;
  blindingThicknessM: number;
  steelRatioKgPerM3?: number;
};

export type WellFoundationInput = FoundationsCommonPricingInput & {
  shape: "CIRCULAR" | "RECTANGULAR";
  diameterM?: number;
  lengthM?: number;
  widthM?: number;
  depthM: number;
  quantity: number;
  concreteHeightM: number;
  steelRatioKgPerM3?: number;
};

export type PileFoundationInput = FoundationsCommonPricingInput & {
  diameterM: number;
  depthM: number;
  quantity: number;
  steelRatioKgPerM3?: number;
};

export type GateFoundationInput = FoundationsCommonPricingInput & {
  postCount: number;
  blockLengthM: number;
  blockWidthM: number;
  blockHeightM: number;
  stripLengthM: number;
  stripWidthM: number;
  stripHeightM: number;
  steelRatioKgPerM3?: number;
};

export type FoundationsOutput = {
  excavationM3: number;
  blindingConcreteM3: number;
  foundationConcreteM3: number;
  estimatedSteelKg: number;
  estimatedFormworkM2: number;
  estimatedBackfillM3: number;
  estimatedConcreteCostCfa?: MoneyCfa;
  estimatedSteelCostCfa?: MoneyCfa;
  estimatedTotalCostCfa?: MoneyCfa;
};

const PI = Math.PI;

function clampNonNegative(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return n < 0 ? 0 : n;
}

function round3(n: number): number {
  return Math.round(n * 1000) / 1000;
}

function cost(value: number, unitPrice?: number): number | undefined {
  if (!unitPrice || !Number.isFinite(unitPrice) || unitPrice <= 0) return undefined;
  return Math.round(clampNonNegative(value) * unitPrice);
}

function totalCost(a?: number, b?: number): number | undefined {
  if (typeof a !== "number" && typeof b !== "number") return undefined;
  return Math.round((a ?? 0) + (b ?? 0));
}

export function calculateIsolatedFooting(input: IsolatedFootingInput): FoundationsOutput {
  const qty = clampNonNegative(Math.floor(input.quantity));
  const length = clampNonNegative(input.lengthM);
  const width = clampNonNegative(input.widthM);
  const height = clampNonNegative(input.heightM);
  const overhang = clampNonNegative(input.blindingOverhangM);
  const blindingThk = clampNonNegative(input.blindingThicknessM);

  const foundationConcreteM3 = length * width * height * qty;
  const blindingConcreteM3 = (length + 2 * overhang) * (width + 2 * overhang) * blindingThk * qty;

  const excavationDepth = height + blindingThk;
  const excavationM3 = (length + 2 * overhang) * (width + 2 * overhang) * excavationDepth * qty;

  const steelRatio = input.steelRatioKgPerM3;
  const estimatedSteelKg = steelRatio && steelRatio > 0 ? foundationConcreteM3 * steelRatio : 0;

  const perimeter = 2 * (length + width);
  const estimatedFormworkM2 = perimeter * height * qty;

  const estimatedBackfillM3 = clampNonNegative(excavationM3 - foundationConcreteM3 - blindingConcreteM3);

  const concreteCost = cost(foundationConcreteM3 + blindingConcreteM3, input.priceConcretePerM3);
  const steelCost = cost(estimatedSteelKg, input.priceSteelPerKg);

  return {
    excavationM3: round3(excavationM3),
    blindingConcreteM3: round3(blindingConcreteM3),
    foundationConcreteM3: round3(foundationConcreteM3),
    estimatedSteelKg: round3(estimatedSteelKg),
    estimatedFormworkM2: round3(estimatedFormworkM2),
    estimatedBackfillM3: round3(estimatedBackfillM3),
    estimatedConcreteCostCfa: concreteCost,
    estimatedSteelCostCfa: steelCost,
    estimatedTotalCostCfa: totalCost(concreteCost, steelCost),
  };
}

export function calculateStripFooting(input: StripFootingInput): FoundationsOutput {
  const length = clampNonNegative(input.totalLengthM);
  const width = clampNonNegative(input.widthM);
  const height = clampNonNegative(input.heightM);
  const blindingThk = clampNonNegative(input.blindingThicknessM);
  const blindingWidth = clampNonNegative(input.blindingWidthM);
  const trenchWidth = clampNonNegative(input.trenchWidthM);
  const trenchDepth = clampNonNegative(input.trenchDepthM);

  const foundationConcreteM3 = length * width * height;
  const blindingConcreteM3 = length * blindingWidth * blindingThk;
  const excavationM3 = length * trenchWidth * trenchDepth;

  const steelRatio = input.steelRatioKgPerM3;
  const estimatedSteelKg = steelRatio && steelRatio > 0 ? foundationConcreteM3 * steelRatio : 0;

  const estimatedFormworkM2 = 2 * length * height;

  const estimatedBackfillM3 = clampNonNegative(excavationM3 - foundationConcreteM3 - blindingConcreteM3);

  const concreteCost = cost(foundationConcreteM3 + blindingConcreteM3, input.priceConcretePerM3);
  const steelCost = cost(estimatedSteelKg, input.priceSteelPerKg);

  return {
    excavationM3: round3(excavationM3),
    blindingConcreteM3: round3(blindingConcreteM3),
    foundationConcreteM3: round3(foundationConcreteM3),
    estimatedSteelKg: round3(estimatedSteelKg),
    estimatedFormworkM2: round3(estimatedFormworkM2),
    estimatedBackfillM3: round3(estimatedBackfillM3),
    estimatedConcreteCostCfa: concreteCost,
    estimatedSteelCostCfa: steelCost,
    estimatedTotalCostCfa: totalCost(concreteCost, steelCost),
  };
}

export function calculateGroundBeam(input: GroundBeamInput): FoundationsOutput {
  const length = clampNonNegative(input.totalLengthM);
  const width = clampNonNegative(input.widthM);
  const height = clampNonNegative(input.heightM);

  const foundationConcreteM3 = length * width * height;

  const steelRatio = input.steelRatioKgPerM3;
  const estimatedSteelKg = steelRatio && steelRatio > 0 ? foundationConcreteM3 * steelRatio : 0;

  const estimatedFormworkM2 = input.formworkEnabled ? 2 * (width + height) * length : 0;

  const concreteCost = cost(foundationConcreteM3, input.priceConcretePerM3);
  const steelCost = cost(estimatedSteelKg, input.priceSteelPerKg);

  return {
    excavationM3: 0,
    blindingConcreteM3: 0,
    foundationConcreteM3: round3(foundationConcreteM3),
    estimatedSteelKg: round3(estimatedSteelKg),
    estimatedFormworkM2: round3(estimatedFormworkM2),
    estimatedBackfillM3: 0,
    estimatedConcreteCostCfa: concreteCost,
    estimatedSteelCostCfa: steelCost,
    estimatedTotalCostCfa: totalCost(concreteCost, steelCost),
  };
}

export function calculateRaft(input: RaftInput): FoundationsOutput {
  const length = clampNonNegative(input.lengthM);
  const width = clampNonNegative(input.widthM);
  const thickness = clampNonNegative(input.thicknessM);
  const blindingThk = clampNonNegative(input.blindingThicknessM);

  const foundationConcreteM3 = length * width * thickness;
  const blindingConcreteM3 = length * width * blindingThk;

  const steelRatio = input.steelRatioKgPerM3;
  const estimatedSteelKg = steelRatio && steelRatio > 0 ? foundationConcreteM3 * steelRatio : 0;

  const concreteCost = cost(foundationConcreteM3 + blindingConcreteM3, input.priceConcretePerM3);
  const steelCost = cost(estimatedSteelKg, input.priceSteelPerKg);

  return {
    excavationM3: 0,
    blindingConcreteM3: round3(blindingConcreteM3),
    foundationConcreteM3: round3(foundationConcreteM3),
    estimatedSteelKg: round3(estimatedSteelKg),
    estimatedFormworkM2: 0,
    estimatedBackfillM3: 0,
    estimatedConcreteCostCfa: concreteCost,
    estimatedSteelCostCfa: steelCost,
    estimatedTotalCostCfa: totalCost(concreteCost, steelCost),
  };
}

export function calculateWellFoundation(input: WellFoundationInput): FoundationsOutput {
  const qty = clampNonNegative(Math.floor(input.quantity));
  const depth = clampNonNegative(input.depthM);
  const concreteHeight = clampNonNegative(input.concreteHeightM);

  let sectionArea = 0;
  if (input.shape === "CIRCULAR") {
    const d = clampNonNegative(input.diameterM ?? 0);
    sectionArea = PI * (d * d) / 4;
  } else {
    const l = clampNonNegative(input.lengthM ?? 0);
    const w = clampNonNegative(input.widthM ?? 0);
    sectionArea = l * w;
  }

  const excavationM3 = sectionArea * depth * qty;
  const foundationConcreteM3 = sectionArea * concreteHeight * qty;

  const steelRatio = input.steelRatioKgPerM3;
  const estimatedSteelKg = steelRatio && steelRatio > 0 ? foundationConcreteM3 * steelRatio : 0;

  const concreteCost = cost(foundationConcreteM3, input.priceConcretePerM3);
  const steelCost = cost(estimatedSteelKg, input.priceSteelPerKg);

  return {
    excavationM3: round3(excavationM3),
    blindingConcreteM3: 0,
    foundationConcreteM3: round3(foundationConcreteM3),
    estimatedSteelKg: round3(estimatedSteelKg),
    estimatedFormworkM2: 0,
    estimatedBackfillM3: round3(clampNonNegative(excavationM3 - foundationConcreteM3)),
    estimatedConcreteCostCfa: concreteCost,
    estimatedSteelCostCfa: steelCost,
    estimatedTotalCostCfa: totalCost(concreteCost, steelCost),
  };
}

export function calculatePileFoundation(input: PileFoundationInput): FoundationsOutput {
  const qty = clampNonNegative(Math.floor(input.quantity));
  const diameter = clampNonNegative(input.diameterM);
  const depth = clampNonNegative(input.depthM);

  const singleVolume = PI * (diameter * diameter) / 4 * depth;
  const foundationConcreteM3 = singleVolume * qty;

  const steelRatio = input.steelRatioKgPerM3;
  const estimatedSteelKg = steelRatio && steelRatio > 0 ? foundationConcreteM3 * steelRatio : 0;

  const concreteCost = cost(foundationConcreteM3, input.priceConcretePerM3);
  const steelCost = cost(estimatedSteelKg, input.priceSteelPerKg);

  return {
    excavationM3: 0,
    blindingConcreteM3: 0,
    foundationConcreteM3: round3(foundationConcreteM3),
    estimatedSteelKg: round3(estimatedSteelKg),
    estimatedFormworkM2: 0,
    estimatedBackfillM3: 0,
    estimatedConcreteCostCfa: concreteCost,
    estimatedSteelCostCfa: steelCost,
    estimatedTotalCostCfa: totalCost(concreteCost, steelCost),
  };
}

export function calculateGateFoundation(input: GateFoundationInput): FoundationsOutput {
  const postCount = clampNonNegative(Math.floor(input.postCount));
  const blockLength = clampNonNegative(input.blockLengthM);
  const blockWidth = clampNonNegative(input.blockWidthM);
  const blockHeight = clampNonNegative(input.blockHeightM);

  const stripLength = clampNonNegative(input.stripLengthM);
  const stripWidth = clampNonNegative(input.stripWidthM);
  const stripHeight = clampNonNegative(input.stripHeightM);

  const blocksVolume = blockLength * blockWidth * blockHeight * postCount;
  const stripVolume = stripLength > 0 ? stripLength * stripWidth * stripHeight : 0;

  const foundationConcreteM3 = blocksVolume + stripVolume;

  const steelRatio = input.steelRatioKgPerM3;
  const estimatedSteelKg = steelRatio && steelRatio > 0 ? foundationConcreteM3 * steelRatio : 0;

  const concreteCost = cost(foundationConcreteM3, input.priceConcretePerM3);
  const steelCost = cost(estimatedSteelKg, input.priceSteelPerKg);

  return {
    excavationM3: 0,
    blindingConcreteM3: 0,
    foundationConcreteM3: round3(foundationConcreteM3),
    estimatedSteelKg: round3(estimatedSteelKg),
    estimatedFormworkM2: 0,
    estimatedBackfillM3: 0,
    estimatedConcreteCostCfa: concreteCost,
    estimatedSteelCostCfa: steelCost,
    estimatedTotalCostCfa: totalCost(concreteCost, steelCost),
  };
}
