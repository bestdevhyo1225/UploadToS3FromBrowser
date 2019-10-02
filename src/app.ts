import errorMiddleware from './middlewares/error';
import indexRouter from './routes';
import express from 'express';
import path from 'path';

const app = express();

app.locals.pretty = true;
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '../views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);

app.use(errorMiddleware.error404);
app.use(errorMiddleware.error);

export default app;