export const verifyUserAuthMiddlewawre = (req, res, next) => {

    const { dailyLimitNumber, userEmailString } = req.user;

    // TODO: Ideally check for isGmailConnected here, but currently we rely on userEmailString presence
    if (!dailyLimitNumber || !userEmailString) {
        return res.status(401).json({ message: 'User profile incomplete for automation.' });
    }

    next();
}