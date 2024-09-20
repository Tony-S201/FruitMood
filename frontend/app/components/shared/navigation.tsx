import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const Navigation: React.FunctionComponent = (): JSX.Element => {
  return (
    <nav>
        <ul className="flex justify-between p-4">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/mint">Mint</Link></li>
            <li><Link href="/my-collection">My Collection</Link></li>
            <li><Link href="/support">FAQ & Support</Link></li>
            <ConnectButton />
        </ul>
    </nav>
  )
}

export default Navigation;