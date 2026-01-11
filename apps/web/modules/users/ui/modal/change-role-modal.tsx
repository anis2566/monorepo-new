"use client";

import {
  Shield,
  User,
  Crown,
  Settings,
  Check,
  AlertTriangle,
} from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/react";
import { toast } from "sonner";
import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@workspace/ui/components/dialog";
import { Button } from "@workspace/ui/components/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import { Badge } from "@workspace/ui/components/badge";
import { cn } from "@workspace/ui/lib/utils";
import { ROLE } from "@workspace/utils/constant";

import { useChangeRole } from "@/hooks/use-user";

interface RoleOption {
  id: ROLE;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
}

const roles: RoleOption[] = [
  {
    id: ROLE.Admin,
    label: "Administrator",
    description: "Full access to all settings and features",
    icon: <Crown className="h-5 w-5" />,
    color: "text-warning",
    bgColor: "bg-warning/10",
    borderColor: "border-warning/30",
  },
  {
    id: ROLE.Moderator,
    label: "Moderator",
    description: "Can manage content and users",
    icon: <Shield className="h-5 w-5" />,
    color: "text-accent",
    bgColor: "bg-accent/10",
    borderColor: "border-accent/30",
  },
  {
    id: ROLE.User,
    label: "Member",
    description: "Standard access with limited permissions",
    icon: <User className="h-5 w-5" />,
    color: "text-primary",
    bgColor: "bg-primary/10",
    borderColor: "border-primary/30",
  },
];

export function ChangeUserRoleModal() {
  const [selectedRole, setSelectedRole] = useState<ROLE>(ROLE.User);

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { isOpen, onClose, userId, currentRole, name, email, image } =
    useChangeRole();

  useEffect(() => {
    if (isOpen && currentRole) {
      setSelectedRole(currentRole as ROLE);
    }
  }, [isOpen, currentRole]);

  const { mutate: changeRole, isPending } = useMutation(
    trpc.user.changeRole.mutationOptions({
      onError: (err) => {
        toast.error(err.message);
      },
      onSuccess: async (data) => {
        if (!data.success) {
          toast.error(data.message);
          return;
        }

        toast.success(data.message);

        await queryClient.invalidateQueries({
          queryKey: trpc.admin.user.getMany.queryKey(),
        });

        setTimeout(() => {
          onClose();
        }, 500);
      },
    })
  );

  const handleSave = async () => {
    if (selectedRole === currentRole) {
      onClose();
      return;
    }

    if (!userId) {
      toast.error("User ID is required");
      return;
    }

    changeRole({
      userId,
      role: selectedRole,
    });
  };

  const isDowngrade = selectedRole === ROLE.User && currentRole !== ROLE.User;
  const hasChanges = selectedRole !== currentRole;

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-md mx-auto p-0 gap-0 rounded-2xl overflow-hidden border-border/50 shadow-card">
        {/* Header with gradient */}
        <div className="gradient-primary p-4 sm:p-6">
          <DialogHeader className="space-y-3 text-left">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary-foreground/20 backdrop-blur-sm">
                <Settings className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" />
              </div>
              <DialogTitle className="text-lg sm:text-xl font-semibold text-primary-foreground">
                Change Role
              </DialogTitle>
            </div>
            <DialogDescription className="text-primary-foreground/80 text-sm">
              Update permissions for this team member
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-4 sm:p-6 space-y-5">
          {/* User Info Card */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50 border border-border/50">
            <Avatar className="h-11 w-11 sm:h-12 sm:w-12 ring-2 ring-border/50 ring-offset-2 ring-offset-background">
              <AvatarImage src={image} alt={name} />
              <AvatarFallback className="gradient-primary text-primary-foreground font-medium">
                {name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate text-sm sm:text-base">
                {name}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground truncate">
                {email}
              </p>
            </div>
            <Badge variant="secondary" className="text-xs font-medium shrink-0">
              {currentRole}
            </Badge>
          </div>

          {/* Role Selection */}
          <div className="space-y-2.5">
            <label className="text-sm font-medium text-foreground">
              Select new role
            </label>
            <div className="space-y-4">
              {roles.map((role, index) => {
                const isSelected = selectedRole === role.id;
                const isCurrent = currentRole === role.id;

                return (
                  <button
                    key={role.id}
                    onClick={() => setSelectedRole(role.id)}
                    className={cn(
                      "w-full p-3 sm:p-4 rounded-xl border-2 text-left transition-all duration-200",
                      "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                      "animate-slide-up",
                      isSelected
                        ? cn("border-primary bg-primary/5", role.borderColor)
                        : "border-border/50 hover:border-border hover:bg-secondary/30"
                    )}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          "p-2 rounded-lg transition-colors",
                          isSelected
                            ? cn(role.bgColor, role.color)
                            : "bg-secondary text-muted-foreground"
                        )}
                      >
                        {role.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              "font-medium text-sm sm:text-base",
                              isSelected
                                ? "text-foreground"
                                : "text-foreground/80"
                            )}
                          >
                            {role.label}
                          </span>
                          {isCurrent && (
                            <Badge
                              variant="outline"
                              className="text-[10px] px-1.5 py-0 h-5"
                            >
                              Current
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                          {role.description}
                        </p>
                      </div>
                      <div
                        className={cn(
                          "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all",
                          isSelected
                            ? "border-primary bg-primary"
                            : "border-muted-foreground/30"
                        )}
                      >
                        {isSelected && (
                          <Check className="h-3 w-3 text-primary-foreground" />
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Warning for downgrade */}
          {isDowngrade && (
            <div className="flex items-start gap-3 p-3 rounded-xl bg-warning/10 border border-warning/30 animate-fade-in">
              <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-warning">Role downgrade</p>
                <p className="text-muted-foreground mt-0.5">
                  This will remove administrative permissions from this user.
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 pt-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 h-11 rounded-xl border-border/50 hover:primary/40"
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!hasChanges || isPending}
              className={cn(
                "flex-1 h-11 rounded-xl font-medium transition-all",
                hasChanges ? "gradient-primary hover:opacity-90" : ""
              )}
            >
              {isPending ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Saving...
                </span>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
