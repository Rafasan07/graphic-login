import { redirect } from "next/navigation";

export default function Home() {
  // Immediately redirect to /login when user visits "/"
  redirect('/login');

}