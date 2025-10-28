"use client";
import Link from "next/link";
import Link from "next/link";
"use client";
import Link from "next/link";

export default function Home() {
  return (
    <section className="flex flex-col gap-12">
      {/* Hero */}
      <div className="space-y-4 max-w-2xl">
        <h1 className="text-4xl font-bold">Welcome to MaxiCare Dental</h1>
        <p className="text-lg">
          Complete clinic management, online appointments, in-house lab, and
          educational resources — all in one platform.
        </p>
      </div>

      {/* Quick Links Cards */}
      <div className="grid sm:grid-cols-3 gap-6">
        <Link href="/clinic" className="rounded-lg aspect-video bg-accent/10 flex items-center justify-center text-xl font-semibold hover:bg-accent/20 transition-colors">
          Clinic
        </Link>
        <Link href="/lab" className="rounded-lg aspect-video bg-accent/10 flex items-center justify-center text-xl font-semibold hover:bg-accent/20 transition-colors">
          Lab
        </Link>
        <Link href="/education" className="rounded-lg aspect-video bg-accent/10 flex items-center justify-center text-xl font-semibold hover:bg-accent/20 transition-colors">
          Education
        </Link>
      </div>
    </section>
  );
}

  return (
    <section className="flex flex-col gap-12">
      {/* Hero */}
      <div className="space-y-4 max-w-2xl">
        <h1 className="text-4xl font-bold">Welcome to MaxiCare Dental</h1>
        <p className="text-lg">
          Complete clinic management, online appointments, in-house lab, and
          educational resources — all in one platform.
        </p>
          width={180}
          height={38}
          priority
        />
        <ol className="font-mono list-inside list-decimal text-sm/6 text-center sm:text-left">
          <li className="mb-2 tracking-[-.01em]">
            Get started by editing{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] font-mono font-semibold px-1 py-0.5 rounded">
              src/app/page.tsx
            </code>
            .
          </li>
          <li className="tracking-[-.01em]">
            Save and see your changes instantly.
          </li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </a>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </div>
    </div>
  );
}
