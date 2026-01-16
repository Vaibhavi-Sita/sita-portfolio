package com.sita.portfolio.service;

import com.sita.portfolio.model.dto.request.ContactMessageRequest;
import com.sita.portfolio.model.dto.request.ContactMessageStatusUpdateRequest;
import com.sita.portfolio.model.dto.response.ContactMessageResponse;
import com.sita.portfolio.model.entity.ContactMessage;
import com.sita.portfolio.repository.ContactMessageRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class ContactMessageService {

    private final ContactMessageRepository repository;
    private final ContactMessageRateLimiter rateLimiter;
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${recaptcha.secret:}")
    private String recaptchaSecret;

    public void submit(ContactMessageRequest request, HttpServletRequest httpRequest) {
        // Honeypot check
        if (request.getHoneypot() != null && !request.getHoneypot().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid submission");
        }

        verifyRecaptcha(request.getCaptchaToken(), httpRequest);

        String ip = resolveIp(httpRequest);
        if (!rateLimiter.allow(ip)) {
            throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS, "Too many submissions. Please try later.");
        }

        ContactMessage message = new ContactMessage();
        message.setName(request.getName());
        message.setEmail(request.getEmail());
        message.setSubject(request.getSubject());
        message.setMessage(request.getMessage());
        message.setUserAgent(httpRequest.getHeader("User-Agent"));
        message.setIpAddress(ip);
        message.setStatus("new");

        repository.save(message);

        // Log metadata only (no message body)
        log.info("Contact message stored id={} from {} <{}> subject='{}'", message.getId(), message.getName(), message.getEmail(), message.getSubject());
    }

    public Page<ContactMessageResponse> getMessages(Pageable pageable) {
        return repository.findAll(pageable).map(this::toResponse);
    }

    public ContactMessageResponse updateStatus(UUID id, ContactMessageStatusUpdateRequest request) {
        ContactMessage message = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Message not found"));
        message.setStatus(request.getStatus().toLowerCase());
        repository.save(message);
        return toResponse(message);
    }

    private String resolveIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            return forwarded.split(",")[0].trim();
        }
        return Optional.ofNullable(request.getRemoteAddr()).orElse("unknown");
    }

    private void verifyRecaptcha(String token, HttpServletRequest request) {
        if (recaptchaSecret == null || recaptchaSecret.isBlank()) {
            log.warn("reCAPTCHA secret not configured; skipping verification.");
            return;
        }
        if (token == null || token.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Captcha token missing");
        }

        String url = "https://www.google.com/recaptcha/api/siteverify";
        Map<String, String> params = Map.of(
                "secret", recaptchaSecret,
                "response", token,
                "remoteip", resolveIp(request)
        );

        ResponseEntity<RecaptchaResponse> resp = restTemplate.postForEntity(
                url + "?secret={secret}&response={response}&remoteip={remoteip}",
                null,
                RecaptchaResponse.class,
                params
        );

        RecaptchaResponse body = resp.getBody();
        if (body == null || !Boolean.TRUE.equals(body.success)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Captcha verification failed");
        }
    }

    private record RecaptchaResponse(Boolean success, String challenge_ts, String hostname, String[] errorCodes) {}

    private ContactMessageResponse toResponse(ContactMessage entity) {
        return ContactMessageResponse.builder()
                .id(entity.getId())
                .name(entity.getName())
                .email(entity.getEmail())
                .subject(entity.getSubject())
                .message(entity.getMessage())
                .status(entity.getStatus())
                .createdAt(entity.getCreatedAt())
                .userAgent(entity.getUserAgent())
                .ipAddress(entity.getIpAddress())
                .build();
    }
}
