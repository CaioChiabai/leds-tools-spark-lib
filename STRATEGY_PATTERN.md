# Padrão Comportamental Strategy - Geradores Java

## Visão Geral

O padrão Strategy foi implementado nos geradores da linguagem Java para permitir a seleção dinâmica de algoritmos de geração de código. Este padrão define uma família de algoritmos, encapsula cada um deles e os torna intercambiáveis, permitindo que o algoritmo varie independentemente dos clientes que o utilizam.

## Implementação

### 1. Interface Strategy

**Arquivo:** `IGeneratorStrategy.ts`

```typescript
export interface IGeneratorStrategy {
    generate(model: Model, outputPath: string): void;
}
```

Esta interface define o contrato comum que todas as estratégias de geração devem implementar.

### 2. Context - Factory de Estratégias

**Arquivo:** `GeneratorStrategyFactory.ts`

```typescript
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
```

### 3. Estratégia Concreta - SpringBoot

**Arquivo:** `SpringBootGenerator.ts`

```typescript
export class SpringBootGenerator implements IGeneratorStrategy {
    generate(model: Model.Model, target_folder: string): void {
        const target_folder_entity = target_folder + "/entity"
        const target_folder_webservice = target_folder + "/webservice"

        // Creating folders
        fs.mkdirSync(target_folder_entity, {recursive: true})
        fs.mkdirSync(target_folder_webservice, {recursive: true})
        
        // Creating entity
        java.generateEntity(model, target_folder_entity)
        java.generateWebservice(model, target_folder_webservice)
        
        // Documentation
        java.generateDocumentation(model, target_folder)
    }
}
```

## Estratégias de Geração Específicas

### 1. Geração de Entidades

A estratégia SpringBoot utiliza os seguintes geradores para entidades:

```typescript
// Através da StandardEntityGeneratorFactory
- ConfigGenerator: Gera configurações Maven (pom.xml, settings.xml)
- ModuleGenerator: Gera modelos JPA e repositórios
- SQLGenerator: Gera scripts SQL
- DebeziumGenerator: Gera configurações Debezium
```

**Exemplo de Saída:**
- `pom.xml` - Configuração Maven
- `settings.xml` - Configurações do Maven
- `application.properties` - Propriedades da aplicação
- Modelos JPA com anotações `@Entity`, `@Table`
- Repositórios estendendo `PagingAndSortingRepository`

### 2. Geração de WebServices

A estratégia SpringBoot utiliza os seguintes geradores para webservices:

```typescript
// Através da StandardWebServiceGeneratorFactory
- ConfigGenerator: Gera configurações Docker e Maven
- ModuleGenerator: Gera controllers e aplicação Spring Boot
- GraphQLGenerator: Gera schemas GraphQL
```

**Exemplo de Saída:**
- Controllers com anotações `@Controller`, `@QueryMapping`, `@MutationMapping`
- Aplicação Spring Boot com `@SpringBootApplication`
- Schemas GraphQL (.graphqls)
- Configurações Docker (Dockerfile, docker-compose.yml)

### 3. Geração de Documentação

```typescript
// Através da StandardDocumentationGeneratorFactory
- DocumentationGenerator: Gera README e CI/CD
```

**Exemplo de Saída:**
- `README.md` - Documentação do projeto
- `.gitlab-ci.yml` - Pipeline CI/CD

## Arquitetura do Padrão Strategy

```
IGeneratorStrategy (Strategy Interface)
    └── generate(model: Model, outputPath: string): void
        │
        ├── SpringBootGenerator (Concrete Strategy)
        │   └── generate(): void
        │       ├── java.generateEntity()
        │       ├── java.generateWebservice()
        │       └── java.generateDocumentation()
        │
        └── [Future Strategies]
            ├── DjangoGenerator
            ├── NextJSGenerator
            └── CleanArchitectureGenerator

GeneratorStrategyFactory (Context)
    └── get(language: string): IGeneratorStrategy
```

## Fluxo de Execução

1. **Seleção da Estratégia:**
   ```typescript
   const strategy = GeneratorStrategyFactory.get("springboot");
   ```

2. **Execução da Estratégia:**
   ```typescript
   strategy.generate(model, outputPath);
   ```

3. **Delegação para Sub-geradores:**
   ```typescript
   // SpringBootGenerator delega para:
   java.generateEntity(model, target_folder_entity);
   java.generateWebservice(model, target_folder_webservice);
   java.generateDocumentation(model, target_folder);
   ```

## Componentes Gerados

### Para Entidades Java/Spring Boot:

#### Configurações:
- **pom.xml**: Dependências Maven incluindo Spring Boot, JPA, PostgreSQL, Lombok
- **application.properties**: Configurações de datasource, JPA, logging
- **settings.xml**: Configurações Maven para repositórios GitLab

#### Modelos:
```java
@Data
@Entity
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "entity_name")
public class EntityName implements Serializable {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;
    
    // Atributos da entidade
    // Relacionamentos JPA
}
```

#### Repositórios:
```java
public interface EntityRepository extends 
    PagingAndSortingRepository<Entity, Long>, 
    ListCrudRepository<Entity, Long> {
    
    Optional<IDProjection> findByExternalId(String externalId);
    Boolean existsByInternalId(String internalId);
}
```

### Para WebServices:

#### Controllers GraphQL:
```java
@Controller
public class EntityController {
    @Autowired
    EntityRepository repository;

    @QueryMapping
    public List<Entity> findAllEntities() {
        return repository.findAll();
    }

    @MutationMapping
    public Entity createEntity(@Argument EntityInput input) {
        // Lógica de criação
    }
}
```

#### Aplicação Spring Boot:
```java
@SpringBootApplication
@EnableAutoConfiguration
@ComponentScan(basePackages = {"package.*"})
@EntityScan(basePackages = {"entity.package.*"})
@EnableJpaRepositories(basePackages = {"repository.package.*"})
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

## Benefícios da Implementação

### 1. **Flexibilidade de Algoritmos**
- Permite trocar estratégias de geração em tempo de execução
- Facilita a adição de novas linguagens/frameworks

### 2. **Extensibilidade**
- Novas estratégias podem ser adicionadas sem modificar código existente
- Cada estratégia encapsula sua própria lógica de geração

### 3. **Manutenibilidade**
- Lógicas de geração ficam separadas e organizadas
- Facilita testes unitários de cada estratégia

### 4. **Reutilização**
- Componentes podem ser reutilizados entre diferentes estratégias
- Factories de geradores podem ser compartilhadas

## Vantagens Específicas

1. **Separação de Responsabilidades**: Cada estratégia é responsável por um tipo específico de geração
2. **Polimorfismo**: Cliente usa a interface comum sem conhecer implementações
3. **Configurabilidade**: Permite diferentes configurações por estratégia
4. **Testabilidade**: Cada estratégia pode ser testada independentemente
5. **Escalabilidade**: Facilita suporte a novos frameworks e linguagens

## Exemplo de Uso Completo

```typescript
// 1. Seleção da estratégia
const strategy = GeneratorStrategyFactory.get("springboot");

// 2. Execução da geração
strategy.generate(model, "output/");

// Resultado:
// output/
// ├── entity/
// │   ├── pom.xml
// │   ├── settings.xml
// │   ├── src/main/resources/application.properties
// │   └── src/main/java/
// │       ├── models/Entity.java
// │       └── repositories/EntityRepository.java
// ├── webservice/
// │   ├── pom.xml
// │   ├── Dockerfile
// │   ├── docker-compose.yml
// │   └── src/main/java/
// │       ├── Application.java
// │       ├── controllers/EntityController.java
// │       └── records/EntityInput.java
// └── README.md
```

Este padrão Strategy proporciona uma arquitetura flexível e extensível para o sistema de geração de código, permitindo fácil adição de novas linguagens e frameworks mantendo o código organizado e testável.
