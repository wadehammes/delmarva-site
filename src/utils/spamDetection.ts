const BLOCKED_EMAIL_DOMAINS = new Set(["proonlinepage.com"]);

const SPAM_PATTERNS = [
  /\b(viagra|cialis|casino|poker|loan|mortgage|debt|free money|make money fast)\b/i,
  /\b(click here|buy now|limited time|act now|urgent)\b/i,
  /\b(reply\s+stop\s+to\s+opt\s+out|text\s+stop\s+to\s+opt\s+out)\b/i,
  /\b(wikipedia\s+page|wiki\s+page)\b.*\b(created|creation|getting|build|revered|reference)\b/i,
  /\b(getting|get|create|build)\b.*\b(wikipedia|wiki)\s+page\b/i,
  /\b(1st|first)\s+page\s+of\s+google\b/i,
  /\b(backlink|link building|seo services|rank on google|google ranking)\b/i,
  /\brespond\s+back\s+to\s+this\s+email\b/i,
  /(http|https|www\.)[^\s]{20,}/i,
  /[A-Z]{10,}/,
  /[!@#$%^&*()]{5,}/,
  /(.)\1{10,}/,
];

const SUSPICIOUS_EMAIL_PATTERNS = [
  /^[a-z0-9._%+-]+@(gmail|yahoo|hotmail|outlook)\.(com|net|org)$/i,
];

export const containsSpamPatterns = (content: string): boolean => {
  const hasExcessiveCaps = /[A-Z]{10,}/.test(content);
  if (hasExcessiveCaps) {
    return true;
  }

  const normalizedContent = content.toLowerCase();
  return SPAM_PATTERNS.some((pattern) => pattern.test(normalizedContent));
};

export const isSuspiciousEmail = (email: string): boolean => {
  return SUSPICIOUS_EMAIL_PATTERNS.some((pattern) => pattern.test(email));
};

export const isBlockedEmailDomain = (email: string): boolean => {
  const atIndex = email.lastIndexOf("@");

  if (atIndex === -1) {
    return false;
  }

  const domain = email
    .slice(atIndex + 1)
    .trim()
    .toLowerCase();

  return BLOCKED_EMAIL_DOMAINS.has(domain);
};

export const messageRepeatsSubmitterEmail = (
  message: string,
  email: string,
): boolean => {
  if (!message.trim() || !email.trim()) {
    return false;
  }

  return message.toLowerCase().includes(email.trim().toLowerCase());
};

export const isMessageTooShort = (message: string, minLength = 3): boolean => {
  return message.trim().length < minLength;
};

export const isMessageTooLong = (
  message: string,
  maxLength = 5000,
): boolean => {
  return message.length > maxLength;
};

export const isSpam = (content: {
  email: string;
  message: string;
  name?: string;
  companyName?: string;
}): {
  isSpam: boolean;
  reasons: string[];
} => {
  if (isBlockedEmailDomain(content.email)) {
    return {
      isSpam: true,
      reasons: ["Email domain is blocked"],
    };
  }

  if (containsSpamPatterns(content.message)) {
    return {
      isSpam: true,
      reasons: ["Message contains spam patterns"],
    };
  }

  const reasons: string[] = [];

  if (messageRepeatsSubmitterEmail(content.message, content.email)) {
    reasons.push("Message repeats submitter email");
  }

  if (isMessageTooShort(content.message)) {
    reasons.push("Message is too short");
  }

  if (isMessageTooLong(content.message)) {
    reasons.push("Message is too long");
  }

  const hasMultipleIndicators = reasons.length >= 2;

  return {
    isSpam: hasMultipleIndicators,
    reasons,
  };
};
