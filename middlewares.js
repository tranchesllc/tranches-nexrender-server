require("dotenv").config();

const validateRenderRequest = (req, res, next) => {
    const REQUIRED_FIELDS = ["assets", "template_uri", "composition_name"];
    console.log("Request body:", req.body);
    const missingFields = REQUIRED_FIELDS.filter((field) => {
        const value = req.body[field];
        return !value;
    });

    if (missingFields.length > 0) {
        return res.status(400).json({
            error: "Missing required fields",
            missingFields,
        });
    }
    next();
};

const checkAllowedUrls = (req, res, next) => {
    const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:8000/api/";
    const allowedUrls = [BACKEND_URL];
    const origin = req.get("Origin") || req.get("Referer");

    // If there's no Origin or Referer header, block the request
    if (!origin) {
        return res
            .status(403)
            .json({ error: "Access forbidden: No origin provided" });
    }

    // Check if the origin or referer matches any of the allowed URLs
    const isAllowed = allowedUrls.some((url) => origin.startsWith(url));

    if (!isAllowed) {
        return res
            .status(403)
            .json({ error: "Access forbidden: Invalid origin" });
    }

    // Proceed to the next middleware/route handler
    next();
};

module.exports = {
    validateRenderRequest,
    checkAllowedUrls,
};
