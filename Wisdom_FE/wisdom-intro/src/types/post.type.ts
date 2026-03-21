
export interface Post {
    id: number;
    title: string;
    content: string;
    authorName: string;
    categoryName: string;
    timestamp: string;
    
    likeCount: number;
    dislikeCount: number;
    ratingAvg: number;
    ratingCount: number;
    enabled: boolean;
    commentEnabled: boolean;
    reactionEnabled: boolean;
    
    userLiked?: boolean;
    userDisliked?: boolean;
    userRating?: number;
    
    commentCount: number;
    comments?: Comment[];
    createdAt: string;
}

export interface Comment {
    id: number;
    content: string;
    authorName: string;
    timestamp: string;
    likeCount: number;
    dislikeCount: number;
    replyCount: number;
    userLiked: boolean;
    userDisliked: boolean;
    parentId?: number;

}