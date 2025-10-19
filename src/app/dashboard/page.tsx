
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  addDocumentNonBlocking,
  useCollection,
  useFirebase,
  useFirestore,
  deleteDocumentNonBlocking,
} from '@/firebase';
import { collection, query, where, doc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useMemoFirebase } from '@/firebase/provider';
import type { Application } from '@/lib/definitions';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const applicationSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  resumeUrl: z.string().url('Invalid URL').optional(),
  jobRole: z.string({
    required_error: 'Please select a job role.',
  }),
});

type ApplicationFormValues = z.infer<typeof applicationSchema>;

const statusVariantMapping: {
  [key in Application['status']]:
    | 'default'
    | 'secondary'
    | 'destructive'
    | 'outline';
} = {
  Applied: 'outline',
  Interviewing: 'secondary',
  Offered: 'default',
  Rejected: 'destructive',
};

export default function ApplyPage() {
  const { user } = useFirebase();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [applicationToDeleteId, setApplicationToDeleteId] = useState<
    string | null
  >(null);

  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: user?.email || '',
      phone: '',
      resumeUrl: '',
      jobRole: '',
    },
    values: {
      firstName: user?.displayName?.split(' ')[0] || '',
      lastName: user?.displayName?.split(' ').slice(1).join(' ') || '',
      email: user?.email || '',
      phone: user?.phoneNumber || '',
      resumeUrl: '',
      jobRole: '',
    },
  });

  const applicationsQuery = useMemoFirebase(
    () =>
      user
        ? query(
            collection(firestore, 'applications'),
            where('candidateId', '==', user.uid)
          )
        : null,
    [firestore, user]
  );
  const { data: applications, isLoading } =
    useCollection<Application>(applicationsQuery);

  const onSubmit = async (values: ApplicationFormValues) => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to submit an application.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const applicationData = {
        candidateId: user.uid,
        jobId: 'default-job-id', // Replace with actual job ID
        submissionDate: new Date().toISOString(),
        status: 'Applied',
        answers: JSON.stringify(values),
        jobRole: values.jobRole,
        candidate: {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
        },
      };

      const applicationsRef = collection(firestore, 'applications');
      await addDocumentNonBlocking(applicationsRef, applicationData);

      toast({
        title: 'Success',
        description: 'Your application has been submitted.',
      });
      form.reset();
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit application. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const openDeleteDialog = (applicationId: string) => {
    setApplicationToDeleteId(applicationId);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteApplication = () => {
    if (!applicationToDeleteId) return;
    const appDocRef = doc(firestore, 'applications', applicationToDeleteId);
    deleteDocumentNonBlocking(appDocRef);
    toast({
      title: 'Application Withdrawn',
      description: 'Your application has been successfully withdrawn.',
    });
    setIsDeleteDialogOpen(false);
    setApplicationToDeleteId(null);
  };

  return (
    <>
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-3xl">
              My Applications
            </CardTitle>
            <CardDescription>
              Track the status of your submitted applications.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div>Loading applications...</div>
            ) : applications && applications.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Job Role</TableHead>
                    <TableHead>Submitted On</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Offer</TableHead>
                    <TableHead>
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.map((application) => (
                    <TableRow key={application.id}>
                      <TableCell className="font-medium">
                        {application.jobRole}
                      </TableCell>
                      <TableCell>
                        {new Date(
                          application.submissionDate
                        ).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={statusVariantMapping[application.status]}
                        >
                          {application.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {application.offerLetterUrl ? (
                          <Button asChild variant="link">
                            <a
                              href={application.offerLetterUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              View Offer
                            </a>
                          </Button>
                        ) : (
                          'N/A'
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => openDeleteDialog(application.id)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                You have not submitted any applications yet.
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-3xl">
              New Application
            </CardTitle>
            <CardDescription>Apply for a position at Veridia.</CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-8">
                <div className="space-y-4">
                  <h3 className="font-headline text-xl">
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="john@example.com"
                              {...field}
                              disabled={!!user}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input
                              type="tel"
                              placeholder="+1 (555) 000-0000"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-headline text-xl">
                    Application Details
                  </h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="jobRole"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Job Role</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a role" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Software Engineer">
                                Software Engineer
                              </SelectItem>
                              <SelectItem value="Frontend Developer">
                                Frontend Developer
                              </SelectItem>
                              <SelectItem value="Backend Developer">
                                Backend Developer
                              </SelectItem>
                              <SelectItem value="Full Stack Developer">
                                Full Stack Developer
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="resumeUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Resume URL</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://example.com/resume.pdf"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  size="lg"
                  type="submit"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting
                    ? 'Submitting...'
                    : 'Submit Application'}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenchange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently withdraw your
              application.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteApplication}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
