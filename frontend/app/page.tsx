import { ConnectButton } from "@rainbow-me/rainbowkit";
import Navigation from "./components/shared/navigation";
import Footer from "./components/shared/footer";

const Home: React.FunctionComponent = (): JSX.Element => {
  return (
    <>
      <Navigation />
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <ConnectButton />
      </main>
      <Footer />
    </>
  );
}

export default Home;
