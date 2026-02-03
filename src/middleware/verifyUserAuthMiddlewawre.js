export const verifyUserAuthMiddlewawre = (req, res, next) => {

    const { dailyLimitNumber, userEmailString, appPasswordString } = req.user;

    if (!dailyLimitNumber || !userEmailString || !appPasswordString) {
        return res.status(401).json({ message: 'You are not authorized to access this resource' });
    }

    next();
}