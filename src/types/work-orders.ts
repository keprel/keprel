export const DOCUMENT_CATEGORIES = [
  {
    key: "DASHBOARD_BEFORE",
    label: "Dashboard Before",
    acceptedTypes: ["image/png", "image/jpeg", "application/pdf"],
    multiple: false,
  },
  {
    key: "FOUR_CORNER_PICTURES",
    label: "Four Corner Pictures",
    acceptedTypes: ["image/png", "image/jpeg"],
    multiple: true,
  },
  {
    key: "THRUST_ANGLE_ALIGNMENT",
    label: "Thrust Angle Alignment",
    acceptedTypes: ["image/png", "image/jpeg", "application/pdf"],
    multiple: false,
  },
  {
    key: "REPAIR_ESTIMATE",
    label: "Repair Estimate",
    acceptedTypes: ["image/png", "image/jpeg", "application/pdf"],
    multiple: false,
  },
  {
    key: "CALIBRATION_REPORT",
    label: "Calibration Report",
    acceptedTypes: ["image/png", "image/jpeg", "application/pdf"],
    multiple: false,
  },
  {
    key: "PRE_SCAN",
    label: "Pre-Scan",
    acceptedTypes: ["image/png", "image/jpeg", "application/pdf"],
    multiple: false,
  },
  {
    key: "OEM_PROCEDURES",
    label: "OEM Procedures",
    acceptedTypes: ["image/png", "image/jpeg", "application/pdf"],
    multiple: true,
  },
  {
    key: "PROOF_OF_WORK",
    label: "Proof of Work",
    acceptedTypes: ["image/png", "image/jpeg", "application/pdf"],
    multiple: true,
  },
  {
    key: "POST_SCAN",
    label: "Post-Scan",
    acceptedTypes: ["image/png", "image/jpeg", "application/pdf"],
    multiple: false,
  },
] as const;

export type DocumentCategory = (typeof DOCUMENT_CATEGORIES)[number]["key"];

export interface WorkOrderDocument {
  id: string;
  workOrderId: string;
  category: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  createdAt: string;
}

export interface WorkOrderLineItem {
  id: string;
  workOrderId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  createdAt: string;
}

export interface WorkOrder {
  id: string;
  userId: string;
  bodyShop: string;
  roNumber: string;
  vin: string | null;
  status: "OPEN" | "IN_PROGRESS" | "INVOICED" | "COMPLETED";
  invoicedAt: string | null;
  documents: WorkOrderDocument[];
  lineItems: WorkOrderLineItem[];
  createdAt: string;
  updatedAt: string;
}
