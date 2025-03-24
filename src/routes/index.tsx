import { createFileRoute } from "@tanstack/react-router";
import logo from "../logo.svg";
import { Deposit } from "@/components/deposit/deposit";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  return (
    <div className="text-center flex justify-center items-center h-screen">
      <Deposit />
    </div>
  );
}
