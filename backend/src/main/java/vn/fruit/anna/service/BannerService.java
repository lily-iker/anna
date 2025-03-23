package vn.fruit.anna.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import vn.fruit.anna.dto.request.CreateBannerRequest;
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
                .build();
        return bannerRepository.save(banner);
    }

    public List<Banner> getAllBanners() {
        return bannerRepository.findAll();
    }
}
