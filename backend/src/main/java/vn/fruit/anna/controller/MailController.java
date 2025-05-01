package vn.fruit.anna.controller;

import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import vn.fruit.anna.dto.request.MailRequest;
import vn.fruit.anna.dto.response.ApiResponse;
import vn.fruit.anna.service.MailService;

import java.io.File;
import java.io.IOException;
import java.util.Objects;

@RestController
@RequestMapping("/api/mail")
@RequiredArgsConstructor
public class MailController {
    private final MailService mailService;

    @PostMapping("/send")
    public ResponseEntity<?> sendEmail(@RequestPart("emailDetails") MailRequest mailRequest,
                                       @RequestPart(value = "attachment", required = false) MultipartFile attachment) throws IOException, MessagingException {

//        File file = null;
//        if (attachment != null && !attachment.isEmpty()) {
//            // Save the attachment to a file temporarily
//            file = new File(Objects.requireNonNull(attachment.getOriginalFilename()));
//            attachment.transferTo(file);
//        }

        mailService.sendHtmlEmailWithAttachment(
                mailRequest.getToEmail(),
                mailRequest.getSubject(),
                mailRequest.getHtmlBody(),
                null
        );

        return ResponseEntity.ok(
                new ApiResponse<>(200, "Send email success")
        );
    }
}
