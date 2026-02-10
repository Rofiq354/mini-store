import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  showText?: boolean;
  responsive?: boolean;
  className?: string;
}

export function Logo({
  showText = true,
  responsive = false,
  className,
}: LogoProps) {
  return (
    <Link href="/" className={cn("flex items-center gap-2.5 group", className)}>
      {/* SVG Anda yang sudah di-custom warnanya */}
      <svg
        width="24"
        height="27"
        viewBox="0 0 24 27"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-300 group-hover:scale-110"
      >
        <path
          d="M12.2471 0C13.73 0 15.1112 0.216708 16.3896 0.651367C17.6679 1.0775 18.8015 1.68277 19.79 2.4668C20.7871 3.25084 21.6008 4.1843 22.2314 5.2666C24.9996 6.89712 23.2677 7.52513 23.4463 8.82031H17.8213C17.6421 8.19855 16.8238 8.37465 16.5 7.89746C16.1762 7.41168 16.3466 6.27678 15.8779 5.94434C15.0001 5.89747 15.8776 5.88325 14.5498 5.89355H8.80859C8.11685 5.88929 8.80813 7.89717 6.45605 8.79492C5.89357 10.0562 5.61232 11.5991 5.6123 13.4229C5.6123 15.2466 5.88943 16.7978 6.44336 18.0762C6.99734 19.3546 7.78169 20.3306 8.7959 21.0039C9.81002 21.6685 11.0072 22.001 12.3877 22.001C13.6405 22.001 14.7103 21.7791 15.5967 21.3359C16.4913 20.8843 17.1729 20.2496 17.6416 19.4316C18.0531 18.7262 18.2861 17.9096 18.3428 16.9824L12.7334 18.3975V13.8975L23.6885 12.5283V15.8262C23.6885 18.1272 23.2029 20.1045 22.2314 21.7578C21.2599 23.4026 19.9222 24.6735 18.2178 25.5684C16.5133 26.4547 14.5611 26.8974 12.3623 26.8975C9.90776 26.8975 7.75151 26.3558 5.89355 25.2734C4.03566 24.1825 2.58662 22.6356 1.54688 20.6328C0.5158 18.6216 5.55547e-05 16.2356 0 13.4746C0 11.3525 0.307262 9.45978 0.920898 7.79785C1.54304 6.12755 2.41193 4.71272 3.52832 3.55371C4.6448 2.39462 5.94478 1.51234 7.42773 0.907227C8.9106 0.302181 10.5171 1.03397e-05 12.2471 0ZM12 20.8975C9.79086 20.8975 8 19.1066 8 16.8975V9.89746C8 8.24061 9.34315 6.89746 11 6.89746H12V20.8975ZM18.0762 11.0527L12.749 13.1914V11.1045L16.1133 9.19141L18.0762 11.0527Z"
          className="fill-primary transition-colors"
        />
      </svg>

      {showText && (
        <span
          className={cn(
            "font-bold text-xl tracking-tight text-foreground transition-colors",
            responsive ? "hidden sm:block" : "block",
          )}
        >
          Gerai<span className="text-primary">Ku</span>
        </span>
      )}
    </Link>
  );
}
