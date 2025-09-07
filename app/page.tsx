import { redirect } from "next/navigation";

export default function HomePage() {
  console.log("first");
  redirect("/5/7");
}
