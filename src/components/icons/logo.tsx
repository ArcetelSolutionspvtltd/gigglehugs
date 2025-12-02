import type { SVGProps } from "react";

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 40"
      width="150"
      height="30"
      {...props}
    >
      <text
        x="0"
        y="30"
        fontFamily="'Poppins', sans-serif"
        fontSize="32"
        fontWeight="600"
        fill="hsl(var(--primary))"
      >
        GiggleHugs
      </text>
    </svg>
  );
}
