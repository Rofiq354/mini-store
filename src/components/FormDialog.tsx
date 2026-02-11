"use client";

import { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface FormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger?: ReactNode;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  formId?: string;
  isSubmitting?: boolean;
  submitLabel?: string;
  cancelLabel?: string;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  showCancel?: boolean;
  submitDisabled?: boolean;
}

const sizeClasses = {
  sm: "sm:max-w-[425px]",
  md: "sm:max-w-[600px]",
  lg: "sm:max-w-[800px]",
  xl: "sm:max-w-4xl",
  full: "sm:max-w-[95vw]",
};

export function FormDialog({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  children,
  footer,
  formId = "dialog-form",
  isSubmitting = false,
  submitLabel = "Simpan",
  cancelLabel = "Batal",
  onSubmit,
  size = "md",
  showCancel = true,
  submitDisabled = false,
}: FormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      <DialogContent
        className={`${sizeClasses[size]} gap-0 p-0 flex flex-col max-h-[95vh] sm:max-h-[90vh]`}
      >
        <DialogHeader className="px-6 pt-6 pb-4 shrink-0">
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 pb-6 min-h-0 custom-scrollbar">
          {onSubmit ? (
            <form id={formId} onSubmit={onSubmit} className="space-y-4">
              {children}
            </form>
          ) : (
            <div className="space-y-4">{children}</div>
          )}
        </div>

        {footer ? (
          <DialogFooter className="px-6 py-4 border-t bg-muted/20 shrink-0">
            {footer}
          </DialogFooter>
        ) : (
          <DialogFooter className="px-6 py-4 border-t bg-muted/20 shrink-0">
            {showCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                {cancelLabel}
              </Button>
            )}
            <Button
              form={formId}
              type="submit"
              disabled={isSubmitting || submitDisabled}
            >
              {isSubmitting ? "Menyimpan..." : submitLabel}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
