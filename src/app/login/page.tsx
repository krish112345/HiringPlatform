
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/logo';
import { useAuth, useFirebase } from '@/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Define LoginForm outside of the LoginPage component to prevent re-renders
const LoginForm = ({
  role,
  email,
  setEmail,
  password,
  setPassword,
  handleLogin,
  isLoading,
}: {
  role: 'applicant' | 'hr';
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  handleLogin: () => void;
  isLoading: boolean;
}) => (
  <>
    <CardContent className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor={`${role}-email`}>Email</Label>
        <Input
          id={`${role}-email`}
          type="email"
          placeholder="m@example.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${role}-password`}>Password</Label>
        <Input
          id={`${role}-password`}
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete={
            role === 'applicant' ? 'current-password' : 'new-password'
          }
        />
      </div>
    </CardContent>
    <CardFooter className="flex flex-col gap-4">
      <Button
        className="w-full"
        onClick={handleLogin}
        disabled={isLoading}
      >
        {isLoading ? 'Logging in...' : 'Login'}
      </Button>
      {role === 'applicant' && (
        <div className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="underline">
            Sign up
          </Link>
        </div>
      )}
    </CardFooter>
  </>
);

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'applicant' | 'hr'>('applicant');
  
  const auth = useAuth();
  const { user, isUserLoading, firestore } = useFirebase();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!isUserLoading && user) {
      const hrRoleDoc = doc(firestore, `roles_hr/${user.uid}`);
      getDoc(hrRoleDoc).then(hrRoleSnap => {
        if (hrRoleSnap.exists()) {
          router.push('/admin');
        } else {
          router.push('/dashboard');
        }
      });
    }
  }, [user, isUserLoading, firestore, router]);


  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const hrRoleDoc = doc(firestore, `roles_hr/${user.uid}`);
      const hrRoleSnap = await getDoc(hrRoleDoc);

      if (hrRoleSnap.exists()) {
        router.push('/admin');
      } else if (activeTab === 'hr' && !hrRoleSnap.exists()) {
         toast({
            title: 'Access Denied',
            description: 'You do not have HR permissions.',
            variant: 'destructive',
          });
          await auth.signOut();
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Login error', error);
      toast({
        title: 'Login Failed',
        description: 'Invalid email or password.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex justify-center">
          <Logo />
        </div>
        <Tabs defaultValue="applicant" className="w-full" onValueChange={(value) => setActiveTab(value as 'applicant' | 'hr')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="applicant">Applicant</TabsTrigger>
            <TabsTrigger value="hr">HR</TabsTrigger>
          </TabsList>
          <TabsContent value="applicant">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-2xl">
                  Applicant Login
                </CardTitle>
                <CardDescription>
                  Enter your email below to login to your account.
                </CardDescription>
              </CardHeader>
              <LoginForm
                role="applicant"
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                handleLogin={handleLogin}
                isLoading={isLoading}
              />
            </Card>
          </TabsContent>
          <TabsContent value="hr">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-2xl">
                  HR Login
                </CardTitle>
                <CardDescription>
                  Enter your HR credentials to access the admin dashboard.
                </CardDescription>
              </CardHeader>
              <LoginForm
                role="hr"
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                handleLogin={handleLogin}
                isLoading={isLoading}
              />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
