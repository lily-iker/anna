package vn.fruit.anna.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import vn.fruit.anna.dto.request.CreateBannerRequest;
import vn.fruit.anna.dto.response.ApiResponse;
import vn.fruit.anna.service.BannerService;

@RestController
@RequestMapping("/api/banner")
@RequiredArgsConstructor
public class BannerController {

    private final BannerService bannerService;

    @PostMapping("/create")
    public ResponseEntity<?> createBanner(@Valid @RequestBody CreateBannerRequest request) {
        return ResponseEntity.ok(
                new ApiResponse<>(201,
                        "Create banner success",
                        bannerService.createBanner(request))
        );
    }

    @PutMapping(value = "/{bannerId}/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateBannerImage(
            @PathVariable Integer bannerId,
            @RequestPart("imageFile") MultipartFile imageFile
    ) {
        return ResponseEntity.ok(
                new ApiResponse<>(200,
                        "Banner image updated successfully",
                        bannerService.updateBannerImage(bannerId, imageFile))
        );
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllBanners() {
        return ResponseEntity.ok(
                new ApiResponse<>(200,
                        "Get all banners success",
                        bannerService.getAllBanners())
        );
    }

    @GetMapping("/top")
    public ResponseEntity<?> getTopBanners() {
        return ResponseEntity.ok(
                new ApiResponse<>(200,
                        "Get TOP banners success",
                        bannerService.getAllTopBanners())
        );
    }

    @GetMapping("/about-us")
    public ResponseEntity<?> getAboutUsBanners() {
        return ResponseEntity.ok(
                new ApiResponse<>(200,
                        "Get ABOUT US banners success",
                        bannerService.getAllAboutUsBanners())
        );
    }
}
