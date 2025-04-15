package vn.fruit.anna.dto.filter;

import lombok.*;
import vn.fruit.anna.enums.OrderStatus;

import java.time.LocalDate;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrderFilter {
    private String customerName;
    private OrderStatus status;
    private LocalDate fromDate;
    private LocalDate toDate;
}