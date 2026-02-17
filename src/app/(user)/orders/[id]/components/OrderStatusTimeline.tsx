"use client";

import { CheckCircle2, Circle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

type OrderStatus =
  | "pending_payment"
  | "paid"
  | "processing"
  | "ready_to_ship"
  | "shipped"
  | "delivered"
  | "completed"
  | "cancelled"
  | "failed";

interface OrderStatusTimelineProps {
  currentStatus: OrderStatus;
  deliveryMethod: "delivery" | "pickup";
}

export default function OrderStatusTimeline({
  currentStatus,
  deliveryMethod,
}: OrderStatusTimelineProps) {
  const steps =
    deliveryMethod === "pickup"
      ? [
          { status: "paid", label: "Dibayar" },
          { status: "processing", label: "Diproses" },
          { status: "ready_to_ship", label: "Siap Diambil" },
          { status: "delivered", label: "Sudah Diambil" },
          { status: "completed", label: "Selesai" },
        ]
      : [
          { status: "paid", label: "Dibayar" },
          { status: "processing", label: "Diproses" },
          { status: "ready_to_ship", label: "Siap Dikirim" },
          { status: "shipped", label: "Dikirim" },
          { status: "delivered", label: "Diterima" },
          { status: "completed", label: "Selesai" },
        ];

  const statusOrder = [
    "pending_payment",
    "paid",
    "processing",
    "ready_to_ship",
    "shipped",
    "delivered",
    "completed",
  ];
  const currentIndex = statusOrder.indexOf(currentStatus);

  if (currentStatus === "cancelled" || currentStatus === "failed") return null;

  return (
    <div className="w-full">
      <div className="md:hidden space-y-0">
        {steps.map((step, index) => {
          const stepIndex = statusOrder.indexOf(step.status);
          const isCompleted = stepIndex <= currentIndex;
          const isCurrent = step.status === currentStatus;

          return (
            <div key={step.status} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex items-center justify-center h-8 w-8 rounded-full z-10 border-2 transition-all duration-500",
                    isCompleted
                      ? "bg-primary border-primary text-primary-foreground shadow-sm"
                      : "bg-background border-muted text-muted-foreground",
                  )}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : isCurrent ? (
                    <Clock className="h-4 w-4 animate-pulse" />
                  ) : (
                    <Circle className="h-4 w-4" />
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "w-0.5 h-10 -my-px transition-colors duration-500",
                      isCompleted ? "bg-primary" : "bg-muted",
                    )}
                  />
                )}
              </div>
              <div className="pt-1 pb-6">
                <p
                  className={cn(
                    "text-sm font-bold leading-none",
                    isCompleted ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {step.label}
                </p>
                {isCurrent && (
                  <span className="text-[10px] font-bold text-primary uppercase tracking-widest mt-1 block">
                    Sedang Berlangsung
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="hidden md:block relative px-4">
        <div className="absolute top-5 left-0 w-full h-0.5 bg-muted z-0" />

        <div
          className="absolute top-5 left-0 h-0.5 bg-primary transition-all duration-1000 z-0"
          style={{
            width: `${(currentIndex / (statusOrder.length - 1)) * 100}%`,
          }}
        />

        <div className="relative flex justify-between items-start">
          {steps.map((step) => {
            const stepIndex = statusOrder.indexOf(step.status);
            const isCompleted = stepIndex <= currentIndex;
            const isCurrent = step.status === currentStatus;

            return (
              <div
                key={step.status}
                className="flex flex-col items-center group"
              >
                {/* Icon Circle */}
                <div
                  className={cn(
                    "flex items-center justify-center h-10 w-10 rounded-full border-4 transition-all duration-500 z-10",
                    isCompleted
                      ? "bg-primary border-background text-primary-foreground shadow-md scale-110"
                      : "bg-background border-muted text-muted-foreground",
                  )}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : isCurrent ? (
                    <Clock className="h-5 w-5 animate-pulse" />
                  ) : (
                    <Circle className="h-5 w-5" />
                  )}
                </div>

                {/* Labels */}
                <div className="mt-4 text-center">
                  <p
                    className={cn(
                      "text-xs font-bold tracking-tight transition-colors",
                      isCompleted ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {step.label}
                  </p>
                  {isCurrent && (
                    <div className="mt-1 animate-in fade-in slide-in-from-top-1">
                      <span className="text-[9px] bg-primary text-primary-foreground px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter">
                        Aktif
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
