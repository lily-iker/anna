package vn.fruit.anna.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
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

    @GetMapping("/all")
    public ResponseEntity<?> getAllBanners() {
        return ResponseEntity.ok(
                new ApiResponse<>(200,
                        "Get all banners success",
                        bannerService.getAllBanners())
        );
    }
}
