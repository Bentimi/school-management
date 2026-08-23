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

const update_Section = async (req, res, next) => {
    try {
        const userId =  req.user.id;
        const sectionId = req.params.sectionId;
        const data = req.body;

        const section = await sectionService.updateSection(userId, sectionId, data);

        res.success(section, "Section updated successfully")

    } catch (e) {
        next(e);
    }
}

const get_Section = async (req, res, next) => {
    try {
        const userId =  req.user.id;
        const sectionId = req.params.sectionId;

        const section = await sectionService.getSection(userId, sectionId);

        res.success(section, "Section updated successfully")

    } catch (e) {
        next(e);
    }
}

const delete_Section = async (req, res, next) => {
    try {
        const userid = req.user.id;
        const sectionId = req.params.sectionId;

        const section = await sectionService.deleteSection(userId, sectionId);

        return res.status(204).json({
            status: 'Success',
            message: 'Section deleted',
            data: null
        })
    } catch (e) {
        next(e);
    }
}

const all_Section = async (req, res, next) => {
    try {
        const userId = req.user.Id;
        const pageSize = parseInt(req.query.pageSize) || 10;
        const page = parseInt(req.query.page) || 1;

        const result = await sectionService.allSection(userId, pageSize, page)

        res.success(result, "Section successfully fetched")
    } catch (e) {
        next(e);
    }
}

module.exports = {
    create_Section,
    update_Section,
    get_Section,
    delete_Section,
    all_Section
}