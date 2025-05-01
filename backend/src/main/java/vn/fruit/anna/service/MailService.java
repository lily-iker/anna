package vn.fruit.anna.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.UnsupportedEncodingException;
import java.util.concurrent.CompletableFuture;

@Service
@RequiredArgsConstructor
public class MailService {

    private final JavaMailSender mailSender;

    @Async
    public CompletableFuture<Void> sendHtmlEmailWithAttachment(String toEmail,
                                                               String subject,
                                                               String htmlBody,
                                                               File attachment) throws MessagingException, UnsupportedEncodingException {

        // Create MimeMessage instance
        MimeMessage mimeMessage = mailSender.createMimeMessage();

        // Use MimeMessageHelper to construct the email
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true); // true to indicate multipart (for attachments)

        helper.setTo(toEmail);
        helper.setSubject(subject);
        helper.setText(htmlBody, true); // true to indicate HTML content
        helper.setFrom("your_email@gmail.com", "Your Name");

        if (attachment != null && attachment.exists()) {
            helper.addAttachment(attachment.getName(), attachment);
        }

        mailSender.send(mimeMessage);

        return CompletableFuture.completedFuture(null);
    }
}
