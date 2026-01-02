import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { BookOpen, Phone, User } from "lucide-react";
import { useState } from "react";

interface ClassPhoneIdStepProps {
  onNext: (data: { classLevel: string; phone: string }) => void;
  onBack: () => void;
}

const CLASS_OPTIONS = [
  { value: "class-6", label: "Class 6" },
  { value: "class-7", label: "Class 7" },
  { value: "class-8", label: "Class 8" },
  { value: "class-9", label: "Class 9" },
  { value: "class-10", label: "Class 10" },
  { value: "class-11", label: "Class 11" },
  { value: "class-12", label: "Class 12" },
  { value: "undergraduate", label: "Undergraduate" },
  { value: "postgraduate", label: "Postgraduate" },
];

export const ClassPhoneIdStep = ({ onNext, onBack }: ClassPhoneIdStepProps) => {
  const [classLevel, setClassLevel] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<{
    class?: string;
    phone?: string;
    studentId?: string;
  }>({});
  const [studentId, setStudentId] = useState("");

  const validatePhone = (value: string) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(value);
  };

  const handleSubmit = () => {
    const newErrors: { class?: string; phone?: string; studentId?: string } =
      {};

    if (!classLevel) {
      newErrors.class = "Please select your class";
    }

    if (!phone) {
      newErrors.phone = "Phone number is required";
    } else if (!validatePhone(phone)) {
      newErrors.phone = "Enter a valid 10-digit phone number";
    }

    if (!studentId) {
      newErrors.studentId = "Student ID is required";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onNext({ classLevel, phone });
    }
  };

  return (
    <div className="flex flex-col px-4 animate-slide-up">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-foreground mb-1">Your Details</h2>
        <p className="text-sm text-muted-foreground">
          Help us personalize your experience
        </p>
      </div>

      <div className="space-y-5">
        {/* Class Selection */}
        <div className="space-y-1">
          <Label
            htmlFor="class"
            className="flex items-center gap-2 text-foreground font-medium"
          >
            <BookOpen className="w-4 h-4 text-primary" />
            Select Your Class
          </Label>
          <Select value={classLevel} onValueChange={setClassLevel}>
            <SelectTrigger id="class" className="w-full py-5">
              <SelectValue placeholder="Choose your class" />
            </SelectTrigger>
            <SelectContent className="bg-popover border border-border shadow-lg z-50">
              {CLASS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.class && (
            <p className="text-xs text-destructive">{errors.class}</p>
          )}
        </div>

        {/* Student Id */}
        <div className="space-y-1">
          <Label
            htmlFor="studentId"
            className="flex items-center gap-2 text-foreground font-medium"
          >
            <User className="w-4 h-4 text-primary" />
            Student ID
          </Label>
          <Input
            id="studentId"
            type="text"
            placeholder="Enter your student ID"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            className="h-12"
          />
          {errors.studentId && (
            <p className="text-xs text-destructive">{errors.studentId}</p>
          )}
        </div>

        {/* Phone Number */}
        <div className="space-y-1">
          <Label
            htmlFor="id"
            className="flex items-center gap-2 text-foreground font-medium"
          >
            <Phone className="w-4 h-4 text-primary" />
            Guardian Phone Number
          </Label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">
              +88
            </span>
            <Input
              id="id"
              type="text"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
              }
              className="pl-12 h-12"
            />
          </div>
          {errors.phone && (
            <p className="text-xs text-destructive">{errors.phone}</p>
          )}
          <p className="text-xs text-muted-foreground">
            We&apos;ll send a verification code to this number
          </p>
        </div>
      </div>

      <div className="mt-8 space-y-3">
        <Button
          variant="default"
          size="lg"
          onClick={handleSubmit}
          className="w-full"
        >
          Send Verification Code
        </Button>
        <Button
          variant="ghost"
          size="default"
          onClick={onBack}
          className="w-full hover:bg-muted hover:text-black"
        >
          Back
        </Button>
      </div>
    </div>
  );
};
