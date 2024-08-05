import jwt from "jsonwebtoken";
import { z } from "zod";

const payload_schema = z.object({
  id: z.string().uuid(),
});

export type Payload = z.infer<typeof payload_schema>;

export function sign(data: Payload, secret: string): string {
  const payload = payload_schema.parse(data);
  return jwt.sign(payload, secret);
}

export function verify(token: string, secret: string): Payload {
  return payload_schema.parse(jwt.verify(token, secret));
}
