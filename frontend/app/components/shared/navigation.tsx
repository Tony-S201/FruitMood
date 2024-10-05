import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const Navigation: React.FunctionComponent = (): JSX.Element => {
  return (
    <nav>
        <ul className="flex justify-between p-4 fixed w-full">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/mint">Mint</Link></li>
            <li><Link href="/my-collection">Collection & Fusion</Link></li>
            <li><Link href="/support">FAQ</Link></li>
            <ConnectButton />
        </ul>
    </nav>
  )
}

export default Navigation;