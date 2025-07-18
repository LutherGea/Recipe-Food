import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { ChefHat, User, Lock, Eye, EyeOff } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast({
        title: "Input Tidak Valid",
        description: "Silakan masukkan username dan password",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      const success = login(username, password);
      
      if (success) {
        toast({
          title: "Login Berhasil",
          description: `Selamat datang kembali, ${username}!`
        });
        navigate('/');
      } else {
        toast({
          title: "Login Gagal",
          description: "Username atau password salah",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error Login",
        description: "Terjadi kesalahan saat login",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const demoCredentials = [
    { username: 'Luther', password: '123456789' },
    { username: 'user', password: 'user123' },
    { username: 'demo', password: 'demo123' }
  ];

  const fillDemoCredentials = (creds: { username: string; password: string }) => {
    setUsername(creds.username);
    setPassword(creds.password);
  };

  if (isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-3">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl">
              <ChefHat className="h-10 w-10 text-white" />
            </div>
            <span className="text-3xl font-bold text-white">
              RecipeApp
            </span>
          </Link>
        </div>

        {/* Login Card */}
        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-bold">Selamat Datang Kembali</CardTitle>
            <p className="text-muted-foreground">Masuk untuk mengakses resep Anda</p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nama Pengguna</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Masukkan nama pengguna Anda"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Kata Sandi</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Masukkan kata sandi Anda"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-warm hover:opacity-90" 
                disabled={loading}
              >
                {loading ? 'Masuk...' : 'Masuk'}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="border-t pt-4">
              <p className="text-sm text-muted-foreground text-center mb-3">
                Akun Demo (Klik untuk menggunakan):
              </p>
              <div className="space-y-2">
                {demoCredentials.map((creds, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="w-full text-left justify-start"
                    onClick={() => fillDemoCredentials(creds)}
                    disabled={loading}
                  >
                    <User className="h-4 w-4 mr-2" />
                    {creds.username} / {creds.password}
                  </Button>
                ))}
              </div>
            </div>

            {/* Additional Info */}
            <div className="text-center text-xs text-muted-foreground">
              <p>Ini adalah aplikasi demo.</p>
              <p>Gunakan salah satu kredensial di atas untuk login.</p>
            </div>

            {/* Back to Home */}
            <div className="text-center">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  Kembali ke Beranda
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Features Info */}
        <div className="mt-6 text-center text-white/80 text-sm">
          <p>🔐 Login untuk mengakses favorit dan catatan pribadi</p>
          <p>⭐ Beri rating resep dan simpan catatan khusus</p>
          <p>❤️ Bangun koleksi resep pribadi Anda</p>
        </div>
      </div>
    </div>
  );
};

export default Login;