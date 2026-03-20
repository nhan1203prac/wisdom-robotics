package org.wisdom.WD01.Service;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.wisdom.WD01.Dto.CreateEmployeeAccountRequest;

public interface AccountService extends UserDetailsService      {

    UserDetails loadUserByUsername(String username);

    void createEmployeeAccount(CreateEmployeeAccountRequest request);
}