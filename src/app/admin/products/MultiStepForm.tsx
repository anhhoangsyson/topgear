"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

const productSchema = z.object({
    productName: z.string().min(1, "Tên sản phẩm không được để trống"),
    categoriesId: z.string().min(1, "Danh mục không được để trống"),
});

const variantSchema = z.object({
    variantName: z.string().min(1, "Tên biến thể không được để trống"),
    variantPrice: z.number().min(0, "Giá không hợp lệ"),
    variantStock: z.number().min(0, "Số lượng không hợp lệ"),
    status: z.enum(["active", "inactive"]),
});

const attributeSchema = z.object({
    attributeId: z.string().min(1, "Thuộc tính không được để trống"),
    attributeValue: z.string().min(1, "Giá trị không được để trống"),
    status: z.enum(["active", "inactive"]),
});

const imageSchema = z.object({
    imageUrl: z.string().url("URL ảnh không hợp lệ"),
});


interface Categories {
    _id: string;
    categoriesName: string;
    subcategories: string[];
    isActive: boolean;
}

export default function MuiltiStepForm() {
    const [step, setStep] = useState(1);
    const [categories, setCategories] = useState([] as Categories[]);
    useEffect(() => {
        axios.get("http://localhost:3000/api/v1/categories").then((response) => {
            setCategories(response.data.data);
            console.log("Categories:", response.data.data);

        }).catch((error) => {
            console.error("Lỗi khi lấy danh mục:", error);
        });
    }, []);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: zodResolver(getSchema(step)),
        mode: 'onChange', // Validate on change
        reValidateMode: 'onChange', // Re-validate on change
     });

    function getSchema(step: number): z.ZodSchema {
        switch (step) {
            case 1:
                return productSchema;
            case 2:
                return variantSchema;
            case 3:
                return attributeSchema;
            case 4:
                return imageSchema;
            default:
                return productSchema;
        }
    }

    interface FormData {
        productName?: string;
        categoriesId?: string;
        variantName?: string;
        variantPrice?: number;
        variantStock?: number;
        status?: "active" | "inactive";
        attributeId?: string;
        attributeValue?: string;
        imageUrl?: string;
    }

    const onSubmit = async (data: FormData) => {
        try {
            // await axios.post(`/api/v1/${step}`, data);
            await axios.get("http://localhost:3000/api/v1/products");
            if (step < 4) {
                setStep((prevStep) => {
                    console.log("Current Step:", prevStep);
                    console.log('data', data);
                    return prevStep + 1;
                });
                console.log("Next Step:", step + 1);
            }
            console.log('step', step);
        } catch (error) {
            console.error("Submit error:", error);
        }
    };

    return (
        <div className="p-6 max-w-lg mx-auto">
            <form onSubmit={handleSubmit(onSubmit)}>
                {step === 1 && (
                    <>
                        <Input {...register("productName")} placeholder="Tên sản phẩm" />
                        {errors.productName && <p>{errors.productName.message?.toString()}</p>}
                        <select {...register("categoriesId")} className="w-full p-2 border rounded">
                            <option value="">Chọn danh mục</option>
                            {categories.map((cat) => (
                                <option key={cat._id} value={cat._id}>
                                    {cat.categoriesName}
                                </option>
                            ))}
                        </select>
                        {errors.categoriesId && <p className="text-red-500">{errors.categoriesId.message?.toString()}</p>}
                    </>
                )}

                {step === 2 && (
                    <>
                        <Input {...register("variantName")} placeholder="Tên biến thể" />
                        <Input {...register("variantPrice", { valueAsNumber: true })} type="number" placeholder="Giá" />
                        <Input {...register("variantStock", { valueAsNumber: true })} type="number" placeholder="Số lượng" />
                        <Select {...register("status")}>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </Select>
                    </>
                )}

                {step === 3 && (
                    <>
                        <Input {...register("attributeId")} placeholder="ID thuộc tính" />
                        <Input {...register("attributeValue")} placeholder="Giá trị thuộc tính" />
                        <Select {...register("status")}>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </Select>
                    </>
                )}

                {step === 4 && (
                    <>
                        <Input {...register("imageUrl")} placeholder="URL ảnh" />
                        {errors.imageUrl && <p>{errors.imageUrl.message?.toString()}</p>}
                    </>
                )}

                <div className="flex justify-between mt-4">
                    {step > 1 && <Button type="button" onClick={() => setStep(step - 1)}>Quay lại</Button>}
                    <Button type="submit">{step === 4 ? "Hoàn thành" : "Tiếp theo"}</Button>
                </div>
            </form>
        </div>
    );
}
