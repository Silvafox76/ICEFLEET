import { NextResponse } from 'next/server';

/**
 * Standardized API response helpers
 */

export function successResponse<T>(data: T, status: number = 200): NextResponse {
  return NextResponse.json({ success: true, data }, { status });
}

export function errorResponse(
  message: string,
  status: number = 500,
  details?: unknown
): NextResponse {
  return NextResponse.json({
    success: false,
    error: message,
    details
  }, { status });
}

export function validationErrorResponse(errors: unknown): NextResponse {
  return NextResponse.json({
    success: false,
    error: 'Validation failed',
    details: errors
  }, { status: 400 });
}

export function notFoundResponse(resource: string): NextResponse {
  return NextResponse.json({
    success: false,
    error: `${resource} not found`
  }, { status: 404 });
}

export function unauthorizedResponse(message: string = 'Unauthorized'): NextResponse {
  return NextResponse.json({
    success: false,
    error: message
  }, { status: 401 });
}

export function forbiddenResponse(message: string = 'Forbidden'): NextResponse {
  return NextResponse.json({
    success: false,
    error: message
  }, { status: 403 });
}
