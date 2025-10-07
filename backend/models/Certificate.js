// backend/models/Certificate.js

import mongoose from 'mongoose';

const certificateSchema = mongoose.Schema(
  {
    // Private Identifier for easy lookup by college staff/systems
    rollNumber: { type: String, required: true, unique: true },
    
    // Public/Blockchain Identifier (The immutable key)
    certificateId: { type: String, required: true, unique: true },
    
    // Student identification (Private data, kept off-chain)
    studentName: { type: String, required: true },
    
    // Link to the user who issued the record
    issuerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // Links this record to the User model
    },
    
    // Status flag (e.g., 'issued', 'revoked', 'pending')
    status: { type: String, required: true, default: 'issued' }, 
  },
  { timestamps: true }
);

const Certificate = mongoose.model('Certificate', certificateSchema);

export default Certificate;