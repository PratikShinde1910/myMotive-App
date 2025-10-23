import { SignIn } from "@/components/clerk/SignIn";

export default function Index() {
  return (<SignIn signUpUrl="/sign-up" scheme="mymotive"  homeUrl="(protected)"/>);
}
