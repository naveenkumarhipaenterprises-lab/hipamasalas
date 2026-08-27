import { LogOut } from "lucide-react";
import { Link } from "wouter";
import { AdminPasswordLogin } from "@/components/AdminPasswordAccess";
import { products } from "@shared/hipaContent";
import { trpc } from "@/lib/trpc";

function errorText(error: unknown) {
  return error instanceof Error ? error.message : "The product status could not be saved. Please try again.";
}

export function AdminProductAvailabilityPage() {
  const utils = trpc.useUtils();
  const me = trpc.auth.me.useQuery(undefined, { retry: false, refetchOnWindowFocus: false });
  const adminAccess = trpc.adminAccess.status.useQuery(undefined, { retry: false, refetchOnWindowFocus: false });
  const isAdmin = adminAccess.data?.authenticated === true;
  const records = trpc.productAvailability.adminList.useQuery(undefined, { enabled: isAdmin, retry: false });
  const update = trpc.productAvailability.set.useMutation({
    onSuccess: async () => {
      await Promise.all([
        utils.productAvailability.adminList.invalidate(),
        utils.productAvailability.publicList.invalidate(),
      ]);
    },
  });
  const logout = trpc.adminAccess.logout.useMutation({
    onSuccess: async () => {
      await utils.adminAccess.status.invalidate();
    },
  });

  if (me.isLoading || adminAccess.isLoading) return <main className="admin-blog-shell"><p className="admin-loading">Checking administrator access…</p></main>;

  if (!isAdmin) return <AdminPasswordLogin title="Product administration" description="Sign in with the private HIPA administrator username and password to update public product availability." />;

  if (!isAdmin) {
    return <main className="admin-blog-shell"><section className="admin-auth-card"><p className="admin-kicker">Restricted access</p><h1>This account is not an administrator</h1><p>Only the HIPA owner can change public product availability.</p><button className="admin-secondary-button" type="button" onClick={() => logout.mutate()}><LogOut size={17} /> Sign out</button></section></main>;
  }

  const statusBySlug = new Map(records.data?.map((record) => [record.productSlug, record.status]));
  const savingSlug = update.variables?.slug;
  return <main className="admin-blog-shell"><div className="admin-blog-topbar"><div><p className="admin-kicker">HIPA Masala</p><h1>Product availability</h1><p>Choose whether each product is publicly shown as available or currently unavailable. Changes update the public product cards and detail pages.</p></div><div className="admin-top-actions"><Link href="/admin" className="admin-secondary-button">Blog management</Link><button className="admin-secondary-button" type="button" onClick={() => logout.mutate()}><LogOut size={16} /> Sign out</button></div></div><section className="admin-editor-card admin-availability-card"><div className="admin-card-heading"><div><h2>Public product status</h2><p>Only authenticated administrators can make these updates.</p></div></div>{records.isLoading ? <p className="admin-empty">Loading product statuses…</p> : records.isError ? <p className="admin-message error" role="alert">Product statuses are temporarily unavailable. Refresh and try again.</p> : <div className="admin-availability-list">{products.map((product) => { const status = statusBySlug.get(product.slug) || "available"; const saving = update.isPending && savingSlug === product.slug; return <article className="admin-availability-item" key={product.slug}><div><h3>{product.name}</h3><p className={`admin-status ${status}`}>{status === "available" ? "Available" : "Unavailable"}</p></div><div className="admin-availability-actions"><button className="admin-secondary-button" type="button" disabled={saving || status === "available"} onClick={() => update.mutate({ slug: product.slug, status: "available" })}>Mark available</button><button className="admin-danger-button" type="button" disabled={saving || status === "unavailable"} onClick={() => update.mutate({ slug: product.slug, status: "unavailable" })}>Mark unavailable</button></div>{update.isError && savingSlug === product.slug ? <p className="admin-message error" role="alert">{errorText(update.error)}</p> : null}</article>; })}</div>}</section></main>;
}
