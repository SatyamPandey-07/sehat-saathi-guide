import { Router, Response } from 'express';
import { protect, AuthRequest } from '../middleware/auth';
import { SymptomLog } from '../models/SymptomLog';
import { Reminder } from '../models/Reminder';
import { ReminderLog } from '../models/ReminderLog';
import { Order } from '../models/Order';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// Bulk Sync Endpoint
router.post('/bulk', protect, asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) {
        res.status(401);
        throw new Error("User not authenticated");
    }

    const { items } = req.body;

    if (!items || !Array.isArray(items)) {
        res.status(400);
        throw new Error("Invalid sync data format. 'items' array is required.");
    }

    const results = {
        success: 0,
        failed: 0,
        errors: [] as any[]
    };

    for (const item of items) {
        try {
            switch (item.type) {
                case 'symptom':
                    await SymptomLog.create({
                        ...item.data,
                        userId: (req.user as any)._id,
                        // Ensure we keep the original creation time if provided, or default to now
                        createdAt: item.data.createdAt || new Date()
                    });
                    break;

                case 'reminder_log':
                    await ReminderLog.create({
                        ...item.data,
                        userId: (req.user as any)._id,
                        takenAt: item.data.takenAt || new Date()
                    });
                    break;

                case 'order':
                    // Basic order creation from offline data
                    const orderData = item.data;
                    await Order.create({
                        ...orderData,
                        userId: (req.user as any)._id,
                        status: 'pending',
                        paymentStatus: 'pending', // Offline orders might need payment verification later
                        createdAt: orderData.createdAt || new Date()
                    });
                    break;

                default:
                    console.warn(`Unknown sync item type: ${item.type}`);
            }
            results.success++;
        } catch (error: any) {
            console.error(`Sync failed for item ${item.id}:`, error);
            results.failed++;
            results.errors.push({ id: item.id, error: error.message });
        }
    }

    res.json({
        success: true,
        message: `Synced ${results.success} items. Failed: ${results.failed}`,
        results
    });
}));

export default router;
