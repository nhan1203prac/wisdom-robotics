package org.wisdom.WD01.Reponsitory;

import org.springframework.data.jpa.repository.JpaRepository;
import org.wisdom.WD01.Entity.OrderStatus;

public interface OrderStatusRepository extends JpaRepository<OrderStatus, Long> {

}