"use client";
import { MonitorIcon, MoonStar, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const THEMES = ["light", "system", "dark"] as const;
const THEMES_ICONS = {
  light: <MonitorIcon />,
  system: <MoonStar />,
  dark: <SunIcon />,
};

export default function ThemeChanger() {
  const { theme, setTheme } = useTheme();

  const [mount, setMount] = useState(false);

  useEffect(() => {
    setMount(true);
  }, []);

  if (!mount || !theme) return <button></button>;

  const changeTheme = () => {
    const idx = THEMES.indexOf(theme as keyof typeof THEMES_ICONS) + 1;
    setTheme(THEMES[idx % THEMES.length]);
  }

  return (
    <button
      className="btn-icon"
      onClick={changeTheme}
    >
      {THEMES_ICONS[theme as keyof typeof THEMES_ICONS]}
    </button>
  );
}
