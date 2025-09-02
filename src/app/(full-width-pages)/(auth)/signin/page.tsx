import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign-in SIKALIS",
  description: "Halaman untuk masuk ke SAKIP BPS Kabupaten Ogan Komering Ulu Selatan",
};

export default function SignIn() {
  return <SignInForm />;
}
