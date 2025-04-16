package vn.fruit.anna.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.fruit.anna.dto.request.ListCustomersByIdsRequest;
import vn.fruit.anna.dto.response.ApiResponse;
import vn.fruit.anna.service.CustomerService;

@RestController
@RequestMapping("/api/customer")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService customerService;

    @GetMapping("/search")
    public ResponseEntity<?> getAllCustomers(
            @RequestParam(required = false, defaultValue = "") String name,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(
                new ApiResponse<>(200,
                        "Get customers successfully",
                        customerService.searchCustomers(name, page, size))
        );
    }

    @DeleteMapping("/delete-by-ids")
    public ResponseEntity<?> deleteCustomersByIds(@RequestBody ListCustomersByIdsRequest request) {
        customerService.deleteCustomersByIds(request);
        return ResponseEntity.ok(
                new ApiResponse<>(200,
                        "Customers deleted successfully")
        );
    }
}
