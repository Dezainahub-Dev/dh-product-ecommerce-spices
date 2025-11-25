import Image from "next/image";

type LogoProps = {
  className?: string;
};

export function BrandLogo({ className = "h-12 w-12 shrink-0" }: LogoProps) {
  return (
    <Image
      src="/Logo.png"
      alt="AvaNora logo"
      width={48}
      height={48}
      className={className}
      priority
    />
  );
}

export const LogoMark = BrandLogo;
