package org.wisdom.WD01.Service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.wisdom.WD01.Dto.Request.PostRequest;
import org.wisdom.WD01.Dto.Response.PageResponse;
import org.wisdom.WD01.Dto.Response.PostResponse;
import org.wisdom.WD01.Dto.Response.PostStatResponse;
import org.wisdom.WD01.Entity.Post;
import org.wisdom.WD01.Entity.PostRating;
import org.wisdom.WD01.Entity.PostReaction;
import org.wisdom.WD01.Entity.User;
import org.wisdom.WD01.Enum.ReactionType;
import org.wisdom.WD01.Exception.AppException;
import org.wisdom.WD01.Reponsitory.PostRatingRepository;
import org.wisdom.WD01.Reponsitory.PostReactionRepository;
import org.wisdom.WD01.Reponsitory.PostRepository;
import org.wisdom.WD01.Reponsitory.UserRepository;
import org.wisdom.WD01.Service.PostService;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PostServiceImpl implements PostService {
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final PostReactionRepository postReactionRepository;
    private final PostRatingRepository postRatingRepository;

    @Override
    @Transactional
    public PostResponse createPost(PostRequest postRequest, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException("User not found"));

        Post post = Post.builder()
                .title(postRequest.getTitle())
                .content(postRequest.getContent())
                .author(user)
                .enabled(true)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();
        post = postRepository.save(post);
        return mapToResponse(post);
    }

    @Override
    public PageResponse<PostResponse> getAllActivePost(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Post> pageResult = postRepository.findByEnabledTrueOrderByCreatedAtDesc(pageable);

        List<PostResponse> content = pageResult.getContent()
                .stream()
                .map(this::mapToResponse)
                .toList();

        PageResponse<PostResponse> response = PageResponse.<PostResponse>builder()
                .content(content)
                .page(pageResult.getNumber())
                .size(pageResult.getSize())
                .totalElements(pageResult.getTotalElements())
                .totalPages(pageResult.getTotalPages())
                .build();

        return response;
    }

    private Post findPostEntityById(Long postId) {
        return postRepository.findById(postId)
                .orElseThrow(() -> new AppException("Post not found"));
    }

    @Override
    public PostResponse getPostById(Long postId) {
        Post post = findPostEntityById(postId);

        return mapToResponse(post);
    }

    @Override
    public PostStatResponse togglePostStatus(Long postId) {
        Post post = findPostEntityById(postId);
        post.setEnabled(!post.isEnabled());
        postRepository.save(post);
        return mapToStatResponse(post);
    }

    @Override
    public PostStatResponse reactToPost(Long postId, String username, ReactionType type) {
        Post post = findPostEntityById(postId);
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException("User not found"));

        var existingReaction = postReactionRepository.findByUserIdAndPostId(user.getId(), postId);

        if (existingReaction.isPresent()) {
            PostReaction postReaction = existingReaction.get();
            if(postReaction.getType() == type){
                postReactionRepository.delete(postReaction);
                if(type == ReactionType.LIKE){
                    post.setLikeCount(post.getLikeCount() - 1);
                }else {
                    post.setLikeCount(post.getLikeCount() - 1);
                }
            }else{
                postReaction.setType(type);
                if(type == ReactionType.LIKE){
                    post.setLikeCount(post.getLikeCount() + 1);
                    post.setDislikeCount(post.getDislikeCount() - 1);
                }else{
                    post.setDislikeCount(post.getDislikeCount() + 1);
                    post.setLikeCount(post.getLikeCount() - 1);
                }
                postReactionRepository.save(postReaction);
            }
        }else{
            PostReaction newReaction = new PostReaction();
            newReaction.setPost(post);
            newReaction.setType(type);
            newReaction.setUser(user);
            postReactionRepository.save(newReaction);

            if(type == ReactionType.LIKE){
                post.setLikeCount(post.getLikeCount() + 1);
            }else {
                post.setDislikeCount(post.getDislikeCount() + 1);
            }
        }
        postRepository.save(post);
        return mapToStatResponse(post);
    }

    @Override
    public PostStatResponse ratePost(Long postId, String username, int stars) {
        Post post = findPostEntityById(postId);
        User user = userRepository.findByUsername(username).orElseThrow();

        PostRating rating = postRatingRepository.findByUserIdAndPostId(user.getId(), postId)
                .orElse(new PostRating());

        rating.setUser(user);
        rating.setPost(post);
        rating.setRating(stars);
        postRatingRepository.save(rating);

        double totalRating = (post.getRatingAvg() * post.getRatingCount()) + stars;
        post.setRatingCount(post.getRatingCount() + 1);
        post.setRatingAvg(totalRating / post.getRatingCount());

        postRepository.save(post);
        return mapToStatResponse(post);
    }

    private PostResponse mapToResponse(Post post) {
        return PostResponse.builder()
                .id(post.getId())
                .title(post.getTitle())
                .content(post.getContent())
                .authorName(post.getAuthor().getUsername())
                .likeCount(post.getLikeCount())
                .dislikeCount(post.getDislikeCount())
                .ratingAvg(post.getRatingAvg())
                .ratingCount(post.getRatingCount())
                .enabled(post.isEnabled())
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .build();
    }

    private PostStatResponse mapToStatResponse(Post post) {
        return PostStatResponse.builder()
                .id(post.getId())
                .likeCount(post.getLikeCount())
                .dislikeCount(post.getDislikeCount())
                .ratingAvg(post.getRatingAvg())
                .ratingCount(post.getRatingCount())
                .enabled(post.isEnabled())
                .build();
    }
}
