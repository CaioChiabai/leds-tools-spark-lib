import path from "path";
import fs from 'fs'
import { Model } from "src/backend/models/index.js";

/**
 * Capitaliza uma string
 * 
 * @param str - String a ser capitalizada
 * @returns A string capitalizada
 */
export function capitalizeString(str: string) : string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Aplica `path.join` nos argumentos passados, e cria o caminho gerado caso não exista
 * 
 * @param args - Caminho para ser construído
 * @returns O caminho construído e normalizado, o mesmo retorno que `path.join(args)`
 */

export const ident_size = 4;
export const base_ident = ' '.repeat(ident_size);

export function createPath(...args: string[]) : string {
  const PATH = path.join(...args)
  if(!fs.existsSync(PATH)) {
    fs.mkdirSync(PATH, { recursive: true })
  }
  return PATH
}

export function getEntityName(model: { name?: string; configuration?: { name?: string } }): string {
    const name = model.configuration?.name || model.name || "";
    return name.startsWith("Modulo_") ? name.replace("Modulo_", "") : name;
}