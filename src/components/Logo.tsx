import Link from "next/link";
import { SiAuthy } from "react-icons/si";

export default function Logo() {
  return (
    <Link
      href={"/"}
      className="absolute top-5 left-5 flex flex-row text-[#ff0033] items-center justify-center gap-1 z-50"
    >
      <SiAuthy className="text-xl mt-1" />
      <h1 className="font-normal text-lg sm:text-xl tracking-tight">
        You<span className="text-[#e5e5e5]">Ask</span>Tube
      </h1>
    </Link>
  );
}
