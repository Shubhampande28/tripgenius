// Shared "enter admin key" gate, shown by any /admin* page when
// isAdminAuthorized() fails. Submits as a GET so the key lands back in the
// URL's query string, which is how every /admin* page re-checks auth.
export default function AdminDenied({ title = 'Admin access' }: { title?: string }) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-dark px-4">
      <form method="GET" className="bg-surface border border-border rounded-2xl p-8 max-w-sm w-full text-center">
        <h1 className="font-heading text-xl font-bold text-primary-text mb-4">{title}</h1>
        <input
          type="password" name="key" placeholder="Admin key" autoFocus
          className="w-full bg-dark border border-border rounded-xl px-4 py-2.5 text-sm text-primary-text mb-3 outline-none focus:border-accent"
        />
        <button type="submit" className="w-full bg-accent text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-accent/90">
          Open dashboard
        </button>
      </form>
    </main>
  );
}
