package org.wisdom.WD01.Service;

import org.springframework.security.core.userdetails.UserDetails;

public interface AccountService {

    UserDetails loadUserByUsername(String username);
}