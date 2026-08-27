import { FormEvent, useState } from "react";
import { LogIn, LogOut } from "lucide-react";
import { trpc } from "@/lib/trpc";

export function AdminPasswordLogin({ title, description }: { title: string; description: string }) {
  const utils = trpc.useUtils();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const login = trpc.adminAccess.login.useMutation({
    onSuccess: async () => {
      setPassword("");
      await utils.adminAccess.status.invalidate();
    },
  });
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    login.mutate({ username: username.trim(), password });
  };

  return <main className="admin-blog-shell"><section className="admin-auth-card"><p className="admin-kicker">HIPA Masalas</p><h1>{title}</h1><p>{description}</p><form className="admin-blog-form" autoComplete="off" onSubmit={submit}><label>Username<input autoComplete="off" value={username} required maxLength={128} onChange={(event) => setUsername(event.target.value)} /></label><label>Password<input autoComplete="new-password" type="password" value={password} required maxLength={256} onChange={(event) => setPassword(event.target.value)} /></label>{login.isError ? <p className="admin-message error" role="alert">Username or password is incorrect.</p> : null}<button className="admin-primary-button" type="submit" disabled={login.isPending}><LogIn size={17} />{login.isPending ? "Signing in…" : "Sign in"}</button></form></section></main>;
}

export function AdminPasswordLogoutButton() {
  const utils = trpc.useUtils();
  const logout = trpc.adminAccess.logout.useMutation({
    onSuccess: async () => {
      await utils.adminAccess.status.invalidate();
    },
  });
  return <button className="admin-secondary-button" type="button" onClick={() => logout.mutate()} disabled={logout.isPending}><LogOut size={16} /> Sign out</button>;
}
