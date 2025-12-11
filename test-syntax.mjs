import ts from 'typescript';
import fs from 'fs';

const files = [
  'src/services/home.service.ts',
  'src/services/technician.service.ts'
];

files.forEach(file => {
  const source = fs.readFileSync(file, 'utf8');
  const result = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ES2020 }
  });
  
  if (result.diagnostics.length > 0) {
    console.error(`\n❌ ${file} has syntax errors:`);
    result.diagnostics.forEach(d => {
      console.error(`  ${d.messageText}`);
    });
  } else {
    console.log(`✅ ${file} - OK`);
  }
});
