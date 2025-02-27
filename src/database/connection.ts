import { AppDataSource } from "./data-source";

export const connectDB = async (): Promise<void> => {
  try {
    await AppDataSource.initialize();
    console.log("Database connected");
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
};

export const disconnectDB = async (): Promise<void> => {
  try {
    await AppDataSource.destroy();
    console.log("Database connection closed");
  } catch (error) {
    console.error("Error closing database connection:", error);
  }
};
