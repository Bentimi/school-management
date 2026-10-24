const sessionService = require("../services/session.service");

const create_Session = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const data = req.body;

        // console.log(data)

        const result = await sessionService.createSession(userId, data);
        res.status(201).json({
            status: "Success",
            message: "Session added successfully",
            result
        })
    } catch (e) {
        // console.log(e)
        next(e);
    }
}

const update_Session = async (req, res, next) => {
    try {
        const userId =  req.user.id;
        const sessionId = req.params.sessionId;
        const data = req.body;

        const session = await sessionService.updateSession(userId, sessionId, data);

        res.success(session, "Session updated successfully")

    } catch (e) {
        // console.log(e)
        next(e);
    }
}

const get_Session = async (req, res, next) => {
    try {
        const userId =  req.user.id;
        const sessionId = req.params.sessionId;

        const session = await sessionService.getSession(userId, sessionId);

        res.success(session, "Session updated successfully")

    } catch (e) {
        next(e);
    }
}

const delete_Session = async (req, res, next) => {
    try {
        const userid = req.user.id;
        const sessionId = req.params.sessionId;

        const session = await sessionService.deleteSession(userId, sessionId);

        return res.status(204).json({
            status: 'Success',
            message: 'Session deleted',
            data: null
        })
    } catch (e) {
        next(e);
    }
}

const all_Session = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const pageSize = parseInt(req.query.pageSize) || 10;
        const page = parseInt(req.query.page) || 1;
        const search = req.query.search || '';

        const result = await sessionService.allSession(userId, pageSize, page, search)
        // console.log(result)
        // console.log(pageSize)
        res.success(result, "Session successfully fetched")
    } catch (e) {
        console.log(e)
        next(e);
    }
}

const session_status = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const sessionId = req.params.sessionId;

        const session = await sessionService.sessionStatus(userId, sessionId);

        res.success(session, session.msg);
    } catch (e) {
        console.log(e)
        next (e);
    }
}

const session_verification = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const sessionId = req.params.sessionId;
        const data = req.body;

        const session = await sessionService.sessionVerification(userId, sessionId, data);

        res.success(session, 'Session successfully updated!');
    } catch (e) {
        console.log(e)
        next (e);
    }
}

module.exports = {
    create_Session,
    update_Session,
    get_Session,
    delete_Session,
    all_Session,
    session_status,
    session_verification
}