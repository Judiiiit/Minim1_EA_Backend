import RouteModel, { IRoute } from '../models/Route';

const createRoute = async (input: IRoute) => {
    const route = new RouteModel(input);
    return await route.save();
};

const getRoute = async (RouteId: string) => {
    return await RouteModel.findById(RouteId).exec();
};

const getAllRoutes = async () => {
    return await RouteModel.find().exec();
};

const updateRoute = async (RouteId: string, input: Partial<IRoute>) => {
    return await RouteModel.findByIdAndUpdate(RouteId, input, { new: true }).exec();
};

const deleteRoute = async (RouteId: string) => {
    return await RouteModel.findByIdAndDelete(RouteId).exec();
};

export default {
    createRoute,
    getRoute,
    getAllRoutes,
    updateRoute,
    deleteRoute
};