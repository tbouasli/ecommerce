import { FastifyPluginAsync } from "fastify";
import { sign } from "@ecommerce/auth";
import { z } from "zod";
import { db } from "./db";
import { QueryResult } from "pg";

export const auth: FastifyPluginAsync = async (fastify) => {
  const signUpSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });

  fastify.post("/sign-up", async (request, reply) => {
    const { email, password } = signUpSchema.parse(request.body);

    let result: QueryResult;

    try {
      result = await db.query(
        "INSERT INTO users (email, password) VALUES ($1, $2)",
        [email, password]
      );
    } catch (err) {
      return reply.status(500).send({ message: "Database error" });
    }

    const id = result.rows[0].id;

    return reply.send({ token: sign({ id }, "secret") });
  });

  const signInSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });

  fastify.post("/sign-in", async (request, reply) => {
    const { email, password } = signInSchema.parse(request.body);

    let result: QueryResult;

    try {
      result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    } catch (err) {
      return reply.status(500).send({ message: "Database error" });
    }

    if (result.rows.length === 0) {
      return reply.status(401).send({ message: "Invalid email or password" });
    }

    const user = result.rows[0];

    if (user.password !== password) {
      return reply.status(401).send({ message: "Invalid email or password" });
    }

    return reply.send({ token: sign({ id: user.id }, "secret") });
  });
};
