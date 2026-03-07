package org.wisdom.WD01.Service;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;

public interface AccountService extends UserDetailsService {

    UserDetails loadUserByUsername(String username);
}