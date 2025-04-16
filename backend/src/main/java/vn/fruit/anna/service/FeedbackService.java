package vn.fruit.anna.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.fruit.anna.dto.request.CreateFeedbackRequest;
import vn.fruit.anna.dto.request.ListFeedbacksByIdsRequest;
import vn.fruit.anna.model.Feedback;
import vn.fruit.anna.model.Product;
import vn.fruit.anna.repository.FeedbackRepository;
import vn.fruit.anna.repository.ProductRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FeedbackService {
    private final FeedbackRepository feedbackRepository;
    private final ProductRepository productRepository;

    @Transactional
    public Feedback createFeedback(CreateFeedbackRequest request) {
        Product existingProduct = productRepository.findByNameIgnoreCase(request.getProductName())
                .orElseThrow(() -> new IllegalArgumentException("Product already exists!"));

        Feedback feedback = Feedback.builder()
                .customerName(request.getCustomerName())
                .customerPhoneNumber(request.getCustomerPhoneNumber())
                .content(request.getContent())
                .productId(existingProduct.getId())
                .productName(existingProduct.getName())
                .build();
        return feedbackRepository.save(feedback);
    }

    @Transactional
    public void deleteFeedbacksByIds(ListFeedbacksByIdsRequest request) {
        List<Feedback> feedbacks = feedbackRepository.findAllById(request.getFeedbackIds());
        if (!feedbacks.isEmpty()) {
            feedbackRepository.deleteAll(feedbacks);
        }
    }

    public Page<?> searchFeedbacks(String productName, int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size);
        return feedbackRepository.findByProductNameContainingIgnoreCase(productName, pageRequest);
    }

}
