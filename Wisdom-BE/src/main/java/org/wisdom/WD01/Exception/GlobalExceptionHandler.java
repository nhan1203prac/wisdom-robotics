package org.wisdom.WD01.Exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.wisdom.WD01.Dto.Response.ApiResponse;

@ControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse> handleException(Exception e) {
        log.error("GlobalExceptionHandler :: handleException : {}", e.getMessage());
        ApiResponse apiResponse = ApiResponse.builder()
                .success(false)
                .message(e.getMessage())
                .build();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(apiResponse);
    }

    @ExceptionHandler(AppException.class)
    public ResponseEntity<ApiResponse> handleAppException(AppException e) {
        ApiResponse apiResponse = ApiResponse.builder()
                .success(false)
                .message(e.getMessage())
                .build();
        return new ResponseEntity<>(apiResponse, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<?> handleValidationException(ValidationException e){
        log.error("GlobalExceptionHandler :: handleValidationException : {}", e.getMessage());
        ApiResponse apiResponse = ApiResponse.builder()
                .message("Validation Error")
                .success(false)
                .data(e.getErrors())
                .build();
        return new ResponseEntity<>(apiResponse, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiResponse> handleIllegalArgumentException(IllegalArgumentException e) {
        log.error("GlobalExceptionHandler :: handleIllegalArgumentException : {}", e.getMessage());

        ApiResponse<Object> apiResponse = ApiResponse.builder()
                .success(false)
                .message(e.getMessage())
                .build();

        return new ResponseEntity<>(apiResponse, HttpStatus.BAD_REQUEST);
    }

//    @ExceptionHandler(MethodArgumentNotValidException.class)
//    public ResponseEntity<ApiResponse> handleMethodArgumentNotValidException
//            (MethodArgumentNotValidException e) {
//        log.error("GlobalExceptionHandler :: handleMethodArgumentNotValidException ::", e.getMessage());
//        List<FieldError> fieldErrors = e.getBindingResult().getFieldErrors();
//        Map<String, String> map = new HashMap<>();
//        fieldErrors.forEach(fieldError -> {
//            map.put(fieldError.getField(), fieldError.getDefaultMessage());
//        });
//
//        ApiResponse apiResponse = ApiResponse.builder()
//                .success(false)
//                .message("Dữ liệu đầu vào không hợp lệ")
//                .data(map)
//                .build();
//
//        return new ResponseEntity<>(apiResponse, HttpStatus.BAD_REQUEST);
//    }


}
