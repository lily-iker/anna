package vn.fruit.anna.dto.request;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class MailRequest {
    private String toEmail;
    private String subject;
    private String htmlBody;
}
