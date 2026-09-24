export interface City {
  id: number;
  name: string;
}

export interface AuthUser {
  id: number;
  mobile: string;
  first_name: string | null;
  last_name: string | null;
  city: City | null;
  is_verified: boolean;
}

export interface OtpRequestSuccess {
  message: string;
  expires_in_seconds: number;
  /** Only present when the backend runs with APP_DEBUG=true. Never rely on this existing. */
  debug_code?: string;
}

export interface OtpCooldownError {
  message: string;
  retry_after_seconds: number;
}

export interface ValidationError {
  message: string;
  errors?: Record<string, string[]>;
}

export interface OtpVerifySuccess {
  message: string;
  token: string;
  user: AuthUser;
}

export interface MeSuccess {
  user: AuthUser;
}

export interface ApiMessage {
  message: string;
}
