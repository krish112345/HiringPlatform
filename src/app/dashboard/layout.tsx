'use client';

import { DashboardLayout } from '@/components/dashboard-layout';
import { useFirebase } from '@/firebase';
import { FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const navItems = [{ href: '/dashboard', icon: FileText, label: 'Application' }];

export default function ApplicantDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isUserLoading } = useFirebase();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/');
    }
  }, [user, isUserLoading, router]);
  return <DashboardLayout navItems={navItems}>{children}</DashboardLayout>;
}
