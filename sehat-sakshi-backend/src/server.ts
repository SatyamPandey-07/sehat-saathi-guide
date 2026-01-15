import { createServer } from 'http';
import app from "./app";
import { env } from "./config/env";
import { connectDB } from "./config/database";
import { initSocket } from "./config/socket";
import { startReminderWorker } from "./services/reminderWorker";

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

const startServer = async () => {
  try {
    await connectDB();
    console.log("Database connected successfully");

    // Create HTTP server from Express app
    const httpServer = createServer(app);

    // Initialize Socket.io
    initSocket(httpServer);
    console.log("Socket.io initialized");

    // Start background worker
    startReminderWorker();

    httpServer.listen(env.PORT, () => {
      console.log(`Backend running on http://localhost:${env.PORT}`);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err: any) => {
      console.error('UNHANDLED REJECTION! Shutting down...');
      console.error(err.name, err.message);
      httpServer.close(() => {
        process.exit(1);
      });
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM received. Shutting down gracefully');
      httpServer.close(() => {
        console.log('Process terminated');
      });
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
