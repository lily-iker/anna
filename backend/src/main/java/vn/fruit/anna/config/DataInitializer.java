package vn.fruit.anna.config;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import vn.fruit.anna.enums.Unit;
import vn.fruit.anna.model.*;
import vn.fruit.anna.repository.*;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final BannerRepository bannerRepository;
    private final BlogRepository blogRepository;

    @PostConstruct
    public void initData() {
        initCategories();
        initProducts();
        initBanners();
        initBlogs();
    }

    private void initCategories() {
        if (categoryRepository.count() > 0) return;

        List<Category> categories = List.of(
                Category.builder().name("Trái cây nhập khẩu")
                        .thumbnailImage("https://res.cloudinary.com/demo/image/upload/v1/fruit1.jpg").build(),
                Category.builder().name("Trái cây theo mùa")
                        .thumbnailImage("https://res.cloudinary.com/demo/image/upload/v1/fruit2.jpg").build(),
                Category.builder().name("Combo ưu đãi")
                        .thumbnailImage("https://res.cloudinary.com/demo/image/upload/v1/fruit3.jpg").build()
        );
        categoryRepository.saveAll(categories);
        System.out.println("✅ Categories inserted.");
    }

    private void initProducts() {
        if (productRepository.count() > 0) return;

        List<Product> products = List.of(
                Product.builder().name("Táo Mỹ").description("Ngọt và giòn").originalPrice(100000.0).discountPrice(80000.0)
                        .minPrice(70000.0).maxPrice(100000.0).unit(Unit.KILOGRAM).stock(100).minUnitToOrder(1)
                        .thumbnailImage("https://example.com/tao.jpg").build(),

                Product.builder().name("Chuối Việt Nam").description("Chuối chín cây").originalPrice(50000.0).discountPrice(40000.0)
                        .minPrice(35000.0).maxPrice(55000.0).unit(Unit.KILOGRAM).stock(200).minUnitToOrder(1)
                        .thumbnailImage("https://example.com/chuoi.jpg").build(),

                Product.builder().name("Cam Sành").description("Ngọt mát tự nhiên").originalPrice(70000.0).discountPrice(60000.0)
                        .minPrice(55000.0).maxPrice(75000.0).unit(Unit.KILOGRAM).stock(150).minUnitToOrder(1)
                        .thumbnailImage("https://example.com/cam.jpg").build(),

                Product.builder().name("Nho Đen Úc").description("Không hạt").originalPrice(120000.0).discountPrice(100000.0)
                        .minPrice(90000.0).maxPrice(130000.0).unit(Unit.KILOGRAM).stock(90).minUnitToOrder(1)
                        .thumbnailImage("https://example.com/nho.jpg").build(),

                Product.builder().name("Dưa Hấu").description("Mọng nước").originalPrice(40000.0).discountPrice(35000.0)
                        .minPrice(30000.0).maxPrice(45000.0).unit(Unit.KILOGRAM).stock(250).minUnitToOrder(1)
                        .thumbnailImage("https://example.com/duahau.jpg").build(),

                Product.builder().name("Xoài Cát Hòa Lộc").description("Ngon nổi tiếng").originalPrice(90000.0).discountPrice(80000.0)
                        .minPrice(70000.0).maxPrice(95000.0).unit(Unit.KILOGRAM).stock(120).minUnitToOrder(1)
                        .thumbnailImage("https://example.com/xoai.jpg").build(),

                Product.builder().name("Lê Hàn Quốc").description("Giòn, ngọt thanh").originalPrice(110000.0).discountPrice(95000.0)
                        .minPrice(85000.0).maxPrice(115000.0).unit(Unit.KILOGRAM).stock(80).minUnitToOrder(1)
                        .thumbnailImage("https://example.com/le.jpg").build(),

                Product.builder().name("Ổi Nữ Hoàng").description("Không hạt, giòn").originalPrice(60000.0).discountPrice(50000.0)
                        .minPrice(45000.0).maxPrice(65000.0).unit(Unit.KILOGRAM).stock(100).minUnitToOrder(1)
                        .thumbnailImage("https://example.com/oi.jpg").build(),

                Product.builder().name("Thanh Long Đỏ").description("Đẹp mắt").originalPrice(70000.0).discountPrice(60000.0)
                        .minPrice(55000.0).maxPrice(75000.0).unit(Unit.KILOGRAM).stock(90).minUnitToOrder(1)
                        .thumbnailImage("https://example.com/thanhlong.jpg").build(),

                Product.builder().name("Măng Cụt").description("Đặc sản").originalPrice(130000.0).discountPrice(115000.0)
                        .minPrice(105000.0).maxPrice(140000.0).unit(Unit.KILOGRAM).stock(70).minUnitToOrder(1)
                        .thumbnailImage("https://example.com/mangcut.jpg").build(),

                Product.builder().name("Dâu Tây Đà Lạt").description("Tươi ngon").originalPrice(140000.0).discountPrice(125000.0)
                        .minPrice(115000.0).maxPrice(145000.0).unit(Unit.KILOGRAM).stock(60).minUnitToOrder(1)
                        .thumbnailImage("https://example.com/dau.jpg").build(),

                Product.builder().name("Sầu Riêng Ri6").description("Thơm đậm").originalPrice(180000.0).discountPrice(160000.0)
                        .minPrice(150000.0).maxPrice(190000.0).unit(Unit.KILOGRAM).stock(50).minUnitToOrder(1)
                        .thumbnailImage("https://example.com/saurieng.jpg").build()
        );

        productRepository.saveAll(products);
        System.out.println("✅ Products inserted.");
    }

    private void initBanners() {
        if (bannerRepository.count() > 0) return;

        List<Banner> banners = List.of(
                Banner.builder().title("Khuyến mãi mùa hè")
                        .thumbnailImage("https://res.cloudinary.com/demo/image/upload/v1/banner1.jpg").build(),

                Banner.builder().title("Trái cây nhập khẩu giảm giá")
                        .thumbnailImage("https://res.cloudinary.com/demo/image/upload/v1/banner2.jpg").build(),

                Banner.builder().title("Miễn phí giao hàng")
                        .thumbnailImage("https://res.cloudinary.com/demo/image/upload/v1/banner3.jpg").build()
        );

        bannerRepository.saveAll(banners);
        System.out.println("✅ Banners inserted.");
    }

    private void initBlogs() {
        if (blogRepository.count() > 0) return;

        List<Blog> blogs = List.of(
                Blog.builder()
                        .title("Về Anna")
                        .sapo("Sứ mệnh của chúng tôi")
                        .content("Chúng tôi cung cấp trái cây chất lượng cao cho người tiêu dùng.")
                        .thumbnailImage("https://res.cloudinary.com/demo/image/upload/v1/blog1.jpg")
                        .author("Minh Lâm")
                        .build(),

                Blog.builder()
                        .title("Dinh dưỡng & Sức khỏe")
                        .sapo("Tác dụng của trái cây sạch")
                        .content("Trái cây sạch giúp tăng cường sức đề kháng và hỗ trợ hệ tiêu hóa.")
                        .thumbnailImage("https://res.cloudinary.com/demo/image/upload/v1/blog2.jpg")
                        .author("Minh Lâm")
                        .build(),

                Blog.builder()
                        .title("Xu hướng tiêu dùng")
                        .sapo("Chọn mua & bảo quản trái cây")
                        .content("Người tiêu dùng đang ưu tiên trái cây hữu cơ và bảo quản đúng cách.")
                        .thumbnailImage("https://res.cloudinary.com/demo/image/upload/v1/blog3.jpg")
                        .author("Minh Lâm")
                        .build(),

                Blog.builder()
                        .title("Trái cây và làm đẹp")
                        .sapo("Lợi ích làm đẹp từ thiên nhiên")
                        .content("Vitamin C và chất chống oxy hóa trong trái cây giúp làm đẹp da, tóc và vóc dáng.")
                        .thumbnailImage("https://res.cloudinary.com/demo/image/upload/v1/blog4.jpg")
                        .author("Minh Lâm")
                        .build(),

                Blog.builder()
                        .title("Trái cây cho trẻ nhỏ")
                        .sapo("Chế độ ăn lành mạnh cho bé")
                        .content("Hướng dẫn lựa chọn trái cây phù hợp cho từng độ tuổi của trẻ nhỏ.")
                        .thumbnailImage("https://res.cloudinary.com/demo/image/upload/v1/blog5.jpg")
                        .author("Minh Lâm")
                        .build()
        );

        blogRepository.saveAll(blogs);
        System.out.println("✅ Blogs inserted.");
    }

}
