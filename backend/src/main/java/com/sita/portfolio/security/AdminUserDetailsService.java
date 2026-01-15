package com.sita.portfolio.security;

import com.sita.portfolio.model.entity.AdminUser;
import com.sita.portfolio.repository.AdminUserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * UserDetailsService implementation for loading admin users.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AdminUserDetailsService implements UserDetailsService {

    private final AdminUserRepository adminUserRepository;

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        AdminUser adminUser = adminUserRepository.findByEmail(email)
                .orElseThrow(() -> {
                    log.warn("Admin user not found: {}", email);
                    return new UsernameNotFoundException("User not found with email: " + email);
                });

        return new AdminUserDetails(adminUser);
    }

}
