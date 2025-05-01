package vn.fruit.anna.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import vn.fruit.anna.dto.request.CreateBlogRequest;
import vn.fruit.anna.dto.request.ListBlogsByIdsRequest;
import vn.fruit.anna.dto.response.BlogResponse;
import vn.fruit.anna.exception.ResourceNotFoundException;
import vn.fruit.anna.model.Blog;
import vn.fruit.anna.repository.BlogRepository;

import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BlogService {

    private final BlogRepository blogRepository;
    private final CloudinaryService cloudinaryService;

    @Transactional
    public BlogResponse createBlog(CreateBlogRequest request, MultipartFile imageFile) {
        Blog blog = Blog.builder()
                .title(request.getTitle())
                .sapo(request.getSapo())
                .content(request.getContent())
                .author(request.getAuthor())
                .build();

        if (imageFile != null && !imageFile.isEmpty()) {
            try {
                String uploadedUrl = cloudinaryService.uploadImage(imageFile);
                blog.setThumbnailImage(uploadedUrl);
            } catch (IOException e) {
                throw new RuntimeException("Failed to upload image for blog", e);
            }
        }

        blogRepository.save(blog);
        return toResponse(blog);
    }

    @Transactional
    public BlogResponse updateBlog(Long id, CreateBlogRequest request, MultipartFile imageFile) {
        Blog blog = blogRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Blog not found with ID: " + id));

        blog.setTitle(request.getTitle());
        blog.setSapo(request.getSapo());
        blog.setContent(request.getContent());
        blog.setAuthor(request.getAuthor());

        String oldUrl = blog.getThumbnailImage();

        if (imageFile != null && !imageFile.isEmpty()) {
            try {
                String uploadedUrl = cloudinaryService.uploadImage(imageFile);
                blog.setThumbnailImage(uploadedUrl);

                if (oldUrl != null && !oldUrl.isBlank()) {
                    String publicId = cloudinaryService.getPublicIdFromUrl(oldUrl);
                    cloudinaryService.deleteAsset(publicId);
                }
            } catch (IOException e) {
                throw new RuntimeException("Failed to upload new image for blog", e);
            }
        }

        blogRepository.save(blog);
        return toResponse(blog);
    }


    @Transactional
    public void deleteBlogsByIds(ListBlogsByIdsRequest request) {
        List<Long> blogIds = request.getBlogIds();
        List<Blog> blogs = blogRepository.findAllById(blogIds);

        if (!blogs.isEmpty()) {
            for (Blog blog : blogs) {
                String oldUrl = blog.getThumbnailImage();

                if (oldUrl != null && !oldUrl.isBlank()) {
                    String publicId = cloudinaryService.getPublicIdFromUrl(oldUrl);
                    try {
                        cloudinaryService.deleteAsset(publicId);
                    } catch (IOException e) {
                        throw new RuntimeException("Failed to delete image for blog", e);
                    }
                }
            }

            blogRepository.deleteAll(blogs);
        }
    }


    public BlogResponse getBlogById(Long id) {
        Blog blog = blogRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Blog not found!"));
        return toResponse(blog);
    }

    public Page<BlogResponse> searchBlogs(String title, int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size);
        return blogRepository.findByTitleContainingIgnoreCase(title, pageRequest)
                .map(this::toResponse);
    }

    private BlogResponse toResponse(Blog blog) {
        Long nextBlogId = blogRepository.findNextBlogId(blog.getCreatedAt()).orElse(null);
        Long previousBlogId = blogRepository.findPreviousBlogId(blog.getCreatedAt()).orElse(null);

        return BlogResponse.builder()
                .id(blog.getId())
                .title(blog.getTitle())
                .sapo(blog.getSapo())
                .thumbnailImage(blog.getThumbnailImage())
                .content(blog.getContent())
                .author(blog.getAuthor())
                .createdAt(blog.getCreatedAt())
                .nextBlogId(nextBlogId)
                .previousBlogId(previousBlogId)
                .build();
    }
}
