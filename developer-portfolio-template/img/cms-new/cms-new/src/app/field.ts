export interface Field {
  name: string;
  type: string;
  options: String[];
  isCommon: boolean;
  Value: any;
}
export interface Event {
  id: number;
  name: string;
  code: string;
  isLetterRequired: boolean;
  eventOrder: number;
  letterNumber: string;
  eventDate: string;
  performanceBondExpiryDate: string;
  bankName: string;
  cadNumber: number;
  cadExpiryDate: string;
  extendedCadExpiryDate: string;
  lcNumber: string;
  lcExpiryDate: string;
  extendedLcExpiryDate: string;
  lcOpeningDate: string;
  latestShipmentDate: string;
  extendedLatestShipmentDate: string;
  bankPermitNumber: string;
  lcExpiryDateExtensionCount: number;
  latestShipmentDateExtensionCount: number;
  cadExpiryDateExtensionCount: number;
  delayReason: string;
}
