package vn.fruit.anna.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import vn.fruit.anna.dto.request.CreateCategoryRequest;
import vn.fruit.anna.dto.request.UpdateCategoryImageRequest;
import vn.fruit.anna.exception.ResourceNotFoundException;
import vn.fruit.anna.model.Category;
import vn.fruit.anna.repository.CategoryRepository;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepository categoryRepository;
    private final CloudinaryService cloudinaryService;

    @Transactional
    public Category createCategory(CreateCategoryRequest request, MultipartFile imageFile) {
        Category category = Category.builder()
                .name(request.getName())
                .build();

        if (imageFile != null && !imageFile.isEmpty()) {
            try {
                String imageUrl = cloudinaryService.uploadImage(imageFile);
                category.setThumbnailImage(imageUrl);
            } catch (IOException e) {
                throw new RuntimeException("Failed to upload category image", e);
            }
        }

        return categoryRepository.save(category);
    }

    @Transactional
    public Category updateCategoryImage(Integer categoryId, MultipartFile imageFile) {
        if (imageFile == null || imageFile.isEmpty()) {
            throw new IllegalArgumentException("No image file uploaded");
        }

        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + categoryId));

        String oldUrl = category.getThumbnailImage();

        try {
            String newImageUrl = cloudinaryService.uploadImage(imageFile);
            category.setThumbnailImage(newImageUrl);

            if (oldUrl != null && !oldUrl.isBlank()) {
                String publicId = cloudinaryService.getPublicIdFromUrl(oldUrl);
                cloudinaryService.deleteAsset(publicId);
            }

        } catch (IOException e) {
            throw new RuntimeException("Failed to upload new category image", e);
        }

        return categoryRepository.save(category);
    }


    @Transactional
    public List<Category> updateMultipleCategoryImages(List<UpdateCategoryImageRequest> requests,
                                                       List<MultipartFile> imageFiles) {
        List<Category> updatedCategories = new ArrayList<>();

        for (int i = 0; i < requests.size(); i++) {
            Integer categoryId = requests.get(i).getCategoryId();
            MultipartFile imageFile = imageFiles.get(i);

            Category category = categoryRepository.findById(categoryId)
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + categoryId));

            String oldUrl = category.getThumbnailImage();

            if (imageFile != null && !imageFile.isEmpty()) {
                try {
                    String imageUrl = cloudinaryService.uploadImage(imageFile);
                    category.setThumbnailImage(imageUrl);

                    if (oldUrl != null && !oldUrl.isBlank()) {
                        String publicId = cloudinaryService.getPublicIdFromUrl(oldUrl);
                        cloudinaryService.deleteAsset(publicId);
                    }

                } catch (IOException e) {
                    throw new IllegalArgumentException("Error uploading image to Cloudinary", e);
                }
            }

            updatedCategories.add(category);
        }

        return categoryRepository.saveAll(updatedCategories);
    }

    public List<Category> getAllCategory() {
        return categoryRepository.findAll();
    }
}
