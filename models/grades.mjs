import mongoose from 'mongoose';

const gradeSchema = new mongoose.Schema({
    
    scores: [{ type: Array }],
    class_id: { type: Number, required: true },
    learner_id: { type: Number, required: true },
    
});

const Grade = mongoose.model('Grade', gradeSchema);

export default Grade;