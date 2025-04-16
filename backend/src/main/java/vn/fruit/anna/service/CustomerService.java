package vn.fruit.anna.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.fruit.anna.dto.request.ListCustomersByIdsRequest;
import vn.fruit.anna.repository.CustomerRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import vn.fruit.anna.dto.response.CustomerResponse;
import vn.fruit.anna.model.Customer;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CustomerService {
    private final CustomerRepository customerRepository;

    public Page<?> searchCustomers(String name, int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size);
        return customerRepository.findByNameContainingIgnoreCase(name, pageRequest).map(this::toResponse);
    }

    @Transactional
    public void deleteCustomersByIds(ListCustomersByIdsRequest request) {
        List<UUID> customerIds = request.getCustomerIds();

        List<Customer> customers = customerRepository.findAllById(customerIds);

        if (!customers.isEmpty()) {
            customerRepository.deleteAll(customers);
        }
    }

    private CustomerResponse toResponse(Customer customer) {
        return CustomerResponse.builder()
                .id(customer.getId())
                .name(customer.getName())
                .phoneNumber(customer.getPhoneNumber())
                .address(customer.getAddress())
                .email(customer.getEmail())
                .totalOrders(customer.getTotalOrders())
                .lastOrderDate(customer.getLastOrderDate())
                .build();
    }
}
