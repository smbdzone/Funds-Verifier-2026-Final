import React, { Suspense } from "react";
import { CreateViewingSlotTab } from "@/components/modules/SellerProfile/CreateViewingSlotTab";

function page() {
  return (
    <div>
      <Suspense fallback={<p className="text-center">Loading...</p>}>
        <CreateViewingSlotTab />
      </Suspense>
    </div>
  );
}

export default page;
