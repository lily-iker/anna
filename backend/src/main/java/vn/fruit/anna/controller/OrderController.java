package vn.fruit.anna.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.fruit.anna.dto.filter.OrderFilter;
import vn.fruit.anna.dto.request.CreateOrderRequest;
import vn.fruit.anna.dto.request.ListOrdersByIdsRequest;
import vn.fruit.anna.dto.request.UpdateOrderStatusRequest;
import vn.fruit.anna.dto.response.ApiResponse;
import vn.fruit.anna.enums.OrderStatus;
import vn.fruit.anna.service.OrderService;

import java.util.UUID;

@RestController
@RequestMapping("/api/order")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody CreateOrderRequest request) {
        return ResponseEntity.ok(
                new ApiResponse<>(
                        201,
                        "Order created successfully",
                        orderService.createOrder(request)
                )
        );
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<?> getOrderById(@PathVariable UUID orderId) {
        return ResponseEntity.ok(
                new ApiResponse<>(200,
                        "Orders searched successfully",
                        orderService.getOrderById(orderId))
        );
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String customerName,
            @RequestParam(required = false) OrderStatus status,
            @RequestParam(defaultValue = "createdAt", required = false) String sortBy,
            @RequestParam(defaultValue = "desc", required = false) String direction
    ) {
        OrderFilter filter = OrderFilter.builder()
                .customerName(customerName)
                .status(status)
                .build();

        return ResponseEntity.ok(
                new ApiResponse<>(200,
                        "Orders searched successfully",
                        orderService.searchOrders(filter, page, size, sortBy, direction))
        );
    }

    @PutMapping("/{orderId}/status")
    public ResponseEntity<?> updateOrderStatus(
            @PathVariable UUID orderId,
            @RequestBody UpdateOrderStatusRequest request
    ) {
        return ResponseEntity.ok(
                new ApiResponse<>(200,
                        "Order's status updated successfully",
                        orderService.updateStatus(orderId, request.getNewStatus()))
        );
    }

    @DeleteMapping("/delete-by-ids")
    public ResponseEntity<?> deleteOrdersByIds(@RequestBody ListOrdersByIdsRequest request) {
        orderService.deleteOrdersByIds(request);
        return ResponseEntity.ok(
                new ApiResponse<>(200, "Orders deleted successfully")
        );
    }

}
