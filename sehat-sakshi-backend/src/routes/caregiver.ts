import { Router, Response } from 'express';
import { protect, AuthRequest } from '../middleware/auth';
import { Caregiver } from '../models/Caregiver';
import { User } from '../models/User';
import { SOSAlert } from '../models/SOSAlert';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// Invite a caregiver
router.post('/invite', protect, asyncHandler(async (req: AuthRequest, res: Response) => {
    const { email, relationship, name } = req.body;

    if (!req.user) {
        res.status(401);
        throw new Error("User not authenticated");
    }

    const patientId = (req.user as any)._id;

    if (email === req.user.email) {
        res.status(400);
        throw new Error("You cannot invite yourself as a caregiver.");
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });

    const invitation = await Caregiver.create({
        patientId,
        caregiverId: existingUser?._id, // Link if user exists
        caregiverEmail: email,
        name: existingUser?.name || name || "Pending Caregiver",
        relationship,
        status: 'pending' // Default status
    });

    // TODO: Send email invitation via EmailService (mocked for now)

    res.status(201).json({ success: true, data: invitation, message: "Invitation sent successfully." });
}));

// Get list of my caregivers
router.get('/', protect, asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) throw new Error("User not found");
    const caregivers = await Caregiver.find({ patientId: (req.user as any)._id });
    res.json({ success: true, data: caregivers });
}));

// Get list of patients I care for
router.get('/patients', protect, asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) throw new Error("User not found");
    // Find where I am the caregiver (by ID or Email)
    const records = await Caregiver.find({
        $or: [
            { caregiverId: (req.user as any)._id },
            { caregiverEmail: req.user.email }
        ]
    }).populate('patientId', 'name email phone profilePic');

    res.json({ success: true, data: records });
}));

// Trigger SOS
router.post('/sos', protect, asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) throw new Error("User not found");
    const { location } = req.body;

    // Log the alert
    const alert = await SOSAlert.create({
        patientId: (req.user as any)._id,
        location,
        status: 'active',
        notifiedContacts: [] // To be populated
    });

    // Mock Twilio SMS
    const caregivers = await Caregiver.find({ patientId: (req.user as any)._id, status: { $ne: 'rejected' } });
    const contacts = caregivers.map(c => c.caregiverEmail); // In real app, use phone numbers

    // Mock sending SMS
    console.log(`[Twilio MOCK] Sending SOS to: ${contacts.join(', ')}`);
    console.log(`[Twilio MOCK] Message: SOS! ${req.user.name} needs help at ${location?.address}`);

    alert.notifiedContacts = contacts;
    await alert.save();

    res.json({ success: true, data: alert, message: "SOS Alert broadcasted!" });
}));

export default router;
