package com.sita.portfolio.exception;

import com.sita.portfolio.model.dto.ApiErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.Path;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@DisplayName("GlobalExceptionHandler")
class GlobalExceptionHandlerTest {

    @InjectMocks
    private GlobalExceptionHandler exceptionHandler;

    @Mock
    private HttpServletRequest request;

    private static final String TEST_PATH = "/api/test";

    @BeforeEach
    void setUp() {
        when(request.getRequestURI()).thenReturn(TEST_PATH);
    }

    @Nested
    @DisplayName("400 Bad Request")
    class BadRequestTests {

        @Test
        @DisplayName("should return 400 with field errors for validation failures")
        void handleValidationErrors_returnsFieldErrors() {
            // Arrange
            MethodArgumentNotValidException ex = mock(MethodArgumentNotValidException.class);
            BindingResult bindingResult = mock(BindingResult.class);
            
            FieldError fieldError1 = new FieldError("object", "title", "Title is required");
            FieldError fieldError2 = new FieldError("object", "email", "Email must be valid");
            
            when(ex.getBindingResult()).thenReturn(bindingResult);
            when(bindingResult.getFieldErrors()).thenReturn(List.of(fieldError1, fieldError2));

            // Act
            ResponseEntity<ApiErrorResponse> response = exceptionHandler.handleValidationErrors(ex, request);

            // Assert
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
            assertThat(response.getBody()).isNotNull();
            assertThat(response.getBody().getStatus()).isEqualTo(400);
            assertThat(response.getBody().getError()).isEqualTo("Validation Failed");
            assertThat(response.getBody().getPath()).isEqualTo(TEST_PATH);
            assertThat(response.getBody().getFieldErrors()).hasSize(2);
            assertThat(response.getBody().getFieldErrors())
                    .extracting(ApiErrorResponse.FieldError::getField)
                    .containsExactlyInAnyOrder("title", "email");
            assertThat(response.getBody().getCorrelationId()).isNull();
        }

        @Test
        @DisplayName("should return 400 for constraint violations")
        void handleConstraintViolation_returnsFieldErrors() {
            // Arrange
            Set<ConstraintViolation<?>> violations = new HashSet<>();
            
            ConstraintViolation<?> violation = mock(ConstraintViolation.class);
            Path path = mock(Path.class);
            when(path.toString()).thenReturn("createProject.title");
            when(violation.getPropertyPath()).thenReturn(path);
            when(violation.getMessage()).thenReturn("must not be blank");
            violations.add(violation);
            
            ConstraintViolationException ex = new ConstraintViolationException("Validation failed", violations);

            // Act
            ResponseEntity<ApiErrorResponse> response = exceptionHandler.handleConstraintViolation(ex, request);

            // Assert
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
            assertThat(response.getBody()).isNotNull();
            assertThat(response.getBody().getStatus()).isEqualTo(400);
            assertThat(response.getBody().getFieldErrors()).hasSize(1);
            assertThat(response.getBody().getFieldErrors().get(0).getField()).isEqualTo("title");
        }

        @Test
        @DisplayName("should return 400 for bad request exception")
        void handleBadRequest_returnsError() {
            // Arrange
            BadRequestException ex = new BadRequestException("Invalid input", "field");

            // Act
            ResponseEntity<ApiErrorResponse> response = exceptionHandler.handleBadRequest(ex, request);

            // Assert
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
            assertThat(response.getBody()).isNotNull();
            assertThat(response.getBody().getMessage()).isEqualTo("Invalid input");
            assertThat(response.getBody().getFieldErrors()).hasSize(1);
            assertThat(response.getBody().getFieldErrors().get(0).getField()).isEqualTo("field");
        }

        @Test
        @DisplayName("should return 400 for malformed JSON")
        void handleMessageNotReadable_returnsError() {
            // Arrange
            HttpMessageNotReadableException ex = mock(HttpMessageNotReadableException.class);
            when(ex.getMessage()).thenReturn("JSON parse error");

            // Act
            ResponseEntity<ApiErrorResponse> response = exceptionHandler.handleMessageNotReadable(ex, request);

            // Assert
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
            assertThat(response.getBody()).isNotNull();
            assertThat(response.getBody().getError()).isEqualTo("Malformed Request");
        }

        @Test
        @DisplayName("should return 400 for missing parameter")
        void handleMissingParameter_returnsError() throws Exception {
            // Arrange
            MissingServletRequestParameterException ex = 
                    new MissingServletRequestParameterException("id", "UUID");

            // Act
            ResponseEntity<ApiErrorResponse> response = exceptionHandler.handleMissingParameter(ex, request);

            // Assert
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
            assertThat(response.getBody()).isNotNull();
            assertThat(response.getBody().getMessage()).contains("id");
            assertThat(response.getBody().getFieldErrors()).hasSize(1);
        }
    }

    @Nested
    @DisplayName("401 Unauthorized")
    class UnauthorizedTests {

        @Test
        @DisplayName("should return 401 for unauthorized exception")
        void handleUnauthorized_returnsError() {
            // Arrange
            UnauthorizedException ex = new UnauthorizedException("Invalid token");

            // Act
            ResponseEntity<ApiErrorResponse> response = exceptionHandler.handleUnauthorized(ex, request);

            // Assert
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
            assertThat(response.getBody()).isNotNull();
            assertThat(response.getBody().getStatus()).isEqualTo(401);
            assertThat(response.getBody().getError()).isEqualTo("Unauthorized");
            assertThat(response.getBody().getMessage()).isEqualTo("Invalid token");
        }

        @Test
        @DisplayName("should return 401 for bad credentials")
        void handleBadCredentials_returnsError() {
            // Arrange
            BadCredentialsException ex = new BadCredentialsException("Bad credentials");

            // Act
            ResponseEntity<ApiErrorResponse> response = exceptionHandler.handleUnauthorized(ex, request);

            // Assert
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
            assertThat(response.getBody()).isNotNull();
            assertThat(response.getBody().getMessage()).isEqualTo("Authentication required");
        }
    }

    @Nested
    @DisplayName("403 Forbidden")
    class ForbiddenTests {

        @Test
        @DisplayName("should return 403 for forbidden exception")
        void handleForbidden_returnsError() {
            // Arrange
            ForbiddenException ex = new ForbiddenException("Insufficient permissions");

            // Act
            ResponseEntity<ApiErrorResponse> response = exceptionHandler.handleForbidden(ex, request);

            // Assert
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
            assertThat(response.getBody()).isNotNull();
            assertThat(response.getBody().getStatus()).isEqualTo(403);
            assertThat(response.getBody().getError()).isEqualTo("Forbidden");
            assertThat(response.getBody().getMessage()).isEqualTo("Insufficient permissions");
        }

        @Test
        @DisplayName("should return 403 for access denied")
        void handleAccessDenied_returnsError() {
            // Arrange
            AccessDeniedException ex = new AccessDeniedException("Access denied");

            // Act
            ResponseEntity<ApiErrorResponse> response = exceptionHandler.handleForbidden(ex, request);

            // Assert
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
            assertThat(response.getBody()).isNotNull();
            assertThat(response.getBody().getMessage()).isEqualTo("Access denied");
        }
    }

    @Nested
    @DisplayName("404 Not Found")
    class NotFoundTests {

        @Test
        @DisplayName("should return 404 for resource not found")
        void handleResourceNotFound_returnsError() {
            // Arrange
            ResourceNotFoundException ex = new ResourceNotFoundException("Project", "id", "123");

            // Act
            ResponseEntity<ApiErrorResponse> response = exceptionHandler.handleResourceNotFound(ex, request);

            // Assert
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
            assertThat(response.getBody()).isNotNull();
            assertThat(response.getBody().getStatus()).isEqualTo(404);
            assertThat(response.getBody().getError()).isEqualTo("Not Found");
            assertThat(response.getBody().getMessage()).contains("Project");
            assertThat(response.getBody().getMessage()).contains("123");
        }

        @Test
        @DisplayName("should return 404 with simple message")
        void handleResourceNotFound_simpleMessage() {
            // Arrange
            ResourceNotFoundException ex = new ResourceNotFoundException("Resource not found");

            // Act
            ResponseEntity<ApiErrorResponse> response = exceptionHandler.handleResourceNotFound(ex, request);

            // Assert
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
            assertThat(response.getBody()).isNotNull();
            assertThat(response.getBody().getMessage()).isEqualTo("Resource not found");
        }
    }

    @Nested
    @DisplayName("500 Internal Server Error")
    class InternalServerErrorTests {

        @Test
        @DisplayName("should return 500 with correlation ID for unhandled exceptions")
        void handleGenericException_returnsCorrelationId() {
            // Arrange
            RuntimeException ex = new RuntimeException("Unexpected error");

            // Act
            ResponseEntity<ApiErrorResponse> response = exceptionHandler.handleGenericException(ex, request);

            // Assert
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
            assertThat(response.getBody()).isNotNull();
            assertThat(response.getBody().getStatus()).isEqualTo(500);
            assertThat(response.getBody().getError()).isEqualTo("Internal Server Error");
            assertThat(response.getBody().getCorrelationId()).isNotNull();
            assertThat(response.getBody().getCorrelationId()).matches(
                    "[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}");
            assertThat(response.getBody().getMessage()).contains("correlation ID");
        }

        @Test
        @DisplayName("should not expose internal error details")
        void handleGenericException_hidesInternalDetails() {
            // Arrange
            RuntimeException ex = new RuntimeException("Database connection failed: password invalid");

            // Act
            ResponseEntity<ApiErrorResponse> response = exceptionHandler.handleGenericException(ex, request);

            // Assert
            assertThat(response.getBody()).isNotNull();
            assertThat(response.getBody().getMessage()).doesNotContain("Database");
            assertThat(response.getBody().getMessage()).doesNotContain("password");
        }
    }

    @Nested
    @DisplayName("Response Structure")
    class ResponseStructureTests {

        @Test
        @DisplayName("should include timestamp in all error responses")
        void allResponses_includeTimestamp() {
            // Arrange
            BadRequestException ex = new BadRequestException("Test error");

            // Act
            ResponseEntity<ApiErrorResponse> response = exceptionHandler.handleBadRequest(ex, request);

            // Assert
            assertThat(response.getBody()).isNotNull();
            assertThat(response.getBody().getTimestamp()).isNotNull();
        }

        @Test
        @DisplayName("should include path in all error responses")
        void allResponses_includePath() {
            // Arrange
            ResourceNotFoundException ex = new ResourceNotFoundException("Not found");

            // Act
            ResponseEntity<ApiErrorResponse> response = exceptionHandler.handleResourceNotFound(ex, request);

            // Assert
            assertThat(response.getBody()).isNotNull();
            assertThat(response.getBody().getPath()).isEqualTo(TEST_PATH);
        }
    }

}
