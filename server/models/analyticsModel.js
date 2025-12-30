import db from '../config/db.js';
import Review from './reviewModel.js';

const Analytics = {
    /**
     * options: { startDate: ISO string, endDate: ISO string, status: string }
     */
    async overview(mentorId, options = {}) {
        const { startDate, endDate, status } = options;

        const paramsBase = [mentorId];
        // build date filters
        let dateClause = '';
        const paramsForDates = [];
        if (startDate && endDate) {
            dateClause = ' AND start_time BETWEEN ? AND ?';
            paramsForDates.push(startDate, endDate);
        } else if (startDate) {
            dateClause = ' AND start_time >= ?';
            paramsForDates.push(startDate);
        } else if (endDate) {
            dateClause = ' AND start_time <= ?';
            paramsForDates.push(endDate);
        }

        // total mentees (active unless status override)
        const menteeStatusFilter = status ? 'AND status = ?' : "AND status = 'active'";
        const menteeParams = status ? [mentorId, status] : [mentorId];
        const totalMenteesPromise = db.execute(
            `SELECT COUNT(*) as total FROM mentor_mentees WHERE mentor_id = ? ${menteeStatusFilter}`,
            menteeParams
        );

        // upcoming sessions (default: start_time >= NOW())
        let upcomingQuery = `SELECT COUNT(*) as upcoming FROM sessions WHERE mentor_id = ? AND status IN ('accepted','requested')`;
        let upcomingParams = [mentorId];
        if (dateClause) {
            upcomingQuery += dateClause;
            upcomingParams = upcomingParams.concat(paramsForDates);
        } else {
            upcomingQuery += ' AND start_time >= NOW()';
        }
        const upcomingPromise = db.execute(upcomingQuery, upcomingParams);

        // pending requests (sessions with status='requested')
        let pendingQuery = `SELECT COUNT(*) as pending FROM sessions WHERE mentor_id = ? AND status = 'requested'`;
        let pendingParams = [mentorId];
        if (dateClause) {
            pendingQuery += dateClause;
            pendingParams = pendingParams.concat(paramsForDates);
        } else {
            pendingQuery += ' AND start_time >= NOW()';
        }
        const pendingPromise = db.execute(pendingQuery, pendingParams);

        // ratings & count (use Review.statsForMentor)
        const ratingsPromise = Review.statsForMentor(mentorId);

        // earnings: sum price for accepted or completed sessions
        let earningsQuery = `SELECT COALESCE(SUM(price),0) as earnings FROM sessions WHERE mentor_id = ? AND status IN ('accepted','completed')`;
        let earningsParams = [mentorId];
        if (dateClause) {
            earningsQuery += dateClause;
            earningsParams = earningsParams.concat(paramsForDates);
        }
        const earningsPromise = db.execute(earningsQuery, earningsParams);

        const [[menteeRows], [upcomingRows], [pendingRows], ratings, [earningsRows]] = await Promise.all([
            totalMenteesPromise,
            upcomingPromise,
            pendingPromise,
            ratingsPromise,
            earningsPromise
        ]);

        const totalMentees = menteeRows[0] ? menteeRows[0].total : 0;
        const upcomingSessions = upcomingRows[0] ? upcomingRows[0].upcoming : 0;
        const pendingRequests = pendingRows[0] ? pendingRows[0].pending : 0;
        const avgRating = ratings && ratings.avgRating ? Number(Number(ratings.avgRating).toFixed(2)) : null;
        const reviewsCount = ratings && ratings.count ? Number(ratings.count) : 0;
        const earnings = earningsRows[0] ? Number(earningsRows[0].earnings || 0) : 0;

        return {
            totalMentees,
            upcomingSessions,
            pendingRequests,
            avgRating,
            reviewsCount,
            earnings
        };
    }
};

export default Analytics;