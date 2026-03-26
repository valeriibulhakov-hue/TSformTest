import { createServer } from 'node:http';
import { createYoga } from 'graphql-yoga';
import { schema } from './graphql/schema';

const PORT = process.env.PORT || 4000;

const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:5173'];

const yoga = createYoga({
  schema,
  cors: {
    origin: ALLOWED_ORIGINS,
    credentials: true,
  },
});

const server = createServer(yoga);

server.listen(PORT, () => {
  console.log(`🚀 http://localhost:${PORT}/graphql`);
});