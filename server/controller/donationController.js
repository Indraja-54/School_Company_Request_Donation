import FilledDonation from "../models/FilledDonation.js";
import ItemRequest from "../models/ItemRequest.js";
import ItemDonation from "../models/ItemDonation.js";

/**
 * CREATE NEW DONATION (Company)
 */

export const createDonation = async (req, res) => {
  const { itemType, totalQuantity, allocations = [], shippingDate } = req.body;
  const companyPartyId = req.user.partyId;
  console.log("🔥 CREATE DONATION HIT", req.body);


  if (!itemType || !totalQuantity) {
    return res.status(400).json({ message: "Invalid donation data" });
  }

  let remainingDonationQty = totalQuantity;

  // 1️⃣ Create donation inventory
  const donation = await ItemDonation.create({
    ITD_Party: companyPartyId,
    ITD_ItemType: itemType,
    ITD_Quantity: totalQuantity,
    ITD_PendingQuantity: totalQuantity,
    ITD_Date: shippingDate ? new Date(shippingDate) : new Date(),
  });

  // 2️⃣ Fulfill school pending requests
  for (const alloc of allocations) {
    if (remainingDonationQty <= 0) break;

    const request = await ItemRequest.findById(alloc.requestId);

    if (!request || request.ITR_PendingQuantity <= 0) continue;
    console.log("Allocating to school:", alloc.schoolId, "Qty:", alloc.quantity);


    const usedQty = Math.min(
  Number(alloc.quantity),
  Number(request.ITR_PendingQuantity),
  Number(remainingDonationQty)
);

// 🔥 reduce pending quantity
request.ITR_PendingQuantity =
  request.ITR_PendingQuantity - usedQty;

// 🔥 update status only when fully done
if (request.ITR_PendingQuantity <= 0) {
  request.ITR_PendingQuantity = 0;
  request.ITR_RequestStatus = "Completed";
} else {
  request.ITR_RequestStatus = "Pending";
}

await request.save();


    // reduce company donation pending
    donation.ITD_PendingQuantity -= usedQty;
    await donation.save();

    console.log("Creating FilledDonation for school:", request.ITR_Party);


    // 🔥 CREATE PROCESSED / CONTRIBUTION RECORD
   await FilledDonation.create({
  FDS_FromParty: companyPartyId,
  FDS_ToParty: request.ITR_Party,
  FDS_ItemType: itemType,
  FDS_Quantity: usedQty,

  // ✅ donated date (auto, but explicit is fine)
  FDS_Date: new Date(),

  // ✅ shipping date coming from frontend
  FDS_ShippingNo: shippingDate ? new Date(shippingDate) : null,
});



    remainingDonationQty -= usedQty;
  }

  res.status(201).json({
    message: "Donation distributed successfully",
  });
};




/**
 * GET COMPANY DONATIONS
 */
export const getCompanyDonations = async (req, res) => {
  const donations = await FilledDonation.find({
    FDS_FromParty: req.params.partyId,
  }).populate("FDS_ToParty", "name");

  const result = donations.map(d => ({
  id: d._id,                // ✅ ADD THIS
  itemType: d.FDS_ItemType,
  quantity: d.FDS_Quantity,
  donatedDate: d.FDS_Date
    ? new Date(d.FDS_Date).toLocaleDateString()
    : "-",
  shippingDate: d.FDS_ShippingNo
    ? new Date(d.FDS_ShippingNo).toLocaleDateString()
    : "-",
}));


  res.json(result);
};





/**
 * GET PENDING SCHOOL REQUESTS BY ITEM
 */
export const getPendingSchools = async (req, res) => {
  const { itemType } = req.params;
  const requests = await ItemRequest.find({
    ITR_ItemType: itemType,
    ITR_PendingQuantity: { $gt: 0 },
  }).populate("ITR_Party", "name");

  const result = requests.map(r => ({
  requestId: r._id,              // ✅ ADD THIS
  schoolId: r.ITR_Party._id,
  schoolName: r.ITR_Party.name,
  pendingQuantity: r.ITR_PendingQuantity,
}));


  res.json(result);
};
