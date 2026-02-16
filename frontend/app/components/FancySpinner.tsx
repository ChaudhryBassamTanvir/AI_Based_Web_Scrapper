import { useEffect, useState } from "react";
import { AiFillSetting, AiOutlineThunderbolt, AiOutlineRobot } from "react-icons/ai";

interface FancySpinnerProps {
  loading: boolean;
}

export function FancySpinner({ loading }: FancySpinnerProps) {
  const icons = [<AiFillSetting />, <AiOutlineThunderbolt />, <AiOutlineRobot />];
  const [currentIcon, setCurrentIcon] = useState(0);

  // Sequential icon animation
  useEffect(() => {
    if (!loading) return;

    const interval = setInterval(() => {
      setCurrentIcon((prev) => (prev + 1) % icons.length);
    }, 500); // change every 0.5s

    return () => clearInterval(interval);
  }, [loading]);

  if (!loading) return null;

  return (
    <div className=" flex items-center justify-center bg-black/70 backdrop-blur-sm rounded-lg z-20 w-40">

        {/* Sequential icons */}
        <div className="text-white text-2xl  p-3">
          {icons[currentIcon]}

        
      </div>
    </div>
  );
}
