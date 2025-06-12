# Padrão Criacional Factory - Geradores Java

## Visão Geral

O padrão Factory Method foi aplicado nos geradores da linguagem Java para criar uma estrutura flexível e extensível de geração de código. Este padrão permite a criação de objetos sem especificar suas classes concretas, delegando a responsabilidade de instanciação para as subclasses.

## Implementação

### 1. Factory Abstrata para Entidades

**Arquivo:** `AbstractEntityGeneratorFactory.ts`

```typescript
export abstract class EntityGeneratorFactory {
    public generate(model: Model, target_folder: string): void {
        fs.mkdirSync(target_folder, {recursive: true});
        
        const generators = this.createGenerators();

        for (const generator of generators) {
            generator.generate(model, target_folder);
        }
    }
    
    protected abstract createGenerators(): IJavaGenerator[];
}
```

**Implementação Concreta:** `StandardEntityGeneratorFactory.ts`

```typescript
export class StandardEntityGeneratorFactory extends EntityGeneratorFactory{
    protected createGenerators(): IJavaGenerator[] {
        return [
            new ConfigGenerator(),
            new ModuleGenerator(),
            new SQLGenerator(),
            new DebeziumGenerator()
        ];
    }
}
```

### 2. Factory Abstrata para WebServices

**Arquivo:** `AbstractWebServiceGeneratorFactory.ts`

```typescript
export abstract class WebServiceGeneratorFactory {
    public generate(model: Model, target_folder: string): void {
        fs.mkdirSync(target_folder, {recursive: true});
        
        const generators = this.createGenerators();

        for (const generator of generators) {
            generator.generate(model, target_folder);
        }
    }
    
    protected abstract createGenerators(): IJavaGenerator[];
}
```

**Implementação Concreta:** `StandardWebServiceGeneratorFactory.ts`

```typescript
export class StandardWebServiceGeneratorFactory extends WebServiceGeneratorFactory {
    protected createGenerators(): IJavaGenerator[] {
        return [
            new ConfigGenerator(),
            new ModuleGenerator(),
            new GraphQLGenerator()
        ];
    }
}
```

### 3. Factory Abstrata para Documentação

**Arquivo:** `AbstractDocumentationGeneratorFactory.ts`

```typescript
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
```

**Implementação Concreta:** `StandardDocumentationGeneratorFactory.ts`

```typescript
export class StandardDocumentationGeneratorFactory extends AbstractDocumentationGeneratorFactory {
    protected createGenerators(): IJavaGenerator[] {
        return [
            new DocumentationGenerator()
        ];
    }
}
```

## Benefícios da Aplicação do Padrão

### 1. **Flexibilidade de Criação**
- Permite adicionar novos tipos de geradores sem modificar o código cliente
- Facilita a criação de diferentes combinações de geradores

### 2. **Encapsulamento da Lógica de Criação**
- A lógica de instanciação fica isolada nas factory methods
- O código cliente não precisa conhecer as classes concretas dos geradores

### 3. **Extensibilidade**
- Novas implementações de factory podem ser criadas facilmente
- Permite diferentes estratégias de geração para diferentes contextos

### 4. **Manutenibilidade**
- Mudanças na criação de objetos ficam centralizadas
- Reduz o acoplamento entre classes

## Estrutura de Classes

```
AbstractEntityGeneratorFactory (Factory Abstrata)
    ├── createGenerators(): IJavaGenerator[] (Factory Method)
    └── generate(model, target_folder): void (Template Method)
        │
        └── StandardEntityGeneratorFactory (Factory Concreta)
            └── createGenerators(): IJavaGenerator[]
                ├── ConfigGenerator
                ├── ModuleGenerator
                ├── SQLGenerator
                └── DebeziumGenerator

AbstractWebServiceGeneratorFactory (Factory Abstrata)
    ├── createGenerators(): IJavaGenerator[] (Factory Method)
    └── generate(model, target_folder): void (Template Method)
        │
        └── StandardWebServiceGeneratorFactory (Factory Concreta)
            └── createGenerators(): IJavaGenerator[]
                ├── ConfigGenerator
                ├── ModuleGenerator
                └── GraphQLGenerator

AbstractDocumentationGeneratorFactory (Factory Abstrata)
    ├── createGenerators(): IJavaGenerator[] (Factory Method)
    └── generate(model, target_folder): void (Template Method)
        │
        └── StandardDocumentationGeneratorFactory (Factory Concreta)
            └── createGenerators(): IJavaGenerator[]
                └── DocumentationGenerator
```

## Interface Comum

Todos os geradores implementam a interface `IJavaGenerator`:

```typescript
export interface IJavaGenerator {
    generate(model: Model, target_folder: string): void;
}
```

## Exemplos de Uso

### Geração de Entidades
```typescript
const entityFactory = new StandardEntityGeneratorFactory();
entityFactory.generate(model, "output/entity");
```

### Geração de WebServices
```typescript
const webServiceFactory = new StandardWebServiceGeneratorFactory();
webServiceFactory.generate(model, "output/webservice");
```

### Geração de Documentação
```typescript
const docFactory = new StandardDocumentationGeneratorFactory();
docFactory.generate(model, "output/docs");
```

## Vantagens da Implementação

1. **Separação de Responsabilidades**: Cada factory é responsável por um tipo específico de geração
2. **Reutilização**: Geradores individuais podem ser reutilizados em diferentes factories
3. **Testabilidade**: Cada factory pode ser testada independentemente
4. **Configurabilidade**: Permite diferentes configurações de geradores para diferentes cenários
5. **Escalabilidade**: Facilita a adição de novos tipos de geradores ou factories

Este padrão Factory Method proporciona uma arquitetura robusta e flexível para o sistema de geração de código Java, permitindo fácil extensão e manutenção do sistema.
