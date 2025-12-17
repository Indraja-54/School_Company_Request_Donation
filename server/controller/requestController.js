import ItemRequest from "../models/ItemRequest.js";
import FilledDonation from "../models/FilledDonation.js";
import ItemDonation from "../models/ItemDonation.js";

/**
 * GET Pending Requests (School)
 */
export const getPendingRequests = async (req, res) => {
  const requests = await ItemRequest.find({
    ITR_Party: req.params.partyId,
    ITR_RequestStatus: { $ne: "Completed" },
  }).populate("ITR_Party", "name"); // ✅ FIXED

  const result = requests.map(r => ({
    id: r._id,
    itemType: r.ITR_ItemType,
    quantityRequested: r.ITR_QuantityRequested,
    pendingQuantity: r.ITR_PendingQuantity,
    status: r.ITR_RequestStatus || "Pending",
  }));

  res.json(result);
};

/**
 * GET Processed Requests (School)
 */
export const getProcessedRequests = async (req, res) => {
  const donations = await FilledDonation.find({
    FDS_ToParty: req.params.partyId,
  }).populate("FDS_FromParty", "name");

  const result = donations.map(d => ({
    itemType: d.FDS_ItemType,
    companyName: d.FDS_FromParty?.name,
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
 * CREATE New Request (School)
 */
export const createRequest = async (req, res) => {
  const { itemType, quantityRequested, allocations = [], shippingDate } = req.body;
  const schoolPartyId = req.user.partyId;

  let remainingQty = quantityRequested;

  for (const alloc of allocations) {
    if (remainingQty <= 0) break;

    const donation = await ItemDonation.findById(alloc.donationId);
    if (!donation || donation.ITD_PendingQuantity <= 0) continue;

    const usedQty = Math.min(
      alloc.quantity,
      donation.ITD_PendingQuantity,
      remainingQty
    );

    // reduce donation inventory
    donation.ITD_PendingQuantity -= usedQty;
    await donation.save();

    // 🔥 CREATE PROCESSED / CONTRIBUTION RECORD
    await FilledDonation.create({
      FDS_FromParty: donation.ITD_Party,
      FDS_ToParty: schoolPartyId,
      FDS_ItemType: itemType,
      FDS_Quantity: usedQty,
      FDS_ShippingDate: shippingDate ? new Date(shippingDate) : new Date(),
    });

    remainingQty -= usedQty;
  }

  // remaining → pending request
  if (remainingQty > 0) {
    await ItemRequest.create({
      ITR_Party: schoolPartyId,
      ITR_ItemType: itemType,
      ITR_QuantityRequested: quantityRequested,
      ITR_PendingQuantity: remainingQty,
      ITR_RequestStatus: "Pending",
    });
  }

  res.status(201).json({
    message:
      remainingQty === 0
        ? "Request fully fulfilled"
        : "Partially fulfilled, pending created",
  });
};


/**
 * GET Available Donations (School)
 */
export const getAvailableDonations = async (req, res) => {
  const { itemType } = req.params;

  const donations = await ItemDonation.find({
    ITD_ItemType: itemType,
    ITD_PendingQuantity: { $gt: 0 },
  }).populate("ITD_Party", "name");
   console.log("DONATIONS FROM DB:", donations);

  const result = donations.map(d => ({
    donationId: d._id,
    companyId: d.ITD_Party?._id,
    companyName: d.ITD_Party?.name, // ✅ NOW COMES
    availableQuantity: d.ITD_PendingQuantity,
  }));

  res.json(result);
};
