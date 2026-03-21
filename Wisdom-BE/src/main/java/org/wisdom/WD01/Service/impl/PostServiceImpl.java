package org.wisdom.WD01.Service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.wisdom.WD01.Dto.Request.PostRequest;
import org.wisdom.WD01.Dto.Response.PageResponse;
import org.wisdom.WD01.Dto.Response.PostResponse;
import org.wisdom.WD01.Dto.Response.PostStatResponse;
import org.wisdom.WD01.Entity.*;
import org.wisdom.WD01.Enum.ReactionType;
import org.wisdom.WD01.Exception.AppException;
import org.wisdom.WD01.Reponsitory.*;
import org.wisdom.WD01.Service.PostService;
import org.wisdom.WD01.Util.SecurityUtil;
import org.wisdom.WD01.Util.Validation;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PostServiceImpl implements PostService {
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final PostReactionRepository postReactionRepository;
    private final PostRatingRepository postRatingRepository;
    private final CategoryRepository categoryRepository;
    private final Validation validation;

    //Creates a new post for a specific user.
    @Override
    @Transactional
    public PostResponse createPost(PostRequest postRequest, String username) {
        // Validate if the category exists before proceeding
        validation.validatePostCategory(postRequest.getCategoryId());

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException("User not found"));

        // Get category
        PostCategory category = categoryRepository.getReferenceById(postRequest.getCategoryId());

        // Build the Post entity with default settings (enabled, comment/reaction enabled)
        Post post = Post.builder()
                .title(postRequest.getTitle())
                .content(postRequest.getContent())
                .category(category)
                .author(user)
                .enabled(true)
                .commentEnabled(true)
                .reactionEnabled(true)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        post = postRepository.save(post);
        return mapToResponse(post);
    }

    //Updates an existing post if the user is the original author.
    @Transactional
    @Override
    public PostResponse updatePost(Long postId, PostRequest postRequest, String username) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new AppException("Post not found"));

        // Security check: Only the author can edit
        if (!post.getAuthor().getUsername().equals(username)) {
            throw new AppException("You don't have permission to edit this post");
        }

        post.setTitle(postRequest.getTitle());
        post.setContent(postRequest.getContent());
        post.setUpdatedAt(Instant.now());

        post = postRepository.save(post);
        return mapToResponse(post);
    }

    //Deletes a post after verifying ownership.
    @Override
    @Transactional
    public void deletePost(Long postId) {
        // Check and get authentication
        Authentication auth = SecurityUtil.getAuthentication();
        // Get username
        String username = auth.getName();

        // Get post by id
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new AppException("Post not found"));


        boolean isOwner = post.getAuthor().getUsername().equals(username);
        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a->a.getAuthority().equals("ROLE_ADMIN"));
        // Only owner and admin can delete post
        if (!isOwner && !isAdmin) {
            throw new AppException("You don't have permission to delete this post");
        }

        postRepository.delete(post);
    }

    //Retrieves a paginated list of active posts, optionally filtered by category.
    @Override
    public PageResponse<PostResponse> getAllActivePost(Long categoryId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Post> pageResult;

        // Filter by category if ID is provided, otherwise fetch all enabled posts
        if (categoryId != null) {
            pageResult = postRepository.findByEnabledTrueAndCategoryIdOrderByCreatedAtDesc(categoryId, pageable);
        } else {
            pageResult = postRepository.findByEnabledTrueOrderByCreatedAtDesc(pageable);
        }

        List<PostResponse> content = pageResult.getContent()
                .stream()
                .map(this::mapToResponse)
                .toList();

        return PageResponse.<PostResponse>builder()
                .content(content)
                .page(pageResult.getNumber())
                .size(pageResult.getSize())
                .totalElements(pageResult.getTotalElements())
                .totalPages(pageResult.getTotalPages())
                .build();
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

    //Toggles post visibility, commenting, or reactions.

    @Override
    @Transactional
    public PostStatResponse toggleFeature(Long postId, String feature) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new AppException("Post not found"));

        // Ensure current user is the owner
        Authentication auth = SecurityUtil.getAuthentication();
        String currentUsername = auth.getName();
        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        boolean isOwner = post.getAuthor().getUsername().equals(currentUsername);
        if (!isAdmin && !isOwner) {
            throw new AppException("You don't have permission to toggle this feature");
        }

        // Toggle boolean states based on feature string
        switch (feature.toUpperCase()) {
            case "POST" -> post.setEnabled(!post.isEnabled());
            case "COMMENT" -> post.setCommentEnabled(!post.isCommentEnabled());
            case "REACT" -> post.setReactionEnabled(!post.isReactionEnabled());
            default -> throw new AppException("Invalid feature type");
        }

        post = postRepository.save(post);
        return mapToStatResponse(post);
    }

    // Handles Like/Dislike logic. Supports adding, removing, and switching reactions.

    @Override
    public PostStatResponse reactToPost(Long postId, String username, ReactionType type) {
        Post post = findPostEntityById(postId);
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException("User not found"));

        var existingReaction = postReactionRepository.findByUserIdAndPostId(user.getId(), postId);

        if (existingReaction.isPresent()) {
            PostReaction postReaction = existingReaction.get();

            if(postReaction.getType() == type){
                // Case 1: Same reaction clicked again -> REMOVE reaction
                postReactionRepository.delete(postReaction);
                if(type == ReactionType.LIKE){
                    post.setLikeCount(post.getLikeCount() - 1);
                } else {
                    post.setDislikeCount(post.getDislikeCount() - 1);
                }
            } else {
                // Case 2: Different reaction clicked -> SWITCH reaction
                postReaction.setType(type);
                if(type == ReactionType.LIKE){
                    post.setLikeCount(post.getLikeCount() + 1);
                    post.setDislikeCount(post.getDislikeCount() - 1);
                } else {
                    post.setDislikeCount(post.getDislikeCount() + 1);
                    post.setLikeCount(post.getLikeCount() - 1);
                }
                postReactionRepository.save(postReaction);
            }
        } else {
            // Case 3: No existing reaction -> ADD new reaction
            PostReaction newReaction = new PostReaction();
            newReaction.setPost(post);
            newReaction.setType(type);
            newReaction.setUser(user);
            postReactionRepository.save(newReaction);

            if(type == ReactionType.LIKE){
                post.setLikeCount(post.getLikeCount() + 1);
            } else {
                post.setDislikeCount(post.getDislikeCount() + 1);
            }
        }
        postRepository.save(post);
        return mapToStatResponse(post);
    }

    // Handles star ratings and recalculates the average rating for the post.
    @Override
    @Transactional
    public PostStatResponse ratePost(Long postId, String username, int stars) {
        Post post = findPostEntityById(postId);
        User user = userRepository.findByUsername(username).orElseThrow();

        Optional<PostRating> existingRatingOpt = postRatingRepository.findByUserIdAndPostId(user.getId(), postId);

        double currentAvg = post.getRatingAvg();
        int currentCount = post.getRatingCount();

        if (existingRatingOpt.isPresent()) {
            // Case 1: Update existing rating
            PostRating rating = existingRatingOpt.get();
            int oldStars = rating.getRating();

            // Formula: ((Avg * Count) - oldVal + newVal) / Count
            double newAvg = ((currentAvg * currentCount) - oldStars + stars) / currentCount;

            rating.setRating(stars);
            postRatingRepository.save(rating);

            post.setRatingAvg(newAvg);
        } else {
            // Case 2: Add new rating
            PostRating newRating = new PostRating();
            newRating.setUser(user);
            newRating.setPost(post);
            newRating.setRating(stars);
            postRatingRepository.save(newRating);

            int newCount = currentCount + 1;
            // Formula: ((Avg * Count) + newVal) / (Count + 1)
            double newAvg = ((currentAvg * currentCount) + stars) / newCount;

            post.setRatingCount(newCount);
            post.setRatingAvg(newAvg);
        }

        postRepository.save(post);
        return mapToStatResponse(post);
    }

    // Maps Post entity to a detailed PostResponse DTO.
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
                .commentCount(post.getComments() != null ? post.getComments().size() : 0)
                .enabled(post.isEnabled())
                .commentEnabled(post.isCommentEnabled())
                .reactionEnabled(post.isReactionEnabled())
                .categoryId(post.getCategory() != null ? post.getCategory().getId() : null)
                .categoryName(post.getCategory() != null ? post.getCategory().getName() : "Uncategorized")
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .build();
    }

    // Maps Post entity to a minimal statistical response DTO.
    private PostStatResponse mapToStatResponse(Post post) {
        return PostStatResponse.builder()
                .id(post.getId())
                .likeCount(post.getLikeCount())
                .dislikeCount(post.getDislikeCount())
                .ratingAvg(post.getRatingAvg())
                .ratingCount(post.getRatingCount())
                .enabled(post.isEnabled())
                .commentEnabled(post.isCommentEnabled())
                .reactionEnabled(post.isReactionEnabled())
                .build();
    }
}