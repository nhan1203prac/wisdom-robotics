package org.wisdom.WD01.Reponsitory;

import org.springframework.data.jpa.repository.JpaRepository;
import org.wisdom.WD01.Entity.PaymentTransaction;
import org.wisdom.WD01.Enum.PaymentStatus;
import org.wisdom.WD01.Enum.TargetType;

import java.util.Optional;

public interface PaymentTransactionRepository extends JpaRepository<PaymentTransaction, Long> {
    Optional<PaymentTransaction> findByTxRef(String txRef);


    Optional<PaymentTransaction> findByTargetIdAndTargetTypeAndStatus(Long targetId, TargetType targetType, PaymentStatus status);
}
