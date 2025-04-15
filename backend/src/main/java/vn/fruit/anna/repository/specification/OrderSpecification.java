package vn.fruit.anna.repository.specification;

import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import vn.fruit.anna.dto.filter.OrderFilter;
import vn.fruit.anna.model.Order;

import java.util.ArrayList;
import java.util.List;

public class OrderSpecification {

    public static Specification<Order> applyFilter(OrderFilter filter) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Filter by customer name
            if (filter.getCustomerName() != null && !filter.getCustomerName().isEmpty()) {
                predicates.add(criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("customer").get("name")),
                        "%" + filter.getCustomerName().toLowerCase() + "%"
                ));
            }

            // Filter by order status
            if (filter.getStatus() != null) {
                predicates.add(criteriaBuilder.equal(
                        root.get("status"),
                        filter.getStatus()
                ));
            }

//            // Filter by fromDate (createdAt >= fromDate)
//            if (filter.getFromDate() != null) {
//                predicates.add(criteriaBuilder.greaterThanOrEqualTo(
//                        root.get("createdAt"),
//                        filter.getFromDate().atStartOfDay()
//                ));
//            }
//
//            // Filter by toDate (createdAt <= toDate)
//            if (filter.getToDate() != null) {
//                predicates.add(criteriaBuilder.lessThanOrEqualTo(
//                        root.get("createdAt"),
//                        filter.getToDate().atTime(23, 59, 59)
//                ));
//            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
