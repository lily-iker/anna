package vn.fruit.anna.config;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import vn.fruit.anna.enums.BannerType;
import vn.fruit.anna.enums.OrderStatus;
import vn.fruit.anna.enums.RoleName;
import vn.fruit.anna.enums.Unit;
import vn.fruit.anna.model.*;
import vn.fruit.anna.repository.*;

import java.util.*;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class DataInitializer {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final BannerRepository bannerRepository;
    private final BlogRepository blogRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final CustomerRepository customerRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;

    @PostConstruct
    public void initData() {
        initAdminAccount();
        initCategories();
        initProducts();
        initBanners();
        initBlogs();
        initCustomers();
        initOrders();
    }

    public void initAdminAccount() {
        // Ensure ADMIN role exists
        Role adminRole = roleRepository.findByName(RoleName.ADMIN)
                .orElseGet(() -> roleRepository.save(Role.builder().name(RoleName.ADMIN).build()));

        // Create admin user if not exists
        Optional<User> adminUserOpt = userRepository.findByUsername("adminadmin");

        if (adminUserOpt.isEmpty()) {
            User adminUser = User.builder()
                    .fullName("Admin User")
                    .email("adminadmin@gmail.com")
                    .username("adminadmin")
                    .password(passwordEncoder.encode("adminadmin"))
                    .role(adminRole)
                    .build();

            userRepository.save(adminUser);
            System.out.println("✅ Admin user created.");
        } else {
            System.out.println("ℹ️ Admin user already exists.");
        }
    }

    private void initCategories() {
        if (categoryRepository.count() > 0) return;

        List<Category> categories = List.of(
                Category.builder().name("Trái cây nhập khẩu")
                        .thumbnailImage("https://res.cloudinary.com/dschfkj54/image/upload/v1742819903/danh_m%E1%BB%A5c_pre_xatkoe.jpg").build(),
                Category.builder().name("Trái cây theo mùa")
                        .thumbnailImage("https://res.cloudinary.com/dschfkj54/image/upload/v1742819903/danh_m%E1%BB%A5c_pre_xatkoe.jpg").build(),
                Category.builder().name("Giỏ hoa quả")
                        .thumbnailImage("https://res.cloudinary.com/dschfkj54/image/upload/v1742819903/danh_m%E1%BB%A5c_pre_xatkoe.jpg").build()
        );
        categoryRepository.saveAll(categories);
        System.out.println("✅ Categories inserted.");
    }

    private void initProducts() {
        if (productRepository.count() > 0) return;

        Category importedFruitCategory = categoryRepository.findByName("Trái cây nhập khẩu").get();
        Category seasonalFruitCategory = categoryRepository.findByName("Trái cây theo mùa").get();
        Category setFruit = categoryRepository.findByName("Giỏ hoa quả").get();

        List<Product> products = List.of(
                Product.builder()
                        .name("Set giỏ hoa quả")
                        .origin("Vietnam")
                        .description("Giỏ quà trái cây cao cấp, được tuyển chọn từ những loại trái cây tươi ngon như nho xanh, cam, lê, táo, cherry...")
                        .originalPrice(250000.0)
                        .sellingPrice(250000.0)
                        .discountPercentage(0.0)
                        .unit(Unit.Hộp)
                        .stock(20)
                        .minUnitToOrder(1)
                        .thumbnailImage(null)
                        .category(importedFruitCategory)
                        .build(),

                Product.builder()
                        .name("Sữa óc chó hạnh nhân Hàn Quốc")
                        .origin("South Korea")
                        .description("Sữa óc chó hạnh nhân Hàn Quốc là một loại thức uống phổ biến, thường được biết đến với hương vị thơm ngon và giá trị dinh dưỡng cao...")
                        .originalPrice(190000.0)
                        .sellingPrice(190000.0)
                        .discountPercentage(0.0)
                        .unit(Unit.Hộp)
                        .stock(10)
                        .minUnitToOrder(1)
                        .thumbnailImage(null)
                        .category(setFruit)
                        .build(),

                Product.builder()
                        .name("Táo STORY Pháp")
                        .origin("France")
                        .description("Táo Story giống Pháp có hình dáng tròn đều, lớp vỏ mịn màng với sắc đỏ quyến rũ...")
                        .originalPrice(40000.0)
                        .sellingPrice(40000.0)
                        .discountPercentage(0.0)
                        .unit(Unit.KG)
                        .stock(40)
                        .minUnitToOrder(2)
                        .thumbnailImage("https://res.cloudinary.com/dschfkj54/image/upload/v1742736196/taostory_03_qcd8g1.jpg")
                        .category(seasonalFruitCategory)
                        .build(),

                Product.builder()
                        .name("Táo EVERCRISP S32")
                        .origin("USA")
                        .description("Táo EverCrisp Mỹ là giống táo cao cấp, kết hợp hoàn hảo giữa Fuji và Honeycrisp...")
                        .originalPrice(60000.0)
                        .sellingPrice(60000.0)
                        .discountPercentage(0.0)
                        .unit(Unit.KG)
                        .stock(40)
                        .minUnitToOrder(2)
                        .thumbnailImage("https://res.cloudinary.com/dschfkj54/image/upload/v1742736196/taoever32_03_crpvz8.jpg")
                        .category(seasonalFruitCategory)
                        .build(),

                Product.builder()
                        .name("Cam Ai Cập")
                        .origin("Egypt")
                        .description("Cam Ai Cập sở hữu một vị thanh ngọt đặc trưng cùng với mùi thơm nức từ vỏ quả...")
                        .originalPrice(15000.0)
                        .sellingPrice(15000.0)
                        .discountPercentage(0.0)
                        .unit(Unit.KG)
                        .stock(15)
                        .minUnitToOrder(2)
                        .thumbnailImage("https://res.cloudinary.com/dschfkj54/image/upload/v1742736194/camaicap_01_qygdij.jpg")
                        .category(seasonalFruitCategory)
                        .build(),

                Product.builder()
                        .name("Việt Quất Peru")
                        .origin("Peru")
                        .description("Việt quất Peru là loại quả có vị ngọt thanh, thơm đặc trưng, rất giàu vitamin...")
                        .originalPrice(35000.0)
                        .sellingPrice(35000.0)
                        .discountPercentage(0.0)
                        .unit(Unit.Hộp)
                        .stock(24)
                        .minUnitToOrder(2)
                        .thumbnailImage("https://res.cloudinary.com/dschfkj54/image/upload/v1742736196/vietquatperu_03_x8yi8q.jpg")
                        .category(importedFruitCategory)
                        .build(),

                Product.builder()
                        .name("Nho xanh Úc")
                        .origin("Australia")
                        .description("Nho xanh Úc là loại trái cây phổ biến, nổi tiếng với vị ngọt thanh, giòn tan...")
                        .originalPrice(89000.0)
                        .sellingPrice(89000.0)
                        .discountPercentage(0.0)
                        .unit(Unit.KG)
                        .stock(20)
                        .minUnitToOrder(2)
                        .thumbnailImage("https://res.cloudinary.com/dschfkj54/image/upload/v1742736194/nhoxanhuc_02_jogemo.jpg")
                        .category(importedFruitCategory)
                        .build(),

                Product.builder()
                        .name("Quất đường Đài Loan")
                        .origin("Taiwan")
                        .description("Quất đường Đài Loan, còn gọi là 'Kumquat Đài Loan', là một loại trái cây thuộc họ cam quýt...")
                        .originalPrice(45000.0)
                        .sellingPrice(45000.0)
                        .discountPercentage(0.0)
                        .unit(Unit.Hộp)
                        .stock(12)
                        .minUnitToOrder(2)
                        .thumbnailImage("https://res.cloudinary.com/dschfkj54/image/upload/v1742736194/quatduongdailoan_01_s2desw.jpg")
                        .category(setFruit)
                        .build(),

                Product.builder()
                        .name("Lê nâu Hàn Quốc")
                        .origin("South Korea")
                        .description("Lê nâu Hàn Quốc, còn được biết đến với tên gọi lê tuyết hoặc lê Á, là một loại trái cây phổ biến tại Hàn Quốc...")
                        .originalPrice(40000.0)
                        .sellingPrice(40000.0)
                        .discountPercentage(0.0)
                        .unit(Unit.KG)
                        .stock(30)
                        .minUnitToOrder(2)
                        .thumbnailImage("https://res.cloudinary.com/dschfkj54/image/upload/v1742736194/lenauhan_01_oc3lf1.jpg")
                        .category(seasonalFruitCategory)
                        .build(),

                Product.builder()
                        .name("Xoài Phá Thái")
                        .origin("Thailand")
                        .description("Xoài Phá Thái, hay còn gọi là xoài Thái Lan, là một loại xoài nổi tiếng ở Việt Nam...")
                        .originalPrice(20000.0)
                        .sellingPrice(20000.0)
                        .discountPercentage(0.0)
                        .unit(Unit.KG)
                        .stock(30)
                        .minUnitToOrder(5)
                        .thumbnailImage("https://res.cloudinary.com/dschfkj54/image/upload/v1742736195/xoaiphathai_01_wrzzg3.jpg")
                        .category(seasonalFruitCategory)
                        .build(),

                Product.builder()
                        .name("Táo Ambrosia Mỹ size 72")
                        .origin("USA")
                        .description("Táo Ambrosia Mỹ joyfully hình chuông siêu sang và đẹp. Táo đỏ bóng, đẹp, cuống tươi xanh, giòn ngọt và cực thơm.")
                        .originalPrice(65000.0)
                        .sellingPrice(65000.0)
                        .discountPercentage(0.0)
                        .unit(Unit.KG)
                        .stock(30)
                        .minUnitToOrder(2)
                        .thumbnailImage("https://res.cloudinary.com/dschfkj54/image/upload/v1742736194/taoam_03_ruvzv4.jpg")
                        .category(importedFruitCategory)
                        .build(),

                Product.builder()
                        .name("Roi lòng xanh An Phước")
                        .origin("Vietnam")
                        .description("Roi lòng xanh An Phước là một giống roi nổi tiếng, được biết đến với vị ngọt thanh mát và thịt giòn...")
                        .originalPrice(30000.0)
                        .sellingPrice(30000.0)
                        .discountPercentage(0.0)
                        .unit(Unit.KG)
                        .stock(20)
                        .minUnitToOrder(2)
                        .thumbnailImage(null)
                        .category(seasonalFruitCategory)
                        .build(),

                Product.builder()
                        .name("Cam sành Vĩnh Long")
                        .origin("Vietnam")
                        .description("Cam sành Vĩnh Long là một loại trái cây đặc sản nổi tiếng của tỉnh Vĩnh Long, Việt Nam...")
                        .originalPrice(11000.0)
                        .sellingPrice(11000.0)
                        .discountPercentage(0.0)
                        .unit(Unit.KG)
                        .stock(20)
                        .minUnitToOrder(2)
                        .thumbnailImage("https://res.cloudinary.com/dschfkj54/image/upload/v1742736194/lenauhan_01_oc3lf1.jpg")
                        .category(seasonalFruitCategory)
                        .build(),

                Product.builder()
                        .name("Xoài bao tử")
                        .origin("Vietnam")
                        .description("Xoài bao tử là xoài non, còn nhỏ, thường được dùng làm món ăn vặt...")
                        .originalPrice(12000.0)
                        .sellingPrice(12000.0)
                        .discountPercentage(0.0)
                        .unit(Unit.KG)
                        .stock(15)
                        .minUnitToOrder(3)
                        .thumbnailImage("https://res.cloudinary.com/dschfkj54/image/upload/v1742736194/xoao_bautu_03_hq9hdy.jpg")
                        .category(seasonalFruitCategory)
                        .build()
        );

        productRepository.saveAll(products);
        System.out.println("✅ Products inserted.");
    }

    private void initBanners() {
        if (bannerRepository.count() > 0) return;

        List<Banner> banners = List.of(
                // TOP banners
                Banner.builder()
                        .title("Khuyến mãi mùa hè")
                        .thumbnailImage("https://res.cloudinary.com/dschfkj54/image/upload/v1742818692/banner_top_1_bfiwnc.jpg")
                        .bannerType(BannerType.TOP)
                        .build(),

                Banner.builder()
                        .title("Giảm giá cuối tuần")
                        .thumbnailImage("https://res.cloudinary.com/dschfkj54/image/upload/v1742818691/banner_top_2_uhp0nb.jpg")
                        .bannerType(BannerType.TOP)
                        .build(),

                Banner.builder()
                        .title("Trái cây tươi mỗi ngày")
                        .thumbnailImage("https://res.cloudinary.com/dschfkj54/image/upload/v1742818692/%C4%91%E1%BB%83_%C4%91%C3%A2u_c%C5%A9ng_%C4%91c_k_%C4%91%E1%BB%83_c%C5%A9ng_%C4%91c_i2ddfy.jpg")
                        .bannerType(BannerType.TOP)
                        .build(),

                // ABOUT_US banners
                Banner.builder()
                        .title("Chúng tôi là ai?")
                        .thumbnailImage("https://res.cloudinary.com/dschfkj54/image/upload/v1742818692/%C4%91%E1%BB%83_%C4%91%C3%A2u_c%C5%A9ng_%C4%91c_k_%C4%91%E1%BB%83_c%C5%A9ng_%C4%91c_i2ddfy.jpg")
                        .bannerType(BannerType.ABOUT_US)
                        .build(),

                Banner.builder()
                        .title("Sứ mệnh của chúng tôi")
                        .thumbnailImage("https://res.cloudinary.com/dschfkj54/image/upload/v1742818692/%C4%91%E1%BB%83_%C4%91%C3%A2u_c%C5%A9ng_%C4%91c_k_%C4%91%E1%BB%83_c%C5%A9ng_%C4%91c_i2ddfy.jpg")
                        .bannerType(BannerType.ABOUT_US)
                        .build(),

                Banner.builder()
                        .title("Cam kết chất lượng")
                        .thumbnailImage("https://res.cloudinary.com/dschfkj54/image/upload/v1742818692/%C4%91%E1%BB%83_%C4%91%C3%A2u_c%C5%A9ng_%C4%91c_k_%C4%91%E1%BB%83_c%C5%A9ng_%C4%91c_i2ddfy.jpg")
                        .bannerType(BannerType.ABOUT_US)
                        .build(),

                // CONTACT banners
                Banner.builder()
                        .title("Hỗ trợ 24/7")
                        .thumbnailImage("https://res.cloudinary.com/dschfkj54/image/upload/v1742752113/contact_1.jpg")
                        .bannerType(BannerType.CONTACT)
                        .build(),

                Banner.builder()
                        .title("Địa chỉ cửa hàng")
                        .thumbnailImage("https://res.cloudinary.com/dschfkj54/image/upload/v1742752113/contact_2.jpg")
                        .bannerType(BannerType.CONTACT)
                        .build(),

                Banner.builder()
                        .title("Liên hệ ngay")
                        .thumbnailImage("https://res.cloudinary.com/dschfkj54/image/upload/v1742752113/contact_3.jpg")
                        .bannerType(BannerType.CONTACT)
                        .build());

        bannerRepository.saveAll(banners);
        System.out.println("✅ Banners inserted.");
    }

    private void initBlogs() {
        if (blogRepository.count() > 0) return;

        List<Blog> blogs = List.of(
                // Blog.builder()
                //         .title("Về Anna")
                //         .sapo("Sứ mệnh của chúng tôi")
                //         .content("Chúng tôi cung cấp trái cây chất lượng cao cho người tiêu dùng.")
                //         .thumbnailImage("https://res.cloudinary.com/demo/image/upload/v1/blog1.jpg")
                //         .author("Minh Lâm")
                //         .build(),

                // Blog.builder()
                //         .title("Dinh dưỡng & Sức khỏe")
                //         .sapo("Tác dụng của trái cây sạch")
                //         .content("Trái cây sạch giúp tăng cường sức đề kháng và hỗ trợ hệ tiêu hóa.")
                //         .thumbnailImage("https://res.cloudinary.com/demo/image/upload/v1/blog2.jpg")
                //         .author("Minh Lâm")
                //         .build(),

                // Blog.builder()
                //         .title("Xu hướng tiêu dùng")
                //         .sapo("Chọn mua & bảo quản trái cây")
                //         .content("Người tiêu dùng đang ưu tiên trái cây hữu cơ và bảo quản đúng cách.")
                //         .thumbnailImage("https://res.cloudinary.com/demo/image/upload/v1/blog3.jpg")
                //         .author("Minh Lâm")
                //         .build(),

                // Blog.builder()
                //         .title("Trái cây và làm đẹp")
                //         .sapo("Lợi ích làm đẹp từ thiên nhiên")
                //         .content("Vitamin C và chất chống oxy hóa trong trái cây giúp làm đẹp da, tóc và vóc dáng.")
                //         .thumbnailImage("https://res.cloudinary.com/demo/image/upload/v1/blog4.jpg")
                //         .author("Minh Lâm")
                //         .build(),

                // Blog.builder()
                //         .title("Trái cây cho trẻ nhỏ")
                //         .sapo("Chế độ ăn lành mạnh cho bé")
                //         .content("Hướng dẫn lựa chọn trái cây phù hợp cho từng độ tuổi của trẻ nhỏ.")
                //         .thumbnailImage("https://res.cloudinary.com/demo/image/upload/v1/blog5.jpg")
                //         .author("Minh Lâm")
                //         .build()

                Blog.builder()
                        .title("Về Anna")
                        .sapo("Sứ mệnh của chúng tôi")
                        .content("Chúng tôi cung cấp trái cây chất lượng cao cho người tiêu dùng.")
                        .thumbnailImage("https://res.cloudinary.com/dschfkj54/image/upload/v1742752394/ti%E1%BB%81n_%C4%91%E1%BB%81_blog_1_1_om3lyv.jpg")
                        .author("Minh Lâm")
                        .build(),

                Blog.builder()
                        .title("Dinh dưỡng & Sức khỏe")
                        .sapo("Tác dụng của trái cây sạch")
                        .content("Trái cây sạch giúp tăng cường sức đề kháng và hỗ trợ hệ tiêu hóa.")
                        .thumbnailImage("https://res.cloudinary.com/dschfkj54/image/upload/v1742751880/ti%E1%BB%81n_%C4%91%E1%BB%81_blog_2_gz7brj.jpg")
                        .author("Minh Lâm")
                        .build(),

                Blog.builder()
                        .title("Xu hướng tiêu dùng")
                        .sapo("Chọn mua & bảo quản trái cây")
                        .content("Người tiêu dùng đang ưu tiên trái cây hữu cơ và bảo quản đúng cách.")
                        .thumbnailImage("https://res.cloudinary.com/dschfkj54/image/upload/v1742751880/ti%E1%BB%81n_%C4%91%E1%BB%81_blog_3_qmgvt1.jpg")
                        .author("Minh Lâm")
                        .build()
        );

        blogRepository.saveAll(blogs);
        System.out.println("✅ Blogs inserted.");
    }

    private void initCustomers() {
        if (customerRepository.count() > 0) return;

        List<Customer> customers = List.of(
                Customer.builder()
                        .name("Nguyễn Văn A")
                        .email("vana@gmail.com")
                        .phoneNumber("0909123456")
                        .address("123 Đường Lê Lợi, Quận 1, TP.HCM")
                        .build(),
                Customer.builder()
                        .name("Trần Thị B")
                        .email("thib@gmail.com")
                        .phoneNumber("0909876543")
                        .address("456 Nguyễn Huệ, Quận 1, TP.HCM")
                        .build(),
                Customer.builder()
                        .name("Lê Hoàng C")
                        .email("hoangc@gmail.com")
                        .phoneNumber("0912345678")
                        .address("789 Phan Xích Long, Phú Nhuận, TP.HCM")
                        .build(),
                Customer.builder()
                        .name("Phan Thị D")
                        .email("thidi@gmail.com")
                        .phoneNumber("0908765432")
                        .address("321 Trường Chinh, Tân Bình, TP.HCM")
                        .build(),
                Customer.builder()
                        .name("Đoàn Minh E")
                        .email("minhe@gmail.com")
                        .phoneNumber("0918234567")
                        .address("555 Nguyễn Trãi, Quận 5, TP.HCM")
                        .build(),
                Customer.builder()
                        .name("Vũ Thanh F")
                        .email("thanhf@gmail.com")
                        .phoneNumber("0923456789")
                        .address("100 Võ Văn Kiệt, Quận 1, TP.HCM")
                        .build(),
                Customer.builder()
                        .name("Bùi Minh G")
                        .email("minhg@gmail.com")
                        .phoneNumber("0934567890")
                        .address("234 Trần Hưng Đạo, Quận 5, TP.HCM")
                        .build(),
                Customer.builder()
                        .name("Hồ Thị H")
                        .email("hothi@gmail.com")
                        .phoneNumber("0907654321")
                        .address("890 Lý Thường Kiệt, Quận 11, TP.HCM")
                        .build(),
                Customer.builder()
                        .name("Ngô Quang I")
                        .email("quangi@gmail.com")
                        .phoneNumber("0945678901")
                        .address("123 Bà Triệu, Quận 3, TP.HCM")
                        .build(),
                Customer.builder()
                        .name("Vũ Thi J")
                        .email("thij@gmail.com")
                        .phoneNumber("0912348765")
                        .address("654 Nguyễn Thái Học, Quận 1, TP.HCM")
                        .build()
        );

        customerRepository.saveAll(customers);
        System.out.println("✅ Customers inserted.");
    }

    private void initOrders() {
        if (orderRepository.count() > 0) return;

        List<Customer> customers = customerRepository.findAll();
        List<Product> products = productRepository.findAll();

        if (customers.size() < 3 || products.size() < 3) {
            System.out.println("⚠️ Not enough customers or products to create orders.");
            return;
        }

        // Possible statuses to cycle through
        OrderStatus[] statuses = OrderStatus.values();

        Random random = new Random();

        for (int i = 0; i < 100; i++) {
            Customer customer = customers.get(i % customers.size());
            OrderStatus status = statuses[i % statuses.length];

            Date deliveryDate = new Date(System.currentTimeMillis() + (2 + i) * 86400000L);
            String note = "Giao đơn hàng #" + (i + 1);

            Order order = Order.builder()
                    .customer(customer)
                    .estimatedDeliveryDate(deliveryDate)
                    .note(note)
                    .status(status)
                    .build();

            order = orderRepository.save(order);

            int numberOfItems = 1 + random.nextInt(3); // 1 to 3 products per order
            double total = 0.0;

            for (int j = 0; j < numberOfItems; j++) {
                Product product = products.get(random.nextInt(products.size()));
                int quantity = 1 + random.nextInt(5); // 1 to 5 units

                OrderItem item = OrderItem.builder()
                        .order(order)
                        .product(product)
                        .quantity(quantity)
                        .price(product.getSellingPrice())
                        .build();

                total += item.getPrice() * item.getQuantity();
                order.getOrderItems().add(item);
            }

            order.setTotalPrice(total);
            orderRepository.save(order);
        }
        System.out.println("✅ Sample orders and order items inserted.");

        Map<UUID, Long> orderCountByCustomer = orderRepository.findAll().stream()
                .collect(Collectors.groupingBy(o -> o.getCustomer().getId(), Collectors.counting()));

        for (Customer customer : customers) {
            long total = orderCountByCustomer.getOrDefault(customer.getId(), 0L);
            customer.setTotalOrders((int) total);
        }

        customerRepository.saveAll(customers);
        System.out.println("✅ Updated totalOrders for each customer.");
    }


}
