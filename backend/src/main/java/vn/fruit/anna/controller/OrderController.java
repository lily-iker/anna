package vn.fruit.anna.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.fruit.anna.dto.filter.OrderFilter;
import vn.fruit.anna.dto.response.ApiResponse;
import vn.fruit.anna.dto.response.OrderResponse;
import vn.fruit.anna.enums.OrderStatus;
import vn.fruit.anna.service.OrderService;

import java.util.UUID;

@RestController
@RequestMapping("/api/order")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

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
            @RequestParam(required = false) OrderStatus status
    ) {
        OrderFilter filter = OrderFilter.builder()
                .customerName(customerName)
                .status(status)
                .build();

        return ResponseEntity.ok(
                new ApiResponse<>(200,
                        "Orders searched successfully",
                        orderService.searchOrders(filter, page, size))
        );
    }

}
