'use client';

import { useState } from 'react';
import { MoreHorizontal } from 'lucide-react';
import type { Application, Candidate } from '@/lib/definitions';
import {
  useCollection,
  updateDocumentNonBlocking,
  useFirebase,
  deleteDocumentNonBlocking,
} from '@/firebase';
import { collection, doc, getDoc } from 'firebase/firestore';
import { useFirestore, useMemoFirebase } from '@/firebase/provider';
import { useEffect } from 'react';

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
import { Badge } from '@/components/ui/badge';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

type ApplicationWithCandidate = Application & { candidate: Candidate };

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

export default function AdminDashboardPage() {
  const { user } = useFirebase();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [isHR, setIsHR] = useState(false);
  const [isCheckingRole, setIsCheckingRole] = useState(true);

  const [isViewingApplication, setIsViewingApplication] = useState(false);
  const [selectedApplication, setSelectedApplication] =
    useState<ApplicationWithCandidate | null>(null);
  const [currentStatus, setCurrentStatus] =
    useState<Application['status'] | undefined>(undefined);
  const [offerLetterUrl, setOfferLetterUrl] = useState('');

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [applicationToDeleteId, setApplicationToDeleteId] = useState<
    string | null
  >(null);

  useEffect(() => {
    const checkHRRole = async () => {
      if (user) {
        const hrRoleDoc = doc(firestore, `roles_hr/${user.uid}`);
        const hrRoleSnap = await getDoc(hrRoleDoc);
        setIsHR(hrRoleSnap.exists());
      } else {
        setIsHR(false);
      }
      setIsCheckingRole(false);
    };
    checkHRRole();
  }, [user, firestore]);

  const applicationsQuery = useMemoFirebase(
    () => (isHR ? collection(firestore, 'applications') : null),
    [firestore, isHR]
  );
  const { data: applications, isLoading: isLoadingApplications } =
    useCollection<ApplicationWithCandidate>(applicationsQuery);

  const handleViewApplication = (application: ApplicationWithCandidate) => {
    setSelectedApplication(application);
    setCurrentStatus(application.status);
    setOfferLetterUrl(application.offerLetterUrl || '');
    setIsViewingApplication(true);
  };

  const handleStatusChange = async () => {
    if (!selectedApplication || !currentStatus) return;

    const appDocRef = doc(firestore, 'applications', selectedApplication.id);
    const updateData: { status: Application['status']; offerLetterUrl?: string } =
      {
        status: currentStatus,
      };

    if (currentStatus === 'Offered' && offerLetterUrl) {
      updateData.offerLetterUrl = offerLetterUrl;
    }

    try {
      updateDocumentNonBlocking(appDocRef, updateData);
      toast({
        title: 'Status Updated',
        description: `Status for ${selectedApplication.candidate.firstName} ${selectedApplication.candidate.lastName} updated to ${currentStatus}.`,
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update status. Please try again.',
        variant: 'destructive',
      });
    }
    setIsViewingApplication(false);
    setSelectedApplication(null);
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
      title: 'Application Deleted',
      description: 'The application has been successfully deleted.',
    });
    setIsDeleteDialogOpen(false);
    setApplicationToDeleteId(null);
  };

  const applicationAnswers = selectedApplication?.answers
    ? JSON.parse(selectedApplication.answers)
    : {};

  const isLoading = isCheckingRole || isLoadingApplications;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isHR) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Access Denied</CardTitle>
        </CardHeader>
        <CardContent>
          <p>You do not have permission to view this page.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Applicants</CardTitle>
          <CardDescription>
            Manage job applicants and their application process.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">
                  Applied On
                </TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications?.map((application) => (
                <TableRow key={application.id}>
                  <TableCell className="font-medium">
                    <div className="font-bold">{`${application.candidate.firstName} ${application.candidate.lastName}`}</div>
                    <div className="text-sm text-muted-foreground">
                      {application.candidate.email}
                    </div>
                  </TableCell>
                  <TableCell>{application.jobRole}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariantMapping[application.status]}>
                      {application.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {new Date(application.submissionDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          aria-haspopup="true"
                          size="icon"
                          variant="ghost"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => handleViewApplication(application)}
                        >
                          View Application
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => openDeleteDialog(application.id)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Showing <strong>1-{applications?.length}</strong> of{' '}
            <strong>{applications?.length}</strong> applicants
          </div>
        </CardFooter>
      </Card>

      <Dialog
        open={isViewingApplication}
        onOpenChange={setIsViewingApplication}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="font-headline">
              Application Details
            </DialogTitle>
            <DialogDescription>
              Review the application from{' '}
              {selectedApplication?.candidate.firstName}{' '}
              {selectedApplication?.candidate.lastName}.
            </DialogDescription>
          </DialogHeader>
          {selectedApplication && (
            <div className="grid gap-6 py-4">
              <div className="space-y-2">
                <h4 className="font-semibold">Personal Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={applicationAnswers.firstName}
                      readOnly
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={applicationAnswers.lastName}
                      readOnly
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={applicationAnswers.email}
                      readOnly
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={applicationAnswers.phone || 'N/A'}
                      readOnly
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Application Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="jobRole">Job Role</Label>
                    <Input
                      id="jobRole"
                      value={selectedApplication.jobRole}
                      readOnly
                    />
                  </div>
                  <div>
                    <Label>Resume</Label>
                    {applicationAnswers.resumeUrl ? (
                      <a
                        href={applicationAnswers.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary underline"
                      >
                        View Resume
                      </a>
                    ) : (
                      'No resume provided'
                    )}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Application Status</h4>
                <Select
                  value={currentStatus}
                  onValueChange={(value) =>
                    setCurrentStatus(value as Application['status'])
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Set status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Applied">Applied</SelectItem>
                    <SelectItem value="Interviewing">Interviewing</SelectItem>
                    <SelectItem value="Offered">Offered</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {currentStatus === 'Offered' && (
                <div className="space-y-2">
                  <h4 className="font-semibold">Offer Letter</h4>
                  <Label htmlFor="offerLetterUrl">Offer Letter URL</Label>
                  <Input
                    id="offerLetterUrl"
                    placeholder="https://example.com/offer.pdf"
                    value={offerLetterUrl}
                    onChange={(e) => setOfferLetterUrl(e.target.value)}
                  />
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsViewingApplication(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleStatusChange}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              application and remove its data from our servers.
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
