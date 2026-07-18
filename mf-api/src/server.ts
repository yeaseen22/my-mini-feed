import { app } from './app/app';
import Prisma from './prisma';

const HOST: string = String(process.env.HOST || '0.0.0.0');
const PORT: number = Number(process.env.PORT || 8080);

(async () => {
    try {
        await Prisma.$connect();
        console.log('------ Database is connected! -------');

        app.listen(PORT, HOST, () => {
            console.log(`Welcome to -- ${process.env.APP_NAME} -- `);
            console.log(`Server is running on http://${HOST}:${PORT}`);
        });

        process.on('SIGINT', async () => {
            await Prisma.$disconnect();
            console.log('Disconnected from database');
            process.exit(0);
        });

    } catch (error) {
        console.error('Failed to connect to database:', error);
        process.exit(1);
    }
})();
