import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
  Suggestion,
} from 'react-places-autocomplete';
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
import { UserBirthInfo } from "@/lib/gemini";
import { cn } from "@/lib/utils";

interface BirthDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: UserBirthInfo) => void;
}

export function BirthDetailsDialog({ open, onClose, onSubmit }: BirthDetailsDialogProps) {
  const [address, setAddress] = useState("");
  const [searchError, setSearchError] = useState<string | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<string | null>(null);
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

  const handleSelect = async (address: string) => {
    try {
      const results = await geocodeByAddress(address);
      const latLng = await getLatLng(results[0]);
      form.setValue("birthPlace", address);
      form.setValue("latitude", latLng.lat);
      form.setValue("longitude", latLng.lng);
      setAddress(address);
      setSelectedPlace(address);
      setSearchError(null);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSubmit = form.handleSubmit((data) => {
    if (!selectedPlace) {
      setSearchError("Please select a place from the suggestions");
      return;
    }
    onSubmit(data);
    onClose();
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Enter Your Birth Details</DialogTitle>
          <DialogDescription>
            This information helps provide accurate astrological insights.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            <PlacesAutocomplete
              value={address}
              onChange={(value) => {
                setAddress(value);
                if (value !== selectedPlace) {
                  setSelectedPlace(null);
                  form.setValue("latitude", 0);
                  form.setValue("longitude", 0);
                }
                setSearchError(null);
              }}
              onSelect={handleSelect}
              onError={(status) => {
                if (status === 'ZERO_RESULTS') {
                  setSearchError('No locations found. Try a different search term.');
                }
              }}
            >
              {({
                getInputProps,
                suggestions,
                getSuggestionItemProps,
                loading,
              }) => (
                <div className="relative">
                  <Input
                    {...getInputProps({
                      placeholder: 'Enter your birth place',
                      className: cn('w-full', searchError && 'border-red-500'),
                    })}
                  />
                  {searchError && (
                    <p className="text-sm text-red-500 mt-1">{searchError}</p>
                  )}
                  {suggestions.length > 0 && (
                    <div className="absolute z-50 mt-1 w-full">
                      <div className="rounded-lg border bg-popover shadow-md max-h-[200px] overflow-y-auto">
                        {loading && (
                          <div className="flex items-center justify-center py-2 px-2 bg-background">
                            <Loader2 className="h-4 w-4 animate-spin" />
                          </div>
                        )}
                        {suggestions.map((suggestion) => {
                          const style = {
                            backgroundColor: suggestion.active
                              ? 'hsl(var(--accent))'
                              : 'hsl(var(--background))',
                            color: suggestion.active
                              ? 'hsl(var(--accent-foreground))'
                              : 'hsl(var(--foreground))',
                            cursor: 'pointer',
                            padding: '8px 12px',
                          };
                          return (
                            <div
                              {...getSuggestionItemProps(suggestion, {
                                style,
                                className: 'text-sm hover:bg-accent hover:text-accent-foreground'
                              })}
                              key={suggestion.placeId}
                            >
                              {suggestion.description}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </PlacesAutocomplete>
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
