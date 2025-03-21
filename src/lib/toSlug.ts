export function toSlug(str: string): string {
    return str
        .toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Xóa dấu
        .replace(/\s+/g, "-") // Khoảng trắng -> "-"
        .replace(/[^a-z0-9\-]/g, "") // Loại ký tự đặc biệt
        .replace(/-+/g, "-") // Xóa dấu "-" thừa
        .trim();
}