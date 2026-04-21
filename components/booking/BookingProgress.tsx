"use client"

import { Check } from "lucide-react"
import { useTranslations } from "next-intl"
import {
  Stepper,
  StepperItem,
  StepperNav,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
  StepperIndicator,
} from "@/components/ui/stepper"

interface BookingProgressProps {
  currentStep: 1 | 2 | 3
}

export function BookingProgress({ currentStep }: BookingProgressProps) {
  const t = useTranslations("booking.progress")

  const steps = [
    { n: 1 as const, label: t("service") },
    { n: 2 as const, label: t("barber") },
    { n: 3 as const, label: t("schedule") },
  ]

  return (
    <Stepper value={currentStep} className="mb-8">
      <StepperNav>
        {steps.map(({ n, label }, i) => (
          <StepperItem key={n} step={n} completed={n < currentStep} className="items-start">
            <StepperTrigger className="flex-col gap-1.5 cursor-default" tabIndex={-1}>
              <StepperIndicator>
                {n < currentStep ? <Check className="w-3 h-3" /> : n}
              </StepperIndicator>
              <StepperTitle>{label}</StepperTitle>
            </StepperTrigger>
            {i < steps.length - 1 && <StepperSeparator className="mt-3" />}
          </StepperItem>
        ))}
      </StepperNav>
    </Stepper>
  )
}
