import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <p className="text-6xl font-bold text-emerald-600">404</p>
      <h1 className="mt-2 text-2xl font-semibold">Page not found</h1>
      <p className="mt-2 text-sm text-slate-500">
        We couldn&apos;t find what you were looking for.
      </p>
      <Button asChild className="mt-4">
        <Link href="/">Back home</Link>
      </Button>
    </div>
  );
}
