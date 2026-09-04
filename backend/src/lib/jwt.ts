if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

export const JWT_SECRET = process.env.JWT_SECRET;

declare module "hono" {
  interface ContextVariableMap {
    jwtPayload: JwtPayload;
  }
}
export type JwtPayload = {
  sub: string;
  email: string;
  role: string;
  exp: number;
};
