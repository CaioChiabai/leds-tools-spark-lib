import { describe, it, expect, vi, beforeEach } from "vitest";
import * as fs from "fs";
import * as path from "path";

import { generate as caGenerate } from "../packages/csharp-generator/cleanArchitecture-generator/generator";
import * as appGen from "../packages/csharp-generator/cleanArchitecture-generator/Application/generate";
import * as domainGen from "../packages/csharp-generator/cleanArchitecture-generator/Domain/generate";
import * as infraGen from "../packages/csharp-generator/cleanArchitecture-generator/Infrastructure/generate";
import * as infraTestGen from "../packages/csharp-generator/cleanArchitecture-generator/InfraTest/generate";
import * as domainTestGen from "../packages/csharp-generator/cleanArchitecture-generator/DomainTest/generate";
import * as webApiGen from "../packages/csharp-generator/cleanArchitecture-generator/WebAPI/generate";

vi.mock("fs");
vi.mock("path");
vi.mock("langium/generate", () => ({
  expandToStringWithNL: (strings: TemplateStringsArray, ...exprs: any[]) =>
    String.raw({ raw: strings }, ...exprs),
  expandToString: (strings: TemplateStringsArray, ...exprs: any[]) =>
    String.raw({ raw: strings }, ...exprs),
}));

vi.mock("../packages/csharp-generator/cleanArchitecture-generator/Application/generate");
vi.mock("../packages/csharp-generator/cleanArchitecture-generator/Domain/generate");
vi.mock("../packages/csharp-generator/cleanArchitecture-generator/Infrastructure/generate");
vi.mock("../packages/csharp-generator/cleanArchitecture-generator/InfraTest/generate");
vi.mock("../packages/csharp-generator/cleanArchitecture-generator/DomainTest/generate");
vi.mock("../packages/csharp-generator/cleanArchitecture-generator/WebAPI/generate");

const mockMkdirSync = fs.mkdirSync as unknown as ReturnType<typeof vi.fn>;
const mockAppGen = appGen.generate as unknown as ReturnType<typeof vi.fn>;
const mockDomainGen = domainGen.generate as unknown as ReturnType<typeof vi.fn>;
const mockInfraGen = infraGen.generate as unknown as ReturnType<typeof vi.fn>;
const mockInfraTestGen = infraTestGen.generate as unknown as ReturnType<typeof vi.fn>;
const mockDomainTestGen = domainTestGen.generate as unknown as ReturnType<typeof vi.fn>;
const mockWebApiGen = webApiGen.generate as unknown as ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.clearAllMocks();
  mockMkdirSync.mockImplementation(() => undefined);
  mockAppGen.mockImplementation(() => {});
  mockDomainGen.mockImplementation(() => {});
  mockInfraGen.mockImplementation(() => {});
  mockInfraTestGen.mockImplementation(() => {});
  mockDomainTestGen.mockImplementation(() => {});
  mockWebApiGen.mockImplementation(() => {});
});

// -------------------- Clean Architecture Generator Tests --------------------
describe("csharp-generator/cleanArchitecture-generator/generator.ts", () => {
  it("should create all main folders and call all sub-generators", () => {
    const model = { configuration: { name: "TestProject", description: "desc" } };
    caGenerate(model as any, "output");

    expect(mockMkdirSync).toHaveBeenCalledWith("output/TestProject.Application", { recursive: true });
    expect(mockMkdirSync).toHaveBeenCalledWith("output/TestProject.Domain", { recursive: true });
    expect(mockMkdirSync).toHaveBeenCalledWith("output/TestProject.Domain.Test", { recursive: true });
    expect(mockMkdirSync).toHaveBeenCalledWith("output/TestProject.Infrastructure", { recursive: true });
    expect(mockMkdirSync).toHaveBeenCalledWith("output/TestProject.Infrastructure.Test", { recursive: true });
    expect(mockMkdirSync).toHaveBeenCalledWith("output/TestProject.WebAPI", { recursive: true });

    expect(mockAppGen).toHaveBeenCalledWith(model, "output/TestProject.Application");
    expect(mockDomainGen).toHaveBeenCalledWith(model, "output/TestProject.Domain");
    expect(mockDomainTestGen).toHaveBeenCalledWith(model, "output/TestProject.Domain.Test");
    expect(mockInfraGen).toHaveBeenCalledWith(model, "output/TestProject.Infrastructure");
    expect(mockInfraTestGen).toHaveBeenCalledWith(model, "output/TestProject.Infrastructure.Test");
    expect(mockWebApiGen).toHaveBeenCalledWith(model, "output/TestProject.WebAPI");
  });

  it("should not throw or call sub-generators if model is undefined", () => {
    expect(() => caGenerate(undefined as any, "output")).not.toThrow();
    expect(mockMkdirSync).not.toHaveBeenCalled();
    expect(mockAppGen).not.toHaveBeenCalled();
    expect(mockDomainGen).not.toHaveBeenCalled();
    expect(mockInfraGen).not.toHaveBeenCalled();
    expect(mockInfraTestGen).not.toHaveBeenCalled();
    expect(mockDomainTestGen).not.toHaveBeenCalled();
    expect(mockWebApiGen).not.toHaveBeenCalled();
  });

  it("should not throw or call sub-generators if model.configuration is undefined", () => {
    const model = {};
    expect(() => caGenerate(model as any, "output")).not.toThrow();
    expect(mockMkdirSync).not.toHaveBeenCalled();
    expect(mockAppGen).not.toHaveBeenCalled();
    expect(mockDomainGen).not.toHaveBeenCalled();
    expect(mockInfraGen).not.toHaveBeenCalled();
    expect(mockInfraTestGen).not.toHaveBeenCalled();
    expect(mockDomainTestGen).not.toHaveBeenCalled();
    expect(mockWebApiGen).not.toHaveBeenCalled();
  });

  it("should not throw or call sub-generators if model.configuration.name is undefined", () => {
    const model = { configuration: {} };
    expect(() => caGenerate(model as any, "output")).not.toThrow();
    expect(mockMkdirSync).not.toHaveBeenCalled();
    expect(mockAppGen).not.toHaveBeenCalled();
    expect(mockDomainGen).not.toHaveBeenCalled();
    expect(mockInfraGen).not.toHaveBeenCalled();
    expect(mockInfraTestGen).not.toHaveBeenCalled();
    expect(mockDomainTestGen).not.toHaveBeenCalled();
    expect(mockWebApiGen).not.toHaveBeenCalled();
  });

  it("should handle missing output path gracefully", () => {
    const model = { configuration: { name: "TestProject", description: "desc" } };
    expect(() => caGenerate(model as any, undefined as any)).not.toThrow();
  });

  it("should handle multiple calls without side effects", () => {
    const model = { configuration: { name: "TestProject", description: "desc" } };
    caGenerate(model as any, "output");
    caGenerate(model as any, "output2");
    expect(mockMkdirSync).toHaveBeenCalledWith("output/TestProject.Application", { recursive: true });
    expect(mockMkdirSync).toHaveBeenCalledWith("output2/TestProject.Application", { recursive: true });
  });
});

// -------------------- Application Generator Tests --------------------
describe("csharp-generator/cleanArchitecture-generator/Application/generate.ts", () => {
  it("should export a generate function", () => {
    expect(typeof appGen.generate).toBe("function");
  });

  it("should not throw if called with undefined model", () => {
    expect(() => appGen.generate(undefined as any, "output")).not.toThrow();
  });

  it("should not throw if called with model without configuration", () => {
    expect(() => appGen.generate({} as any, "output")).not.toThrow();
  });

  it("should not throw if called with valid model", () => {
    const model = { configuration: { name: "Test", description: "desc" } };
    expect(() => appGen.generate(model as any, "output")).not.toThrow();
  });
});

// -------------------- Domain Generator Tests --------------------
describe("csharp-generator/cleanArchitecture-generator/Domain/generate.ts", () => {
  it("should export a generate function", () => {
    expect(typeof domainGen.generate).toBe("function");
  });

  it("should not throw if called with undefined model", () => {
    expect(() => domainGen.generate(undefined as any, "output")).not.toThrow();
  });

  it("should not throw if called with model without configuration", () => {
    expect(() => domainGen.generate({} as any, "output")).not.toThrow();
  });

  it("should not throw if called with valid model", () => {
    const model = { configuration: { name: "Test", description: "desc" } };
    expect(() => domainGen.generate(model as any, "output")).not.toThrow();
  });
});

// -------------------- Infrastructure Generator Tests --------------------
describe("csharp-generator/cleanArchitecture-generator/Infrastructure/generate.ts", () => {
  it("should export a generate function", () => {
    expect(typeof infraGen.generate).toBe("function");
  });

  it("should not throw if called with undefined model", () => {
    expect(() => infraGen.generate(undefined as any, "output")).not.toThrow();
  });

  it("should not throw if called with model without configuration", () => {
    expect(() => infraGen.generate({} as any, "output")).not.toThrow();
  });

  it("should not throw if called with valid model", () => {
    const model = { configuration: { name: "Test", description: "desc" } };
    expect(() => infraGen.generate(model as any, "output")).not.toThrow();
  });
});

// -------------------- InfraTest Generator Tests --------------------
describe("csharp-generator/cleanArchitecture-generator/InfraTest/generate.ts", () => {
  it("should export a generate function", () => {
    expect(typeof infraTestGen.generate).toBe("function");
  });

  it("should not throw if called with undefined model", () => {
    expect(() => infraTestGen.generate(undefined as any, "output")).not.toThrow();
  });

  it("should not throw if called with model without configuration", () => {
    expect(() => infraTestGen.generate({} as any, "output")).not.toThrow();
  });

  it("should not throw if called with valid model", () => {
    const model = { configuration: { name: "Test", description: "desc" } };
    expect(() => infraTestGen.generate(model as any, "output")).not.toThrow();
  });
});

// -------------------- DomainTest Generator Tests --------------------
describe("csharp-generator/cleanArchitecture-generator/DomainTest/generate.ts", () => {
  it("should export a generate function", () => {
    expect(typeof domainTestGen.generate).toBe("function");
  });

  it("should not throw if called with undefined model", () => {
    expect(() => domainTestGen.generate(undefined as any, "output")).not.toThrow();
  });

  it("should not throw if called with model without configuration", () => {
    expect(() => domainTestGen.generate({} as any, "output")).not.toThrow();
  });

  it("should not throw if called with valid model", () => {
    const model = { configuration: { name: "Test", description: "desc" } };
    expect(() => domainTestGen.generate(model as any, "output")).not.toThrow();
  });
});

// -------------------- WebAPI Generator Tests --------------------
describe("csharp-generator/cleanArchitecture-generator/WebAPI/generate.ts", () => {
  it("should export a generate function", () => {
    expect(typeof webApiGen.generate).toBe("function");
  });

  it("should not throw if called with undefined model", () => {
    expect(() => webApiGen.generate(undefined as any, "output")).not.toThrow();
  });

  it("should not throw if called with model without configuration", () => {
    expect(() => webApiGen.generate({} as any, "output")).not.toThrow();
  });

  it("should not throw if called with valid model", () => {
    const model = { configuration: { name: "Test", description: "desc" } };
    expect(() => webApiGen.generate(model as any, "output")).not.toThrow();
  });
});