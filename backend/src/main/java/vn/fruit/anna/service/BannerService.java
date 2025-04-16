package vn.fruit.anna.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import vn.fruit.anna.dto.request.CreateBannerRequest;
import vn.fruit.anna.enums.BannerType;
import vn.fruit.anna.model.Banner;
import vn.fruit.anna.repository.BannerRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BannerService {

    private final BannerRepository bannerRepository;

    public Banner createBanner(CreateBannerRequest request) {
        Banner banner = Banner.builder()
                .title(request.getTitle())
                .thumbnailImage(request.getThumbnailImage())
                .bannerType(request.getBannerType())
                .build();
        return bannerRepository.save(banner);
    }

    @Transactional
    public Banner updateBannerImage(Integer bannerId, MultipartFile imageFile) {
        Banner banner = bannerRepository.findById(bannerId)
                .orElseThrow(() -> new RuntimeException("Banner not found with ID: " + bannerId));

        if (imageFile != null && !imageFile.isEmpty()) {
            // 🔁 TODO: Replace this with your actual cloud/image saving logic
//            String imageUrl = uploadImage(imageFile);
//            banner.setThumbnailImage(imageUrl);
        }

        return bannerRepository.save(banner);
    }

    public List<Banner> getAllBanners() {
        return bannerRepository.findAll();
    }

    public List<Banner> getAllTopBanners() {
        return bannerRepository.findByBannerType(BannerType.TOP);
    }

    public List<Banner> getAllAboutUsBanners() {
        return bannerRepository.findByBannerType(BannerType.ABOUT_US);
    }
}
