package vn.fruit.anna.dto.request;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CreateFeedbackRequest {
    private String customerName;
    private String customerPhoneNumber;
    private String content;
    private String productName;
}
