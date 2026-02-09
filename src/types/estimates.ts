export interface VehicleInfo {
  year?: string;
  make?: string;
  model?: string;
  vin?: string;
}

export interface LineItem {
  lineNumber: number;
  description: string;
  operation: string;
  category: string;
  totalPrice: number;
}

export interface Calibration {
  system: string;
  type: "Static" | "Dynamic" | "Static & Dynamic";
  priority: "Required" | "Recommended" | "Verify";
  reason: string;
  triggeringItems: string[];
  estimatedCost: number;
}

export interface Note {
  severity: "info" | "warning" | "critical";
  message: string;
}

export interface AnalysisResult {
  vehicleInfo: VehicleInfo;
  lineItems: LineItem[];
  calibrations: Calibration[];
  notes: Note[];
}
