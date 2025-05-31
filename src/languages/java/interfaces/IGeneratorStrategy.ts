import { Model } from "../../../shared/ast.js";

export interface IGeneratorStrategy {
  generate(model: Model, outputPath: string): void;
}