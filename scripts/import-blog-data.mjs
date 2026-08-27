import "dotenv/config";
import fs from "node:fs";
import mysql from "mysql2/promise";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required. Copy .env.example to .env and configure MySQL first.");
}

const posts = JSON.parse(fs.readFileSync(new URL("../data/blog-posts.json", import.meta.url), "utf8"));
const connection = await mysql.createConnection(process.env.DATABASE_URL);

for (const post of posts) {
  await connection.execute(
    `INSERT INTO blogPosts (id, slug, title, description, body, authorName, coverImageUrl, coverImageAlt, status, publishedAt, createdByUserId, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE title = VALUES(title), description = VALUES(description), body = VALUES(body), authorName = VALUES(authorName), coverImageUrl = VALUES(coverImageUrl), coverImageAlt = VALUES(coverImageAlt), status = VALUES(status), publishedAt = VALUES(publishedAt), updatedAt = VALUES(updatedAt)`,
    [post.id, post.slug, post.title, post.description, post.body, post.authorName, post.coverImageUrl, post.coverImageAlt, post.status, post.publishedAt, post.createdByUserId, post.createdAt, post.updatedAt],
  );
}

await connection.end();
console.log(`Imported ${posts.length} published blog posts.`);
