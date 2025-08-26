"use client";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { collection, query, where, getDocs, } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Interface untuk data user
interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  role: string;
  password: string; // Password yang sudah di-hash
}

// Interface untuk session user (tanpa password)
interface UserSession {
  id: string;
  username: string;
  email: string;
  name: string;
  role: string;
}

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Validasi input
      if (!formData.username.trim() || !formData.password.trim()) {
        throw new Error("Username dan password harus diisi");
      }

      // Cari user berdasarkan username di Firestore
      const userData = await getUserByUsername(formData.username);
      
      if (!userData) {
        throw new Error("Username tidak ditemukan");
      }

      // Verifikasi password
      const isPasswordValid = await verifyPassword(formData.password, userData.password);
      
      if (!isPasswordValid) {
        throw new Error("Password salah");
      }

      // Simpan user data ke sessionStorage dan localStorage (tanpa password)
      const userSession: UserSession = {
        id: userData.id,
        username: userData.username,
        email: userData.email,
        name: userData.name,
        role: userData.role
      };

      sessionStorage.setItem('user', JSON.stringify(userSession));
      localStorage.setItem('user', JSON.stringify(userSession));

      console.log("Login berhasil:", userData);
      
      // Redirect ke dashboard setelah login sukses
      router.push("/");
      router.refresh(); // Refresh untuk update UI berdasarkan auth state
      
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Login error:", error);
      setError(error.message || "Terjadi kesalahan saat login");
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk mendapatkan user data dari username
  const getUserByUsername = async (username: string): Promise<User | null> => {
    try {
      // Coba cari di collection 'users' dengan username yang cocok
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("username", "==", username.trim().toLowerCase()));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const data = userDoc.data();
        
        return {
          id: userDoc.id,
          username: data.username,
          email: data.email,
          name: data.name,
          role: data.role || 'user',
          password: data.password // Password yang di-hash dari Firestore
        };
      }
      
      // Jika tidak ditemukan di collection 'users', coba di collection 'pegawai'
      const pegawaiRef = collection(db, "pegawai");
      const qPegawai = query(pegawaiRef, where("username", "==", username.trim().toLowerCase()));
      const pegawaiSnapshot = await getDocs(qPegawai);
      
      if (!pegawaiSnapshot.empty) {
        const pegawaiDoc = pegawaiSnapshot.docs[0];
        const data = pegawaiDoc.data();
        
        return {
          id: pegawaiDoc.id,
          username: data.username,
          email: data.email || "",
          name: data.name,
          role: data.role || 'user',
          password: data.password || "" // Password yang di-hash dari Firestore
        };
      }
      
      return null;
    } catch (error) {
      console.error("Error getting user by username:", error);
      throw new Error("Gagal mencari user");
    }
  };

  // Fungsi untuk verifikasi password
  const verifyPassword = async (inputPassword: string, hashedPassword: string): Promise<boolean> => {
    try {
      // Jika password tidak di-hash (development), bandingkan langsung
      if (hashedPassword === inputPassword) {
        console.warn("Password tidak di-hash! Harap hash password di production.");
        return true;
      }
      
      // Gunakan bcryptjs untuk memverifikasi password yang di-hash
      const bcrypt = await import('bcryptjs');
      return bcrypt.compareSync(inputPassword, hashedPassword);
    } catch (error) {
      console.error("Error verifying password:", error);
      
      // Fallback: comparison sederhana (hanya untuk development)
      return inputPassword === hashedPassword;
    }
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">

        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your username and password to sign in!
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-900/20 dark:text-red-400">
              {error}
            </div>
          )}

          {/* Username & password form */}
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <Label>
                  Username <span className="text-error-500">*</span>
                </Label>
                <Input 
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Masukkan username Anda" 
                  type="text"
                  required
                  disabled={loading}
                  autoComplete="username"
                />
              </div>
              <div>
                <Label>
                  Password <span className="text-error-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    type={showPassword ? "text" : "password"}
                    placeholder="Masukkan password Anda"
                    required
                    disabled={loading}
                    autoComplete="current-password"
                  />
                  <span
                    onClick={() => !loading && setShowPassword(!showPassword)}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                  >
                    {showPassword ? (
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                    )}
                  </span>
                </div>
              </div>
              <div className="flex justify-end">
                <Link
                  href="/reset-password"
                  className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Forgot password?
                </Link>
              </div>
              <div>
                <Button 
                  className="w-full" 
                  size="sm"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Signing in...
                    </div>
                  ) : (
                    "Sign in"
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}