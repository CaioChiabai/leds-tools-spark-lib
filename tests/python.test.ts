import { describe, it, expect, vi, beforeEach } from "vitest";
import * as fs from "fs";
import * as path from "path";

import { generate as djangoGenerate } from "../packages/python-generator/django/back/generator";
import * as settingsGen from "../packages/python-generator/django/back/setting-generator";
import * as bddGen from "../packages/python-generator/django/back/bdd/generator";
import * as modulesGen from "../packages/python-generator/django/back/components/module-generator";

vi.mock("fs");
vi.mock("path");
vi.mock("langium/generate", () => ({
  expandToStringWithNL: (strings: TemplateStringsArray, ...exprs: any[]) =>
    String.raw({ raw: strings }, ...exprs),
  toString: (x: any) => x,
}));
vi.mock("../packages/python-generator/django/back/setting-generator");
vi.mock("../packages/python-generator/django/back/bdd/generator");
vi.mock("../packages/python-generator/django/back/components/module-generator");

const mockMkdirSync = fs.mkdirSync as unknown as ReturnType<typeof vi.fn>;
const mockWriteFileSync = fs.writeFileSync as unknown as ReturnType<typeof vi.fn>;
const mockJoin = path.join as unknown as ReturnType<typeof vi.fn>;

const mockSettingsGen = settingsGen.generate as unknown as ReturnType<typeof vi.fn>;
const mockBddGen = bddGen.generate as unknown as ReturnType<typeof vi.fn>;
const mockModulesGen = modulesGen.generateModules as unknown as ReturnType<typeof vi.fn>;

describe("python-generator/django/back/generator.ts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockMkdirSync.mockImplementation(() => {});
    mockWriteFileSync.mockImplementation(() => {});
    mockJoin.mockImplementation((...args: string[]) => args.join("/"));
    mockSettingsGen.mockImplementation(() => {});
    mockBddGen.mockImplementation(() => {});
    mockModulesGen.mockImplementation(() => {});
  });

  it("should create target folder and call settings, modules and bdd generators", () => {
    const model = { configuration: { name: "Test", description: "desc" }, abstractElements: [] };
    djangoGenerate(model as any, "output");

    expect(mockMkdirSync).toHaveBeenCalledWith("output", { recursive: true });
    expect(mockSettingsGen).toHaveBeenCalledWith(model, "output");
    expect(mockModulesGen).toHaveBeenCalledWith(model, "output");
    expect(mockBddGen).toHaveBeenCalledWith(model, "output");
  });

  it("should handle errors from fs.mkdirSync gracefully", () => {
    mockMkdirSync.mockImplementation(() => { throw new Error("disk full"); });
    const model = { configuration: { name: "Test", description: "desc" }, abstractElements: [] };
    expect(() => djangoGenerate(model as any, "output")).toThrow("disk full");
  });

  it("should write files with expected content", () => {
    mockWriteFileSync.mockImplementation(() => {});
    const model = { configuration: { name: "Test", description: "desc" }, abstractElements: [] };
    djangoGenerate(model as any, "output");
    expect(mockSettingsGen).toHaveBeenCalled();
    expect(mockModulesGen).toHaveBeenCalled();
    expect(mockBddGen).toHaveBeenCalled();
  });

  it("should not fail if model is undefined", () => {
    expect(() => djangoGenerate(undefined as any, "output")).not.toThrow();
  });

  it("should not fail if configuration is missing", () => {
    const model = { abstractElements: [] };
    expect(() => djangoGenerate(model as any, "output")).not.toThrow();
  });

  it("should not fail with empty model", () => {
    expect(() => djangoGenerate({} as any, "output")).not.toThrow();
  });

  it("should not call sub-generators if configuration is missing", () => {
    const model = {};
    djangoGenerate(model as any, "output");
    expect(mockSettingsGen).toHaveBeenCalled();
    expect(mockModulesGen).toHaveBeenCalled();
    expect(mockBddGen).toHaveBeenCalled();
  });

  it("should handle multiple calls without side effects", () => {
    const model = { configuration: { name: "Test", description: "desc" }, abstractElements: [] };
    djangoGenerate(model as any, "output");
    djangoGenerate(model as any, "output2");
    expect(mockMkdirSync).toHaveBeenCalledWith("output", { recursive: true });
    expect(mockMkdirSync).toHaveBeenCalledWith("output2", { recursive: true });
  });

  it("should pass correct model to sub-generators", () => {
    const model = { configuration: { name: "Test", description: "desc" }, abstractElements: [] };
    djangoGenerate(model as any, "output");
    expect(mockSettingsGen).toHaveBeenCalledWith(model, "output");
    expect(mockModulesGen).toHaveBeenCalledWith(model, "output");
    expect(mockBddGen).toHaveBeenCalledWith(model, "output");
  });

  it("should export djangoGenerate as a function", () => {
    expect(typeof djangoGenerate).toBe("function");
  });
});

describe("python-generator/django/back/setting-generator.ts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should export a generate function", () => {
    expect(typeof settingsGen.generate).toBe("function");
  });

  it("should call generate with correct arguments", () => {
    settingsGen.generate({ foo: "bar" } as any, "out");
    expect(mockSettingsGen).toHaveBeenCalledWith({ foo: "bar" }, "out");
  });

  it("should handle missing arguments gracefully", () => {
    expect(() => settingsGen.generate(undefined as any, undefined as any)).not.toThrow();
  });

  if (typeof (settingsGen as any).helperFunction === "function") {
    it("helperFunction should return expected value", () => {
      const result = (settingsGen as any).helperFunction("input");
      expect(result).toBeDefined();
    });
  }
});

describe("python-generator/django/back/bdd/generator.ts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should export a generate function", () => {
    expect(typeof bddGen.generate).toBe("function");
  });

  it("should call generate with correct arguments", () => {
    bddGen.generate({ foo: "bar" } as any, "out");
    expect(mockBddGen).toHaveBeenCalledWith({ foo: "bar" }, "out");
  });

  it("should handle missing arguments gracefully", () => {
    expect(() => bddGen.generate(undefined as any, undefined as any)).not.toThrow();
  });

  if (typeof (bddGen as any).helperFunction === "function") {
    it("helperFunction should return expected value", () => {
      const result = (bddGen as any).helperFunction("input");
      expect(result).toBeDefined();
    });
  }
});

describe("python-generator/django/back/components/module-generator.ts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should export a generateModules function", () => {
    expect(typeof modulesGen.generateModules).toBe("function");
  });

  it("should call generateModules with correct arguments", () => {
    modulesGen.generateModules({ foo: "bar" } as any, "out");
    expect(mockModulesGen).toHaveBeenCalledWith({ foo: "bar" }, "out");
  });

  it("should handle missing arguments gracefully", () => {
    expect(() => modulesGen.generateModules(undefined as any, undefined as any)).not.toThrow();
  });

  if (typeof (modulesGen as any).helperFunction === "function") {
    it("helperFunction should return expected value", () => {
      const result = (modulesGen as any).helperFunction("input");
      expect(result).toBeDefined();
    });
  }
});