'use client';
import Link from "next/link";

// UI components
import Chart from "./components/chart";
import { Button, Grow } from "@mui/material";
import { ReactLiteCarousel } from "react-lite-carousel";

const Home: React.FunctionComponent = (): JSX.Element => {
  return (
    <>
      <div className="flex h-screen p-32 flex-col items-center">
        <Grow in>
          <div>
            <ReactLiteCarousel autoPlay className="flex items-center">
              {/* Hero Section */}
              <section>
                <h1 className="text-2xl">Mint Your Fruit NFT</h1>
                <p>Choose your favorite fruit, select an emotion and create it!</p>
                <Link href="/mint">
                  <Button variant="contained">Start</Button>
                </Link>
              </section>

              {/* Concept Explanation */}
              <section>
                <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
              </section>

              {/* Stats */}
              <section>
                <Chart />
              </section>
            </ReactLiteCarousel>
          </div>
        </Grow>
      </div>
    </>
  );
}

export default Home;
