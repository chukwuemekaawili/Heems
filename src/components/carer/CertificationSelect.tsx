import { Badge } from "@/components/ui/badge";
import { Check, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { cn } from "@/lib/utils";

const CERTIFICATIONS = [
    "Food and safety level 1 & 2",
    "Fire safety",
    "Mental capacity Act awareness",
    "Safeguards of Vulnerable adults and Children (SOVA) Awareness",
    "Dementia awareness",
    "Stroke awareness",
    "COOSH",
    "Medications level 2",
    "GDPR",
    "Moving and Handling awareness",
    "Equality act 2010",
    "Behaviour Support Awareness",
    "Personal Care Awareness",
    "Infection Prevention & Hygiene",
    "Health & Safety Awareness",
    "First Aid Awareness",
    "Equality, Diversity & Inclusion",
    "Data Protection & Confidentiality Awareness",
    "Mental health awareness",
    "End-of-Life Sensitivity Awareness",
    "Lone Working Awareness",
    "Mobility Support Awareness",
    "Medication Awareness",
    "Others"
];

interface CertificationSelectProps {
    selected: string[];
    onChange: (selected: string[]) => void;
    disabled?: boolean;
}

export function CertificationSelect({ selected = [], onChange, disabled }: CertificationSelectProps) {
    const [open, setOpen] = useState(false);

    const handleSelect = (cert: string) => {
        if (selected.includes(cert)) {
            onChange(selected.filter((c) => c !== cert));
        } else {
            onChange([...selected, cert]);
        }
    };

    const handleRemove = (cert: string) => {
        onChange(selected.filter((c) => c !== cert));
    };

    return (
        <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
                {selected.map((cert) => (
                    <Badge key={cert} variant="secondary" className="pl-2 pr-1 py-1">
                        {cert}
                        <button
                            onClick={() => !disabled && handleRemove(cert)}
                            disabled={disabled}
                            className={cn(
                                "ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                                disabled ? "cursor-not-allowed opacity-50" : "hover:bg-muted-foreground/20"
                            )}
                        >
                            <X className="h-3 w-3 text-muted-foreground" />
                            <span className="sr-only">Remove {cert}</span>
                        </button>
                    </Badge>
                ))}
                {selected.length === 0 && (
                    <span className="text-sm text-muted-foreground italic">No qualifications selected</span>
                )}
            </div>

            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="justify-between w-full md:w-[300px]"
                        disabled={disabled}
                    >
                        <span className="flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            Add Qualification
                        </span>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0" align="start">
                    <Command>
                        <CommandInput placeholder="Search qualifications..." />
                        <CommandList>
                            <CommandEmpty>No qualification found.</CommandEmpty>
                            <CommandGroup className="max-h-64 overflow-auto">
                                {CERTIFICATIONS.map((cert) => (
                                    <CommandItem
                                        key={cert}
                                        value={cert}
                                        onSelect={() => handleSelect(cert)}
                                    >
                                        <div
                                            className={cn(
                                                "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                                selected.includes(cert)
                                                    ? "bg-primary text-primary-foreground"
                                                    : "opacity-50 [&_svg]:invisible"
                                            )}
                                        >
                                            <Check className={cn("h-4 w-4")} />
                                        </div>
                                        {cert}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
}
