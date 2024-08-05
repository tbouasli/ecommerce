import Fastify from "fastify";
import { auth } from "./auth";

export const fastify = Fastify({
  logger: true,
});

fastify.register(auth);

async function main() {
  try {
    await fastify.listen({ port: 3000 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

main();
