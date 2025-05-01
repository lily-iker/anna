package vn.fruit.anna.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import vn.fruit.anna.model.Order;
import vn.fruit.anna.model.OrderItem;

import java.io.File;
import java.io.UnsupportedEncodingException;
import java.text.NumberFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;
import java.util.concurrent.CompletableFuture;

@Service
@RequiredArgsConstructor
public class MailService {

    public static final String EMAIL_FROM_NAME = "Anna Fruits";
    public static final String EMAIL_SUBJECT = "Xác nhận đơn hàng - Chi tiết đơn hàng của bạn";

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String emailFrom;


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
        helper.setFrom(emailFrom, "Your Name");

        if (attachment != null && attachment.exists()) {
            helper.addAttachment(attachment.getName(), attachment);
        }

        mailSender.send(mimeMessage);

        return CompletableFuture.completedFuture(null);
    }

    @Async
    public CompletableFuture<Void> sendOrderConfirmMail(Order order)
            throws MessagingException, UnsupportedEncodingException {
        // Tạo một đối tượng MimeMessage
        MimeMessage mimeMessage = mailSender.createMimeMessage();

        // Sử dụng MimeMessageHelper để xây dựng email
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage);

        // Thiết lập người nhận và tiêu đề
        helper.setTo(order.getCustomer().getEmail());
        helper.setSubject("Xác nhận đơn hàng - Chi tiết đơn hàng của bạn");

        // Nội dung email với tên khách hàng và chi tiết đơn hàng theo định dạng HTML
        String htmlBody = generateOrderDetailsHtmlBody(order);

        helper.setText(htmlBody, true); // true để chỉ ra nội dung HTML
        helper.setFrom(emailFrom, EMAIL_FROM_NAME);

//        // Nếu có tệp đính kèm (ví dụ: hóa đơn đơn hàng), thêm tệp vào email
//        if (attachment != null && attachment.exists()) {
//            helper.addAttachment(attachment.getName(), attachment);
//        }

        mailSender.send(mimeMessage);

        return CompletableFuture.completedFuture(null);
    }

    private String generateOrderDetailsHtmlBody(Order order) {
        StringBuilder html = new StringBuilder();

        html.append("<!DOCTYPE html>")
                .append("<html lang=\"vi\">")
                .append("<head>")
                .append("<meta charset=\"UTF-8\">")
                .append("<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">")
                .append("<title>Chi tiết đơn hàng</title>")
                .append("<link href=\"https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap\" rel=\"stylesheet\">")
                .append("<style>")
                .append("* { margin: 0; padding: 0; box-sizing: border-box; }") // Reset CSS
                .append("body { font-family: 'Roboto', Arial, sans-serif; background-color: #f5f5f5; color: #333; margin: 0; padding: 20px; }") // Better font and background
                .append(".container { background-color: #fff; border-radius: 16px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08); max-width: 600px; margin: 0 auto; overflow: hidden; }") // Card-like container
                .append(".header { background-color: #4CAF50; padding: 25px 30px; text-align: center; }") // Green header
                .append(".header h1 { color: white; font-size: 28px; font-weight: 700; margin: 0; }") // White text on green
                .append(".content { padding: 30px; }") // Content padding
                .append(".order-info { margin-bottom: 25px; }") // Order info section
                .append(".order-info-item { display: flex; justify-content: space-between; padding: 12px 0; }") // Order info items
                .append(".order-info-item:last-child { border-bottom: none; }") // No border for last item
                .append(".order-info-label { font-weight: 500; color: #666; }") // Label styling
                .append(".order-info-value { font-weight: 600; color: #333; text-align: right; }") // Value styling
                .append(".divider { height: 1px; background-color: #eaeaea; margin: 20px 0; }") // Divider
                .append(".items-title { font-size: 18px; font-weight: 600; color: #333; margin-bottom: 15px; }") // Items title
                .append(".item { display: flex; justify-content: space-between; align-items: center; padding: 15px 0; border-bottom: none; }") // Item styling
                .append(".item:last-child { border-bottom: none; }") // No border for last item
                .append(".item-name { font-weight: 500; color: #333; flex: 1; }") // Item name
                .append(".item-quantity { color: #666; margin: 0 15px; }") // Item quantity
                .append(".item-price { font-weight: 600; color: #333; text-align: left; min-width: 100px; }") // Item price
                .append(".total-section { background-color: #f9f9f9; padding: 20px 30px; border-top: 1px solid #eee; text-align: center; }") // Total section
                .append(".total { display: inline-block; }") // Total container - inline-block for centering
                .append(".total-label { font-size: 18px; font-weight: 600; color: #333; margin-right: 15px; }") // Total label with spacing
                .append(".total-value { font-size: 24px; font-weight: 700; color: #4CAF50; }") // Total value
                .append(".footer { padding: 20px 30px; text-align: center; background-color: #f5f5f5; border-top: 1px solid #eee; }") // Footer
                .append(".footer p { color: #888; font-size: 14px; }") // Footer text
                .append("@media (max-width: 600px) { .container { border-radius: 0; } .header { padding: 20px; } .content, .total-section, .footer { padding: 20px; } }") // Mobile responsiveness
                .append("</style>")
                .append("</head>")
                .append("<body>")
                .append("<div class='container'>");

        // Header
        html.append("<div class='header'>")
                .append("<h1>Chi tiết đơn hàng</h1>")
                .append("</div>");

        // Content
        html.append("<div class='content'>");

        // Order Info
        html.append("<div class='order-info'>");

        html.append("<div class='order-info-item'>")
                .append("<span class='order-info-label'>Mã đơn hàng:</span>")
                .append("<span class='order-info-value'>").append(order.getId()).append("</span>")
                .append("</div>");

        html.append("<div class='order-info-item'>")
                .append("<span class='order-info-label'>Ngày giao dự kiến:</span>")
                .append("<span class='order-info-value'>").append(formatDate(order.getEstimatedDeliveryDate())).append("</span>")
                .append("</div>");

        html.append("</div>"); // End order-info

        html.append("<div class='divider'></div>");

        // Items
        html.append("<h2 class='items-title'>Sản phẩm đã đặt</h2>");

        for (OrderItem item : order.getOrderItems()) {
            html.append("<div class='item'>")
                    .append("<div class='item-name'>").append(item.getProductName()).append("</div>")
                    .append("<div class='item-quantity'>").append(item.getQuantity()).append(" x</div>")
                    .append("<div class='item-price'>").append(formatCurrency(item.getPrice())).append("</div>")
                    .append("</div>");
        }

        html.append("</div>"); // End content

        html.append("<div class='divider'></div>");

        // Total Section
        html.append("<div class='total-section'>")
                .append("<div class='total'>")
                .append("<span class='total-label'>Tổng cộng:</span>")
                .append("<span class='total-value'>").append(formatCurrency(order.getTotalPrice())).append("</span>")
                .append("</div>")
                .append("</div>");

        // Footer
        html.append("<div class='footer'>")
                .append("<p>Cảm ơn bạn đã mua hàng tại cửa hàng của chúng tôi!</p>")
                .append("</div>");

        html.append("</div>") // Closing container
                .append("</body>")
                .append("</html>");

        return html.toString();
    }

    private String formatCurrency(double amount) {
        NumberFormat formatter = NumberFormat.getNumberInstance(new Locale("vi", "VN"));
        return formatter.format(amount) + " VNĐ";
    }

    private String formatDate(Date date) {
        SimpleDateFormat formatter = new SimpleDateFormat("dd/MM/yyyy");
        return formatter.format(date);
    }

}
