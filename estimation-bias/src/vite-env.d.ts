/// <reference types="vite/client" />
import { defineConfig } from "vite";

const trainingURL: string = import.meta.env.VITE_API_URL_TRAINING;
const crudURL: string = import.meta.env.VITE_API_URL_CRUD;

export default defineConfig({
  define: {
    VITE_API_URL_CRUD: JSON.stringify(crudURL),
    VITE_API_URL_TRAINING: JSON.stringify(trainingURL),
  },
});
