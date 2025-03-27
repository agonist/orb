import { Card } from "../card";

export const DepositHelp = () => {
  return (
    <Card>
      <h1 className="text-xl font-semibold mb-4">How Depositing Works</h1>

      <p className="mb-2">
        To begin using the platform, you need to{" "}
        <strong>deposit your coins</strong>. In return, you’ll receive a{" "}
        <strong>1:1 equivalent in platform tokens</strong>.
      </p>
      <br />
      <p className="mb-2">
        These tokens can then be <strong>stacked (staked)</strong> to
        participate in our
        <strong> vault yield strategies</strong>, allowing you to earn passive
        rewards.
      </p>
      <br />
      <p className="text-sm text-muted-foreground italic">
        Note: This operation does <strong>not</strong> involve any protocol
        fees.
      </p>
    </Card>
  );
};
