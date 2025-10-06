import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export default function Signup() {
  const { signUpWithEmail, loading, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      await signUpWithEmail(email, password);
      setSuccess("Pendaftaran berhasil. Periksa email Anda untuk konfirmasi (jika diperlukan).");
    } catch (err: any) {
      setError(err?.message || "Gagal mendaftar");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md p-6 space-y-4">
        <h1 className="text-2xl font-bold">Daftar</h1>
        {user && <p className="text-sm text-muted-foreground">Sudah masuk sebagai {user.email}</p>}
        {error && <p className="text-sm text-red-500">{error}</p>}
        {success && <p className="text-sm text-green-600">{success}</p>}
        <form onSubmit={handleSignup} className="space-y-3">
          <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <Button type="submit" disabled={loading} className="w-full">Daftar</Button>
        </form>
        <div className="py-2"><Separator /></div>
        <p className="text-xs text-muted-foreground">Sudah punya akun? Masuk di halaman Login.</p>
      </Card>
    </div>
  );
}



