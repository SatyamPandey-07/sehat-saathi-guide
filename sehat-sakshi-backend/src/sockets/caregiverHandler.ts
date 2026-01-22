import { Server, Socket } from 'socket.io';
import logger from '../config/logger';

export const setupCaregiverHandler = (io: Server) => {
    const caregiverNamespace = io.of('/caregivers');

    caregiverNamespace.on('connection', (socket: Socket) => {
        logger.info(`Caregiver socket connected: ${socket.id}`);

        // Join a specific room (e.g., patient's ID)
        socket.on('join_patient_room', (patientId: string) => {
            socket.join(`patient:${patientId}`);
            logger.info(`Socket ${socket.id} joined patient room: ${patientId}`);
        });

        // Handle SOS Alert
        socket.on('trigger_sos', (data: { patientId: string; location: any }) => {
            logger.warn(`SOS Alert triggered for patient ${data.patientId}`);
            // Broadcast to all caregivers in the patient's room
            caregiverNamespace.to(`patient:${data.patientId}`).emit('sos_alert', {
                patientId: data.patientId,
                location: data.location,
                timestamp: new Date().toISOString(),
                message: "EMERGENCY! Patient needs help immediately.",
            });
        });

        // Handle Medication Updates (real-time adherence tracking)
        socket.on('medication_update', (data: { patientId: string; medicine: string; status: string }) => {
            logger.info(`Medication update for ${data.patientId}: ${data.medicine} - ${data.status}`);
            caregiverNamespace.to(`patient:${data.patientId}`).emit('patient_medication_update', data);
        });

        socket.on('disconnect', () => {
            logger.info(`Caregiver socket disconnected: ${socket.id}`);
        });
    });
};
