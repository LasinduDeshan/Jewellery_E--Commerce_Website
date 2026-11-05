/**
 * Helper to produce authorized request headers for the Admin Portal.
 * Retrieves the isolated admin token from localStorage ('aura_admin_token')
 * with graceful fallback to customer token if logged in simultaneously.
 */
export function getAdminAuthHeaders(customHeaders: Record<string, string> = {}): Record<string, string> {
  let token: string | null = null;
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('aura_admin_token') || localStorage.getItem('jewellery_token');
  }

  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...customHeaders,
  };
}

