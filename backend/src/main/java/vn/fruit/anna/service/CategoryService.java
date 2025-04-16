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

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepository categoryRepository;

    @Transactional
    public Category createCategory(CreateCategoryRequest request, MultipartFile imageFile) {
        Category category = Category.builder()
                .name(request.getName())
                .build();

        if (imageFile != null && !imageFile.isEmpty()) {
            // TODO: Upload image to cloud or local storage and get the URL
            System.out.println("Saving category image: " + imageFile.getOriginalFilename());
//            String imageUrl = imageStorageService.upload(imageFile);
//            category.setThumbnailImage(imageUrl);
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

//        String imageUrl = imageStorageService.upload(imageFile);
//        category.setThumbnailImage(imageUrl);

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

            System.out.println("image file: " + imageFile.getOriginalFilename());

            if (imageFile != null && !imageFile.isEmpty()) {
//                String imageUrl = imageStorageService.upload(imageFile);
//                category.setThumbnailImage(imageUrl);
            }

            updatedCategories.add(category);
        }

        return categoryRepository.saveAll(updatedCategories);
    }

    public List<Category> getAllCategory() {
        return categoryRepository.findAll();
    }
}
