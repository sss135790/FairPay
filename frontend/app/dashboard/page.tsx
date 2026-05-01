"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  UserButton,
  useAuth,
} from "@clerk/nextjs";
const categories = [
  "Food",
  "Transport",
  "Utilities",
  "Shopping",
  "Health",
  "Other",
];

interface Expense {
  id: number;
  amount: number;
  category: string;
  description: string;
  date: string;
  note: string;
}

const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export default function DashboardPage() {
  const { userId } = useAuth();
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const total = useMemo(
    () => expenses.reduce((sum, expense) => sum + expense.amount, 0),
    [expenses]
  );

  useEffect(() => {
    if (!userId) {
      return;
    }

    const loadExpenses = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${apiBase}/expenses?sort=date_desc`, {
          headers: {
            "X-User-Id": userId,
          },
        });
        if (!response.ok) {
          const errorBody = await response.json().catch(() => null);
          const message = errorBody?.detail || `Unable to load expenses (${response.status})`;
          throw new Error(message);
        }
        const data = await response.json();
        setExpenses(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not load expenses. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadExpenses();
  }, [userId]);

  const submitExpense = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    const parsedAmount = Number(amount);

    if (!date) {
      setError("Please choose a date for this expense.");
      return;
    }
    if (!description.trim()) {
      setError("Please enter a description.");
      return;
    }
    if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Amount must be a positive number.");
      return;
    }
    if (!userId) {
      setError("Unable to submit expense: missing user context.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(`${apiBase}/expenses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-Id": userId,
        },
        body: JSON.stringify({
          amount: parsedAmount,
          category,
          description: description.trim(),
          date,
          note: note.trim(),
        }),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => null);
        throw new Error(errorBody?.detail || "Could not save expense");
      }

      const createdExpense = await response.json();
      setExpenses((current) => [createdExpense, ...current]);
      setAmount("");
      setDescription("");
      setNote("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save expense");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <SignedIn>
        <div className="min-h-screen bg-slate-100 text-slate-900">
          <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
            <header className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-500">Dashboard</p>
                <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">Expense tracker</h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                  Add expenses with category, amount, description, and date.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-2 shadow-sm">
                  <UserButton />
                </div>
                <SignOutButton>
                  <button className="rounded-full bg-slate-950 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">
                    Logout
                  </button>
                </SignOutButton>
              </div>
            </header>

            <div className="grid gap-6 xl:grid-cols-[280px_1fr]">
              <aside className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="space-y-2">
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Navigation</p>
                  <nav className="space-y-1">
                    <Link
                      href="/dashboard"
                      className="block rounded-2xl px-4 py-3 text-sm font-medium transition bg-slate-950 text-white"
                    >
                      Home
                    </Link>
                    <Link
                      href="/dashboard/all-expenses"
                      className="block rounded-2xl px-4 py-3 text-sm font-medium transition text-slate-700 hover:bg-slate-50"
                    >
                      All expenses
                    </Link>
                  </nav>
                </div>

                <div className="space-y-3 rounded-3xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Summary</p>
                  <div className="flex items-center justify-between text-sm text-slate-700">
                    <span>Total items</span>
                    <span className="font-semibold">{expenses.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-slate-700">
                    <span>Current total</span>
                    <span className="font-semibold">₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </aside>

              <section className="space-y-6">
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="text-xl font-semibold text-slate-950">Add a new expense</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Enter the amount, category, date, and description to keep track of every expense.
                  </p>

                  <form className="mt-6 space-y-4" onSubmit={submitExpense}>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="space-y-2 text-sm text-slate-700">
                        Amount
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={amount}
                          onChange={(event) => setAmount(event.target.value)}
                          className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900"
                          placeholder="?"
                        />
                      </label>

                      <label className="space-y-2 text-sm text-slate-700">
                        Category
                        <select
                          value={category}
                          onChange={(event) => setCategory(event.target.value)}
                          className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900"
                        >
                          {categories.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="space-y-2 text-sm text-slate-700">
                        Date
                        <input
                          type="date"
                          value={date}
                          onChange={(event) => setDate(event.target.value)}
                          className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900"
                        />
                      </label>
                      <label className="space-y-2 text-sm text-slate-700">
                        Description
                        <input
                          type="text"
                          value={description}
                          onChange={(event) => setDescription(event.target.value)}
                          className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900"
                          placeholder="What was this for?"
                        />
                      </label>
                    </div>

                    <label className="space-y-2 text-sm text-slate-700">
                      Notes
                      <textarea
                        value={note}
                        onChange={(event) => setNote(event.target.value)}
                        className="min-h-24 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900"
                        placeholder="Optional note or merchant name"
                      />
                    </label>

                    {error ? <p className="text-sm text-rose-600">{error}</p> : null}

                    <button
                      type="submit"
                      disabled={saving}
                      className="inline-flex items-center justify-center rounded-3xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {saving ? "Saving..." : "Add expense"}
                    </button>
                  </form>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-slate-950">Recent expenses</h2>
                      <p className="mt-2 text-sm leading-6 text-slate-600">Your newest entries appear first.</p>
                    </div>
                    <div className="rounded-3xl bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700">
                      Total: ₹{total.toFixed(2)}
                    </div>
                  </div>

                  <div className="mt-6 space-y-4">
                    {loading ? (
                      <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-600">
                        Loading expenses...
                      </div>
                    ) : expenses.length === 0 ? (
                      <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-600">
                        No expenses yet. Add one to see it here.
                      </div>
                    ) : (
                      <div className="space-y-4">
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
            <h1 className="mt-4 text-3xl font-semibold text-slate-950">Please sign in to view your dashboard</h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Your expense dashboard is private. Sign in to continue.
            </p>
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
