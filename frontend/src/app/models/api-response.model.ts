/**
 * Standard API response wrapper
 */
export interface ApiResponse<T> {
  timestamp: string;
  path: string;
  data: T;
}

/**
 * API error response
 */
export interface ApiErrorResponse {
  timestamp: string;
  path: string;
  status: number;
  error: string;
  message: string;
  fieldErrors?: FieldError[];
  correlationId?: string;
}

export interface FieldError {
  field: string;
  message: string;
  rejectedValue?: unknown;
}
