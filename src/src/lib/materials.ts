// Rules for uploaded course materials. No server-only imports, so the
// upload page can use the same limits as the API.

export const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB

export const ALLOWED_EXTENSIONS = [
    "pdf",
    "doc",
    "docx",
    "ppt",
    "pptx",
    "xls",
    "xlsx",
    "txt",
    "zip",
    "png",
    "jpg",
    "jpeg",
];

export function extensionOf(name: string) {
    const dot = name.lastIndexOf(".");
    return dot >= 0 ? name.slice(dot + 1).toLowerCase() : "";
}

export function isAllowedFile(name: string) {
    return ALLOWED_EXTENSIONS.includes(extensionOf(name));
}

// Keep only the file name (no folders) and replace unusual characters.
export function cleanFileName(name: string) {
    const base = name.split(/[\\/]/).pop() ?? "file";
    const cleaned = base.replace(/[^\w.\- ()]+/g, "_").trim().slice(0, 150);
    return cleaned || "file";
}

export function escapeRegex(text: string) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function formatSize(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}