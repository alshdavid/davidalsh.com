import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename); 
export const __root = path.join(__dirname, ".."); 
export const __src = path.join(__root, "src"); 
export const __dist = path.join(__root, "dist");
export const __temp = path.join(__root, "temp");
