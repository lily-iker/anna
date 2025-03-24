package vn.fruit.anna.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
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

    public List<Banner> getAllBanners() {
        return bannerRepository.findAll();
    }

    public List<Banner> getAllTopBanners() {
        return bannerRepository.findByBannerType(BannerType.TOP);
    }

    public List<Banner> getAllAboutUsBanners() {
        return bannerRepository.findByBannerType(BannerType.ABOUT_US);
    }

    public List<Banner> getAllContactBanners() {
        return bannerRepository.findByBannerType(BannerType.CONTACT);
    }
}
