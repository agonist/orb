import { useMemo, useState } from "react";
import { NumberInput } from "../ui/input";

export const Deposit = () => {
  const [depositValue, setDepositValue] = useState<string>("");

  const handleChange = (val: string) => {
    if (/^\d*\.?\d*$/.test(val)) {
      setDepositValue(val);
    }
  };

  // TODO use the usd value at some point
  const bottomLabel = useMemo(() => {
    if (depositValue === "") return "$0.00";

    const cleanValue = depositValue.toString().endsWith(".")
      ? depositValue.toString().slice(0, -1)
      : depositValue;

    return `$${(Number(cleanValue) * 12).toFixed(2)}`;
  }, [depositValue]);

  return (
    <div className="bg-[rgb(22,22,22)] w-96 h-96 rounded-md border p-4 flex flex-col gap-8 items-start">
      <h1 className="text-xl font-semibold">Deposit</h1>

      <div className="">
        <NumberInput
          type="text"
          placeholder="0"
          label="Deposit"
          bottomLabel={bottomLabel}
          value={depositValue}
          onChange={(e) => handleChange(e.target.value)}
        />
      </div>
    </div>
  );
};
