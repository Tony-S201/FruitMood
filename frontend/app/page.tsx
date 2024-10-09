'use client';
import Link from "next/link";

// UI components
import { Button, Grow } from "@mui/material";

const Home: React.FunctionComponent = (): JSX.Element => {

  return (
    <div className="min-h-screen py-20 mt-10">
      <div className="container mx-auto px-4">
        <Grow in timeout={1250}>
          <h1 className="text-3xl font-bold text-center mb-4">Welcome to FruitMood</h1>
        </Grow>

        <div className="bg-white bg-opacity-80 shadow-lg rounded-lg p-8 mx-auto max-w-3xl">
          <p className="text-xl mb-8">
            FruitMood is a platform that allows you to create and collect unique Fruit NFTs with personalized emotions.
            With our user-friendly interface, you can customize your own Fruit NFTs and join a community of fruit enthusiasts.
            Start exploring the colorful world of FruitMood today!
          </p>

          <div className="text-center">
            <Link href="/mint">
              <Button 
                variant="contained" 
                className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-bold py-3 px-8 rounded-full shadow-lg transition duration-200 ease-in-out transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-orange-300"
              >
                Start Creating
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
