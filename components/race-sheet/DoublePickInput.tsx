import { DoublePickInputProps } from "@/types";

const DoublePickInput = ({
  value1,
  value2,
  onChangeValue1,
  onChangeValue2,
  highlightClass1,
  highlightClass2,
}: DoublePickInputProps) => {
  return (
    <div className="flex w-28 overflow-hidden rounded-lg border border-white/10 bg-black/30 sm:w-32">
      <input
        value={value1}
        onChange={(e) => onChangeValue1(e.target.value)}
        className={`w-1/2 border-0 border-r border-white/10 px-2 py-2 text-center text-white outline-none ${highlightClass1}`}
      />

      <input
        value={value2}
        onChange={(e) => onChangeValue2(e.target.value)}
        className={`w-1/2 border-0 px-2 py-2 text-center text-white outline-none ${highlightClass2}`}
      />
    </div>
  );
};

export default DoublePickInput;