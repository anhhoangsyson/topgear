import { IComment } from '@/types/comment';

/**
 * Build 2-level comment structure from flat array (Facebook-style)
 * - Level 1: Top-level comments (parent_id = null)
 * - Level 2: All replies (flattened, regardless of depth)
 * @param flatComments - Flat array of comments from API
 * @returns Array of top-level comments with all replies flattened to one level
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

  // Helper function to find the root parent (top-level comment)
  const findRootParent = (commentId: string, visited = new Set<string>()): string | null => {
    if (visited.has(commentId)) {
      // Circular reference detected
      return null;
    }
    visited.add(commentId);
    
    const comment = commentMap.get(commentId);
    if (!comment) return null;
    
    // Get parent_id
    let parentId: string | null = null;
    if (comment.parent_id === null) {
      return null; // This is already a top-level comment
    } else if (typeof comment.parent_id === 'string') {
      parentId = comment.parent_id;
    } else if (typeof comment.parent_id === 'object' && comment.parent_id._id) {
      parentId = comment.parent_id._id;
    }
    
    if (!parentId) return null;
    
    // Check if parent is top-level
    const parent = commentMap.get(parentId);
    if (!parent) return null;
    
    // Check if parent has no parent (is top-level)
    let parentParentId: string | null = null;
    if (parent.parent_id === null) {
      return parentId; // Found root parent
    } else if (typeof parent.parent_id === 'string') {
      parentParentId = parent.parent_id;
    } else if (typeof parent.parent_id === 'object' && parent.parent_id._id) {
      parentParentId = parent.parent_id._id;
    }
    
    if (!parentParentId) {
      return parentId; // Parent is top-level
    }
    
    // Recursively find root parent
    return findRootParent(parentId, visited);
  };

  // Second pass: build 2-level structure
  const topLevelComments: IComment[] = [];
  
  flatComments.forEach(comment => {
    const commentWithReplies = commentMap.get(comment._id)!;
    
    // Get parent_id
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
      // Find root parent (top-level comment) and add this reply to it
      const rootParentId = findRootParent(comment._id);
      if (rootParentId) {
        const rootParent = commentMap.get(rootParentId);
        if (rootParent && rootParent.replies) {
          rootParent.replies.push(commentWithReplies);
        }
      } else {
        // Fallback: try to add to direct parent
        const parent = commentMap.get(parentId);
        if (parent && parent.replies) {
          parent.replies.push(commentWithReplies);
        } else {
          // Parent not found - treat as top-level
          if (process.env.NODE_ENV === 'development') {
            console.warn(`[buildNestedComments] Parent ${parentId} not found for comment ${comment._id}, treating as top-level`);
          }
          topLevelComments.push(commentWithReplies);
        }
      }
    }
  });

  if (process.env.NODE_ENV === 'development') {
    console.log('[buildNestedComments] Built 2-level structure:', {
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

