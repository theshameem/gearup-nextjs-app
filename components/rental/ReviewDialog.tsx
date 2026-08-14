"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Star } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Textarea, Label } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useCreateReview } from "@/hooks/useReviews";
import { cn } from "@/lib/utils";

const schema = z.object({
  rating: z.coerce.number().int().min(1, "Pick a rating").max(5),
  comment: z.string().max(500).optional().or(z.literal("")),
});
type FormValues = z.infer<typeof schema>;

export function ReviewDialog({
  open,
  onClose,
  gearItemId,
  rentalOrderId,
  gearName,
}: {
  open: boolean;
  onClose: () => void;
  gearItemId: string;
  rentalOrderId: string;
  gearName: string;
}) {
  const [submitting, setSubmitting] = useState(false);
  const create = useCreateReview();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as never,
    defaultValues: { rating: 5, comment: "" },
  });
  const rating = form.watch("rating");

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    try {
      await create.mutateAsync({
        gearItemId,
        rentalOrderId,
        rating: values.rating,
        comment: values.comment || undefined,
      });
      toast.success("Thanks for your review!");
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not submit review";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onClose={onClose} title={`Review ${gearName}`}>
      <form onSubmit={form.handleSubmit(onSubmit as never)} className="space-y-3">
        <div>
          <Label>Rating</Label>
          <div className="mt-2 flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => form.setValue("rating", n)}
                className="rounded-md p-1 hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label={`${n} star${n > 1 ? "s" : ""}`}
              >
                <Star
                  className={cn(
                    "h-6 w-6",
                    n <= rating ? "fill-amber-400 text-amber-400" : "text-slate-300",
                  )}
                />
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="comment">Comment (optional)</Label>
          <Textarea id="comment" rows={4} {...form.register("comment")} />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? "Submitting…" : "Submit review"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
