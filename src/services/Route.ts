import RouteModel, { IRoute } from '../models/Route';
import PointModel from '../models/Point';
import ReviewModel from '../models/Review';

type PaginationLimit = 10 | 25 | 50;

type PaginationParams = {
    limit: PaginationLimit;
    page: number;
};

type PaginatedResult<T> = {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
};

type ListResult<T> = PaginatedResult<T> | T[];

const calculateRatingAverage = async (routeId: string) => {
    const reviews = await ReviewModel.find({ routeId }).exec();

    let total = 0;
    let count = 0;

    for (const review of reviews) {
        for (const rating of review.ratings) {
            total += rating.score;
            count++;
        }
    }

    return count > 0 ? Number((total / count).toFixed(2)) : 0;
};

const addAverageToRoute = async (route: any) => {
    const routeObject = route.toObject ? route.toObject() : route;
    const ratingAverage = await calculateRatingAverage(String(routeObject._id));

    return {
        ...routeObject,
        ratingAverage
    };
};

const createRoute = async (input: IRoute) => {
    const route = new RouteModel(input);
    return await route.save();
};

const getRoute = async (routeId: string) => {
    const route = await RouteModel.findById(routeId).populate('points').populate('reviews').exec();

    if (!route) {
        return null;
    }

    return await addAverageToRoute(route);
};

const getAllRoutes = async (pagination?: PaginationParams): Promise<ListResult<IRoute>> => {
    if (!pagination) {
        const routes = await RouteModel.find().sort({ _id: 1 }).populate('points').populate('reviews').exec();

        const routesWithAverage = [];
        for (const route of routes) {
            routesWithAverage.push(await addAverageToRoute(route));
        }

        return routesWithAverage;
    }

    const { limit, page } = pagination;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([RouteModel.find().sort({ _id: 1 }).skip(skip).limit(limit).populate('points').populate('reviews').exec(), RouteModel.countDocuments()]);

    const routesWithAverage = [];
    for (const route of data) {
        routesWithAverage.push(await addAverageToRoute(route));
    }

    return {
        data: routesWithAverage,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    };
};

const updateRoute = async (routeId: string, input: Partial<IRoute>) => {
    const updatedRoute = await RouteModel.findByIdAndUpdate(routeId, input, { new: true }).populate('points').populate('reviews').exec();

    if (!updatedRoute) {
        return null;
    }

    return await addAverageToRoute(updatedRoute);
};

const deleteRoute = async (routeId: string) => {
    await PointModel.deleteMany({ routeId }).exec();
    await ReviewModel.deleteMany({ routeId }).exec();
    return await RouteModel.findByIdAndDelete(routeId).exec();
};

export default {
    createRoute,
    getRoute,
    getAllRoutes,
    updateRoute,
    deleteRoute
};
