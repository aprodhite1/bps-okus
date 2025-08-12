import SignUpForm from "@/components/auth/SignUpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign-Up SAKIP | BPS Kabupaten Ogan Komering Ulu Selatan",
  description: "Halaman untuk daftar akun SAKIP BPS Kabupaten Ogan Komering Ulu Selatan",
};

export default function SignUp() {
  return <SignUpForm />;
}
