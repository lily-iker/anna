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

import java.util.List;

@Service
@RequiredArgsConstructor
public class BlogService {

    private final BlogRepository blogRepository;

    @Transactional
    public BlogResponse createBlog(CreateBlogRequest request, MultipartFile imageFile) {
        Blog blog = Blog.builder()
                .title(request.getTitle())
//                .thumbnailImage(request.getThumbnailImage())
                .sapo(request.getSapo())
                .content(request.getContent())
                .author(request.getAuthor())
                .build();

        if (imageFile != null && !imageFile.isEmpty()) {
            // TODO: Save image to cloud and set image URL/path
            System.out.println("Updating image file: " + imageFile.getOriginalFilename());
            // example: product.setThumbnailImage("https://cdn.com/new-image.jpg");
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

        if (imageFile != null && !imageFile.isEmpty()) {
            // TODO: Upload image and set the URL
            System.out.println("Updating image file: " + imageFile.getOriginalFilename());
            // Example:
            // String uploadedUrl = imageUploaderService.upload(imageFile);
            // blog.setThumbnailImage(uploadedUrl);
        }

        blogRepository.save(blog);
        return toResponse(blog);
    }

    @Transactional
    public void deleteBlogsByIds(ListBlogsByIdsRequest request) {
        List<Long> blogIds = request.getBlogIds();

        List<Blog> blogs = blogRepository.findAllById(blogIds);

        if (!blogs.isEmpty()) {
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
        return BlogResponse.builder()
                .id(blog.getId())
                .title(blog.getTitle())
                .thumbnailImage(blog.getThumbnailImage())
                .sapo(blog.getSapo())
                .content(blog.getContent())
                .author(blog.getAuthor())
                .createdAt(blog.getCreatedAt())
                .build();
    }
}
