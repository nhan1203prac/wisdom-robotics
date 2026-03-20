package org.wisdom.WD01.Service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.wisdom.WD01.Entity.Employee;
import org.wisdom.WD01.Entity.Role;
import org.wisdom.WD01.Entity.User;
import org.wisdom.WD01.Reponsitory.EmployeeRepository;
import org.wisdom.WD01.Reponsitory.RoleRepository;
import org.wisdom.WD01.Reponsitory.UserRepository;
import org.wisdom.WD01.Service.EmployeeService;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    @Override
    public Employee createEmployee(Employee employee) {

        Employee savedEmployee = employeeRepository.save(employee);

        return savedEmployee;
    }

    @Override
    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }
}