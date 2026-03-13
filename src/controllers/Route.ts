import { NextFunction, Request, Response } from 'express';
import RouteService from '../services/Route';

const createRoute = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const savedRoute = await RouteService.createRoute(req.body);
        return res.status(201).json(savedRoute);
    } catch (error) {
        return res.status(500).json({ error });
    }
};

const readRoute = async (req: Request, res: Response, next: NextFunction) => {
    const RouteId = req.params.RouteId;

    try {
        const route = await RouteService.getRoute(RouteId);
        return route
            ? res.status(200).json(route)
            : res.status(404).json({ message: 'not found' });
    } catch (error) {
        return res.status(500).json({ error });
    }
};

const readAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const routes = await RouteService.getAllRoutes();
        return res.status(200).json(routes);
    } catch (error) {
        return res.status(500).json({ error });
    }
};

const updateRoute = async (req: Request, res: Response, next: NextFunction) => {
    const RouteId = req.params.RouteId;

    try {
        const updatedRoute = await RouteService.updateRoute(RouteId, req.body);
        return updatedRoute
            ? res.status(200).json(updatedRoute)
            : res.status(404).json({ message: 'not found' });
    } catch (error) {
        return res.status(500).json({ error });
    }
};

const deleteRoute = async (req: Request, res: Response, next: NextFunction) => {
    const RouteId = req.params.RouteId;

    try {
        const route = await RouteService.deleteRoute(RouteId);
        return route
            ? res.status(200).json(route)
            : res.status(404).json({ message: 'not found' });
    } catch (error) {
        return res.status(500).json({ error });
    }
};

export default {
    createRoute,
    readRoute,
    readAll,
    updateRoute,
    deleteRoute
};