package com.sita.portfolio.controller;

import com.sita.portfolio.model.dto.ApiResponse;
import com.sita.portfolio.model.dto.request.ContactMessageStatusUpdateRequest;
import com.sita.portfolio.model.dto.response.ContactMessageResponse;
import com.sita.portfolio.service.ContactMessageService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.UUID;

@RestController
@RequestMapping("/api/admin/contact/messages")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminContactMessageController {

    private final ContactMessageService contactMessageService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<ContactMessageResponse>>> listMessages(
            @PageableDefault(size = 20, sort = "createdAt", direction = org.springframework.data.domain.Sort.Direction.DESC) Pageable pageable,
            HttpServletRequest request) {
        Page<ContactMessageResponse> page = contactMessageService.getMessages(pageable);
        return ResponseEntity.ok(ApiResponse.success(page, request.getRequestURI()));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<ContactMessageResponse>> updateStatus(
            @PathVariable UUID id,
            @Valid @RequestBody ContactMessageStatusUpdateRequest statusRequest,
            HttpServletRequest request) {
        ContactMessageResponse updated = contactMessageService.updateStatus(id, statusRequest);
        return ResponseEntity.ok(ApiResponse.success(updated, request.getRequestURI()));
    }
}
