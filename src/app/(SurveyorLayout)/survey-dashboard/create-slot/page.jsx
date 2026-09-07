import React from "react";
import { CreateViewingSlotTab } from "@/components/modules/SellerProfile/CreateViewingSlotTab";

function page() {
  return (
    <div>
      <CreateViewingSlotTab
        panelTitle="Create Service Slots"
        slotTypeLabel="service"
        slotCategory="service"
      />
    </div>
  );
}

export default page;
