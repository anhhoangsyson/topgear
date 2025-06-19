"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "@/hooks/use-toast";
import BasicInfoForm from "@/app/admin/(otherPages)/laptop/add/BasicInfoForm";
import SpecificationsForm from "@/app/admin/(otherPages)/laptop/add/SpecificationsForm";
import ImagesAndSeoForm from "@/app/admin/(otherPages)/laptop/add/ImagesAndSeoForn";
import PreviewForm from "@/app/admin/(otherPages)/laptop/add/PreviewForm";
import { ILaptop, ISeoMetadata } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/atoms/ui/tabs";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/atoms/ui/card";
import { Button } from "@/components/atoms/ui/Button";
import OverlayLoader from "@/components/atoms/feedback/OverlayLoader";

// Định nghĩa schema cho từng bước
const basicInfoSchema = z.object({
    modelName: z.string().min(1, "Model không được để trống"),
    name: z.string().min(1, "Tên sản phẩm không được để trống"),
    brandId: z.string().min(1, "Thương hiệu không được để trống"),
    categoryId: z.string().min(1, "Danh mục không được để trống"),
    description: z.string().optional(),
    price: z.coerce.number().positive("Giá phải lớn hơn 0"),
    discountPrice: z.coerce.number().optional(),
    stock: z.coerce.number().int().min(0, "Số lượng không được âm"),
    warranty: z.coerce.number().int().min(0).optional(),
    releaseYear: z.coerce.number().int().optional(),
    status: z.enum(["new", "refurbished", "used"]),
    weight: z.coerce.number().optional(),
    dimensions: z.string().optional(),
    isActive: z.boolean().default(true),
    isPromoted: z.boolean().default(false),
});

const specificationsSchema = z.object({
    processor: z.string().min(1, "Bộ xử lý không được để trống"),
    processorGen: z.string().optional(),
    processorSpeed: z.coerce.number().optional(),
    ram: z.coerce.number().int().min(1, "RAM không được để trống"),
    ramType: z.string().optional(),
    storage: z.coerce.number().int().min(1, "Bộ nhớ không được để trống"),
    storageType: z.string().optional(),
    graphicsCard: z.string().optional(),
    graphicsMemory: z.coerce.number().optional(),
    displaySize: z.coerce.number().min(1, "Kích thước màn hình không được để trống"),
    displayResolution: z.string().optional(),
    displayType: z.string().optional(),
    refreshRate: z.coerce.number().optional(),
    touchscreen: z.boolean().default(false),
    battery: z.string().optional(),
    batteryLife: z.coerce.number().optional(),
    operatingSystem: z.string().optional(),
    ports: z.array(z.string()).optional(),
    webcam: z.string().optional(),
    keyboard: z.string().optional(),
    speakers: z.string().optional(),
    connectivity: z.string().optional(),
});

const imagesAndSeoSchema = z.object({
    images:
        z.array(z.instanceof(File)).optional(),
    // : z.array(z.instanceof(File)).min(1, "Phải có ít nhất 1 hình ảnh"),
    altTexts: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
    seoMetadata: z.object({
        metaTitle: z.string().optional(),
        metaDescription: z.string().optional(),
        keywords: z.array(z.string()).optional(),
    }).optional(),
});

// Kiểu dữ liệu cho form
type FormValues = z.infer<typeof basicInfoSchema> & {
    specifications: z.infer<typeof specificationsSchema>;
    images: File[];
    altTexts: string[];
    tags: string[];
    seoMetadata: {
        metaTitle: string;
        metaDescription: string;
        keywords: string[];
    };
};

export default function EditLaptopForm({ laptop }: { laptop: ILaptop }) {

    const router = useRouter();
    const [step, setStep] = useState(1);
    const [activeTab, setActiveTab] = useState("basic");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [suggestedMetadata, setSuggestedMetadata] = useState<ISeoMetadata>({
        ...laptop.seoMetadata
    });

    const methods = useForm<FormValues>({
        resolver: zodResolver(
            step === 1
                ? basicInfoSchema
                : step === 2
                    ? specificationsSchema
                    : step === 3
                        ? imagesAndSeoSchema
                        : z.any()
        ),
        mode: "onChange",
        defaultValues:
        {
            modelName: laptop.modelName,
            name: laptop.name,
            brandId: laptop?.brandId?._id || "",
            categoryId: laptop?.categoryId?._id || "",
            description: laptop.description,
            price: laptop.price,
            discountPrice: laptop.discountPrice,
            stock: laptop.stock,
            warranty: laptop.warranty,
            releaseYear: laptop.releaseYear,
            status: laptop.status,
            weight: laptop.weight,
            dimensions: laptop.dimensions,
            isActive: laptop.isActive,
            isPromoted: laptop.isPromoted,
            specifications: {
                ...laptop.specifications,
                // processor: "",
                // processorGen: "",
                // processorSpeed: 0,
                // ram: 0,
                // ramType: "",
                // storage: 0,
                // storageType: "",
                // graphicsCard: "",
                // graphicsMemory: 0,
                // displaySize: 0,
                // displayResolution: "",
                // displayType: "",
                // refreshRate: 0,
                // touchscreen: false,
                // battery: "",
                // batteryLife: 0,
                // operatingSystem: "",
                // ports: [],
                // webcam: "",
                // keyboard: "",
                // speakers: "",
                // connectivity: "",

            },
            images: [],
            altTexts: laptop.images?.map(image => image.altText) || [],
            tags: laptop.tags,
            seoMetadata: {
                metaTitle: laptop.seoMetadata?.metaTitle,
                metaDescription: laptop.seoMetadata?.metaDescription,
                keywords: laptop.seoMetadata?.keywords || [],
            },
        }
    });

    // useEffect(() => {
    //     if (laptop) {

    //         methods.reset(
    //             {
    //                 modelName: laptop.modelName,
    //                 name: laptop.name,
    //                 brandId: laptop?.brandId?._id || "",
    //                 categoryId: laptop?.categoryId?._id || "",
    //                 description: laptop.description,
    //                 price: laptop.price,
    //                 discountPrice: laptop.discountPrice,
    //                 stock: laptop.stock,
    //                 warranty: laptop.warranty,
    //                 releaseYear: laptop.releaseYear,
    //                 status: laptop.status,
    //                 weight: laptop.weight,
    //                 dimensions: laptop.dimensions,
    //                 isActive: laptop.isActive,
    //                 isPromoted: laptop.isPromoted,
    //                 specifications: {
    //                     ...laptop.specifications,
    //                     // processor: "",
    //                     // processorGen: "",
    //                     // processorSpeed: 0,
    //                     // ram: 0,
    //                     // ramType: "",
    //                     // storage: 0,
    //                     // storageType: "",
    //                     // graphicsCard: "",
    //                     // graphicsMemory: 0,
    //                     // displaySize: 0,
    //                     // displayResolution: "",
    //                     // displayType: "",
    //                     // refreshRate: 0,
    //                     // touchscreen: false,
    //                     // battery: "",
    //                     // batteryLife: 0,
    //                     // operatingSystem: "",
    //                     // ports: [],
    //                     // webcam: "",
    //                     // keyboard: "",
    //                     // speakers: "",
    //                     // connectivity: "",

    //                 },
    //                 images: [],
    //                 altTexts: laptop.images?.map(image => image.altText) || [],
    //                 tags: laptop.tags,
    //                 seoMetadata: {
    //                     metaTitle: laptop.seoMetadata?.metaTitle,
    //                     metaDescription: laptop.seoMetadata?.metaDescription,
    //                     keywords: laptop.seoMetadata?.keywords || [],
    //                 },
    //             }
    //         );
    //     }

    // }, [laptop]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [brandsResponse, categoriesResponse] = await Promise.all([
                    fetch(`${process.env.NEXT_PUBLIC_API_URL_NEXT_SERVER}/api/brand`, { method: "GET" }),
                    fetch(`${process.env.NEXT_PUBLIC_API_URL_NEXT_SERVER}/api/category`, { method: "GET" }),
                ]);

                const [brandsData, categoriesData] = await Promise.all([
                    brandsResponse.json(),
                    categoriesResponse.json(),
                ]);

                setBrands(brandsData.data);
                setCategories(categoriesData.data);
            } catch (error) {
                toast({
                    variant: "destructive",
                    title: "Có lỗi xảy ra",
                    description: "Không thể tải dữ liệu. Vui lòng thử lại sau.",
                });
            }
        };
        fetchData();
    }, []);


    const handleTabChange = (value: string) => {
        setActiveTab(value);
        if (value === "basic") setStep(1);
        else if (value === "specifications") setStep(2);
        else if (value === "images") setStep(3);
        else if (value === "preview") setStep(4);
    };

    const handleNext = async () => {
        let isValid = false;

        if (step === 1) {
            isValid = await methods.trigger([
                "modelName", "name", "brandId", "categoryId", "price",
                "stock", "status", "isActive", "isPromoted"
            ], { shouldFocus: true });

            if (isValid) {
                setStep(2);
                setActiveTab("specifications");
            }
        }
        else if (step === 2) {
            isValid = await methods.trigger([
                "specifications.processor", "specifications.ram",
                "specifications.storage", "specifications.displaySize"
            ], { shouldFocus: true });

            if (isValid) {
                // Gọi API để gợi ý metadata
                try {
                    const formData = methods.getValues();
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_NEXT_SERVER}/api/suggest-metadata`, {
                        method: "POST",
                        body: JSON.stringify({
                            name: formData.name,
                            modelName: formData.modelName,
                            description: formData.description,
                            specifications: formData.specifications
                        }),
                    })

                    const suggestMetadata = await response.json();

                    setSuggestedMetadata(suggestMetadata.data);

                    // Cập nhật form với metadata được gợi ý
                    methods.setValue("seoMetadata.metaTitle", suggestedMetadata.metaTitle!);
                    methods.setValue("seoMetadata.metaDescription", suggestedMetadata.metaDescription!);
                    methods.setValue("seoMetadata.keywords", suggestedMetadata.keywords!);
                    methods.setValue("tags", suggestMetadata.tags);
                } catch (error) {
                    console.error("Error fetching suggested metadata:", error);
                }

                setStep(3);
                setActiveTab("images");
            }
        }
        else if (step === 3) {
            isValid = await methods.trigger(["images"], { shouldFocus: true });

            if (isValid) {
                setStep(4);
                setActiveTab("preview");
            }
        }
    };

    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1);
            if (step === 2) setActiveTab("basic");
            else if (step === 3) setActiveTab("specifications");
            else if (step === 4) setActiveTab("images");
        }
    };

    const onSubmit = async (data: FormValues) => {
        setIsSubmitting(true);


        try {
            // Tạo FormData để gửi dữ liệu và file
            const formData = new FormData();

            const oldImages = laptop.images
            if (oldImages && oldImages.length > 0) {
                formData.append("oldImages", JSON.stringify(oldImages.map(img => img.imageUrl)));
            }


            // Thêm các trường cơ bản
            formData.append("modelName", data.modelName);
            formData.append("name", data.name);
            formData.append("brandId", data.brandId);
            formData.append("categoryId", data.categoryId);
            formData.append("price", data.price.toString());
            if (data.discountPrice) formData.append("discountPrice", data.discountPrice.toString());
            formData.append("stock", data.stock.toString());
            if (data.warranty) formData.append("warranty", data.warranty.toString());
            if (data.releaseYear) formData.append("releaseYear", data.releaseYear.toString());
            formData.append("status", data.status);
            if (data.weight) formData.append("weight", data.weight.toString());
            if (data.dimensions) formData.append("dimensions", data.dimensions);
            formData.append("isActive", data.isActive.toString());
            formData.append("isPromoted", data.isPromoted.toString());
            if (data.description) formData.append("description", data.description);

            // Thêm thông số kỹ thuật
            formData.append("specifications", JSON.stringify(data.specifications));

            // Thêm tags
            if (data.tags && data.tags.length > 0) {
                formData.append("tags", JSON.stringify(data.tags));
            }

            // Thêm SEO metadata
            if (data.seoMetadata) {
                formData.append("seoMetadata", JSON.stringify(data.seoMetadata));
            }

            // Thêm hình ảnh và alt text
            data.images.forEach((file, index) => {
                formData.append("files", file);
                if (data.altTexts && data.altTexts[index]) {
                    formData.append(`altText[${index}]`, data.altTexts[index]);
                }
            });

            // Gửi dữ liệu lên server
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/laptop/${laptop._id}`, {
                method: "PUT",
                body: formData,
            })

            const result = await res.json();

            if (res.ok) {
                toast({
                    title: "Edit laptop thành công",
                    description: `Laptop "${data.name}" đã edit.`,
                });
            }

            router.push("/admin/laptop");
        } catch (error) {
            console.error("Error submitting form:", error);
            toast({
                variant: "destructive",
                title: "Có lỗi xảy ra",
                description: "Không thể edit laptop. Vui lòng thử lại sau.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto py-6">
            <Card className="max-w-5xl mx-auto">
                <CardHeader>
                    <CardTitle>
                        Edit Laptop {laptop.name || "Form"}
                    </CardTitle>
                </CardHeader>

                <FormProvider {...methods}>
                    <form onSubmit={methods.handleSubmit(onSubmit)}>
                        <CardContent>
                            {/* Hiển thị tiến trình */}
                            <div className="mb-8">
                                <div className="flex justify-between mb-2">
                                    {[1, 2, 3, 4].map((stepNumber) => (
                                        <div
                                            key={stepNumber}
                                            className={`w-8 h-8 rounded-full flex items-center justify-center ${stepNumber === step
                                                ? "bg-primary text-primary-foreground"
                                                : stepNumber < step
                                                    ? "bg-primary/80 text-primary-foreground"
                                                    : "bg-muted text-muted-foreground"
                                                }`}
                                        >
                                            {stepNumber}
                                        </div>
                                    ))}
                                </div>
                                <div className="w-full bg-muted h-2 rounded-full">
                                    <div
                                        className="bg-primary h-2 rounded-full transition-all"
                                        style={{ width: `${(step / 4) * 100}%` }}
                                    />
                                </div>
                            </div>

                            <Tabs value={activeTab} onValueChange={handleTabChange}>
                                <TabsList className="grid w-full grid-cols-4">
                                    <TabsTrigger value="basic">Thông tin cơ bản</TabsTrigger>
                                    <TabsTrigger value="specifications">Thông số kỹ thuật</TabsTrigger>
                                    <TabsTrigger value="images">Hình ảnh & SEO</TabsTrigger>
                                    <TabsTrigger value="preview">Xem trước</TabsTrigger>
                                </TabsList>

                                <TabsContent value="basic">
                                    <BasicInfoForm brands={brands} categories={categories} />
                                </TabsContent>

                                <TabsContent value="specifications">
                                    <SpecificationsForm />
                                </TabsContent>

                                <TabsContent value="images">
                                    <ImagesAndSeoForm
                                        suggestedMetadata={suggestedMetadata}
                                        oldImages={laptop.images}
                                        isEditMode={true} // Thêm prop để xác định chế độ chỉnh sửa
                                    />
                                </TabsContent>

                                <TabsContent value="preview">
                                    <PreviewForm brands={brands} categories={categories} />
                                </TabsContent>
                            </Tabs>
                        </CardContent>

                        <CardFooter className="flex justify-between">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleBack}
                                disabled={step === 1 || isSubmitting}
                            >
                                Quay lại
                            </Button>

                            {step < 4 ? (
                                <Button
                                    type="button"
                                    onClick={handleNext}
                                    disabled={isSubmitting}
                                >
                                    Tiếp theo
                                </Button>
                            ) : (
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                >
                                    Tạo Laptop
                                </Button>
                            )}
                        </CardFooter>
                    </form>
                </FormProvider>
            </Card>

            {isSubmitting && <OverlayLoader />}
        </div>
    );
}