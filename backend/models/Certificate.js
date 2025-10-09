import mongoose from 'mongoose';

const certificateSchema = mongoose.Schema(
  {
    rollNumber: { type: String, required: true, unique: true },
    
    certificateId: { type: String, required: true, unique: true },
    
    studentName: { type: String, required: true },
    
    issuerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    
    status: { type: String, required: true, default: 'issued' }, 
  },
  { timestamps: true }
);

const Certificate = mongoose.model('Certificate', certificateSchema);

export default Certificate;