import React from "react";
import styles from "@/styles/Hero.module.css"

const Hero: React.FC = () => {
  return (
    <div className={styles.heroContainer}>
      <h1>Welcome to Borui Education</h1>
      <p>Best Math/Coding in Vancouver</p>
      {/* Additional content */}
    </div>
  );
};

export default Hero;
