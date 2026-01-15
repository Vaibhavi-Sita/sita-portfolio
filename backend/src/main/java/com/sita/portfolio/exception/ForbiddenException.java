package com.sita.portfolio.exception;

/**
 * Exception thrown when the user does not have permission to access a resource.
 * Results in HTTP 403 response.
 */
public class ForbiddenException extends RuntimeException {

    public ForbiddenException(String message) {
        super(message);
    }

    public ForbiddenException() {
        super("Access denied");
    }

}
