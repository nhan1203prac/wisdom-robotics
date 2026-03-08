package org.wisdom.WD01.Service;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OtpStorageService {

    // Map storage key = email and value = otp & expired
    private final Map<String, OtpDetails> otpCache = new ConcurrentHashMap<>();
    // Class storage info of map value
    private static class OtpDetails {
        String otp;
        LocalDateTime expiryTime;

        OtpDetails(String otp, int minutesToLive) {
            this.otp = otp;
            this.expiryTime = LocalDateTime.now().plusMinutes(minutesToLive);
        }
    }

    // Save otp
    public void saveOtp(String email, String otp) {
        otpCache.put(email, new OtpDetails(otp, 15));
    }

    // Get and check otp
    public String getOtp(String email, boolean checkExpiry) {
        OtpDetails otpDetails = otpCache.get(email);
        if (otpDetails == null) {
            return null;
        }
        // If the time has expired, delete and return null.
        if(checkExpiry && otpDetails.expiryTime.isBefore(LocalDateTime.now())) {
            return null;
        }
        return otpDetails.otp;
    }

    // Delete after use
    public void deleteOtp(String email) {
        otpCache.remove(email);
    }



    @Scheduled(fixedRate = 60000)
    public void cleanUp(){
        int initialSize = otpCache.size();
        // Remove expired entries
        otpCache.entrySet().removeIf(entry ->
                LocalDateTime.now().isAfter(entry.getValue().expiryTime));

    }

}
