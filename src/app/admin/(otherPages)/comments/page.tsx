'use client';

import React, { useState, useEffect } from 'react';
import { DataTable } from '@/components/common/data-table';
import { commentColumns } from './comment-columns';
import { IComment } from '@/types/comment';
import { getAllCommentsAdmin, approveCommentAdmin, rejectCommentAdmin, getCommentStats } from '@/services/comment-api';
import { toast } from '@/hooks/use-toast';
import { Input } from '@/components/atoms/ui/input';
import { Button } from '@/components/atoms/ui/Button';
import { LoaderCircle, Search, Filter, CheckCircle, XCircle, MessageSquare } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/atoms/ui/select';
import Panigation from '@/components/common/Panigation';
import BlogCommentsModal from './BlogCommentsModal';

export default function CommentsPage() {
  const [comments, setComments] = useState<IComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<{ total: number; approved: number; pending: number } | null>(null);
  
  // Modal state
  const [showBlogModal, setShowBlogModal] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<{
    blogId: string;
    blogTitle: string;
    blogSlug: string;
    highlightedCommentId?: string;
  } | null>(null);
  
  // Filters
  const [filters, setFilters] = useState({
    search: '',
    isApproved: undefined as boolean | undefined,
    page: 1,
    limit: 20,
  });
  
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  });

  const fetchComments = async () => {
    try {
      setLoading(true);
      const data = await getAllCommentsAdmin({
        search: filters.search || undefined,
        isApproved: filters.isApproved,
        page: filters.page,
        limit: filters.limit,
      });
      
      setComments(data.comments);
      setPagination({
        page: data.page,
        totalPages: data.totalPages,
        total: data.total,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Không thể tải danh sách bình luận';
      toast({
        title: 'Lỗi',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const statsData = await getCommentStats();
      setStats({
        total: statsData.total,
        approved: statsData.approved,
        pending: statsData.pending,
      });
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error fetching stats:', error);
      }
    }
  };

  useEffect(() => {
    fetchComments();
  }, [filters.page, filters.isApproved]);

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    // Debounce search
    const timer = setTimeout(() => {
      if (filters.page === 1) {
        fetchComments();
      } else {
        setFilters(prev => ({ ...prev, page: 1 }));
      }
    }, 500);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.search]);

  const handleApprove = async (commentId: string) => {
    try {
      await approveCommentAdmin(commentId);
      toast({
        title: 'Thành công',
        description: 'Đã duyệt bình luận',
      });
      fetchComments();
      fetchStats();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Không thể duyệt bình luận';
      toast({
        title: 'Lỗi',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  const handleReject = async (commentId: string) => {
    try {
      await rejectCommentAdmin(commentId);
      toast({
        title: 'Thành công',
        description: 'Đã từ chối bình luận',
      });
      fetchComments();
      fetchStats();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Không thể từ chối bình luận';
      toast({
        title: 'Lỗi',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleFilterChange = (key: string, value: string | boolean | undefined) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === 'all' ? undefined : value,
      page: 1, // Reset to page 1 when filter changes
    }));
  };

  const handleBlogClick = (blogId: string, blogTitle: string, blogSlug: string, commentId: string) => {
    setSelectedBlog({
      blogId,
      blogTitle,
      blogSlug,
      highlightedCommentId: commentId,
    });
    setShowBlogModal(true);
  };

  return (
    <div className="container mx-auto py-6 sm:py-10 px-4">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <MessageSquare className="w-7 h-7 text-blue-600" />
          Quản lý bình luận
        </h1>
        <p className="text-gray-600 mb-4">
          Xem và quản lý tất cả bình luận trên blog
        </p>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Tổng số bình luận</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <MessageSquare className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Đã duyệt</p>
                  <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Chờ duyệt</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <XCircle className="w-8 h-8 text-yellow-500" />
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg p-4 border border-gray-200 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Tìm kiếm theo tên hoặc nội dung..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <Select
                value={filters.isApproved === undefined ? 'all' : filters.isApproved.toString()}
                onValueChange={(value) => handleFilterChange('isApproved', value === 'true' ? true : value === 'false' ? false : undefined)}
              >
                <SelectTrigger>
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="true">Đã duyệt</SelectItem>
                  <SelectItem value="false">Chờ duyệt</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={() => {
                setFilters({
                  search: '',
                  isApproved: undefined,
                  page: 1,
                  limit: 20,
                });
              }}
              variant="outline"
            >
              Đặt lại
            </Button>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <LoaderCircle className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : (
          <>
            <DataTable
              columns={commentColumns(handleApprove, handleReject, handleBlogClick)}
              data={comments}
            />
            
            {pagination.totalPages > 1 && (
              <div className="mt-6 flex justify-center">
                <Panigation
                  totalPages={pagination.totalPages}
                  page={pagination.page}
                  // onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Blog Comments Modal */}
      {selectedBlog && (
        <BlogCommentsModal
          open={showBlogModal}
          onClose={() => {
            setShowBlogModal(false);
            setSelectedBlog(null);
          }}
          blogId={selectedBlog.blogId}
          blogTitle={selectedBlog.blogTitle}
          blogSlug={selectedBlog.blogSlug}
          highlightedCommentId={selectedBlog.highlightedCommentId}
        />
      )}
    </div>
  );
}

