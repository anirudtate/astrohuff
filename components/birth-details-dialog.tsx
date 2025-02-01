import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLoadScript, Autocomplete } from "@react-google-maps/api";
import { UserBirthInfo } from "@/lib/gemini";

interface BirthDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: UserBirthInfo) => void;
}

export function BirthDetailsDialog({ open, onClose, onSubmit }: BirthDetailsDialogProps) {
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: ["places"],
  });

  const form = useForm<UserBirthInfo>({
    defaultValues: {
      name: "",
      birthDate: "",
      birthTime: "",
      birthPlace: "",
      latitude: 0,
      longitude: 0,
    },
  });

  const onPlaceSelected = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      if (place.geometry?.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        form.setValue("birthPlace", place.formatted_address || "");
        form.setValue("latitude", lat);
        form.setValue("longitude", lng);
      }
    }
  };

  const handleSubmit = (data: UserBirthInfo) => {
    onSubmit(data);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Enter Your Birth Details</DialogTitle>
          <DialogDescription>
            This information helps provide accurate astrological insights.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              {...form.register("name", { required: "Name is required" })}
              placeholder="Your name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="birthDate">Birth Date</Label>
            <Input
              id="birthDate"
              type="date"
              {...form.register("birthDate", { required: "Birth date is required" })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="birthTime">Birth Time</Label>
            <Input
              id="birthTime"
              type="time"
              {...form.register("birthTime", { required: "Birth time is required" })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="birthPlace">Birth Place</Label>
            {isLoaded ? (
              <Autocomplete
                onLoad={setAutocomplete}
                onPlaceChanged={onPlaceSelected}
                options={{ types: ["(cities)"] }}
              >
                <Input
                  id="birthPlace"
                  {...form.register("birthPlace", { required: "Birth place is required" })}
                  placeholder="Enter your birth place"
                />
              </Autocomplete>
            ) : (
              <Input
                id="birthPlace"
                {...form.register("birthPlace")}
                placeholder="Loading Places Autocomplete..."
                disabled
              />
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Continue</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
