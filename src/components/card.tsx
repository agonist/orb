export const Card = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-card w-lg  rounded-md border p-4 flex flex-col  items-start">
      {children}
    </div>
  );
};
