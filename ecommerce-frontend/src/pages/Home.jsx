import React from "react";
import Hero from "../components/Hero"; // Imports our animated Hero component

const Home = () => {
  return (
      <div>
        {/* We add a little top padding so the Hero doesn't hide behind the fixed navbar */}
        <div className="pt-20">
          <Hero />
        </div>
      </div>
  );
};

export default Home;
