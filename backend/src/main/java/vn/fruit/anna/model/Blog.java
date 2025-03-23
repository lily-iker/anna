package vn.fruit.anna.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Blog extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String thumbnailImage;

    @Column(columnDefinition = "TEXT")
    private String sapo;

    @Column(columnDefinition = "TEXT")
    private String content;

    private String author;
}
