import { Roboto_Flex, Source_Serif_4 } from "next/font/google";

// Archivo from the brief has no Cyrillic, so headings use Roboto Flex on its width axis:
// the same wide, dense grotesque, but it renders Ukrainian.
export const displayFont = Roboto_Flex({
  subsets: ["latin", "cyrillic"],
  axes: ["wdth"],
  variable: "--font-display-face",
  display: "swap",
});

export const serifFont = Source_Serif_4({
  subsets: ["latin", "cyrillic"],
  variable: "--font-serif-face",
  display: "swap",
});

export const fontVariables = `${displayFont.variable} ${serifFont.variable}`;
