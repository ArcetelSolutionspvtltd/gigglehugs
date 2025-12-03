import Image from "next/image";

export function Logo() {
  return (
    <div className="flex items-center gap-3">
      <Image src="/assets/logo/logo.svg" alt="GiggleHugs Logo" width={40} height={40} className="h-10 w-auto" data-ai-hint="company logo"/>
      <span className="text-2xl font-bold tracking-tight text-primary">GiggleHugs</span>
    </div>
  );
}
