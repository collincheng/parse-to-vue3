import * as $t from '@babel/types';
import { NodePath } from '@babel/core';
import { AstConfig } from '../type';
const $$ = $t.identifier;

export function generateImport(specifers: string[], source: string) {
    const realSpecifers = [...new Set(specifers)].map(item =>
        $t.importSpecifier($$(item), $$(item))
    );
    return $t.importDeclaration(realSpecifers, $t.stringLiteral(source));
}
export function traverseImport(path: NodePath, astConfig: AstConfig) {
    if (path.isImportDeclaration()) {
        const source = path.node.source.value;
        const noImportList = ['vue-property-decorator', '@/mixins/dialogMixinVue'];
        if (source === '@/mixins/dialogMixinVue') {
            astConfig.visilbleComposable = true;
        }
        if (!noImportList.includes(source)) {
            astConfig.importList.push(path.node);
        }
    }
}
