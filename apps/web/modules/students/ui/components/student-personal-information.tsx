import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Calendar, MapPin, Phone, User } from "lucide-react";

interface StudentPersonalInformationProps {
  student: {
    name: string;
    nameBangla: string;
    fName: string;
    mName: string;
    gender: string;
    dob: string;
    nationality: string;
    religion: string;
    fPhone: string;
    mPhone: string;
    presentAddress: {
      houseNo: string;
      moholla: string;
      post: string;
      thana: string;
    };
    permanentAddress: {
      village: string;
      post: string;
      thana: string;
      district: string;
    };
    linkedUser: {
      id: string;
      email: string;
      emailVerified: boolean | null;
      isVerifiedStudent: boolean;
    } | null;
  };
}

export const StudentPersonalInformation = ({
  student,
}: StudentPersonalInformationProps) => {
  return (
    <div className="grid lg:grid-cols-2 gap-4">
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <User className="h-5 w-5 text-primary" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-x-6">
          <InfoRow label="Full Name" value={student.name} icon={User} />
          <InfoRow label="Name (Bangla)" value={student.nameBangla} />
          <InfoRow label="Father's Name" value={student.fName} />
          <InfoRow label="Mother's Name" value={student.mName} />
          <InfoRow label="Gender" value={student.gender} />
          <InfoRow label="Date of Birth" value={student.dob} icon={Calendar} />
          <InfoRow label="Nationality" value={student.nationality} />
          <InfoRow label="Religion" value={student.religion} />
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Phone className="h-5 w-5 text-primary" />
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-xs text-muted-foreground mb-2">
              Father&apos;s Phone
            </p>
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium">{student.fPhone}</p>
              <Button variant="ghost" size="sm" className="h-7 px-2">
                <Phone className="h-3 w-3" />
              </Button>
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-2">
              Mother&apos;s Phone
            </p>
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium">{student.mPhone}</p>
              <Button variant="ghost" size="sm" className="h-7 px-2">
                <Phone className="h-3 w-3" />
              </Button>
            </div>
          </div>
          {student.linkedUser?.emailVerified && (
            <div>
              <p className="text-xs text-muted-foreground mb-2">Linked Email</p>
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium">
                  {student.linkedUser.email}
                </p>
                <Badge
                  variant={
                    student.linkedUser.emailVerified ? "default" : "destructive"
                  }
                  className="text-xs"
                >
                  {student.linkedUser.emailVerified
                    ? "Verified"
                    : "Not Verified"}
                </Badge>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Present Address */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <MapPin className="h-5 w-5 text-primary" />
            Present Address
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-foreground space-y-1">
            <p>{student.presentAddress.houseNo}</p>
            <p>{student.presentAddress.moholla}</p>
            <p>
              Post: {student.presentAddress.post}, Thana:{" "}
              {student.presentAddress.thana}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Permanent Address */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <MapPin className="h-5 w-5 text-primary" />
            Permanent Address
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-foreground space-y-1">
            <p>Village: {student.permanentAddress.village}</p>
            <p>Post: {student.permanentAddress.post}</p>
            <p>Thana: {student.permanentAddress.thana}</p>
            <p>District: {student.permanentAddress.district}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

function InfoRow({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="flex items-start gap-3 py-2">
      {Icon && (
        <Icon className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
      )}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground">{value || "-"}</p>
      </div>
    </div>
  );
}
