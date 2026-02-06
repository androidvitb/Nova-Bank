import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast, Toaster } from 'react-hot-toast';
import { ThemeToggle } from '@/components/ThemeToggle';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { ArrowLeft, ArrowUpCircle } from 'lucide-react';

const Deposit = ({ userId }) => {
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleDeposit = async () => {
    if (!amount) {
      toast.error('Please enter an amount');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post('/api/transactions', { userId, action: 'deposit', amount });
      toast.success(response.data.message);
      setTimeout(() => router.push('/dashboard'), 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Deposit failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 transition-colors duration-300">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <div className="absolute top-6 left-6">
        <Button variant="ghost" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4">
          <div className="flex justify-center mb-2">
            <Link href="/dashboard" className="flex items-center gap-2">
              <img src="/logo.png" alt="Logo" className="w-8 h-8" />
              <span className="text-2xl font-bold text-primary tracking-tighter">NOVA</span>
            </Link>
          </div>
          <CardTitle className="text-2xl text-center">Deposit Funds</CardTitle>
          <CardDescription className="text-center">
            Add funds to your account instantly and securely.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-7"
              />
            </div>
          </div>
          <Button
            onClick={handleDeposit}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              'Processing...'
            ) : (
              <>
                <ArrowUpCircle className="h-4 w-4 mr-2" />
                Deposit Now
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Deposit;
