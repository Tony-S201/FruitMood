import { ConnectButton } from "@rainbow-me/rainbowkit";

const Home: React.FC = (): JSX.Element => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <ConnectButton />
    </main>
  );
}

export default Home;
