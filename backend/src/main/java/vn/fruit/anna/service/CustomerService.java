package vn.fruit.anna.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import vn.fruit.anna.repository.CustomerRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import vn.fruit.anna.dto.response.CustomerResponse;
import vn.fruit.anna.model.Customer;
import vn.fruit.anna.repository.CustomerRepository;

@Service
@RequiredArgsConstructor
public class CustomerService {
    private final CustomerRepository customerRepository;

    public Page<?> searchCustomers(String name, int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size);
        return customerRepository.findByNameContainingIgnoreCase(name, pageRequest).map(this::toResponse);
    }

    private CustomerResponse toResponse(Customer customer) {
        return CustomerResponse.builder()
                .id(customer.getId())
                .name(customer.getName())
                .phoneNumber(customer.getPhoneNumber())
                .address(customer.getAddress())
                .email(customer.getEmail())
                .totalOrders(customer.getTotalOrders())
                .build();
    }
}
