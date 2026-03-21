package org.wisdom.WD01.Util;

import org.wisdom.WD01.Exception.AppException;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;

public class HashUtil {

    public static String hmacHashing(String algorithm, String key, String data) {
        try {
            Mac hmac = Mac.getInstance(algorithm);
            SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), algorithm);
            hmac.init(secretKey);

            byte[] result = hmac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder(2 * result.length);
            for (byte b : result) {
                sb.append(String.format("%02x", b & 0xff));
            }
            return sb.toString();
        } catch (Exception ex) {
            throw new AppException("Hashing Error (" + algorithm + "): " + ex.getMessage());
        }
    }
}
