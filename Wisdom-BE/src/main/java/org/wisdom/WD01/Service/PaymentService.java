package org.wisdom.WD01.Service;

import org.wisdom.WD01.Entity.PaymentTransaction;
import org.wisdom.WD01.Enum.PaymentStatus;

import java.util.Map;

public interface PaymentService {
    String createPaymentUrl(PaymentTransaction transaction, String returnUrl);

    boolean verifySignature(Map<String, String> params);

    PaymentStatus getStatus(Map<String, String> params);

    String refund(PaymentTransaction transaction);
}
