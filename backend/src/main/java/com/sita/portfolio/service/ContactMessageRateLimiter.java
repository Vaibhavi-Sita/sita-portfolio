package com.sita.portfolio.service;

import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Simple in-memory IP-based rate limiter to throttle contact submissions.
 */
@Component
public class ContactMessageRateLimiter {

    private static final int MAX_REQUESTS = 5;
    private static final Duration WINDOW = Duration.ofMinutes(5);

    private final Map<String, Deque<Instant>> requestLog = new ConcurrentHashMap<>();

    public boolean allow(String key) {
        Instant now = Instant.now();
        Deque<Instant> events = requestLog.computeIfAbsent(key, k -> new ArrayDeque<>());

        // Drop events outside window
        while (!events.isEmpty() && events.peekFirst().isBefore(now.minus(WINDOW))) {
            events.pollFirst();
        }

        if (events.size() >= MAX_REQUESTS) {
            return false;
        }

        events.addLast(now);
        return true;
    }
}
