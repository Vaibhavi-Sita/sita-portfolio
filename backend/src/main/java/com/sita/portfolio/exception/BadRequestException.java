package com.sita.portfolio.exception;

import lombok.Getter;

/**
 * Exception thrown when a request is malformed or invalid.
 * Results in HTTP 400 response.
 */
@Getter
public class BadRequestException extends RuntimeException {

    private final String field;

    public BadRequestException(String message) {
        super(message);
        this.field = null;
    }

    public BadRequestException(String message, String field) {
        super(message);
        this.field = field;
    }

}
