"use client";

import React from "react";
import Image from "next/image";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogHeader
} from "@/components/ui/alert-dialog"; // ✅ Use this consistently

function LoadingDialog({ loading }) {
  return (
    <AlertDialog open={loading}>
      <AlertDialogContent className="sm:max-w-md text-center">
        <AlertDialogHeader>
          <AlertDialogTitle className="sr-only">Loading</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="flex flex-col items-center py-4">
              <Image src="/loader.gif" width={100} height={100} alt="Loading..." />
              <h2 className="text-lg font-semibold mt-4" aria-live="polite">
                Please wait... AI is working on your course
              </h2>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default LoadingDialog;
