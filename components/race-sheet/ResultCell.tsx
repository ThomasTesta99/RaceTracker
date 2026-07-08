import { RaceResultOption, ResultCellProps } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const ResultCell = ({ value, onChange, onClear }: ResultCellProps) => {
  return (
    <div className="flex flex-col items-center gap-2">
      <Select
        value={value}
        onValueChange={(newValue) => onChange(newValue as RaceResultOption)}
      >
        <SelectTrigger
          className={`w-full text-sm text-white transition ${
            value === "win"
              ? "border-green-400/60 bg-green-500/20 shadow-[0_0_16px_rgba(34,197,94,0.45)]"
              : "border-white/10 bg-black/30"
          }`}
        >
          <SelectValue placeholder="Select" />
        </SelectTrigger>

        <SelectContent className="border-white/10 bg-zinc-900 text-white">
          <SelectItem value="win">Win</SelectItem>
          <SelectItem value="loss">Loss</SelectItem>
          <SelectItem value="scratch">Scratch</SelectItem>
        </SelectContent>
      </Select>

      <button
        type="button"
        onClick={onClear}
        className="w-full cursor-pointer rounded-md border border-white/10 py-1 text-xs text-white/70 hover:bg-white/5"
      >
        Clear
      </button>
    </div>
  );
};

export default ResultCell;