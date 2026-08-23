const sectionService = require("../services/section.service");

const create_Section = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const data = req.body;

        const result = await sectionService(userId, data);
        res.status(201).json({
            status: "Success",
            message: "Section added successfully",
            result
        })
    } catch (e) {
        next(e);
    }
}

module.exports = {
    create_Section
}