## 1. Preparar e buildar a lib

### Acesse o diretório da lib:
```bash
cd leds-tools-spark-lib 
```

### Instale as dependências:
```bash
npm install
```

### Gere os arquivos compilados na pasta dist/:
```bash
npm run build
npx tsc
```

### Crie o link global da lib (isso registra o pacote localmente no sistema):
```bash
npm link
```


## 2. Vincular o Spark à versão local da lib

### Acesse o diretório do projeto principal:
```bash
cd ../leds-tools-spark
```

### Instale as dependências do projeto principal:
```bash
npm install
```

### Crie o link entre o Spark e a lib local (use o nome que aparece no campo "name" do package.json da lib):
```bash
npm link leds-spark-lib

npm ls leds-spark-lib
```


## 3. Testar o Spark localmente

### No diretório do Spark, execute:
```bash
npm run langium:generate
npm run build
```

### Depois, pressione:
```
F5
```


## 4. Atualizar alterações na lib

### Sempre que fizer uma mudança na lib, recompile para atualizar os arquivos usados pelo Spark:
```bash
cd leds-tools-spark-lib
cd ../leds-tools-spark-lib
npm run build
```

### Em seguida, volte para o Spark e rode novamente o build:
```bash
cd ../leds-tools-spark
npm run build
```

cd ../leds-tools-spark-lib