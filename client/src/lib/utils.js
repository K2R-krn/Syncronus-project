import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"
import animationData from "@/assets/lottie-json"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const colors = [
  "bg-[#712c4a57] text-[#ff006e] border—[lpx] border-[#ff006faa]",
  "bg-[#ffd60a2a] text-[#ffd60a] border—[lpx] border-[#ffd60abb]",
  "bg-[#06d6a02a] text-[#06d6a0] border—[lpx] border-[#06d6a0bb]",
  "bg-[#4cc9f02a] text-[#4cc9f0] border—[lpx] border-[#4cc9f0bb]",
];
export const getColor = (color) => {
  if(color>=0 && color<colors.length){
    return colors[color];
  }
  return colors[0]; // return first color if none match ..
} ;


export const animationDefaultOptions = {
  loop : true,
  autoplay: true,
  animationData: animationData,
}