export interface IComment {
  _id: string;
  name: string;
  content: string;
  blog_id: string | {
    _id: string;
    title: string;
    slug: string;
  };
  user_id: string | {
    _id: string;
    fullname: string;
    email: string;
    avatar?: string;
  };
  parent_id: string | { _id: string } | null;
  images?: string[];
  isApproved: boolean;
  replies?: IComment[];
  createdAt: string;
  updatedAt?: string;
}

export interface ICommentListResponse {
  comments: IComment[];
  total: number;
  page: number;
  totalPages: number;
}

export interface ICreateCommentRequest {
  name: string;
  content: string;
  blog_id: string;
  parent_id?: string | null;
  images?: string[];
}

export interface IUpdateCommentRequest {
  name?: string;
  content?: string;
  images?: string[];
}

export interface ICommentStats {
  total: number;
  approved: number;
  pending: number;
  byBlog?: Array<{
    blogId: string;
    count: number;
  }>;
}

