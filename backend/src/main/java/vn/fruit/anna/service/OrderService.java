package vn.fruit.anna.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.fruit.anna.dto.filter.OrderFilter;
import vn.fruit.anna.dto.request.CreateOrderRequest;
import vn.fruit.anna.dto.request.ListOrdersByIdsRequest;
import vn.fruit.anna.dto.request.OrderItemRequest;
import vn.fruit.anna.dto.response.OrderItemResponse;
import vn.fruit.anna.dto.response.OrderResponse;
import vn.fruit.anna.enums.OrderStatus;
import vn.fruit.anna.exception.ResourceNotFoundException;
import vn.fruit.anna.model.Customer;
import vn.fruit.anna.model.Order;
import vn.fruit.anna.model.OrderItem;
import vn.fruit.anna.model.Product;
import vn.fruit.anna.repository.CustomerRepository;
import vn.fruit.anna.repository.OrderRepository;
import vn.fruit.anna.repository.ProductRepository;
import vn.fruit.anna.repository.specification.OrderSpecification;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final CustomerRepository customerRepository;
    private final CustomerService customerService;
    private final ProductRepository productRepository;

    @Transactional
    public OrderResponse createOrder(CreateOrderRequest request) {
        Customer customer = customerRepository.findOneByNameContainingIgnoreCase(request.getCustomerName())
                .orElseGet(() -> customerService.createNewCustomer(request));

        Order order = Order.builder()
                .customer(customer)
                .status(OrderStatus.NEW)
                .estimatedDeliveryDate(request.getEstimatedDeliveryDate())
                .build();

        List<OrderItem> orderItems = processOrderItems(request.getOrderItemRequests(), order);
        order.setOrderItems(orderItems);

        Double total = orderItems.stream()
                .mapToDouble(item -> item.getPrice() * item.getQuantity())
                .sum();
        order.setTotalPrice(total);

        orderRepository.save(order);
        orderRepository.flush();

        customerService.updateCustomerOrderStats(customer, order);

        return toResponse(order);
    }

    public OrderResponse getOrderById(UUID orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found!"));
        return toResponse(order);
    }

    public Page<OrderResponse> searchOrders(OrderFilter filter,
                                            int page,
                                            int size,
                                            String sortBy,
                                            String direction) {
        Sort.Direction sortDirection = direction.equalsIgnoreCase("desc")
                ? Sort.Direction.DESC
                : Sort.Direction.ASC;
        Sort sort = Sort.by(sortDirection, sortBy);

        Pageable pageable = PageRequest.of(page, size, sort);
        Specification<Order> spec = OrderSpecification.applyFilter(filter);
        return orderRepository.findAll(spec, pageable).map(this::toResponse);
    }

    @Transactional
    public OrderResponse updateStatus(UUID orderId, OrderStatus newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found with ID: " + orderId));

        order.setStatus(newStatus);
        return toResponse(order);
    }

    @Transactional
    public void deleteOrdersByIds(ListOrdersByIdsRequest request) {
        List<UUID> orderIds = request.getOrderIds();

        List<Order> orders = orderRepository.findAllById(orderIds);

        if (!orders.isEmpty()) {
            orderRepository.deleteAll(orders);
        }
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
                .customerEmail(order.getCustomer() != null ? order.getCustomer().getEmail() : null)
                .customerAddress(order.getCustomer() != null ? order.getCustomer().getAddress() : null)
                .customerPhoneNumber(order.getCustomer() != null ? order.getCustomer().getPhoneNumber() : null)
                .createdAt(order.getCreatedAt())
                .items(itemResponses)
                .build();
    }

    private OrderItemResponse toItemResponse(OrderItem item) {
        return OrderItemResponse.builder()
                .id(item.getId())
                .productId(item.getProductId())
                .productName(item.getProductName())
                .productOrigin(item.getProductOrigin())
                .productSellingPrice(item.getProductSellingPrice())
                .productDiscountPercentage(item.getProductDiscountPercentage())
                .quantity(item.getQuantity())
                .price(item.getPrice())
                .build();
    }

    private List<OrderItem> processOrderItems(List<OrderItemRequest> itemRequests, Order order) {
        return itemRequests.stream()
                .map(itemRequest -> {
                    Product product = productRepository.findById(itemRequest.getProductId())
                            .orElseThrow(() -> new ResourceNotFoundException(
                                    "Product not found with id: " + itemRequest.getProductId()));

                    return OrderItem.builder()
                            .order(order)
                            .productId(product.getId())
                            .productName(product.getName())
                            .productOrigin(product.getOrigin())
                            .productSellingPrice(product.getSellingPrice())
                            .productDiscountPercentage(product.getDiscountPercentage())
                            .quantity(itemRequest.getQuantity())
                            .price(calculateItemPrice(product, itemRequest.getQuantity()))
                            .build();
                })
                .collect(Collectors.toList());
    }

    private Double calculateItemPrice(Product product, Integer quantity) {
        double unitPrice = product.getSellingPrice() *
                (1 - (product.getDiscountPercentage() != null ?
                        product.getDiscountPercentage() : 0) / 100);
        return unitPrice * quantity;
    }

    private void updateCustomerOrderStats(Customer customer, Order order) {
        customer.setLastOrderDate(order.getCreatedAt());
        customer.setTotalOrders(customer.getTotalOrders() + 1);
        customerRepository.save(customer);
    }
}
