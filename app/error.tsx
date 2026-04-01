"use client";

import { useEffect } from "react";
import { Button } from "@heroui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center gap-6 text-center mt-20">
      <div className="p-10 bg-card rounded-2xl border-2 border-dashed border-danger/30 max-w-md">
        <p className="text-3xl font-black text-danger uppercase opacity-50 mb-4 tracking-tighter">
          Coś poszło nie tak 😿
        </p>
        <Button color="danger" variant="ghost" onClick={reset}>
          Spróbuj ponownie
        </Button>
      </div>
    </div>
  );
}
