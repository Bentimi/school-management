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

    const updatedData = await Session.findByIdAndUpdate(
        sessionId,
        {
            session: data.session,
            endDate: data.endDate,
            startDate: data.startDate,
            lastUpdatedBy: userId
        },
        {
            new: true,
            runValidators: true
        }
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

const allSession = async (userId, pageSize, page) => {
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

    if (pageSize > 100) {
        pageSize = 100
    }

    const sessions = await Session.find()
    .populate("lastUpdatedBy", "first_name last_name email")
    .populate("createdBy", "first_name last_name email")
    .sort({ updatedAt: -1 })
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .lean()

    return sessions;
}

module.exports = {
    createSession,
    updateSession,
    getSession,
    deleteSession,
    allSession
}