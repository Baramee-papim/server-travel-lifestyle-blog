// Validation middleware for post data
export const validatePostData = (req, res, next) => {
    const data = req.body;
    const errors = [];

    // Validate title
    if (data.title === undefined || data.title === null) {
        errors.push("Title is required");
    } else if (typeof data.title !== "string") {
        errors.push("Title must be a string");
    }

    // Validate image
    if (data.image === undefined || data.image === null) {
        errors.push("Image is required");
    } else if (typeof data.image !== "string") {
        errors.push("Image must be a string");
    }

    // Validate category_id
    if (data.category_id === undefined || data.category_id === null) {
        errors.push("Category ID is required");
    } else if (typeof data.category_id !== "number") {
        errors.push("Category ID must be a number");
    }

    // Validate description
    if (data.description === undefined || data.description === null) {
        errors.push("Description is required");
    } else if (typeof data.description !== "string") {
        errors.push("Description must be a string");
    }

    // Validate content
    if (data.content === undefined || data.content === null) {
        errors.push("Content is required");
    } else if (typeof data.content !== "string") {
        errors.push("Content must be a string");
    }

    // Validate status_id
    if (data.status_id === undefined || data.status_id === null) {
        errors.push("Status ID is required");
    } else if (typeof data.status_id !== "number") {
        errors.push("Status ID must be a number");
    }

    // If there are validation errors, return 400 Bad Request
    if (errors.length > 0) {
        return res.status(400).json({
            message: errors[0],
            errors: errors
        });
    }

    // If validation passes, continue to the next middleware/route handler
    next();
};
