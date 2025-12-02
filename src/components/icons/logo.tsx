import type { SVGProps } from "react";
import Image from "next/image";

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <Image src="/assets/logo/logo.svg" alt="GiggleHugs Logo" width={150} height={30} {...props} />
  );
}
