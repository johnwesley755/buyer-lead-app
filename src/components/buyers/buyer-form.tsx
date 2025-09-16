"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { buyerSchema, type BuyerFormValues } from "@/lib/validations/buyer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface BuyerFormProps {
  initialData?: Partial<BuyerFormValues>;
  buyerId?: string;
}

export function BuyerForm({ initialData, buyerId }: BuyerFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!buyerId;

  const form = useForm<BuyerFormValues>({
    resolver: zodResolver(buyerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      status: "new",
      priority: "medium",
      budget: null,
      location: "",
      notes: "",
      tags: [],
      assignedTo: null,
      ...initialData,
    },
  });

  async function onSubmit(data: BuyerFormValues) {
    setIsSubmitting(true);

    try {
      const url = isEditing ? `/api/buyers/${buyerId}` : "/api/buyers";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save buyer");
      }

      router.push("/buyers");
      router.refresh();
    } catch (error) {
      console.error("Form submission error:", error);
      // Handle error state
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="firstName" className="text-sm font-medium">
            First Name
          </label>
          <Input
            id="firstName"
            {...form.register("firstName")}
            disabled={isSubmitting}
          />
          {form.formState.errors.firstName && (
            <p className="text-sm text-red-500">
              {form.formState.errors.firstName.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="lastName" className="text-sm font-medium">
            Last Name
          </label>
          <Input
            id="lastName"
            {...form.register("lastName")}
            disabled={isSubmitting}
          />
          {form.formState.errors.lastName && (
            <p className="text-sm text-red-500">
              {form.formState.errors.lastName.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <Input
            id="email"
            type="email"
            {...form.register("email")}
            disabled={isSubmitting}
          />
          {form.formState.errors.email && (
            <p className="text-sm text-red-500">
              {form.formState.errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm font-medium">
            Phone
          </label>
          <Input
            id="phone"
            {...form.register("phone")}
            disabled={isSubmitting}
          />
          {form.formState.errors.phone && (
            <p className="text-sm text-red-500">
              {form.formState.errors.phone.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="status" className="text-sm font-medium">
            Status
          </label>
          <select
            id="status"
            {...form.register("status")}
            disabled={isSubmitting}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="negotiating">Negotiating</option>
            <option value="closed">Closed</option>
            <option value="lost">Lost</option>
          </select>
          {form.formState.errors.status && (
            <p className="text-sm text-red-500">
              {form.formState.errors.status.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="priority" className="text-sm font-medium">
            Priority
          </label>
          <select
            id="priority"
            {...form.register("priority")}
            disabled={isSubmitting}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          {form.formState.errors.priority && (
            <p className="text-sm text-red-500">
              {form.formState.errors.priority.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="budget" className="text-sm font-medium">
            Budget
          </label>
          <Input
            id="budget"
            type="number"
            {...form.register("budget", { valueAsNumber: true })}
            disabled={isSubmitting}
          />
          {form.formState.errors.budget && (
            <p className="text-sm text-red-500">
              {form.formState.errors.budget.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="location" className="text-sm font-medium">
            Location
          </label>
          <Input
            id="location"
            {...form.register("location")}
            disabled={isSubmitting}
          />
          {form.formState.errors.location && (
            <p className="text-sm text-red-500">
              {form.formState.errors.location.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="notes" className="text-sm font-medium">
          Notes
        </label>
        <Textarea
          id="notes"
          {...form.register("notes")}
          disabled={isSubmitting}
          rows={4}
        />
        {form.formState.errors.notes && (
          <p className="text-sm text-red-500">
            {form.formState.errors.notes.message}
          </p>
        )}
      </div>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Saving..."
            : isEditing
            ? "Update Buyer"
            : "Create Buyer"}
        </Button>
      </div>
    </form>
  );
}
