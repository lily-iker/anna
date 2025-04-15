package vn.fruit.anna.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import vn.fruit.anna.dto.filter.OrderFilter;
import vn.fruit.anna.dto.response.OrderItemResponse;
import vn.fruit.anna.dto.response.OrderResponse;
import vn.fruit.anna.model.Order;
import vn.fruit.anna.model.OrderItem;
import vn.fruit.anna.repository.OrderRepository;
import vn.fruit.anna.repository.specification.OrderSpecification;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;

    public OrderResponse getOrderById(UUID orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found!"));
        return toResponse(order);
    }

    public Page<OrderResponse> searchOrders(OrderFilter filter, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Specification<Order> spec = OrderSpecification.applyFilter(filter);
        return orderRepository.findAll(spec, pageable).map(this::toResponse);
    }

    private OrderResponse toResponse(Order order) {
        List<OrderItemResponse> itemResponses = order.getOrderItems() != null
                ? order.getOrderItems().stream().map(this::toItemResponse).collect(Collectors.toList())
                : List.of();

        return OrderResponse.builder()
                .id(order.getId())
                .estimatedDeliveryDate(order.getEstimatedDeliveryDate())
                .note(order.getNote())
                .totalPrice(order.getTotalPrice())
                .status(order.getStatus())
                .customerName(order.getCustomer() != null ? order.getCustomer().getName() : null)
                .createdAt(order.getCreatedAt())
                .items(itemResponses)
                .build();
    }

    private OrderItemResponse toItemResponse(OrderItem item) {
        return OrderItemResponse.builder()
                .id(item.getId())
                .productId(item.getProduct().getId())
                .productName(item.getProduct().getName())
                .productThumbnailImage(item.getProduct().getThumbnailImage())
                .quantity(item.getQuantity())
                .price(item.getPrice())
                .build();
    }
}
