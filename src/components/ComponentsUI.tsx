import React, { useState, useEffect } from "react";
import { useCalculation, useNote, useFlag, useTheme } from "../lib/useLocalStorageValue";

export default function ComponentsUI() {

  // Prevent hydration mismatch: only render after mount
  const [mounted, setMounted] = useState(false);
  const [calculation] = useCalculation();
  const [note] = useNote();
  const [flag] = useFlag();
  const [theme] = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const [showFullNote, setShowFullNote] = useState(false);
  const MAX_NOTE_LENGTH = 20;

  const truncatedNote = note && note.length > MAX_NOTE_LENGTH
    ? note.slice(0, MAX_NOTE_LENGTH) + "..."
    : note;

  const toggleNote = () => setShowFullNote(prev => !prev);

  if (!mounted) {
    // Prevent hydration mismatch: render nothing until client-side
    return null;
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-4 max-[625px]:px-2 mt-2">
      <div className="flex flex-wrap justify-center items-start gap-3 max-[625px]:gap-1.5 text-sm">
        {/* Calculation */}
        <div className="flex items-center px-3 max-[625px]:text-xs py-1 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
          <span className="font-semibold">Calculation:</span>
          <span className="ml-1 break-words">{calculation}</span>
        </div>

        {/* Flag */}
        <div className="flex items-center px-3 max-[625px]:text-xs py-1 rounded-lg bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200">
          <span className="font-semibold">Flag:</span>
          <span className="ml-1">{flag ? "TRUE" : "FALSE"}</span>
        </div>

        {/* Note */}
        <div className="flex flex-row items-center justify-center px-3 max-[625px]:text-xs py-1 rounded-lg bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 max-w-full">
          <span className="font-semibold mr-1">Note:</span>
          <span className="ml-1 break-words">
            {showFullNote ? note : truncatedNote}
          </span>
          {note.length > MAX_NOTE_LENGTH && (
            <button
              onClick={toggleNote}
              className="ml-2 text-xs underline text-green-700 dark:text-green-300"
            >
              {showFullNote ? "Show less" : "Show more"}
            </button>
          )}
        </div>

        {/* Theme */}
        <div className="flex items-center px-3 max-[625px]:text-xs py-1 rounded-lg bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
          <span className="font-semibold">Theme:</span>
          <span className="ml-1">{theme}</span>
        </div>
      </div>
    </div>
  );
}
