package org.wisdom.WD01.Reponsitory;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.wisdom.WD01.Entity.Employee;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

public interface EmployeeRepository extends JpaRepository<Employee, String> {

    Optional<Employee> findByEmployeeId(String employeeId);

    @Query("SELECT e FROM Employee e " +
            "WHERE e.serviceCategory.id = :catId " +
            "AND e.employeeId NOT IN (" +
            "    SELECT b.assignedEmployee.employeeId FROM Booking b " +
            "    WHERE b.assignedEmployee IS NOT NULL " +
            "    AND b.bookingDate = :date " +
            "    AND b.paymentStatus != 'CANCELLED' " +
            "    AND (b.startTime < :endTime AND b.endTime > :startTime)" +
            ")")
    List<Employee> findAvailableEmployees(
            @Param("catId") Long catId,
            @Param("date") LocalDate date,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime
    );
}