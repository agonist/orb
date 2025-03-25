type Props = {
  value: string;
  onValueClicked: () => void;
};

export const BalanceLabel = ({ value, onValueClicked }: Props) => {
  return (
    <span className="text-sm text-muted-foreground w-full text-end px-1">
      Balance:{" "}
      <span
        className="font-semibold text-foreground hover:cursor-pointer"
        onClick={onValueClicked}
      >
        {value}
      </span>
    </span>
  );
};
