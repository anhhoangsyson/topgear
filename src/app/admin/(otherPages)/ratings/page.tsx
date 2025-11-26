import React, { Suspense } from "react";
import RatingsClient from "./RatingsClient";

export default function RatingsPage() {
  return (
    <Suspense fallback={<div className="container mx-auto py-6">Đang tải...</div>}>
      <RatingsClient />
    </Suspense>
  );
}
