import mongoose from "mongoose";

const assetSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: {
      type: String,
      required: true, // now validated at controller level
    },
    serialNumbers: {
      type: [String],
      required: true,
      validate: {
        validator: function (arr) {
          return arr.length === new Set(arr).size;
        },
        message: "Serial numbers must be unique within the asset",
      }
    },
    quantity: { type: Number, required: true, min: 1 },
    status: {
      type: String,
      enum: ['available', 'assigned', 'in-repair', 'retired', 'maintenance'],
      default: 'available',
    },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    assignedDate: { type: Date },
    returnedDate: { type: Date },
    specifications: { type: String },

    purchaseDate: { type: Date, required: true },
    purchaseValue: { type: Number, required: true },

    hasWarranty: { type: Boolean, default: false },
    warrantyStartDate: { type: Date, default: null },
    warrantyEndDate: { type: Date, default: null },

    usageHistory: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        assignedDate: Date,
        returnedDate: Date,
        daysUsed: Number
      }
    ],

    maintenanceLogs: [
      {
        maintenanceDate: Date,
        daysTaken: Number,
        cost: Number,
        description: String
      }
    ]
  },
  { timestamps: true }
);

const Asset = mongoose.model("Asset", assetSchema);
export default Asset;
