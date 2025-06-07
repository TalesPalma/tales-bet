import express from 'express';
import { initDb } from './repositories/pg.connections';
import { UserRouters } from './routers/user.router';

const app = express();
app.use(express.json());

// Initialize database connection
const PORT = 8080;
initDb();

const userRouter = new UserRouters();
app.use('/login', userRouter.router)


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
