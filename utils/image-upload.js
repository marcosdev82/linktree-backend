import multer from "multer";
import fs from "fs";
import path from "path";

const UPLOAD_ROOT = path.resolve("public/images");

function sanitizeFolderName(folder) {
    if (!folder || typeof folder !== "string") return "";

    return folder
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9-_]/g, "");
}

function resolveFolder(req, allowedFolders, defaultFolder) {
    const baseSegment = req.baseUrl?.split("/").filter(Boolean).at(-1);
    const requestedFolder = req.params?.folder || req.query?.folder || baseSegment;
    const folder = sanitizeFolderName(requestedFolder);

    if (!folder) return defaultFolder;
    if (!allowedFolders.length) return folder;

    return allowedFolders.includes(folder) ? folder : defaultFolder;
}

export function createImageUpload(options = {}) {
    const {
        allowedFolders = [],
        defaultFolder = "uploads",
        allowedExtensions = ["png", "jpg", "jpeg"],
    } = options;

    const normalizedAllowedFolders = allowedFolders.map(sanitizeFolderName).filter(Boolean);
    const normalizedDefaultFolder = sanitizeFolderName(defaultFolder) || "uploads";
    const extensionRegex = new RegExp(`\\.(${allowedExtensions.join("|")})$`, "i");

    const imageStorage = multer.diskStorage({
        destination: function (req, file, cb) {
            const folder = resolveFolder(req, normalizedAllowedFolders, normalizedDefaultFolder);
            const targetDir = path.join(UPLOAD_ROOT, folder);

            fs.mkdir(targetDir, { recursive: true }, (error) => {
                if (error) return cb(error);
                cb(null, targetDir);
            });
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + path.extname(file.originalname));
        },
    });

    return multer({
        storage: imageStorage,
        fileFilter(req, file, cb) {
            if (!file.originalname.match(extensionRegex)) {
                return cb(new Error("Por favor, envie apenas jpg, jpeg ou png!"));
            }
            cb(undefined, true);
        },
    });
}

export const imageUpload = createImageUpload({
    allowedFolders: ["users", "midias"],
    defaultFolder: "users",
});
