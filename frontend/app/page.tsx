import Link from "next/link";

// UI components
import Chart from "./components/chart";
import { Button } from "@mui/material";

const Home: React.FunctionComponent = (): JSX.Element => {
  return (
    <>
      <div className="flex min-h-screen flex-col items-center justify-between p-24">
        {/* Hero Section */}
        <section className="min-h-screen flex flex-col items-center p-10">
          <h1>Mint Your Fruit NFT</h1>
          <p>Choose your favorite fruit, select an emotion and create it!</p>
          <Link href="/mint">
            <Button variant="contained">Start</Button>
          </Link>
        </section>

        {/* Concept Explanation */}
        <section className="min-h-screen p-10">
          <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </section>

        {/* Why Mint + Stats */}
        <section>
          <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>
          <Chart />
        </section>
      </div>
    </>
  );
}

export default Home;
