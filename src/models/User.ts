import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser {
    name: string;
    surname: string;
    username: string;
    email: string;
    password: string;
    enabled: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface IUserModel extends IUser, Document {
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        surname: { type: String, required: true },
        username: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        enabled: { type: Boolean, default: true }
    },
    {
        timestamps: true,
        versionKey: false,
        id: false,
        toJSON: {
            virtuals: true,
            transform: function (doc, ret) {
                delete ret.password;
                return ret;
            }
        },
        toObject: {
            virtuals: true
        }
    }
);

/**
 * Virtual: rutas creadas por el usuario
 */
UserSchema.virtual('routes', {
    ref: 'Route',
    localField: '_id',
    foreignField: 'userId',
    select: 'name _id'
});

/**
 * Hook: hashea la contraseña antes de guardar
 */
UserSchema.pre('save', async function (next) {
    const user = this as IUserModel;

    if (!user.isModified('password')) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        next();
    } catch (error) {
        next(error as Error);
    }
});

/**
 * Método para comparar contraseña
 */
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUserModel>('User', UserSchema);