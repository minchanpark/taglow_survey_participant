const HANDONG_EMAIL_DOMAIN = '@handong.ac.kr';

export function isAllowedParticipantEmail(email: string | null | undefined): boolean {
  if (!email) {
    return false;
  }

  return email.trim().toLowerCase().endsWith(HANDONG_EMAIL_DOMAIN);
}

