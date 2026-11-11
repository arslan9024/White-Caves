/**
 * doorMasking.ts
 * White Caves Real Estate LLC - Strict Unit Door Masking Utility
 * Rule: AEG-017 (TURING Silent Velocity Security Control)
 * Single Purpose File Law: < 350 lines
 *
 * Automatically masks physical house, villa, or plot indicators on external visual elements.
 * Preserves project, tower, and cluster names (e.g. "DAMAC Hills 2 - Camelia") while hiding
 * exact unit rows and door numbers (e.g. "Unit 402" -> "Unit 4**", "Villa B-12" -> "Villa B-**")
 * until NDA / Passport verification is validated.
 */

export interface DoorMaskingOptions {
  isNdaSigned?: boolean;
  isPassportVerified?: boolean;
  maskChar?: string;
}

/**
 * Masks unit door numbers, villa numbers, and plot identifiers in public property displays.
 * If both NDA and Passport verification are present, reveals the unmasked unit identifier.
 */
export function maskUnitDoor(
  unitIdentifier?: string | null,
  options: DoorMaskingOptions = {}
): string {
  if (!unitIdentifier) return 'Unit Private';

  const { isNdaSigned = false, isPassportVerified = false, maskChar = '*' } = options;

  // Fully verified users / VIP clearance view exact door numbers
  if (isNdaSigned && isPassportVerified) {
    return unitIdentifier;
  }

  const trimmed = unitIdentifier.trim();

  // Pattern: "Unit 1204" -> "Unit 12**", "Apt 501" -> "Apt 5**"
  const unitMatch = trimmed.match(/^(unit|apt|apartment|suite|office|flat)\s+([a-z0-9-]+)$/i);
  if (unitMatch) {
    const prefix = unitMatch[1];
    const num = unitMatch[2];
    const maskedNum = maskNumberString(num, maskChar);
    return `${prefix} ${maskedNum}`;
  }

  // Pattern: "Villa 42", "Villa B-12", "Townhouse 104"
  const villaMatch = trimmed.match(/^(villa|townhouse|plot)\s+([a-z0-9-]+)$/i);
  if (villaMatch) {
    const prefix = villaMatch[1];
    const num = villaMatch[2];
    const maskedNum = maskNumberString(num, maskChar);
    return `${prefix} ${maskedNum}`;
  }

  // Fallback: standalone alphanumeric identifier (e.g. "402-B", "1204")
  return maskNumberString(trimmed, maskChar);
}

function maskNumberString(str: string, maskChar: string): string {
  if (str.length <= 1) return maskChar;
  if (str.length === 2) return `${str[0]}${maskChar}`;

  // Keep the first 1-2 characters visible for building floor hints, mask the specific door
  const visibleLen = Math.max(1, Math.floor(str.length / 2));
  const visible = str.slice(0, visibleLen);
  const masked = maskChar.repeat(str.length - visibleLen);
  return `${visible}${masked}`;
}
