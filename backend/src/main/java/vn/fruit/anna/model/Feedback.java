package vn.fruit.anna.model;

import jakarta.persistence.GenerationType;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;

import java.sql.Types;
import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Feedback extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String customerName;

    private String customerPhoneNumber;

    @Column(columnDefinition = "TEXT")
    private String content;

    @JdbcTypeCode(Types.VARCHAR)
    private UUID productId;

    private String productName;
}
