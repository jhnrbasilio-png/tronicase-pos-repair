import { LoginForm } from "@/components/forms/login-form";

export default function LoginPage() {
  return (
    <main className="grid min-h-screen place-items-center px-4">
      <div className="absolute inset-x-0 top-0 h-1 bg-primary" />
      <div className="w-full max-w-5xl items-center gap-12 lg:grid lg:grid-cols-[1fr_440px]">
        <section className="mb-8 lg:mb-0">
          <div className="mb-6 inline-flex rounded-md border border-red-400/30 bg-red-500/10 px-3 py-1 text-sm text-red-100">
            Original TroniCase retail and repair operations suite
          </div>
          <h1 className="max-w-3xl text-4xl font-black tracking-tight text-white md:text-6xl">
            Premium POS, repairs, stock control, and branch reporting in one dark command center.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
            Built as an original system for TroniCase, with role permissions, inventory movement, technician workflows,
            sales analytics, expenses, notifications, and receipt-ready checkout.
          </p>
        </section>
        <LoginForm />
      </div>
    </main>
  );
}
