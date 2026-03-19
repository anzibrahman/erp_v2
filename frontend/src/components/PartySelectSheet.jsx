// src/components/PartySelectSheet.jsx
import { useDispatch } from "react-redux";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { PartyList } from "@/components/PartyList";
import { setParty } from "@/store/slices/transactionSlice";

export default function PartySelectSheet({ open, onOpenChange }) {
  const dispatch = useDispatch();

  const handleSelect = (party) => {
    dispatch(setParty(party));
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="flex h-[80vh] max-h-[80vh] flex-col overflow-hidden rounded-t-3xl px-0 pt-3 pb-2"
      >
        <div className="flex h-full min-h-0 flex-col">
          <SheetHeader className="shrink-0 px-4 pb-2">
            <SheetTitle className="text-sm">Select Party</SheetTitle>
          </SheetHeader>

          <div className="min-h-0 flex-1 px-4 pb-2">
            <PartyList mode="select" onSelect={handleSelect} />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
