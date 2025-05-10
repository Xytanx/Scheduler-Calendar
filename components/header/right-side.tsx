"use client";


import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useViewStore } from "@/lib/store";

export default function HeaderRight() {

  const { setView } = useViewStore();

  return (
    <div className="flex items-center space-x-4">
    {/* <SearchComponent /> */}
    <Select onValueChange={(v) => setView(v)}>
      <SelectTrigger className="w-24 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0">
        <SelectValue placeholder="Month" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="month">Month</SelectItem>
        <SelectItem value="week">Week</SelectItem>
        <SelectItem value="day">Day</SelectItem>
      </SelectContent>
    </Select>


    <a
        href="https://sweytank-portfolio.vercel.app/"
        target="_blank"
        rel="noopener noreferrer"
        className="duration-200 hover:scale-105 hover:shadow-lg"
      >
        <Avatar className="cursor-pointer">
          <AvatarImage src="/img/Avatar.jpeg" />
          <AvatarFallback>Sw</AvatarFallback>
        </Avatar>
      </a>
    {/* <Avatar>
      <AvatarImage src="/img/inst2.png" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar> */}
  </div>
  )
}
