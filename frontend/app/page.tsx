"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
  useAuth,
} from "@clerk/nextjs";

export default function Home() {
  const { isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn) {
      router.replace("/dashboard");
    }
  }, [isSignedIn, router]);

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-12 text-slate-900">
      <main className="mx-auto flex w-full max-w-4xl flex-col gap-10 rounded-4xl border border-slate-200 bg-white p-10 shadow-lg shadow-slate-200/50">
        <section className="grid gap-8 lg:grid-cols-[1.6fr_1fr] lg:items-center">
          <div className="space-y-6">
            <p className="inline-flex rounded-full bg-slate-100 px-4 py-1 text-sm font-semibold text-slate-700">
              FairPayy personal finance
            </p>
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                Track your expenses with clarity
              </h1>
              <p className="max-w-xl text-lg leading-8 text-slate-600">
                Sign in or sign up to start recording expenses, reviewing spending categories, and building a money snapshot.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <SignInButton mode="modal">
                <button className="rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
                  Sign in
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:border-slate-300">
                  Sign up
                </button>
              </SignUpButton>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 shadow-sm">
            <SignedIn>
              <div className="space-y-4 text-slate-700">
                <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Welcome back</p>
                <p className="text-2xl font-semibold text-slate-950">You are signed in.</p>
                <p className="text-sm leading-6">
                  You will be redirected to your dashboard automatically.
                </p>
                <div className="rounded-3xl bg-white p-4 shadow-sm">
                  <UserButton />
                </div>
              </div>
            </SignedIn>
            <SignedOut>
              <div className="space-y-4 text-slate-700">
                <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Get started</p>
                <p className="text-2xl font-semibold text-slate-950">Secure login </p>
                <p className="text-sm leading-6">
                  Sign in or create an account to access your personal expense dashboard.
                </p>
              </div>
            </SignedOut>
          </div>
        </section>
      </main>
    </div>
  );
}
