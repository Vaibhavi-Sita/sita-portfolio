package com.sita.portfolio.exception;

/**
 * Exception thrown when authentication fails or is missing.
 * Results in HTTP 401 response.
 */
public class UnauthorizedException extends RuntimeException {

    public UnauthorizedException(String message) {
        super(message);
    }

    public UnauthorizedException() {
        super("Authentication required");
    }

}
