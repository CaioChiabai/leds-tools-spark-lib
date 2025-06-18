export type Reference<T> = { ref: T } | T;
export type Container<T> = { $container: T };

export type DATATYPE = 'boolean' | 'cnpj' | 'cpf' | 'currency' | 'date' | 'datetime' | 'decimal' | 'email' | 'file' | 'integer' | 'mobilePhoneNumber' | 'phoneNumber' | 'string' | 'uuid' | 'void' | 'zipcode';

export type FEATURE_TYPE = 'authentication';
export type LANGUAGETYPE = 'csharp-clean-architecture' | 'csharp-minimal-api' | 'java' | 'python';
export type QualifiedName = string;
export type QualifiedNameWithWildcard = string;

export interface Actor {
    $container: UseCasesModel;
    $type: 'Actor';
    comment?: string;
    fullName?: string;
    id: QualifiedName;
    superType?: Reference<Actor>;
}

export interface Attribute {
    $container: LocalEntity;
    $type: 'Attribute';
    blank: boolean;
    comment?: string;
    fullName?: string;
    max?: number;
    min?: number;
    name: string;
    type: DATATYPE;
    unique: boolean;
}

export interface AttributeEnum {
    $container: EnumX;
    $type: 'AttributeEnum';
    comment?: string;
    fullName?: string;
    name: string;
}

export interface Configuration {
    $container: Model;
    $type: 'Configuration';
    database_name?: string;
    description?: string;
    entity?: Reference<Entity>;
    feature?: FEATURE_TYPE;
    language?: LANGUAGETYPE;
    name?: string;
    package_path?: LANGUAGETYPE;
}

export interface Element {
    $container: Parameter;
    $type: 'Element';
    comment?: string;
    name: string;
    type: DATATYPE;
}

export interface EnumEntityAtribute {
    $container: LocalEntity;
    $type: 'EnumEntityAtribute';
    comment?: string;
    name: string;
    type: Reference<EnumX>;
}

export interface EnumX {
    $container: Model | Module;
    $type: 'EnumX';
    attributes: Array<AttributeEnum>;
    comment?: string;
    name: string;
}

export interface Event {
    $container: UseCase;
    $type: 'Event';
    action?: string;
    depends: Array<Reference<Event>>;
    description?: string;
    id: string;
    name_fragment?: string;
}

export interface FunctionEntity {
    $container: LocalEntity;
    $type: 'FunctionEntity';
    comment?: string;
    name: string;
    paramters: Array<Parameter>;
    response: DATATYPE;
}

export interface ImportedEntity {
    $container: ModuleImport;
    $type: 'ImportedEntity';
    name: string;
}

export interface LocalEntity {
    $container: Module;
    $type: 'LocalEntity';
    attributes: Array<Attribute>;
    comment?: string;
    enumentityatributes: Array<EnumEntityAtribute>;
    functions: Array<FunctionEntity>;
    is_abstract: boolean;
    name: string;
    relations: Array<Relation>;
    superType?: Reference<Entity>;
}

export interface ManyToMany {
    $container: LocalEntity;
    $type: 'ManyToMany';
    by?: Reference<LocalEntity>;
    comment?: string;
    fullName?: string;
    name: string;
    type: Reference<Entity>;
}

export interface ManyToOne {
    $container: LocalEntity;
    $type: 'ManyToOne';
    comment?: string;
    fullName?: string;
    name: string;
    type: Reference<Entity>;
}

export interface Model {
    $type: 'Model';
    abstractElements: Array<AbstractElement | ModuleImport | UseCasesModel>;
    configuration?: Configuration;
}

export interface Module {
    $container: Model | Module;
    $type: 'Module';
    comment?: string;
    elements: Array<AbstractElement | LocalEntity>;
    name: QualifiedName;
}

export interface ModuleImport {
    $container: Model;
    $type: 'ModuleImport';
    entities: Array<ImportedEntity>;
    library: string;
    name: string;
    package_path: string;
}

export interface OneToMany {
    $container: LocalEntity;
    $type: 'OneToMany';
    comment?: string;
    fullName?: string;
    name: string;
    type: Reference<Entity>;
}

export interface OneToOne {
    $container: LocalEntity;
    $type: 'OneToOne';
    comment?: string;
    fullName?: string;
    name: string;
    type: Reference<Entity>;
}

export interface Parameter {
    $container: FunctionEntity;
    $type: 'Parameter';
    comment?: string;
    element: Array<Element> | Element;
}

export interface UseCase {
    $container: UseCasesModel;
    $type: 'UseCase';
    actors: Array<Reference<Actor>>;
    comment?: string;
    description?: string;
    events: Array<Event>;
    id: QualifiedName;
    name_fragment: string;
    superType?: Reference<UseCase>;
}

export interface UseCasesModel {
    $container: Model;
    $type: 'UseCasesModel';
    comment?: string;
    elements: Array<UseCaseElements>;
    id: QualifiedName;
}

export type AbstractElement = EnumX | Module;
export type Entity = ImportedEntity | LocalEntity;
export type Relation = ManyToMany | ManyToOne | OneToMany | OneToOne;
export type UseCaseElements = Actor | UseCase;

export function isActor(item: any): item is Actor {
    return item && item.$type === 'Actor';
}
export function isLocalEntity(item: any): item is LocalEntity {
    return item && item.$type === 'LocalEntity';
}
export function isModel(item: any): item is Model {
    return item && item.$type === 'Model';
}
export function isModule(item: any): item is Module {
    return item && item.$type === 'Module';
}
export function isConfiguration(item: any): item is Configuration {
    return item && item.$type === 'Configuration';
}
export function isUseCasesModel(item: any): item is UseCasesModel {
    return item && item.$type === 'UseCasesModel';
}
export function isUseCase(item: any): item is UseCase {
    return item && item.$type === 'UseCase';
}
export function isAttribute(item: any): item is Attribute {
    return item && item.$type === 'Attribute';
}
export function isAttributeEnum(item: any): item is AttributeEnum {
    return item && item.$type === 'AttributeEnum';
}
export function isEnumX(item: any): item is EnumX {
    return item && item.$type === 'EnumX';
}
export function isFunctionEntity(item: any): item is FunctionEntity {
    return item && item.$type === 'FunctionEntity';
}
export function isImportedEntity(item: any): item is ImportedEntity {
    return item && item.$type === 'ImportedEntity';
}
export function isManyToMany(item: any): item is ManyToMany {
    return item && item.$type === 'ManyToMany';
}
export function isManyToOne(item: any): item is ManyToOne {
    return item && item.$type === 'ManyToOne';
}
export function isOneToMany(item: any): item is OneToMany {
    return item && item.$type === 'OneToMany';
}
export function isOneToOne(item: any): item is OneToOne {
    return item && item.$type === 'OneToOne';
}
export function isParameter(item: any): item is Parameter {
    return item && item.$type === 'Parameter';
}
export function isElement(item: any): item is Element {
    return item && item.$type === 'Element';
}
export function isEnumEntityAtribute(item: any): item is EnumEntityAtribute {
    return item && item.$type === 'EnumEntityAtribute';
}
export function isEvent(item: any): item is Event {
    return item && item.$type === 'Event';
}
export function isModuleImport(item: any): item is ModuleImport {
    return item && item.$type === 'ModuleImport';
}

export function getRef<T>(ref: Reference<T>): T {
    if (ref && typeof ref === 'object' && 'ref' in ref) {
        return (ref as { ref: T }).ref;
    }
    return ref as T;
}

// ========== generator-utils.ts =============

import path from "path";
import fs from 'fs';

/**
 * Capitaliza uma string
 *
 * @param str - String a ser capitalizada
 * @returns A string capitalizada
 */
export function capitalizeString(str: string) : string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const ident_size = 4;
export const base_ident = ' '.repeat(ident_size);

export function createPath(...args: string[]) : string {
  const PATH = path.join(...args)
  if(!fs.existsSync(PATH)) {
    fs.mkdirSync(PATH, { recursive: true })
  }
  return PATH
}

/**
 * Ordena topologicamente um DAG.
 *
 * @param nodes - Conjuntos de nós que denotam um grafo
 * @param fn - Função que recebe um nó `N` e retorna um iterável dos nós que PRECEDEM `N`.
 * @param reverse - Booleano que define se a ordenação deve ser feita ao contrário.
 *
 * @returns Um array, contendo os nós de `nodes` ordenados topologicamente
 *
 * @throws {Error} Se houver um ciclo em `nodes`, tornando a ordenação impossível
 */
export function topologicalSort<T>(nodes: Iterable<T>, fn: (a: T) => Iterable<T>, reverse?: boolean) : T[] {
  const permantent_marked = new Set<T>()
  const temporary_marked = new Set<T>()
  const ordering: T[] = []
  const visit = (node: T) => {
      if(permantent_marked.has(node)) {
          return
      }
      if(temporary_marked.has(node)) {
          throw new Error("Não foi possível ordenar topologicamente. Ciclo encontrado");
      }
      temporary_marked.add(node)
      for(const n of fn(node)) {
          visit(n)
      }
      temporary_marked.delete(node)
      permantent_marked.add(node)
      ordering.push(node)
  }
  for(const n of nodes) {
      visit(n)
  }
  return reverse ? ordering.reverse() : ordering
}

/**
* Checa se o nó de um grafo é parte de um ciclo.
* Apenas para grafos com grau de saída 1 ou menor em cada nó
* @param start_node Nó inicial
* @param sucessor_function Função que recebe um nó e retorna o nó sucessor, ou undefined caso não haja sucessor.
* @returns Um booleano, dizendo se foi encontrado ciclo
*/
export function cycleFinder<T>(
  start_node: T,
  sucessor_function: (node: T) => T | undefined
) : boolean {
  let hare:   T | undefined = start_node
  let turtle: T | undefined = start_node
  while(hare !== undefined && turtle !== undefined) {
      hare = sucessor_function(hare)
      if(hare === undefined) {
          break
      }
      hare   = sucessor_function(hare)
      turtle = sucessor_function(turtle)
      if(turtle === hare) {
          return true
      }
  }
  return false
}

/**
* Dado um Entity que tenha nome, retorna o qualified name completo
*/
export function getQualifiedName(e: Entity) : string {
  let qualified_name = (e as any).name;
  let parent: any = (e as any).$container;
  while(parent && !isModel(parent)) {
      qualified_name = `${parent.name}.${qualified_name}`;
      parent = parent.$container;
  }
  return qualified_name;
}

export function expandToString(strings: TemplateStringsArray, ...expr: any[]): string {
  let result = '';
  for (let i = 0; i < strings.length; i++) {
    result += strings[i] + (expr[i] !== undefined ? expr[i] : '');
  }
  return result;
}

export function expandToStringWithNL(strings: TemplateStringsArray, ...expr: any[]): string {
  return expandToString(strings, ...expr).replace(/\n{2,}/g, '\n');
}

export function toString(val: any): string {
  if (typeof val === 'string') return val;
  if (val && typeof val.toString === 'function') return val.toString();
  return String(val);
}

// Stubs para compatibilidade
export type Generated = string;
export class CompositeGeneratorNode {
  private content: string[] = [];
  append(str: string) { this.content.push(str); }
  appendNewLine() { this.content.push('\n'); }
  toString() { return this.content.join(''); }
}

// ========== relations.ts =============

export type RelationInfo = {
  tgt: LocalEntity,
  card: RelationType,
  owner: boolean
}
type RelationType = 'OneToMany' | 'OneToOne' | 'ManyToOne' | 'ManyToMany'

function revert_card(card: RelationType) : RelationType {
  switch(card) {
  case 'OneToOne':
    return 'OneToOne'
  case 'OneToMany':
    return 'ManyToOne'
  case 'ManyToOne':
    return 'OneToMany'
  case 'ManyToMany':
    return 'ManyToMany'
  }
}

export function processRelations(
  localEntities: LocalEntity[]
) : Map<LocalEntity, RelationInfo[]> {
  // Inicializa o mapa com listas vazias
  const map: Map<LocalEntity, RelationInfo[]> = new Map()

  for(const cls of localEntities) {
    map.set(cls, new Array())
  }
  
  const add_relation = (owner: LocalEntity, non_owner: LocalEntity, card_name: RelationType) => {
    map.get(owner)?.push({
      tgt: non_owner,
      card: card_name,
      owner: true
    })
    map.get(non_owner)?.push({
      tgt: owner,
      card: revert_card(card_name),
      owner: false
    })
  }

  for(const entity of localEntities) {
    for (const relationship of entity.relations) {
      const relationType = getRef(relationship.type);
      if (isLocalEntity(relationType)) {
        if(relationship.$type === "OneToMany") {
          add_relation(relationType, entity, "ManyToOne")
        } else {
          add_relation(entity, relationType, relationship.$type)
        }
      }
    }
  }

  return map
}
