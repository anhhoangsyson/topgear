import { AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/atoms/ui/alert-dialog";

export function AlertDialogCustom({
    title,
    description,
    href,
    onConfirm,
    open,
    onClose,
}: {
    title: string;
    description?: string;
    href?: string; // URL để điều hướng
    onConfirm?: () => void; // Callback khi nhấn "Continue"
    open: boolean; // Trạng thái mở hộp thoại
    onClose: () => void; // Callback khi đóng hộp thoại,
    children?: React.ReactNode; // Nội dung con
}) {
    return (
        <AlertDialogCustom
            title={title}

            open={open} onClose={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    {description && (
                        <AlertDialogDescription>{description}</AlertDialogDescription>
                    )}
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={() => {
                            if (onConfirm) {
                                onConfirm(); // Gọi callback nếu có
                            } else if (href) {
                                window.location.href = href; // Điều hướng nếu có href
                            }
                            onClose(); // Đóng hộp thoại
                        }}
                    >
                        Continue
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialogCustom>
    );
}