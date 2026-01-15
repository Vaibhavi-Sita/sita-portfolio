package com.sita.portfolio.security;

import com.sita.portfolio.model.entity.AdminUser;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

/**
 * Spring Security UserDetails implementation for admin users.
 */
@Getter
public class AdminUserDetails implements UserDetails {

    private final UUID id;
    private final String email;
    private final String password;
    private final String displayName;
    private final boolean active;
    private final Collection<? extends GrantedAuthority> authorities;

    public AdminUserDetails(AdminUser adminUser) {
        this.id = adminUser.getId();
        this.email = adminUser.getEmail();
        this.password = adminUser.getPasswordHash();
        this.displayName = adminUser.getDisplayName();
        this.active = adminUser.isActive();
        this.authorities = List.of(new SimpleGrantedAuthority("ROLE_ADMIN"));
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return active;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return active;
    }

}
