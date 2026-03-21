package org.wisdom.WD01.Service;

import org.wisdom.WD01.Entity.Employee;
import java.util.List;

public interface EmployeeService {

    Employee createEmployee(Employee employee);

    List<Employee> getAllEmployees();

}