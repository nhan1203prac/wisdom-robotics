package org.wisdom.WD01.Service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.wisdom.WD01.Dto.Response.CommentResponse;
import org.wisdom.WD01.Dto.Response.CommentStatResponse;
import org.wisdom.WD01.Dto.Response.PageResponse;
import org.wisdom.WD01.Entity.*;
import org.wisdom.WD01.Enum.ReactionType;
import org.wisdom.WD01.Exception.AppException;
import org.wisdom.WD01.Reponsitory.*;
import org.wisdom.WD01.Service.CommentService;
import org.wisdom.WD01.Util.SecurityUtil;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {
    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final CommentReactionRepository commentReactionRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Override
    @Transactional
    public CommentResponse addComment(Long postId, Long parentId, String content, String username) {
        Post post = postRepository.findById(postId).orElseThrow(() -> new AppException("Post not found"));

        if (!post.isEnabled()) throw new AppException("Comment is disabled");

        User user = userRepository.findByUsername(username).orElseThrow();

        // Create new comment
        Comment comment = new Comment();
        comment.setContent(content);
        comment.setPost(post);
        comment.setUser(user);
        comment.setEnabled(true);
        comment.setCreatedAt(Instant.now());

        // Set parent if this is a reply
        if (parentId != null) {
            Comment parent = commentRepository.findById(parentId).orElseThrow(() -> new AppException("Parent not found"));
            comment.setParent(parent);
        }

        CommentResponse response = mapToResponse(commentRepository.save(comment));

        // Real-time update via WebSocket
        messagingTemplate.convertAndSend("/topic/posts/" + postId, response);

        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<CommentResponse> getRootComments(Long postId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Comment> commentPage = commentRepository.findRootComments(postId, pageable);

        PageResponse<CommentResponse> response = buildPageResponse(commentPage);

        // Check if current user liked/disliked
        injectUserStatus(response.getContent(), postId);

        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<CommentResponse> getReplies(Long parentId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Comment> commentPage = commentRepository.findReplies(parentId, pageable);

        PageResponse<CommentResponse> response = buildPageResponse(commentPage);

        // Get postId from first item to check reaction status
        if (!commentPage.isEmpty()) {
            Long postId = commentPage.getContent().get(0).getPost().getId();
            injectUserStatus(response.getContent(), postId);
        }

        return response;
    }

    @Override
    @Transactional
    public CommentStatResponse reactToComment(Long commentId, String username, ReactionType type) {
        Comment comment = commentRepository.findById(commentId).orElseThrow(() -> new AppException("Comment not found"));
        User user = userRepository.findByUsername(username).orElseThrow();

        var existingReaction = commentReactionRepository.findByUserIdAndCommentId(user.getId(), commentId);

        if (existingReaction.isPresent()) {
            CommentReaction reaction = existingReaction.get();

            if (reaction.getType() == type) {
                // Remove reaction if clicking the same type
                commentReactionRepository.delete(reaction);
                updateCounters(comment, type, -1);
            } else {
                // Switch between Like and Dislike
                ReactionType oldType = reaction.getType();
                reaction.setType(type);
                commentReactionRepository.save(reaction);

                updateCounters(comment, oldType, -1);
                updateCounters(comment, type, 1);
            }
        } else {
            // Add new reaction
            CommentReaction newReaction = CommentReaction.builder()
                    .comment(comment).user(user).type(type).createdAt(Instant.now()).build();
            commentReactionRepository.save(newReaction);
            updateCounters(comment, type, 1);
        }

        Comment savedComment = commentRepository.save(comment);

        return CommentStatResponse.builder()
                .dislikeCount(savedComment.getDislikeCount())
                .id(savedComment.getId())
                .likeCount(savedComment.getLikeCount())
                .build();
    }

    // Mark current user's reaction status on the comment list
    private void injectUserStatus(List<CommentResponse> content, Long postId) {
        String username = SecurityUtil.getAuthenticatedUsername();
        if (username == null || username.equals("anonymousUser") || content.isEmpty()) return;

        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) return;

        // Fetch all user's reactions in this post at once
        List<CommentReaction> userReactions = commentReactionRepository.findAllByUserIdAndPostId(user.getId(), postId);

        // Map status to DTOs
        for (CommentResponse dto : content) {
            userReactions.stream()
                    .filter(r -> r.getComment().getId().equals(dto.getId()))
                    .findFirst()
                    .ifPresent(r -> {
                        dto.setUserLiked(r.getType() == ReactionType.LIKE);
                        dto.setUserDisliked(r.getType() == ReactionType.DISLIKE);
                    });
        }
    }

    // Update like/dislike counts in Comment table
    private void updateCounters(Comment comment, ReactionType type, int delta) {
        if (type == ReactionType.LIKE) {
            comment.setLikeCount(comment.getLikeCount() + delta);
        } else {
            comment.setDislikeCount(comment.getDislikeCount() + delta);
        }
    }

    // Convert Page to PageResponse DTO
    private PageResponse<CommentResponse> buildPageResponse(Page<Comment> commentPage) {
        List<CommentResponse> dtoList = commentPage.getContent().stream()
                .map(this::mapToResponse).toList();

        return PageResponse.<CommentResponse>builder()
                .content(dtoList)
                .page(commentPage.getNumber())
                .size(commentPage.getSize())
                .totalElements(commentPage.getTotalElements())
                .totalPages(commentPage.getTotalPages())
                .build();
    }

    // Map Entity to DTO for client
    private CommentResponse mapToResponse(Comment comment) {
        return CommentResponse.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .authorName(comment.getUser().getUsername())
                .likeCount(comment.getLikeCount())
                .dislikeCount(comment.getDislikeCount())
                .replyCount(comment.getReplies() != null ? comment.getReplies().size() : 0)
                .createdAt(comment.getCreatedAt())
                .parentId(comment.getParent() != null ? comment.getParent().getId() : null)
                .build();
    }
}