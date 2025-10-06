import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export default function Login() {
  const { signInWithEmail, loading, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await signInWithEmail(email, password);
    } catch (err: any) {
      setError(err?.message || "Failed to sign in");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md p-6 space-y-4">
        <h1 className="text-2xl font-bold">Masuk</h1>
        {user && <p className="text-sm text-muted-foreground">Sudah masuk sebagai {user.email || user.displayName}</p>}
        {error && <p className="text-sm text-red-500">{error}</p>}
        <form onSubmit={handleEmail} className="space-y-3">
          <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <Button type="submit" disabled={loading} className="w-full">Masuk dengan Email</Button>
        </form>
        <div className="py-2"><Separator /></div>
        <p className="text-xs text-muted-foreground">Belum punya akun? Daftar di halaman Sign Up.</p>
      </Card>
    </div>
  );
}


