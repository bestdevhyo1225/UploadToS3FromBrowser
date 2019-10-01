import server from './app';

let port: number = (!process.env.PORT) ? 3000 : parseInt(process.env.PORT);

server.listen(port, () => console.log(`Application Server is listening on ${port}`));