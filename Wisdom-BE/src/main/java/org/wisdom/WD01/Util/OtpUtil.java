package org.wisdom.WD01.Util;

import java.util.Random;

public class OtpUtil {
    public static String generateOtp() {
        StringBuilder otp = new StringBuilder();
        Random rand = new Random();
        for (int i = 0; i < 6; i++) {
            otp.append(rand.nextInt(10));
        }
        return otp.toString();
    }


}
