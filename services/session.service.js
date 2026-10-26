const User = require("../models/user.model");
const Session = require("../models/session.model");
const AppError = require("../utils/AppError.utils");
const mongoose = require("mongoose");

const createSession = async (userId, data) => {
    if (!userId) {
        throw new AppError("Unauthorizd user", 401);
    }

    if (!data.session || !data.endDate || !data.startDate) {
        throw new AppError("All fields required", 400);
    }

    const existingSession = await Session.findOne({
        session: data.session
    })

    if (existingSession) {
        throw new AppError("Session already exists", 409)
    }

    const newSession =  new Session({
        session: data.session,
        startDate: data.startDate,
        endDate: data.endDate,
        regStatus: data.regStatus || false,
        paymentStatus: data.paymentStatus || false,
        isActive: data.isActive || false,
        createdBy: userId
    })

    await newSession.save();
    await newSession.populate('createdBy', 'first_name last_name email');

    return {
        session: newSession
    }
}

const updateSession = async (userId, sessionId, data) => {
    if (!userId) {
        throw new AppError("Unauthorized user", 401);
    }

    const user =  await User.findById(userId);
    if (!user) {
        throw new AppError("User not found", 404)
    }

    if (!user.role === 'admin') {
        throw new AppError("Forbidden Access", 403)
    }

    if (!data.session || !data.startDate || !data.endDate) {
        throw new AppError("All fields required", 400);
    }

    const session = await Session.findById(sessionId);
    if (!session) {
        throw new AppError("Data not found", 404);
    }

    const existingSession = await Session.findOne({
        session: data.session, _id: {
            $ne: sessionId
        }
    });

    if (existingSession) {
        throw new AppError('Session already exists', 409)
    }


    const updatedData = await Session.findByIdAndUpdate(
        sessionId,
        {
            session: data.session,
            endDate: data.endDate,
            startDate: data.startDate,
            lastUpdatedBy: userId
        },
        { returnDocument: "after" }
    )
    .populate('lastUpdatedBy', 'first_name last_name email')
    .populate('createdBy', 'first_name last_name email')
    
    if (!updatedData) {
        throw new AppError("Session not found", 404)
    }

    return {
        session: updatedData
    }
}

const getSession = async (userId, sessionId) => {
    if (!userId) {
        throw new AppError("Unauthenticated user", 401)
    }

    const user = await User.findById(userId);
    if (!user.role === "admin") {
        throw new AppError("Forbidden Access", 403)
    }

    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
        throw new AppError('Invalid session Id', 400)
    }

    const session = await Session.findById(userId)
    .populate('lastUpdatedBy', 'first_name last_name email')
    .populate('createdBy', 'first_name last_name email')

    if (!session) {
        throw new AppError("Data not found", 404)
    }

    return session;
}

const deleteSession = async (userId, sessionId) => {
    if (!userId) {
        throw new AppError("Unauthorized User", 401);
    }

    const userAuth = await User.findById(userId);
    if (!userAuth) {
        throw new AppError("Unauthorized User", 401);
    }

    if (!userAuth.role === 'admin') {
        throw new AppError("Forbidden access", 403);
    }

    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
        throw new AppError('Invalid session Id', 400)
    }

    const deletedSession = await Session.findOneAndDelete(sessionId);
    if (!deletedSession) {
        throw new AppError("Data not found", 404)
    }
    return deletedSession;
}

const allSession = async (userId, pageSize, page, search) => {
    if (!userId) {
        throw new AppError("Unauthorized User", 401);
    }

    const userAuth = await User.findById(userId);
    if (!userAuth) {
        throw new AppError("Unauthorized User", 401);
    }

    if (!userAuth.role === 'admin') {
        throw new AppError("Forbidden access", 403);
    }

    let queryFilter = {};
    if (search) {
        const searchValue = {
            $regex: search, $options: 'i'
        };

        queryFilter = {
            $or: [
                { session: searchValue },
                { createdBy: searchValue }
            ]
        }
    }

    // if (pageSize > 10) {
    //     pageSize = 100
    // }

    const sessions = await Session.find(queryFilter)
    .populate("lastUpdatedBy", "first_name last_name email")
    .populate("createdBy", "first_name last_name email")
    .sort({ updatedAt: -1 })
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .lean()
    const total = await Session.countDocuments(queryFilter)

    return { sessions, total};
}

const sessionStatus = async (userId, sessionId) => {
     if (!userId) {
        throw new AppError("Unauthenticated user", 401)
    }

    const user = await User.findById(userId);
    if (!user.role === "admin") {
        throw new AppError("Forbidden Access", 403)
    }

    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
        throw new AppError('Invalid session Id', 400)
    }

    const sessionData = await Session.findById(sessionId);
    if (!sessionData) {
        throw new AppError("Session do not exist", 400);
    }

    let status;
    let msg;
    if (sessionData.isActive === true) {
        status = false;
        msg = 'Session deactivated'
    } else {
        status = true;
        msg = 'Session activated'
    }

    const updatedData = await Session.findByIdAndUpdate(
        sessionId,
        {
            isActive: status,
            lastUpdatedBy: userId
        },
        { returnDocument: "after" }
    )
    .populate('lastUpdatedBy', 'first_name last_name email')
    .populate('createdBy', 'first_name last_name email')
    
    if (!updatedData) {
        throw new AppError("Session not found", 404)
    }

    return {
        session: updatedData,
        msg
    }
}

const sessionVerification = async (userId, sessionId, data) => {
     if (!userId) {
        throw new AppError("Unauthenticated user", 401)
    }

    const user = await User.findById(userId);
    if (!user.role === "admin") {
        throw new AppError("Forbidden Access", 403)
    }

    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
        throw new AppError('Invalid session Id', 400)
    }

    const checkOldDate = await Session.findOne({
        _id: sessionId,
        startDate: { $gt: Date.now() },
    })

    if (checkOldDate && (data.current || data.paymentStatus || data.active || data.regStatus )) {
        throw new AppError('The session start date has not reached', 400)
    }

    const checkDate = await Session.findOne({
        _id: sessionId,
        endDate: { $gt: Date.now() }
    })

    if (!checkDate && data.current) {
        throw new AppError('The session end date has expired', 400)
    }

    if (data.current === true) {
        const allSession = await Session.updateMany(
            { current: true },
            { current: false }
        )
    }

    const session = await Session.findByIdAndUpdate(
        sessionId,
        {
            isActive: Boolean(data.active),
            current: Boolean(data.current),
            regStatus: Boolean(data.regStatus),
            paymentStatus: Boolean(data.paymentStatus),
            lastUpdatedBy: userId
        },
        {
            returnDocument: 'after'
        }
    )
    .populate('lastUpdatedBy', 'first_name last_name email')
    .populate('createdBy', 'first_name last_name email')
    
    if (!session) {
        throw new AppError("Session not found", 404)
    }

    return session
}

module.exports = {
    createSession,
    updateSession,
    getSession,
    deleteSession,
    allSession,
    sessionStatus,
    sessionVerification
}