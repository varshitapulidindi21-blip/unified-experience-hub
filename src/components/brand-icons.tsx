import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { strokeWidth?: number | string };

export function SharePointBrandIcon({ strokeWidth: _sw, ...rest }: IconProps) {
  return (
    <svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" aria-hidden {...rest}>
      <defs>
        <linearGradient id="bal-sp" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#036C70" />
          <stop offset="1" stopColor="#038387" />
        </linearGradient>
      </defs>
      <circle cx="15" cy="20" r="12" fill="url(#bal-sp)" />
      <circle cx="26" cy="20" r="9" fill="#28A4A7" opacity="0.92" />
      <text
        x="21"
        y="25"
        textAnchor="middle"
        fontFamily="Segoe UI, Arial, sans-serif"
        fontSize="13"
        fontWeight="700"
        fill="#FFFFFF"
      >
        S
      </text>
    </svg>
  );
}

export function SapBrandIcon({ strokeWidth: _sw, ...rest }: IconProps) {
  return (
    <svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" aria-hidden {...rest}>
      <defs>
        <linearGradient id="bal-sap" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#00AEEF" />
          <stop offset="1" stopColor="#003A70" />
        </linearGradient>
      </defs>
      <rect x="3" y="5" width="34" height="30" rx="5" fill="url(#bal-sap)" />
      <text
        x="20"
        y="25"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        fontSize="10.5"
        fontWeight="800"
        fill="#FFFFFF"
        letterSpacing="0.5"
      >
        SAP
      </text>
      <rect x="5" y="29" width="30" height="2" fill="#F0AB00" />
    </svg>
  );
}
