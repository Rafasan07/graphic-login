import { withAccelerate } from "@prisma/extension-accelerate";
import { PrismaClient } from "../generated/prisma-client/client";

const prisma = new PrismaClient().$extends(withAccelerate());

const globalForPrisma = global as unknown as { prisma: typeof prisma };

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
export default prisma;