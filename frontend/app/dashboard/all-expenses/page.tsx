"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  useAuth,
} from "@clerk/nextjs";

const categories = [
    "All",
  "Food",
  "Transport",
  "Utilities",
  "Shopping",
  "Health",
  "Other",
];
const PAGE_LIMIT = 10;
const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

interface Expense {
  id: number;
  amount: number;
  category: string;
  description: string;
  date: string;
  note: string;
}

export default function AllExpensesPage() {
  const { userId } = useAuth();
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("date_desc");
  const [page, setPage] = useState(1);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasMore, setHasMore] = useState(false);

  const filterQuery = category === "All" ? "" : `&category=${encodeURIComponent(category)}`;
  const sortQuery = `&sort=${encodeURIComponent(sort)}`;

  useEffect(() => {
    if (!userId) {
      return;
    }

    const loadExpenses = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(
          `${apiBase}/expenses?page=${page}&limit=${PAGE_LIMIT}${sortQuery}${filterQuery}`,
          {
            headers: {
              "X-User-Id": userId,
            },
          }
        );

        if (!response.ok) {
          const errorBody = await response.json().catch(() => null);
          throw new Error(errorBody?.detail || `Unable to load expenses (${response.status})`);
        }

        const data: Expense[] = await response.json();
        setExpenses(data);
        setHasMore(data.length === PAGE_LIMIT);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not load expenses.");
      } finally {
        setLoading(false);
      }
    };

    loadExpenses();
  }, [userId, page, filterQuery, sortQuery]);

  const emptyState = !loading && expenses.length === 0;
  const totalAmount = useMemo(() => expenses.reduce((sum, expense) => sum + expense.amount, 0), [expenses]);

  return (
    <>
      <SignedIn>
        <div className="min-h-screen bg-slate-100 text-slate-900">
          <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
            <header className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-500">All Expenses</p>
                <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">Your full expense history</h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                  Browse your expenses by category and page through them 10 at a time.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/dashboard"
                  className="rounded-full border border-slate-300 bg-slate-50 px-5 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                >
                  Back to home
                </Link>
              </div>
            </header>

            <div className="grid gap-6 xl:grid-cols-[280px_1fr]">
              <aside className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="space-y-2">
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Navigation</p>
                  <nav className="space-y-1">
                    <Link
                      href="/dashboard"
                      className="block rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                    >
                      Home
                    </Link>
                    <div className="block rounded-2xl bg-slate-950 px-4 py-3 text-sm font-medium text-white">
                      All expenses
                    </div>
                  </nav>
                </div>

                <div className="space-y-3 rounded-3xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Page info</p>
                  <div className="flex items-center justify-between text-sm text-slate-700">
                    <span>Page</span>
                    <span className="font-semibold">{page}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-slate-700">
                    <span>Showing</span>
                    <span className="font-semibold">{expenses.length} / {PAGE_LIMIT}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-slate-700">
                    <span>Total shown</span>
                    <span className="font-semibold">₹{totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </aside>

              <section className="space-y-6">
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Filter</p>
                      <h2 className="mt-2 text-xl font-semibold text-slate-950">Filter by category</h2>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                      <select
                        value={category}
                        onChange={(event) => {
                          setCategory(event.target.value);
                          setPage(1);
                        }}
                        className="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900"
                      >
                        {categories.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      <select
                        value={sort}
                        onChange={(event) => {
                          setSort(event.target.value);
                          setPage(1);
                        }}
                        className="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900"
                      >
                        <option value="date_desc">Newest first</option>
                        <option value="date_asc">Oldest first</option>
                      </select>
                    </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-slate-950">Expenses</h2>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        Showing up to 10 expenses per page. Use the filter to narrow results.
                      </p>
                    </div>
                    <div className="rounded-3xl bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700">
                      Page {page}
                    </div>
                  </div>

                  {error ? <p className="mt-4 text-sm text-rose-600">{error}</p> : null}

                  {loading ? (
                    <div className="mt-6 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-600">
                      Loading expenses...
                    </div>
                  ) : emptyState ? (
                    <div className="mt-6 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-600">
                      No expenses found for this category.
                    </div>
                  ) : (
                    <div className="mt-6 space-y-4">
                      {expenses.map((expense) => (
                        <div key={expense.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <p className="text-sm font-semibold text-slate-900">{expense.description}</p>
                              <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-500">
                                {expense.category}
                              </p>
                            </div>
                            <p className="text-lg font-semibold text-slate-950">₹{expense.amount.toFixed(2)}</p>
                          </div>
                          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-sm text-slate-600">
                            <span>{new Date(expense.date).toLocaleDateString()}</span>
                            {expense.note ? <span>{expense.note}</span> : <span className="italic">No note provided</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-6 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      disabled={page === 1}
                      onClick={() => setPage((current) => Math.max(1, current - 1))}
                      className="rounded-full border border-slate-300 bg-white px-5 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      disabled={!hasMore}
                      onClick={() => setPage((current) => current + 1)}
                      className="rounded-full border border-slate-300 bg-white px-5 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </SignedIn>
      <SignedOut>
        <div className="min-h-screen bg-slate-100 px-6 py-12 text-slate-900">
          <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Not signed in</p>
            <h1 className="mt-4 text-3xl font-semibold text-slate-950">Please sign in to view your expenses</h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">Your expense history is private and requires signing in.</p>
            <div className="mt-8 flex items-center justify-center gap-3">
              <SignInButton>
                <button className="rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
                  Sign in
                </button>
              </SignInButton>
            </div>
          </div>
        </div>
      </SignedOut>
    </>
  );
}
