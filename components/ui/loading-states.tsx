import { Loader2, CheckCircle, AlertCircle, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LoadingSpinner({
  size = "md",
  className,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  return (
    <Loader2 className={cn("animate-spin", sizeClasses[size], className)} />
  );
}

interface LoadingButtonProps {
  isLoading: boolean;
  children: React.ReactNode;
  loadingText?: string;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

export function LoadingButton({
  isLoading,
  children,
  loadingText = "Loading...",
  className,
  disabled,
  ...props
}: LoadingButtonProps) {
  return (
    <Button className={className} disabled={isLoading || disabled} {...props}>
      {isLoading && <LoadingSpinner size="sm" className="mr-2" />}
      {isLoading ? loadingText : children}
    </Button>
  );
}

interface MessageAlertProps {
  type: "success" | "error" | "warning" | "info";
  title?: string;
  message: string;
  className?: string;
  onDismiss?: () => void;
}

export function MessageAlert({
  type,
  title,
  message,
  className,
  onDismiss,
}: MessageAlertProps) {
  const config = {
    success: {
      icon: CheckCircle,
      className: "border-green-500 bg-green-50 text-green-700",
      iconClassName: "text-green-600",
    },
    error: {
      icon: AlertCircle,
      className: "border-red-500 bg-red-50 text-red-700",
      iconClassName: "text-red-600",
    },
    warning: {
      icon: AlertCircle,
      className: "border-yellow-500 bg-yellow-50 text-yellow-700",
      iconClassName: "text-yellow-600",
    },
    info: {
      icon: Info,
      className: "border-blue-500 bg-blue-50 text-blue-700",
      iconClassName: "text-blue-600",
    },
  };

  const { icon: Icon, className: alertClassName, iconClassName } = config[type];

  return (
    <Alert className={cn(alertClassName, className)}>
      <Icon className={cn("w-4 h-4", iconClassName)} />
      <AlertDescription>
        <div className="flex items-start justify-between">
          <div>
            {title && <div className="font-medium mb-1">{title}</div>}
            <div>{message}</div>
          </div>
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="ml-4 text-current opacity-70 hover:opacity-100"
            >
              ×
            </button>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
}

interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
  children: React.ReactNode;
}

export function LoadingOverlay({
  isLoading,
  message = "Loading...",
  children,
}: LoadingOverlayProps) {
  return (
    <div className="relative">
      {children}
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 flex items-center space-x-3">
            <LoadingSpinner />
            <span className="text-gray-700">{message}</span>
          </div>
        </div>
      )}
    </div>
  );
}

interface LoadingCardProps {
  title?: string;
  description?: string;
  className?: string;
}

export function LoadingCard({
  title = "Loading...",
  description,
  className,
}: LoadingCardProps) {
  return (
    <div
      className={cn("bg-white rounded-lg border p-6 text-center", className)}
    >
      <LoadingSpinner className="mx-auto mb-4" />
      <h3 className="font-medium text-gray-900 mb-2">{title}</h3>
      {description && <p className="text-gray-600 text-sm">{description}</p>}
    </div>
  );
}

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn("text-center py-12", className)}>
      {icon && <div className="flex justify-center mb-4">{icon}</div>}
      <h3 className="font-medium text-gray-900 mb-2">{title}</h3>
      {description && <p className="text-gray-600 mb-6">{description}</p>}
      {action && (
        <Button
          onClick={action.onClick}
          className="bg-orange-500 hover:bg-orange-600"
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}
