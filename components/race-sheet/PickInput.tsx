import { PickInputProps } from "@/types";

const PickInput = ({ value, onChange, highlightClass }: PickInputProps) => {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-14 rounded-lg border px-2 py-2 text-center text-white sm:w-16 ${highlightClass}`}
    />
  );
};

export default PickInput;