import { IGeneratorStrategy } from "./languages/java/interfaces/IGeneratorStrategy.js";
import { SpringBootGenerator } from "./generators/SpringBootGenerator.js";

export class GeneratorStrategyFactory {
  static get(language: string): IGeneratorStrategy {
    switch (language.toLowerCase()) {
      case "springboot":
        return new SpringBootGenerator();
      // case "csharp":
      //   return new CSharpGenerator();
      default:
        throw new Error(`Unsupported generator language: ${language}`);
    }
  }
}