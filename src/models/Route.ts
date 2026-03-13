import mongoose, { Document, Schema } from 'mongoose';

export interface IRoute {
    title: string;
    description: string;
    city: string;
    country: string;
    distance: number;
    duration: number;
    difficulty: 'easy' | 'medium' | 'hard';
    tags: string[];
    image?: string;
    authorId: string;
}

export interface IRouteModel extends IRoute, Document {}

const RouteSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        city: { type: String, required: true },
        country: { type: String, required: true },
        distance: { type: Number, required: true },
        duration: { type: Number, required: true },
        difficulty: {
            type: String,
            enum: ['easy', 'medium', 'hard'],
            required: true
        },
        tags: [{ type: String }],
        image: { type: String },
        authorId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

export default mongoose.model<IRouteModel>('Route', RouteSchema);