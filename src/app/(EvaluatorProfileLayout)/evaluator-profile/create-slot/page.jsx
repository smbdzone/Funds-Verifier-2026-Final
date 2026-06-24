import React, { Suspense } from "react";
import { CreateViewingSlotTab } from "@/components/modules/SellerProfile/CreateViewingSlotTab";

function page() {
  return (
    <div>
      <Suspense fallback={<p className="text-center">Loading...</p>}>
        <CreateViewingSlotTab
          panelTitle="Create Evaluation Slots"
          slotTypeLabel="evaluation"
          slotCategory="service"
        />
      </Suspense>
    </div>
  );
}

export default page;
