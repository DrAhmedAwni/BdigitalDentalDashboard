import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { LabCase, CaseStage } from "@/types/lab";
import { cn } from "@/lib/utils";

interface EditCaseDialogProps {
    caseData: LabCase;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (updates: Partial<LabCase>) => Promise<void>;
}

// Material pricing (EGP per unit)
const MATERIAL_PRICES: Record<string, number> = {
    "Monolithic Zirconia": 1250,
    "Layered Zirconia": 1500,
    "E-Max Crown": 1800,
    "PFM (Porcelain Fused to Metal)": 800,
    "Full Metal Crown": 600,
    "Temporary PMMA": 300,
    "Implant Crown": 2000,
    "Veneer": 2500,
};

const CASE_STAGES: CaseStage[] = [
    "submitted",
    "Pouring/Scan",
    "Design",
    "Waiting for Confirmation",
    "Tryin Printing",
    "Tryin Ready to Deliver",
    "Tryin Delivered",
    "Sintring",
    "Stain&Glaze",
    "Final Ready to Deliver",
    "Final Delivered",
];

export function EditCaseDialog({ caseData, open, onOpenChange, onSave }: EditCaseDialogProps) {
    const [material, setMaterial] = useState(caseData.material);
    const [units, setUnits] = useState(caseData.units);
    const [price, setPrice] = useState(caseData.priceEgp);
    const [dueDate, setDueDate] = useState<Date | undefined>(
        caseData.dueDate ? new Date(caseData.dueDate) : undefined
    );
    const [stage, setStage] = useState<CaseStage>(caseData.stage);
    const [shade, setShade] = useState(caseData.shade || "");
    const [notes, setNotes] = useState(caseData.notes || "");
    const [isSaving, setIsSaving] = useState(false);

    // Auto-calculate price when material or units change
    const handleMaterialChange = (newMaterial: string) => {
        setMaterial(newMaterial);
        const unitPrice = MATERIAL_PRICES[newMaterial] || 0;
        setPrice(unitPrice * units);
    };

    const handleUnitsChange = (newUnits: number) => {
        setUnits(newUnits);
        const unitPrice = MATERIAL_PRICES[material] || 0;
        setPrice(unitPrice * newUnits);
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const updates: Partial<LabCase> = {
                material,
                units,
                priceEgp: price,
                dueDate: dueDate ? format(dueDate, "yyyy-MM-dd") : caseData.dueDate,
                stage,
                shade,
                notes,
            };

            await onSave(updates);
            onOpenChange(false);
        } catch (error) {
            console.error("Error saving case:", error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Case: {caseData.caseCode}</DialogTitle>
                    <DialogDescription>
                        Update case details for patient {caseData.patientName}
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    {/* Material Selection */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="material" className="text-right">
                            Material
                        </Label>
                        <Select value={material} onValueChange={handleMaterialChange}>
                            <SelectTrigger className="col-span-3" id="material">
                                <SelectValue placeholder="Select material" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.keys(MATERIAL_PRICES).map((mat) => (
                                    <SelectItem key={mat} value={mat}>
                                        {mat} ({MATERIAL_PRICES[mat]} EGP/unit)
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Units */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="units" className="text-right">
                            Units
                        </Label>
                        <Input
                            id="units"
                            type="number"
                            min={1}
                            value={units}
                            onChange={(e) => handleUnitsChange(parseInt(e.target.value) || 1)}
                            className="col-span-3"
                        />
                    </div>

                    {/* Price (auto-calculated) */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="price" className="text-right">
                            Price (EGP)
                        </Label>
                        <Input
                            id="price"
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                            className="col-span-3"
                        />
                    </div>

                    {/* Shade */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="shade" className="text-right">
                            Shade
                        </Label>
                        <Input
                            id="shade"
                            value={shade}
                            onChange={(e) => setShade(e.target.value)}
                            className="col-span-3"
                            placeholder="e.g., A2, B3"
                        />
                    </div>

                    {/* Due Date */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Due Date</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        "col-span-3 justify-start text-left font-normal",
                                        !dueDate && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={dueDate}
                                    onSelect={setDueDate}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    {/* Stage */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="stage" className="text-right">
                            Stage
                        </Label>
                        <Select value={stage} onValueChange={(value) => setStage(value as CaseStage)}>
                            <SelectTrigger className="col-span-3" id="stage">
                                <SelectValue placeholder="Select stage" />
                            </SelectTrigger>
                            <SelectContent>
                                {CASE_STAGES.map((s) => (
                                    <SelectItem key={s} value={s}>
                                        {s}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Notes */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="notes" className="text-right">
                            Notes
                        </Label>
                        <Input
                            id="notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="col-span-3"
                            placeholder="Additional notes"
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
