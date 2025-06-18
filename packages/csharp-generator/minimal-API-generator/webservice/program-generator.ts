import path from "path";
import fs from "fs";
import { LocalEntity, Model, Module, isLocalEntity, isModule, expandToStringWithNL,capitalizeString } from "../../../models/model.js";

export function generate(model: Model, target_folder: string) : void {
    console.log(model.configuration?.feature)

    fs.writeFileSync(path.join(target_folder, `Program.cs`), generateProgram(model, target_folder))
}

function generateProgram(model: Model, target_folder: string) : string {

    const modules = model.abstractElements.filter(isModule);
    const features = model.configuration?.feature

    return expandToStringWithNL`
    using Microsoft.AspNetCore.Identity;
    using Microsoft.EntityFrameworkCore;
    using Shared;
    
    // modules
    ${generateModuleNames(modules)}

    internal class Program
    {
        private static void Main(String[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            builder.Services.AddDbContext<ContextDb>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("${capitalizeString(model.configuration?.name || "model")}Connection")));
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();
            ${generateFeatureBuilder(features)}

            var app = builder.Build();

            // Automatically apply migrations at startup
            CreateDatabase(app);

            void CreateDatabase(WebApplication app)
            {
                var serviceScope = app.Services.CreateScope();
                var dataContext = serviceScope.ServiceProvider.GetService<ContextDb>();
                dataContext?.Database.EnsureCreated();
                dataContext?.Database.Migrate();
            }

            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            // Mapgroups:
            ${generateMapGroups(features, modules)}
            
            app.MapGet("/", () => "Hello World!");
            ${generateFeatureCors(features)}
            app.Run();
        }
    }
    `
}

function generateModuleNames(modules: Module[]) : string {
    let moduleNames = "";
    for (const mod of modules) {
      moduleNames += `using ${mod.name}; \n`;
    }
    return moduleNames;
  
}
  
function generateMapGroups(features : string | undefined, modules : Module[]) : string {
    let mapGroups = "";
    if (features == 'authentication') {
        mapGroups += `// Authentication Mapgroup\n`;
        mapGroups += `app.MapGroup("/identity").MapIdentityApi<IdentityUser>();\n\n`;
    }
    for (const mod of modules) {
        mapGroups += `var ${mod.name.toLowerCase()} = app.MapGroup("/${mod.name}");\n\n`;
        const mod_classes = mod.elements.filter(isLocalEntity);
        for (const classe of mod_classes) {
            // ...rest of the code remains the same...
        }
    }
    return mapGroups;
}

function generateInputs(classe : LocalEntity) : string {    

    let inputs = "";
    for (const att of classe.attributes) {
        inputs += `\n        ${classe.name.toLowerCase()}.${capitalizeString(att.name)} = input${classe.name}.${capitalizeString(att.name)};`
    }
    return inputs;
}

function generateFeatureBuilder(features: string | undefined) : string {
    if (features == 'authentication'){
        return expandToStringWithNL`
        // Authentication Builder
        builder.Services.AddIdentityApiEndpoints<IdentityUser>()
            .AddEntityFrameworkStores<ContextDb>();
        
        builder.Services.AddCors();
        builder.Services.AddAuthorization();`
    }
    return '';
}

function generateFeatureCors(features: string | undefined) : string {
    if (features == 'authentication'){
        return expandToStringWithNL`
        app.UseCors();`
    }
    return '';
}