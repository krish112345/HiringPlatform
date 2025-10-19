
'use client';

import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import { Briefcase, Search, UserPlus, Zap } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
          <Logo />
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className={cn(
                buttonVariants({ variant: 'ghost' }),
                'px-4'
              )}
            >
              Login
            </Link>
            <Link
              href="/register"
              className={cn(
                buttonVariants({ variant: 'default' }),
                'px-4'
              )}
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full py-20 md:py-32 lg:py-40">
          <div className="container grid grid-cols-1 gap-12 text-center lg:grid-cols-2 lg:text-left">
            <div className="flex flex-col items-center justify-center space-y-6 lg:items-start">
              <h1 className="font-headline text-4xl font-bold uppercase tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                Internship Program
              </h1>
              <p className="max-w-[600px] text-lg text-muted-foreground md:text-xl">
                Work on real-world projects. Veridia.io streamlines your recruitment process, connecting
                you with top-tier talent effortlessly.
              </p>
              <div className="flex w-full max-w-sm flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
                <Link
                  href="/register"
                  className={cn(buttonVariants({ size: 'lg' }), 'w-full sm:w-auto')}
                >
                  Get Started for Free
                </Link>
                <Link
                  href="/login"
                  className={cn(
                    buttonVariants({ variant: 'outline', size: 'lg' }),
                    'w-full sm:w-auto'
                  )}
                >
                  View Open Roles
                </Link>
              </div>
            </div>
            <div className="relative flex items-center justify-center">
              <Image
                src="https://picsum.photos/seed/hero/600/400"
                alt="Recruitment Illustration"
                width={600}
                height={400}
                className="rounded-xl shadow-2xl"
                data-ai-hint="teamwork office"
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full bg-muted py-20 lg:py-28">
          <div className="container space-y-12">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm text-secondary-foreground">
                Key Features
              </div>
              <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-5xl">
                Why Choose Veridia.io?
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our platform is designed to make hiring simple, fast, and
                effective. Discover the tools that will transform your
                recruitment strategy.
              </p>
            </div>
            <div className="mx-auto grid items-start gap-8 sm:max-w-4xl sm:grid-cols-2 md:gap-12 lg:max-w-5xl lg:grid-cols-3">
              <div className="grid gap-1 rounded-lg bg-card p-6 shadow-sm border">
                <h3 className="flex items-center gap-2 text-lg font-bold">
                  <Zap className="h-6 w-6 text-primary" />
                  Seamless Applications
                </h3>
                <p className="text-sm text-muted-foreground">
                  A straightforward application process for candidates means more
                  high-quality submissions for you.
                </p>
              </div>
              <div className="grid gap-1 rounded-lg bg-card p-6 shadow-sm border">
                <h3 className="flex items-center gap-2 text-lg font-bold">
                  <Search className="h-6 w-6 text-primary" />
                  Advanced Candidate Search
                </h3>
                <p className="text-sm text-muted-foreground">
                  Quickly find the right talent with powerful filtering and
                  search tools designed for HR professionals.
                </p>
              </div>
              <div className="grid gap-1 rounded-lg bg-card p-6 shadow-sm border">
                <h3 className="flex items-center gap-2 text-lg font-bold">
                  <Briefcase className="h-6 w-6 text-primary" />
                  Unified Dashboard
                </h3>
                <p className="text-sm text-muted-foreground">
                  Manage all your applicants, from submission to offer, in
                  one intuitive and centralized dashboard.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="w-full py-20 lg:py-28">
          <div className="container space-y-12">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-5xl">
                Get Hired in 3 Easy Steps
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Joining the Veridia talent pool is simple. Follow these steps
                to start your journey towards your dream job.
              </p>
            </div>
            <div className="mx-auto grid gap-8 sm:max-w-4xl md:grid-cols-3 md:gap-12">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-headline">
                    <UserPlus className="h-6 w-6 text-primary" />
                    Create Your Profile
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Sign up and build your candidate profile in minutes. Add
                    your experience, skills, and resume to stand out.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-headline">
                    <Search className="h-6 w-6 text-primary" />
                    Apply for Jobs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Browse open positions and apply with a single click. Your
                    profile makes it easy to submit applications quickly.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-headline">
                    <Briefcase className="h-6 w-6 text-primary" />
                    Track Your Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Keep track of all your applications and their statuses in
                    your personal dashboard.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t bg-muted">
        <div className="container flex flex-col items-center justify-between gap-4 py-6 md:flex-row">
          <div className="flex items-center gap-2">
            <Logo />
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Veridia.io. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy Policy
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
