import { NextFunction, Request, Response } from 'express';
import PointService from '../services/Point';
import { parsePagination } from '../library/Pagination';

const createPoint = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const savedPoint = await PointService.createPoint(req.body);
        return res.status(201).json(savedPoint);
    } catch (error) {
        return res.status(500).json({ error });
    }
};

const readPoint = async (req: Request, res: Response, next: NextFunction) => {
    const pointId = req.params.pointId;

    try {
        const point = await PointService.getPoint(pointId);
        return point
            ? res.status(200).json(point)
            : res.status(404).json({ message: 'not found' });
    } catch (error) {
        return res.status(500).json({ error });
    }
};

const readAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const pagination = parsePagination(req.query);
        const points = await PointService.getAllPoints(pagination);
        return res.status(200).json(points);
    } catch (error) {
        return res.status(500).json({ error });
    }
};

const readByRoute = async (req: Request, res: Response, next: NextFunction) => {
    const routeId = req.params.routeId;

    try {
        const points = await PointService.getPointsByRoute(routeId);
        return res.status(200).json(points);
    } catch (error) {
        return res.status(500).json({ error });
    }
};

const updatePoint = async (req: Request, res: Response, next: NextFunction) => {
    const pointId = req.params.pointId;

    try {
        const updatedPoint = await PointService.updatePoint(pointId, req.body);
        return updatedPoint
            ? res.status(200).json(updatedPoint)
            : res.status(404).json({ message: 'not found' });
    } catch (error) {
        return res.status(500).json({ error });
    }
};

const deletePoint = async (req: Request, res: Response, next: NextFunction) => {
    const pointId = req.params.pointId;

    try {
        const point = await PointService.deletePoint(pointId);
        return point
            ? res.status(200).json(point)
            : res.status(404).json({ message: 'not found' });
    } catch (error) {
        return res.status(500).json({ error });
    }
};

export default {
    createPoint,
    readPoint,
    readAll,
    readByRoute,
    updatePoint,
    deletePoint
};