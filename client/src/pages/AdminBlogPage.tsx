import { ImageUp, LogOut, Pencil, Plus, Save, Send, Trash2, X } from "lucide-react";
import { FormEvent, useState } from "react";
import { Link } from "wouter";
import { AdminPasswordLogin } from "@/components/AdminPasswordAccess";
import { trpc } from "@/lib/trpc";

type BlogForm = {
  id?: number;
  title: string;
  slug: string;
  description: string;
  body: string;
  authorName: string;
  coverImageUrl: string;
  coverImageAlt: string;
  status: "draft" | "published";
};

const emptyForm: BlogForm = {
  title: "",
  slug: "",
  description: "",
  body: "",
  authorName: "HIPA Masala",
  coverImageUrl: "",
  coverImageAlt: "",
  status: "draft",
};

function slugFromTitle(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function errorText(error: unknown) {
  return error instanceof Error ? error.message : "The blog post could not be saved. Please try again.";
}

export function AdminBlogPage() {
  const utils = trpc.useUtils();
  const adminAccess = trpc.adminAccess.status.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
  });
  const isAdmin = adminAccess.data?.authenticated === true;
  const posts = trpc.blog.adminList.useQuery(undefined, { enabled: isAdmin, retry: false });
  const [form, setForm] = useState<BlogForm>(emptyForm);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const uploadCoverImage = trpc.blog.uploadCoverImage.useMutation({
    onSuccess: (upload) => {
      setForm((current) => ({ ...current, coverImageUrl: upload.url }));
      setNotice("Cover image uploaded. Add a short image description before saving the article.");
    },
    onError: (uploadError) => setError(errorText(uploadError)),
  });

  const resetForm = () => {
    setForm(emptyForm);
    setNotice("");
    setError("");
  };

  const createPost = trpc.blog.create.useMutation({
    onSuccess: async (post) => {
      await utils.blog.adminList.invalidate();
      setForm({
        id: post.id,
        title: post.title,
        slug: post.slug,
        description: post.description,
        body: post.body,
        authorName: post.authorName,
        coverImageUrl: post.coverImageUrl || "",
        coverImageAlt: post.coverImageAlt || "",
        status: post.status,
      });
      setNotice(post.status === "published" ? "The article is published on the website." : "Draft saved. It is not public yet.");
    },
    onError: (mutationError) => setError(errorText(mutationError)),
  });

  const updatePost = trpc.blog.update.useMutation({
    onSuccess: async (post) => {
      await utils.blog.adminList.invalidate();
      if (post) {
        setNotice(post.status === "published" ? "The published article has been updated." : "Draft updated. It is not public yet.");
      }
    },
    onError: (mutationError) => setError(errorText(mutationError)),
  });

  const deletePost = trpc.blog.delete.useMutation({
    onSuccess: async () => {
      await utils.blog.adminList.invalidate();
      resetForm();
      setNotice("The blog post has been removed from the website.");
    },
    onError: (mutationError) => setError(errorText(mutationError)),
  });

  const logout = trpc.adminAccess.logout.useMutation({
    onSuccess: async () => {
      await utils.adminAccess.status.invalidate();
    },
  });

  const savePost = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNotice("");
    setError("");
    const post = {
      title: form.title.trim(),
      slug: form.slug.trim(),
      description: form.description.trim(),
      body: form.body.trim(),
      authorName: form.authorName.trim(),
      coverImageUrl: form.coverImageUrl.trim() || undefined,
      coverImageAlt: form.coverImageAlt.trim() || undefined,
      status: form.status,
    };
    if (form.id) {
      updatePost.mutate({ id: form.id, post });
    } else {
      createPost.mutate(post);
    }
  };

  const editPost = (post: NonNullable<typeof posts.data>[number]) => {
    setForm({
      id: post.id,
      title: post.title,
      slug: post.slug,
      description: post.description,
      body: post.body,
      authorName: post.authorName,
      coverImageUrl: post.coverImageUrl || "",
      coverImageAlt: post.coverImageAlt || "",
      status: post.status,
    });
    setNotice("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCoverImageUpload = (file: File | undefined) => {
    if (!file) return;
    setError("");
    setNotice("");
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"] as const;
    if (!allowedTypes.includes(file.type as (typeof allowedTypes)[number])) {
      setError("Choose a PNG, JPG, WebP or GIF image.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Choose an image smaller than 5 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => setError("The selected image could not be read. Please try again.");
    reader.onload = () => {
      const dataUrl = typeof reader.result === "string" ? reader.result : "";
      const base64 = dataUrl.split(",")[1];
      if (!base64) {
        setError("The selected image could not be read. Please try again.");
        return;
      }
      uploadCoverImage.mutate({
        fileName: file.name,
        contentType: file.type as "image/jpeg" | "image/png" | "image/webp" | "image/gif",
        base64,
      });
    };
    reader.readAsDataURL(file);
  };

  if (adminAccess.isLoading) {
    return <main className="admin-blog-shell"><p className="admin-loading">Checking administrator access…</p></main>;
  }

  if (!isAdmin) {
    return <AdminPasswordLogin title="Blog administration" description="Sign in with the private HIPA administrator username and password to write, edit and publish website blog posts." />;
  }

  const saving = createPost.isPending || updatePost.isPending;

  return (
    <main className="admin-blog-shell">
      <div className="admin-blog-topbar">
        <div>
          <p className="admin-kicker">HIPA Masala</p>
          <h1>Blog administration</h1>
          <p>Draft an article privately, then select “Published” when it is ready to appear on the website.</p>
        </div>
        <div className="admin-top-actions">
          <Link href="/admin/products" className="admin-secondary-button">Product availability</Link>
          <button className="admin-secondary-button" type="button" onClick={() => logout.mutate()}>
            <LogOut size={16} /> Sign out
          </button>
        </div>
      </div>

      <div className="admin-blog-grid">
        <section className="admin-editor-card">
          <div className="admin-card-heading">
            <div>
              <h2>{form.id ? "Edit blog post" : "Create blog post"}</h2>
              <p>Only published posts are visible and indexable on the public website.</p>
            </div>
            {form.id ? <button className="admin-icon-button" type="button" aria-label="Create a new post" onClick={resetForm}><Plus size={18} /></button> : null}
          </div>

          <form className="admin-blog-form" onSubmit={savePost}>
            <label>
              Article title
              <input
                value={form.title}
                maxLength={220}
                required
                onChange={(event) => setForm((current) => ({ ...current, title: event.target.value, slug: current.id || current.slug ? current.slug : slugFromTitle(event.target.value) }))}
              />
            </label>
            <label>
              URL slug
              <input
                value={form.slug}
                maxLength={180}
                required
                pattern="[a-z0-9]+(-[a-z0-9]+)*"
                placeholder="example-masala-guide"
                onChange={(event) => setForm((current) => ({ ...current, slug: slugFromTitle(event.target.value) }))}
              />
              <span className="admin-help">Public link: `/blog/{form.slug || "article-slug"}`</span>
            </label>
            <label>
              Search and social description
              <textarea value={form.description} minLength={40} maxLength={320} required rows={3} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} />
            </label>
            <label>
              Article content
              <textarea value={form.body} minLength={120} maxLength={60000} required rows={14} placeholder="Write the article in normal paragraphs. Separate paragraphs with a blank line." onChange={(event) => setForm((current) => ({ ...current, body: event.target.value }))} />
            </label>
            <div className="admin-field-row">
              <label>
                Author
                <input value={form.authorName} maxLength={160} required onChange={(event) => setForm((current) => ({ ...current, authorName: event.target.value }))} />
              </label>
              <label>
                Publication status
                <select value={form.status} onChange={(event) => setForm((current) => ({ ...current, status: event.target.value as BlogForm["status"] }))}>
                  <option value="draft">Draft — private</option>
                  <option value="published">Published — public</option>
                </select>
              </label>
            </div>

            <details className="admin-image-details">
              <summary>Optional cover image</summary>
              <label>
                Upload from your computer
                <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" disabled={uploadCoverImage.isPending} onChange={(event) => handleCoverImageUpload(event.target.files?.[0])} />
                <span className="admin-help">PNG, JPG, WebP or GIF. Maximum 5 MB. It appears on the website only after it is attached to a saved post that you publish.</span>
              </label>
              {uploadCoverImage.isPending ? <p className="admin-uploading"><ImageUp size={16} /> Uploading cover image…</p> : null}
              {form.coverImageUrl ? <img className="admin-cover-preview" src={form.coverImageUrl} alt={form.coverImageAlt || "Selected blog cover preview"} /> : null}
              <label>
                Image URL
                <input value={form.coverImageUrl} maxLength={2048} type="url" placeholder="https://example.com/cover.webp or /uploads/cover.webp" onChange={(event) => setForm((current) => ({ ...current, coverImageUrl: event.target.value }))} />
              </label>
              <label>
                Image description
                <input value={form.coverImageAlt} maxLength={255} onChange={(event) => setForm((current) => ({ ...current, coverImageAlt: event.target.value }))} />
              </label>
            </details>

            {error ? <p className="admin-message error" role="alert">{error}</p> : null}
            {notice ? <p className="admin-message success" role="status">{notice}</p> : null}

            <div className="admin-editor-actions">
              <button className="admin-primary-button" type="submit" disabled={saving || uploadCoverImage.isPending}>
                {form.status === "published" ? <Send size={17} /> : <Save size={17} />}
                {saving ? "Saving…" : form.status === "published" ? "Publish changes" : "Save draft"}
              </button>
              {form.id ? (
                <button className="admin-danger-button" type="button" disabled={deletePost.isPending} onClick={() => { if (window.confirm("Remove this blog post? This cannot be undone.")) deletePost.mutate({ id: form.id! }); }}>
                  <Trash2 size={17} /> Remove
                </button>
              ) : (
                <button className="admin-secondary-button" type="button" onClick={resetForm}><X size={17} /> Clear</button>
              )}
            </div>
          </form>
        </section>

        <aside className="admin-post-list">
          <div className="admin-card-heading">
            <div>
              <h2>All posts</h2>
              <p>{posts.data?.length || 0} saved</p>
            </div>
            <button className="admin-icon-button" type="button" aria-label="Create a new post" onClick={resetForm}><Plus size={18} /></button>
          </div>
          {posts.isLoading ? <p className="admin-empty">Loading posts…</p> : null}
          {posts.isError ? <p className="admin-empty">Saved posts are temporarily unavailable. Refresh the page and try again.</p> : null}
          {!posts.isLoading && !posts.isError && posts.data?.length ? (
            <div className="admin-post-items">
              {posts.data.map((post) => (
                <button key={post.id} className={`admin-post-item ${form.id === post.id ? "selected" : ""}`} type="button" onClick={() => editPost(post)}>
                  <span className={`admin-status ${post.status}`}>{post.status}</span>
                  <strong>{post.title}</strong>
                  <small>/blog/{post.slug}</small>
                  <Pencil size={15} />
                </button>
              ))}
            </div>
          ) : null}
          {!posts.isLoading && !posts.isError && !posts.data?.length ? <p className="admin-empty">No blog posts yet. Create the first draft here.</p> : null}
        </aside>
      </div>
    </main>
  );
}
