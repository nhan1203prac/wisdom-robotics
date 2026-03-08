package org.wisdom.WD01.Util;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Optional;

public class SecurityUtil {
    public static Optional<Authentication> getAuthentication() {
        return Optional.ofNullable(SecurityContextHolder.getContext().getAuthentication());
    }

    public static String getAuthenticatedUsername() {
        Authentication authentication = getAuthentication().orElse(null);
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }
        return authentication.getName();
    }

    public static UserDetails getUserDetails() {
        Authentication authentication = getAuthentication().orElse(null);
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }
        return (UserDetails) authentication.getPrincipal();
    }
}
