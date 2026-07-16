import PrismaClient from '../prisma';
import { ApiError } from '../utils/errors/ApiError';
import { StatusCodes } from 'http-status-codes';

class UserService {
    public findUser = async (id: string) => {
        try {
            const user = await PrismaClient.user.findUnique({
                where: { id },
                include: {
                    _count: {
                        select: {
                            posts: true,
                            comments: true,
                            likes: true
                        }
                    }
                }
            });
            if (!user) {
                throw new ApiError(StatusCodes.NOT_FOUND, `User not found for id: ${id}`);
            }
            return user;
        } catch (error) {
            console.error(`Error to find user: ${error}`);
            throw error;
        }
    }

    public async updateFcmToken(userId: string, fcmToken: string) {
        try {
            return await PrismaClient.user.update({
                where: { id: userId },
                data: { fcmToken }
            });
        } catch (error) {
            console.error('Error in updateFcmToken service:', error);
            throw error;
        }
    }

    public async getUserNotifications(userId: string) {
        try {
            return await PrismaClient.notification.findMany({
                where: { userId },
                orderBy: { createdAt: 'desc' },
                include: {
                    sender: {
                        select: {
                            id: true,
                            fullName: true,
                            username: true,
                            avatarConfig: true
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Error in getUserNotifications service:', error);
            throw error;
        }
    }
}

export default UserService;
