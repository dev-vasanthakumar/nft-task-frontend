import React from "react";
import { Loader2 } from "lucide-react";

function Loading({ text = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-gray-600">
      <Loader2 className="w-10 h-10 animate-spin text-sky-600 mb-3" />
      <p className="text-lg font-medium">{text}</p>
    </div>
  );
}

export default Loading;
