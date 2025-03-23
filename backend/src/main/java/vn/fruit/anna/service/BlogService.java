package vn.fruit.anna.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.fruit.anna.dto.request.CreateBlogRequest;
import vn.fruit.anna.model.Blog;
import vn.fruit.anna.repository.BlogRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BlogService {

    private final BlogRepository blogRepository;

    @Transactional
    public Blog createBlog(CreateBlogRequest request) {
        Blog blog = Blog.builder()
                .title(request.getTitle())
                .thumbnailImage(request.getThumbnailImage())
                .sapo(request.getSapo())
                .content(request.getContent())
                .author(request.getAuthor())
                .build();
        return blogRepository.save(blog);
    }

    public List<Blog> getAllBlogs() {
        return blogRepository.findAll();
    }
}
