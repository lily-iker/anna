package vn.fruit.anna.repository.specification;

import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import vn.fruit.anna.dto.filter.ProductFilter;
import vn.fruit.anna.model.Product;

import java.util.ArrayList;
import java.util.List;

public class ProductSpecification {

    public static Specification<Product> applyFilter(ProductFilter filter) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Filter by name
            if (filter.getName() != null && !filter.getName().isEmpty()) {
                predicates.add(criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("name")),
                        "%" + filter.getName().toLowerCase() + "%"
                ));
            }

            // Filter by selling price (replaces minPrice/maxPrice filtering)
            if (filter.getMinPrice() != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("sellingPrice"), filter.getMinPrice()));
            }
            if (filter.getMaxPrice() != null) {
                // Create the literal for 100 (double)
                Expression<Double> hundred = criteriaBuilder.literal(100.0);

                // Calculate discount fraction: discountPercentage / 100
                Expression<Double> discountFraction = criteriaBuilder.quot(root.get("discountPercentage"), hundred).as(Double.class);

                // Calculate 1 - (discountPercentage / 100)
                Expression<Double> oneMinusDiscount = criteriaBuilder.diff(criteriaBuilder.literal(1.0), discountFraction);

                // Calculate the discount price: sellingPrice * (1 - discountPercentage / 100)
                Expression<Double> discountPrice = criteriaBuilder.prod(root.get("sellingPrice"), oneMinusDiscount);

                // Add the condition: discount price <= maxPrice
                predicates.add(criteriaBuilder.lessThanOrEqualTo(discountPrice, filter.getMaxPrice()));
            }

            // Filter by category name
            if (filter.getCategoryName() != null && !filter.getCategoryName().isEmpty()) {
                predicates.add(criteriaBuilder.equal(
                        criteriaBuilder.lower(root.get("category").get("name")),
                        filter.getCategoryName().toLowerCase()
                ));
            }

            // Filter by product origin (optional filter)
            if (filter.getOrigin() != null && !filter.getOrigin().isEmpty()) {
                predicates.add(criteriaBuilder.equal(
                        criteriaBuilder.lower(root.get("origin")),
                        filter.getOrigin().toLowerCase()
                ));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
