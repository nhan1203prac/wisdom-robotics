package org.wisdom.WD01.Service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.wisdom.WD01.Dto.Response.CommentResponse;
import org.wisdom.WD01.Dto.Response.PageResponse;
import org.wisdom.WD01.Entity.*;
import org.wisdom.WD01.Enum.ReactionType;
import org.wisdom.WD01.Exception.AppException;
import org.wisdom.WD01.Reponsitory.*;
import org.wisdom.WD01.Service.CommentService;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {
    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final CommentReactionRepository commentReactionRepository;

    @Override
    @Transactional
    public CommentResponse addComment(Long postId, Long parentId, String content, String username) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new AppException("Post not found"));

        if (!post.isEnabled()) {
            throw new AppException("Comment is disabled");
        }

        User user = userRepository.findByUsername(username).orElseThrow();

        Comment comment = new Comment();
        comment.setContent(content);
        comment.setPost(post);
        comment.setUser(user);
        comment.setEnabled(true);
        comment.setCreatedAt(Instant.now());

        if (parentId != null) {
            Comment parent = commentRepository.findById(parentId)
                    .orElseThrow(() -> new AppException("Comment parent not found"));
            comment.setParent(parent);
        }

        return mapToResponse(commentRepository.save(comment));
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<CommentResponse> getRootComments(Long postId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Comment> commentPage = commentRepository.findRootComments(postId, pageable);
        return buildPageResponse(commentPage);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<CommentResponse> getReplies(Long parentId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Comment> commentPage = commentRepository.findReplies(parentId, pageable);
        return buildPageResponse(commentPage);
    }

    @Override
    @Transactional
    public void reactToComment(Long commentId, String username, ReactionType type) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new AppException("Comment not found"));
        User user = userRepository.findByUsername(username).orElseThrow();

        var existingReaction = commentReactionRepository.findByUserIdAndCommentId(user.getId(), commentId);

        if (existingReaction.isPresent()) {
            CommentReaction reaction = existingReaction.get();
            if (reaction.getType() == type) {
                commentReactionRepository.delete(reaction);
                updateCounters(comment, type, -1);
            } else {
                ReactionType oldType = reaction.getType();
                reaction.setType(type);
                commentReactionRepository.save(reaction);
                updateCounters(comment, oldType, -1);
                updateCounters(comment, type, 1);
            }
        } else {
            CommentReaction newReaction = CommentReaction.builder()
                    .comment(comment).user(user).type(type).createdAt(Instant.now()).build();
            commentReactionRepository.save(newReaction);
            updateCounters(comment, type, 1);
        }
        commentRepository.save(comment);
    }

    private void updateCounters(Comment comment, ReactionType type, int delta) {
        if (type == ReactionType.LIKE) comment.setLikeCount(comment.getLikeCount() + delta);
        else comment.setDislikeCount(comment.getDislikeCount() + delta);
    }

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

    private CommentResponse mapToResponse(Comment comment) {
        return CommentResponse.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .authorName(comment.getUser().getUsername())
                .likeCount(comment.getLikeCount())
                .dislikeCount(comment.getDislikeCount())
                .createdAt(comment.getCreatedAt())
                .parentId(comment.getParent() != null ? comment.getParent().getId() : null)
                .build();
    }
}