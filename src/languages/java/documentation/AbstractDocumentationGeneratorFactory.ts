import { Model } from "../../../shared/ast.js";
import { IJavaGenerator } from "../interfaces/IJavaGenerator.js";
import fs from "fs";

export abstract class AbstractDocumentationGeneratorFactory {
    public generate(model: Model, target_folder: string): void {
        fs.mkdirSync(target_folder, {recursive: true});
        
        const generators = this.createGenerators();

        for (const generator of generators) {
            generator.generate(model, target_folder);
        }
    }
    
    protected abstract createGenerators(): IJavaGenerator[];
}