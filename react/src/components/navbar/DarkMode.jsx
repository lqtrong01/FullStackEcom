import React, { useEffect, useState } from "react";
import Dark from "../../assets/dark.png";
import Light from "../../assets/light.png";
export default function DarkMode() {
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") ? localStorage.getItem("theme") : "light"
  );
  const element = document.documentElement;

  useEffect(() => {
    if (theme === "dark") {
      element.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      element.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [theme]);

  return (
    <>
      <div className="relative">
        <img
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          src={Light}
          alt="light button"
          className={`w-16 cursor-pointer absolute right-0 z-10 ${
            theme === "dark" ? "opacity-0" : "opacity-100"
          } transition-all duration-300`}
        />
        <img
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          src={Dark}
          alt="dark button"
          className={`w-16 cursor-pointer ${
            theme === "dark" ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>
    </>
  );
}
