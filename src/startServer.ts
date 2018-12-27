// Part 9 10:02 - issues with line 25
// Part 9 14:32 - last position - line 36
// Part 9 18:40 - updates to resolvers, graphql-utils.d.ts, startServer.ts

// docker setup:
// docker redis install: docker pull redis
// docker run redis-server: docker run --name some-redis -d redis
// docker redis-cli: docker run -it --link some-redis:redis --rm redis redis-cli -h redis -p 6379

// restart container on next bootup:
// list container ID: "docker container ls"
// docker start <container ID>
// docker stop <container ID>
// docker rm <container ID>
// docker redis-cli: docker run -it --link some-redis:redis --rm redis redis-cli -h redis -p 6379
// try: docker run -p 6379:6379 --name some-redis -d redis
// ref: https://github.com/andymccurdy/redis-py/issues/852
// try: docker run -d -p 6379:6379 redis --port 6379 redis-cli -h 127.0.0.1 -p 6379

// ref: https://blogs.msdn.microsoft.com/uk_faculty_connection/2017/02/21/containers-redis-running-redis-on-windows-with-docker/


// set bind 0.0.0.0
// https://stackoverflow.com/questions/41371402/connecting-to-redis-running-in-docker-container-from-host-machine


import { importSchema } from 'graphql-import';
import { GraphQLServer } from 'graphql-yoga';
import * as path from 'path';
import * as fs from 'fs';
import { mergeSchemas, makeExecutableSchema } from 'graphql-tools';
import { GraphQLSchema } from 'graphql';
import * as Redis from 'ioredis';

import { createTypeormConn } from './utils/createTypeormConn';
import { User } from './entity/User';

export const startServer = async () => {
  const schemas: GraphQLSchema[] = [];
  const folders = fs.readdirSync(path.join(__dirname, './modules'));
  folders.forEach(folder => {
    const { resolvers } = require(`./modules/${folder}/resolvers`);
    const typeDefs = importSchema(
      path.join(__dirname, `./modules/${folder}/schema.graphql`)
    );
    schemas.push(makeExecutableSchema({ resolvers, typeDefs }));
  });

  const redis = new Redis();
  const server = new GraphQLServer({
    schema: mergeSchemas({ schemas }),
    context: ({ request }) => ({
      redis,
      url: request.protocol + '://' + request.get('host')
    })
  });

  server.express.get('/confirm/:id', async (req, res) => {
    const { id } = req.params;
    const userId = await redis.get(id);
    await User.update({ id: userId! }, { confirmed: true });
    res.send('ok');
  });

  await createTypeormConn();
  const app = await server.start({
    port: process.env.NODE_ENV === 'test' ? 0 : 4000
  });
  console.log('Server is running on localhost:4000');

  return app;
};
