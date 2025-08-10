export const TestButton = () => {
  const handleClick = () => {
    console.log("TEST BUTTON CLICKED!");
    alert("Button works!");
  };

  return (
    <button 
      onClick={handleClick}
      className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      style={{ zIndex: 9999 }}
    >
      Test Click Me
    </button>
  );
};