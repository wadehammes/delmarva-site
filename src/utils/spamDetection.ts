/**
 * Spam detection utilities
 */

// Common spam patterns
const SPAM_PATTERNS = [
  /\b(viagra|cialis|casino|poker|loan|mortgage|debt|free money|make money fast)\b/i,
  /\b(click here|buy now|limited time|act now|urgent)\b/i,
  /(http|https|www\.)[^\s]{20,}/i, // Long URLs
  /[A-Z]{10,}/, // Excessive caps
  /[!@#$%^&*()]{5,}/, // Excessive special chars
  /(.)\1{10,}/, // Repeated characters (e.g., "aaaaaaaaaa")
];

// Suspicious email patterns
const SUSPICIOUS_EMAIL_PATTERNS = [
  /^[a-z0-9._%+-]+@(gmail|yahoo|hotmail|outlook)\.(com|net|org)$/i,
];

/**
 * Check if content contains spam patterns
 */
export function containsSpamPatterns(content: string): boolean {
  // Check caps pattern before lowercasing (caps pattern needs original case)
  const hasExcessiveCaps = /[A-Z]{10,}/.test(content);
  if (hasExcessiveCaps) {
    return true;
  }

  // Check other patterns on normalized content
  const normalizedContent = content.toLowerCase();
  return SPAM_PATTERNS.some((pattern) => pattern.test(normalizedContent));
}

/**
 * Check if email looks suspicious
 * Note: This is a heuristic - legitimate users may have these emails too
 */
export function isSuspiciousEmail(email: string): boolean {
  return SUSPICIOUS_EMAIL_PATTERNS.some((pattern) => pattern.test(email));
}

/**
 * Check if message is too short (likely automated)
 * Only flag truly empty or single-character messages
 */
export function isMessageTooShort(message: string, minLength = 3): boolean {
  return message.trim().length < minLength;
}

/**
 * Check if message is too long (likely spam)
 */
export function isMessageTooLong(message: string, maxLength = 5000): boolean {
  return message.length > maxLength;
}

/**
 * Comprehensive spam check
 */
export function isSpam(content: {
  email: string;
  message: string;
  name?: string;
  companyName?: string;
}): {
  isSpam: boolean;
  reasons: string[];
} {
  const reasons: string[] = [];

  // Check message content
  if (containsSpamPatterns(content.message)) {
    reasons.push("Message contains spam patterns");
  }

  if (isMessageTooShort(content.message)) {
    reasons.push("Message is too short");
  }

  if (isMessageTooLong(content.message)) {
    reasons.push("Message is too long");
  }

  // Check email (informational only - don't use for spam detection)
  // Many legitimate users have Gmail/Yahoo addresses
  // if (isSuspiciousEmail(content.email)) {
  //   reasons.push("Email appears suspicious");
  // }

  // Check name (common spam names)
  if (content.name) {
    const nameLower = content.name.toLowerCase();
    if (
      nameLower.length < 2 ||
      nameLower.length > 50 ||
      /^[a-z]+$/.test(nameLower) // Only letters (no spaces, numbers, etc.)
    ) {
      // This is lenient - adjust based on your needs
    }
  }

  // Only flag as spam if multiple indicators OR critical spam patterns
  // This prevents false positives from single checks like "message too short"
  const hasCriticalSpam = containsSpamPatterns(content.message);
  const hasMultipleIndicators = reasons.length >= 2;

  return {
    isSpam: hasCriticalSpam || hasMultipleIndicators,
    reasons,
  };
}
