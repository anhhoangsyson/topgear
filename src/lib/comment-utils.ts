import { IComment } from '@/types/comment';

/**
 * Build nested comment structure from flat array
 * @param flatComments - Flat array of comments from API
 * @returns Array of top-level comments with nested replies
 */
export function buildNestedComments(flatComments: IComment[]): IComment[] {
  if (flatComments.length === 0) return [];

  // Create a map for quick lookup
  const commentMap = new Map<string, IComment>();
  
  // First pass: convert all comments to have replies array
  flatComments.forEach(comment => {
    commentMap.set(comment._id, {
      ...comment,
      replies: [],
    });
  });

  // Second pass: build nested structure
  const topLevelComments: IComment[] = [];
  
  flatComments.forEach(comment => {
    const commentWithReplies = commentMap.get(comment._id)!;
    
    // Get parent_id - can be null, string, or object
    let parentId: string | null = null;
    if (comment.parent_id === null) {
      parentId = null;
    } else if (typeof comment.parent_id === 'string') {
      parentId = comment.parent_id;
    } else if (typeof comment.parent_id === 'object' && comment.parent_id._id) {
      parentId = comment.parent_id._id;
    }
    
    // If no parent, it's a top-level comment
    if (!parentId) {
      topLevelComments.push(commentWithReplies);
    } else {
      // Find parent and add this comment as a reply
      const parent = commentMap.get(parentId);
      if (parent && parent.replies) {
        parent.replies.push(commentWithReplies);
      } else {
        // Parent not found in current batch - might be a data issue
        // In this case, treat as top-level comment
        if (process.env.NODE_ENV === 'development') {
          console.warn(`[buildNestedComments] Parent ${parentId} not found for comment ${comment._id}, treating as top-level`);
        }
        topLevelComments.push(commentWithReplies);
      }
    }
  });

  if (process.env.NODE_ENV === 'development') {
    console.log('[buildNestedComments] Built nested structure:', {
      flatCount: flatComments.length,
      topLevelCount: topLevelComments.length,
      topLevelComments: topLevelComments.map(c => ({
        id: c._id.slice(-8),
        name: c.name,
        repliesCount: c.replies?.length || 0,
      })),
    });
  }

  return topLevelComments;
}

