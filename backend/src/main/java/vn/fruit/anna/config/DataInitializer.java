package vn.fruit.anna.config;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import vn.fruit.anna.enums.RoleName;
import vn.fruit.anna.enums.Unit;
import vn.fruit.anna.model.*;
import vn.fruit.anna.repository.*;

import java.util.List;
import java.util.Optional;

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

    @PostConstruct
    public void initData() {
        initAdminAccount();
        initCategories();
        initProducts();
        initBanners();
        initBlogs();
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
                        .thumbnailImage("https://res.cloudinary.com/dschfkj54/image/upload/v1742752234/banner_2_fqv9xi.jpg").build(),
                Category.builder().name("Trái cây theo mùa")
                        .thumbnailImage("https://res.cloudinary.com/dschfkj54/image/upload/v1742752234/banner_2_fqv9xi.jpg").build(),
                Category.builder().name("Combo ưu đãi")
                        .thumbnailImage("https://res.cloudinary.com/dschfkj54/image/upload/v1742752234/banner_2_fqv9xi.jpg").build()
        );
        categoryRepository.saveAll(categories);
        System.out.println("✅ Categories inserted.");
    }

    private void initProducts() {
        if (productRepository.count() > 0) return;

        List<Product> products = List.of(
                Product.builder()
                        .name("Set giỏ hoa quả")
                        .description("Giỏ quà trái cây cao cấp, được tuyển chọn từ những loại trái cây tươi ngon như nho xanh, cam, lê, táo, cherry. Trái cây được sắp xếp tỉ mỉ trong giỏ mây tre thủ công, trang trí tinh tế với nơ lụa và lớp lưới sang trọng, mang lại cảm giác nhẹ nhàng, thanh lịch. Đây là món quà hoàn hảo cho các dịp biếu tặng đối tác, chúc mừng, thăm hỏi sức khỏe hoặc kỷ niệm đặc biệt.")
                        .originalPrice(250000.0)
                        .discountPrice(250000.0)
                        .unit(Unit.PIECE)
                        .stock(20)
                        .minUnitToOrder(1)
                        .thumbnailImage(null)
                        .build(),

                Product.builder()
                        .name("Sữa óc chó hạnh nhân Hàn Quốc")
                        .description("Sữa óc chó hạnh nhân Hàn Quốc là một loại thức uống phổ biến, thường được biết đến với hương vị thơm ngon và giá trị dinh dưỡng cao. Nó được làm từ quả óc chó và hạnh nhân, có thể bổ sung các vitamin và khoáng chất quan trọng cho cơ thể. Sản phẩm này thường được đóng gói tiện lợi, dễ dàng sử dụng và bảo quản. Nó cũng có thể được sử dụng như một phần của chế độ ăn uống lành mạnh hoặc là một lựa chọn thay thế cho sữa bò.")
                        .originalPrice(190000.0)
                        .discountPrice(190000.0)
                        .unit(Unit.CASE)  // Assuming each case contains 16 boxes
                        .stock(10)
                        .minUnitToOrder(1)
                        .thumbnailImage(null)
                        .build(),

                Product.builder()
                        .name("Táo STORY Pháp")
                        .description("Táo Story giống Pháp có hình dáng tròn đều, lớp vỏ mịn màng với sắc đỏ quyến rũ xen lẫn ánh vàng tự nhiên. Phần thịt quả trắng ngần, giòn tan vị ngọt thanh hòa quyện cùng chút chua nhẹ, tạo nên hương vị cân bằng hoàn hảo. Hương táo thơm ngát, dịu dàng, cảm giác tươi mát và thư giãn. Táo Story không chỉ phù hợp để ăn tươi mà còn là nguyên liệu lý tưởng cho các món salad, nước ép hay tráng miệng.")
                        .originalPrice(40000.0)
                        .discountPrice(40000.0)
                        .unit(Unit.KILOGRAM)
                        .stock(40)
                        .minUnitToOrder(2)
                        .thumbnailImage("https://res.cloudinary.com/dschfkj54/image/upload/v1742736196/taostory_03_qcd8g1.jpg")
                        .build(),

                Product.builder()
                        .name("Táo EVERCRISP S32")
                        .description("Táo EverCrisp Mỹ là giống táo cao cấp, kết hợp hoàn hảo giữa Fuji và Honeycrisp. Với vỏ đỏ đậm pha vàng, thịt trắng giòn mọng, vị ngọt thanh mát và hương thơm nhẹ, EverCrisp đáp ứng nhu cầu ăn tươi hoặc chế biến. Táo nổi bật với khả năng bảo quản lâu và giàu giá trị dinh dưỡng.")
                        .originalPrice(60000.0)
                        .discountPrice(60000.0)
                        .unit(Unit.KILOGRAM)
                        .stock(40)
                        .minUnitToOrder(2)
                        .thumbnailImage("https://res.cloudinary.com/dschfkj54/image/upload/v1742736196/taoever32_03_crpvz8.jpg")
                        .build(),

                Product.builder()
                        .name("Cam Ai Cập")
                        .description("Cam Ai Cập sở hữu một vị thanh ngọt đặc trưng cùng với mùi thơm nức từ vỏ quả. Nhìn từ bên ngoài, trái cam màu sắc tươi sáng, có lớp vỏ mỏng đặc trưng. Khi cắt quả ra, bạn sẽ thấy phần thịt bên trong khá dày và vị ngon ngọt hấp dẫn. Đặc biệt, loại cam này mọng nước và không hề có hạt. Thưởng thức cam Ai Cập, hưỡng vị thanh mát đậm đà sẽ thấm dần từ đầu lưỡi tới cổ họng.")
                        .originalPrice(15000.0)
                        .discountPrice(15000.0)
                        .unit(Unit.KILOGRAM)
                        .stock(15)
                        .minUnitToOrder(2)
                        .thumbnailImage("https://res.cloudinary.com/dschfkj54/image/upload/v1742736194/camaicap_01_qygdij.jpg")
                        .build(),

                Product.builder()
                        .name("Việt Quất Peru")
                        .description("Việt quất Peru là loại quả có vị ngọt thanh, thơm đặc trưng, rất giàu vitamin và chất chống oxi hóa nên còn được mệnh danh là siêu thực phẩm cho sức khỏe con người.")
                        .originalPrice(35000.0)
                        .discountPrice(35000.0)
                        .unit(Unit.CUP)
                        .stock(24)
                        .minUnitToOrder(2)
                        .thumbnailImage("https://res.cloudinary.com/dschfkj54/image/upload/v1742736196/vietquatperu_03_x8yi8q.jpg")
                        .build(),

                Product.builder()
                        .name("Nho xanh Úc")
                        .description("Nho xanh Úc là loại trái cây phổ biến, nổi tiếng với vị ngọt thanh, giòn tan và không hạt. Chất lượng của nho xanh Úc thường được đánh giá cao do quy trình trồng trọt và thu hoạch nghiêm ngặt. Chúng thường được dùng để ăn trực tiếp hoặc làm nguyên liệu cho các món tráng miệng, salad trái cây.")
                        .originalPrice(89000.0)
                        .discountPrice(89000.0)
                        .unit(Unit.KILOGRAM)
                        .stock(20)
                        .minUnitToOrder(2)
                        .thumbnailImage("https://res.cloudinary.com/dschfkj54/image/upload/v1742736194/nhoxanhuc_02_jogemo.jpg")
                        .build(),

                Product.builder()
                        .name("Quất đường Đài Loan")
                        .description("Quất đường Đài Loan, còn gọi là 'Kumquat Đài Loan', là một loại trái cây thuộc họ cam quýt, nổi tiếng với vị ngọt đặc trưng và vỏ ăn được. Loại quả này thường được trồng ở các vùng có khí hậu ấm áp và được ưa chuộng để ăn tươi, làm mứt, hoặc làm nguyên liệu trong các món tráng miệng và đồ uống. Điểm đặc biệt của quất đường Đài Loan là vỏ mỏng, ngọt hơn ruột, tạo nên một trải nghiệm hương vị độc đáo.")
                        .originalPrice(45000.0)
                        .discountPrice(45000.0)
                        .unit(Unit.PACK)
                        .stock(12)
                        .minUnitToOrder(2)
                        .thumbnailImage("https://res.cloudinary.com/dschfkj54/image/upload/v1742736194/quatduongdailoan_01_s2desw.jpg")
                        .build(),

                Product.builder()
                        .name("Lê nâu Hàn Quốc")
                        .description("Lê nâu Hàn Quốc, còn được biết đến với tên gọi lê tuyết hoặc lê Á, là một loại trái cây phổ biến tại Hàn Quốc. Chúng có vỏ màu vàng nâu, ruột trắng giòn, và vị ngọt thanh, mọng nước. Lê nâu Hàn Quốc thường được ăn tươi trực tiếp hoặc sử dụng trong các món tráng miệng, đồ uống và các món ăn khác. Chúng cũng được biết đến với một số lợi ích sức khỏe như hỗ trợ tiêu hóa và cung cấp vitamin.")
                        .originalPrice(40000.0)
                        .discountPrice(40000.0)
                        .unit(Unit.KILOGRAM)
                        .stock(30)
                        .minUnitToOrder(2)
                        .thumbnailImage("https://res.cloudinary.com/dschfkj54/image/upload/v1742736194/lenauhan_01_oc3lf1.jpg")
                        .build(),

                Product.builder()
                        .name("Xoài Phá Thái")
                        .description("Xoài Phá Thái, hay còn gọi là xoài Thái Lan, là một loại xoài nổi tiếng ở Việt Nam. Giống xoài này được ưa chuộng vì vị ngọt, thơm đặc trưng và kích thước lớn, thịt quả dày. Chúng thường được dùng để ăn tươi hoặc chế biến thành các món tráng miệng như sinh tố, kem, hoặc các món ăn vặt.")
                        .originalPrice(20000.0)
                        .discountPrice(20000.0)
                        .unit(Unit.KILOGRAM)
                        .stock(30)
                        .minUnitToOrder(5)
                        .thumbnailImage("https://res.cloudinary.com/dschfkj54/image/upload/v1742736195/xoaiphathai_01_wrzzg3.jpg")
                        .build(),

                Product.builder()
                        .name("Táo Ambrosia Mỹ size 72")
                        .description("Táo Ambrosia Mỹ joyfully hình chuông siêu sang và đẹp. Táo đỏ bóng, đẹp, cuống tươi xanh, giòn ngọt và cực thơm.")
                        .originalPrice(65000.0)
                        .discountPrice(65000.0)
                        .unit(Unit.KILOGRAM)
                        .stock(30)
                        .minUnitToOrder(2)
                        .thumbnailImage("https://res.cloudinary.com/dschfkj54/image/upload/v1742736194/taoam_03_ruvzv4.jpg")
                        .build(),

                Product.builder()
                        .name("Roi lòng xanh An Phước")
                        .description("Roi lòng xanh An Phước là một giống roi nổi tiếng, được biết đến với vị ngọt thanh mát và thịt giòn. Giống roi này thường có vỏ màu xanh, hình dáng đẹp mắt và được ưa chuộng trong thị trường trái cây.")
                        .originalPrice(30000.0)
                        .discountPrice(30000.0)
                        .unit(Unit.KILOGRAM)
                        .stock(20)
                        .minUnitToOrder(2)
                        .thumbnailImage(null)
                        .build(),

                Product.builder()
                        .name("Cam sành Vĩnh Long")
                        .description("Cam sành Vĩnh Long là một loại trái cây đặc sản nổi tiếng của tỉnh Vĩnh Long, Việt Nam. Loại cam này được yêu thích bởi vị ngọt thanh, mọng nước và hương thơm đặc trưng.")
                        .originalPrice(11000.0)
                        .discountPrice(11000.0)
                        .unit(Unit.KILOGRAM)
                        .stock(20)
                        .minUnitToOrder(2)
                        .thumbnailImage("https://res.cloudinary.com/dschfkj54/image/upload/v1742736194/lenauhan_01_oc3lf1.jpg")
                        .build(),

                Product.builder()
                        .name("Xoài bao tử")
                        .description("Xoài bao tử là xoài non, còn nhỏ, thường được dùng làm món ăn vặt. Chúng có vị chua ngọt đặc trưng và thường được chấm với muối ớt, mắm ruốc hoặc 'nước chấm thần thánh'. Xoài bao tử có thể cung cấp vitamin C và các chất xơ.")
                        .originalPrice(12000.0)
                        .discountPrice(12000.0)
                        .unit(Unit.KILOGRAM)
                        .stock(20)
                        .minUnitToOrder(2)
                        .thumbnailImage("https://res.cloudinary.com/dschfkj54/image/upload/v1742736195/xoaiphathai_01_wrzzg3.jpg")
                        .build(),

                Product.builder()
                        .name("Bưởi Bến Tre Nguyễn Hằng")
                        .description("Bưởi Bến Tre là một loại trái cây đặc sản của tỉnh Bến Tre, Việt Nam, nổi tiếng với vị ngọt thanh, mọng nước và hương thơm đặc trưng. Loại bưởi này thường được trồng ở vùng đất phù sa màu mỡ, tạo nên chất lượng vượt trội so với các loại bưởi khác.")
                        .originalPrice(27000.0)
                        .discountPrice(27000.0)
                        .unit(Unit.PIECE)
                        .stock(24)
                        .minUnitToOrder(2)
                        .thumbnailImage("https://res.cloudinary.com/dschfkj54/image/upload/v1742736194/quatduongdailoan_01_s2desw.jpg")
                        .build()
        );

        productRepository.saveAll(products);
        System.out.println("✅ Products inserted.");
    }

    private void initBanners() {
        if (bannerRepository.count() > 0) return;

        List<Banner> banners = List.of(
                Banner.builder().title("Khuyến mãi mùa hè")
                        .thumbnailImage("https://res.cloudinary.com/dschfkj54/image/upload/v1742752112/banner_blog1_a48mor.jpg").build(),

                Banner.builder().title("Trái cây nhập khẩu giảm giá")
                        .thumbnailImage("https://res.cloudinary.com/dschfkj54/image/upload/v1742752112/banner_blog1_a48mor.jpg").build(),

                Banner.builder().title("Miễn phí giao hàng")
                        .thumbnailImage("https://res.cloudinary.com/dschfkj54/image/upload/v1742752112/banner_blog1_a48mor.jpg").build()
        );

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

}
