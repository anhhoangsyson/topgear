'use client'
import React, { useRef } from 'react'
import 'react-quill-new/dist/quill.snow.css';
import ReactQuill from 'react-quill-new';
import { useSession } from 'next-auth/react';
import { toast } from '@/hooks/use-toast';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import type { ReactQuillRef } from '@/types/react-quill';
import { Label } from '@/components/atoms/ui/label';
import { Input } from '@/components/atoms/ui/input';
import { Button } from '@/components/atoms/ui/Button';

const blogSchema = z.object({
    title: z.string().min(3, "Tiêu đề phải có ít nhất 3 ký tự"),
    tags: z.string().min(1, "Tags không được để trống"),
    thumbnail: z.string().url("Ảnh thumbnail phải là một URL hợp lệ"),
    content: z.string().min(10, "Nội dung phải có ít nhất 10 ký tự"),
});

type BlogForm = z.infer<typeof blogSchema>;

export default function ReactQuillEditor() {
    const { data: session } = useSession();
    const accessToken = session?.accessToken;
    const quillRef = useRef<ReactQuillRef | null>(null);

    const {
        control,
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<BlogForm>({
        resolver: zodResolver(blogSchema),
        defaultValues: {
            title: '',
            tags: '',
            thumbnail: '',
            content: '',
        }
    });

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;
        const formData = new FormData();
        formData.append('file', e.target.files[0]);
        formData.append('upload_preset', 'blog_unsigned');
        const res = await fetch('https://api.cloudinary.com/v1_1/drsm6hdbe/image/upload', {
            method: 'POST',
            body: formData,
        });
        const data = await res.json();
        setValue('thumbnail', data.url, { shouldValidate: true });
    };

    const imageHandler = () => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();
        input.onchange = async () => {
            if (!input.files?.[0]) return;
            const formData = new FormData();
            formData.append('file', input.files[0]);
            formData.append('upload_preset', 'blog_unsigned');
            const res = await fetch('https://api.cloudinary.com/v1_1/drsm6hdbe/image/upload', {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();
            const url = data.secure_url;
            const quill = quillRef.current?.getEditor();
            const range = quill?.getSelection();
            if (quill && range) {
                quill.insertEmbed(range.index, 'image', url);
            }
        };
    };

    const modules = {
        toolbar: {
            container: [
                [{ 'header': [1, 2, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                ['blockquote', 'code-block'],
                [{ 'script': 'sub' }, { 'script': 'super' }],
                [{ 'indent': '-1' }, { 'indent': '+1' }],
                [{ 'direction': 'rtl' }],
                [{ 'size': ['small', false, 'large', 'huge'] }],
                [{ 'color': [] }, { 'background': [] }],
                [{ 'font': [] }],
                ['link', 'image', 'video'],
                ['clean']
            ],
            handlers: {
                image: imageHandler
            }
        }
    };

    const onSubmit = async (data: BlogForm) => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_EXPRESS_API_URL}/blog`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                ...data,
                tags: data.tags.split(',').map(t => t.trim()),
            }),
        });
        if (res.ok) {
            toast({ title: 'Tạo bài viết thành công!' });
            reset();
        } else {
            toast({ title: 'Có lỗi khi tạo bài viết!', variant: 'destructive' });
        }
    };

    const thumbnail = watch('thumbnail');

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="w-full mx-auto bg-white p-6 rounded-lg shadow space-y-6">
            <h2 className="text-2xl font-bold mb-2">Tạo bài viết mới</h2>
            <div>
                <Label htmlFor="title">Tiêu đề</Label>
                <Input
                    id="title"
                    placeholder="Nhập tiêu đề bài viết"
                    {...register('title')}
                />
                {errors.title && <p className="text-red-500 text-xs">{errors.title.message}</p>}
            </div>
            <div>
                <Label htmlFor="tags">Tags (phân cách bằng dấu phẩy)</Label>
                <Input
                    id="tags"
                    placeholder="Ví dụ: xe, review, tin tức"
                    {...register('tags')}
                />
                {errors.tags && <p className="text-red-500 text-xs">{errors.tags.message}</p>}
            </div>
            <div>
                <Label htmlFor="thumbnail">Ảnh thumbnail</Label>
                <Input
                    id="thumbnail"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                />
                {thumbnail && (
                    <div className="mt-2">
                        <img src={thumbnail} alt="thumbnail" className="rounded border w-32 h-20 object-cover" />
                    </div>
                )}
                {errors.thumbnail && <p className="text-red-500 text-xs">{errors.thumbnail.message}</p>}
            </div>
            <div>
                <Label>Nội dung</Label>
                <Controller
                    control={control}
                    name="content"
                    render={({ field }) => (
                        <div className="rounded bg-white">
                            <ReactQuill
                                // @ts-expect-error - react-quill-new doesn't have proper types
                                ref={quillRef}
                                modules={modules}
                                value={field.value}
                                onChange={field.onChange}
                                style={{ minHeight: 180 }}
                            />
                        </div>
                    )}
                />
                {errors.content && <p className="text-red-500 text-xs">{errors.content.message}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Đang tạo..." : "Tạo bài viết"}
            </Button>
        </form>
    );
}