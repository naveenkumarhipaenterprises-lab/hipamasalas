# WordPress Setup Guide — HIPA Masala Blog

The Blog section of this website (`blog.html` and `blog-details.html`) is built to read
posts from a WordPress site using WordPress's built-in public REST API. WordPress is used
purely as a headless content source — no WordPress theme, plugin, or admin page is ever
shown to your website visitors. Nothing on the frontend connects to WordPress until you
put a real URL into `config.js` (see Step 6).

---

## 1. Set up WordPress

You need a WordPress site somewhere reachable over the internet (a subdomain like
`blog.hipamasalas.com`, or any WordPress host — e.g. WordPress.com Business plan,
Bluehost, SiteGround, or a self-hosted install). Any standard WordPress 5.5+ install
already has the REST API turned on by default — you don't need to install anything extra
to enable it.

Steps:
1. Install WordPress on your chosen host (most hosts offer a 1-click WordPress installer).
2. Log into `/wp-admin` with the admin account you created during install.
3. Confirm the REST API is reachable by visiting `https://your-site.com/wp-json/wp/v2/posts`
   in a browser — you should see JSON text (even if it's just `[]` for no posts yet).

---

## 2. Create categories

Blog category tabs on `blog.html` are generated automatically from whatever categories
your published posts actually use — nothing is hardcoded on the website side.

1. In `/wp-admin`, go to **Posts → Categories**.
2. Add categories that make sense for HIPA Masala content, e.g. *Recipes*, *Cooking Tips*,
   *Spice Guides*, *Health Benefits*.
3. You can add more categories at any time — the website will pick them up automatically
   the next time it loads posts.

---

## 3. Create a blog post

1. Go to **Posts → Add New**.
2. Add a **Title** — this becomes the article title and page `<title>` on the site.
3. Write the post body using the block editor as normal.
4. In the right-hand sidebar, assign it to a **Category**.
5. Check the **Excerpt** box (or just let WordPress auto-generate one) — the website uses
   the excerpt for the card preview text on the blog listing page.
6. Note the **Permalink slug** shown under the title — the site uses this slug in the
   article URL (`blog-details.html?slug=your-slug`).

---

## 4. Add a featured image

1. In the **Featured Image** panel (bottom-right of the post editor), click **Set featured
   image**.
2. Upload or choose an image. This becomes the card thumbnail on `blog.html` and the hero
   image on `blog-details.html`. If no featured image is set, the site shows a plain
   text placeholder instead — it will not show a broken image icon.

---

## 5. Publish

Click **Publish** (top-right). The post becomes available immediately at
`https://your-site.com/wp-json/wp/v2/posts` — this is what the HIPA Masala site reads.

---

## 6. WordPress REST API URL — where to put it

Open `config.js` in the website project and find:

```js
WORDPRESS_API_URL: "REPLACE_WITH_REAL_VALUE"
```

Replace the placeholder with your real REST API base URL, for example:

```js
WORDPRESS_API_URL: "https://blog.hipamasalas.com/wp-json/wp/v2"
```

Do **not** put an admin username, password, or API secret here — this is a public,
read-only endpoint by design. Nothing else in the codebase needs to change; every blog
page reads this one value.

---

## 7. CORS considerations

Because the website (e.g. `https://www.hipamasalas.com`) and WordPress
(e.g. `https://blog.hipamasalas.com`) are different origins, the browser will enforce
CORS when the site's JavaScript calls the WordPress REST API.

- Most standard WordPress installs already send permissive CORS headers for the REST API
  by default, so this often works with no extra setup.
- If you see a CORS error in the browser console (F12 → Console) after connecting a real
  URL, you'll need to explicitly allow your website's domain. Options, roughly in order of
  simplicity:
  - A small must-use plugin or a snippet in your theme's `functions.php` that adds an
    `Access-Control-Allow-Origin` header for your site's domain on REST requests.
  - A free CORS-enabling plugin from the WordPress plugin directory.
  - If your host uses a reverse proxy / CDN (e.g. Cloudflare), a header rule there instead.
- Keep this scoped to your own domain rather than allowing all origins (`*`), since this
  is a production site.

---

## 8. How to test the API

Before wiring it into the site, test the endpoint directly:

1. Visit `https://your-wp-site.com/wp-json/wp/v2/posts?_embed` in a browser. You should
   see a JSON array of your published posts, each including `title`, `excerpt`, `slug`,
   `content`, and (thanks to `_embed`) the featured image and category data.
2. Visit `https://your-wp-site.com/wp-json/wp/v2/posts?slug=your-post-slug&_embed` to
   confirm a single post can be fetched by slug — this is exactly what `blog-details.html`
   uses.
3. If either URL returns an error or empty response, fix that at the WordPress level
   first (check the post is actually **Published**, not Draft) before touching the
   website code.

---

## 9. How to confirm the post appears on the HIPA website

1. Put your real API URL into `config.js` as described in Step 6.
2. Deploy/refresh the site (or open `blog.html` locally if you've already set the URL).
3. The blog grid should show a loading spinner briefly, then your published post(s) as
   cards. Category tabs should appear automatically for any categories in use.
4. Click a card (or "Read More") — it should take you to
   `blog-details.html?slug=your-post-slug` and render the full article, featured image,
   author, date, and related posts from the same category.
5. If nothing appears and the grid shows "We couldn't load the blog right now," open the
   browser console (F12) for the actual fetch error — this is almost always either a typo
   in the API URL or a CORS issue (see Step 7).

Until Step 6 is done, `blog.html` will correctly show a **"Blog coming soon"** placeholder
instead of attempting any connection — this is expected behavior, not a bug.
