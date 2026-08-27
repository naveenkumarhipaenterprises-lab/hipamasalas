export const ENV = {
  cookieSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  adminLoginUsername: process.env.ADMIN_LOGIN_USERNAME ?? "",
  adminLoginPassword: process.env.ADMIN_LOGIN_PASSWORD ?? "",
};
