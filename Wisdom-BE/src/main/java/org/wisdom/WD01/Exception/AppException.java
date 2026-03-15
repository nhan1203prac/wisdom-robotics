package org.wisdom.WD01.Exception;

import lombok.Getter;

@Getter
public class AppException extends RuntimeException {
    public AppException(String message) {
        super(message);
    }
}
