package com.sita.portfolio.model.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

/**
 * Standard API response wrapper for successful responses.
 *
 * @param <T> The type of data being returned
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {

    @Builder.Default
    private Instant timestamp = Instant.now();

    private String path;

    private T data;

    /**
     * Creates a success response with data.
     */
    public static <T> ApiResponse<T> success(T data) {
        return ApiResponse.<T>builder()
                .timestamp(Instant.now())
                .data(data)
                .build();
    }

    /**
     * Creates a success response with data and path.
     */
    public static <T> ApiResponse<T> success(T data, String path) {
        return ApiResponse.<T>builder()
                .timestamp(Instant.now())
                .path(path)
                .data(data)
                .build();
    }

    /**
     * Creates an empty success response.
     */
    public static ApiResponse<Void> ok() {
        return ApiResponse.<Void>builder()
                .timestamp(Instant.now())
                .build();
    }

}
