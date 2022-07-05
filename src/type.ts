import { ObjectProperty, ImportDeclaration, Statement, FunctionDeclaration } from '@babel/types';
import { NodePath } from '@babel/core';
export class AstConfig {
    componentAttrs: ObjectProperty[] = [];
    importList: ImportDeclaration[] = [];
    propsAttrs: ObjectProperty[] = [];
    methods: FunctionDeclaration[] = [];
    setupStatements: Statement[] = [];
    // 是否有visible引用
    visilbleComposable: boolean = false;
    elementui: string[] = [];
}
export type ITransHandle = (path: NodePath, astConfig: AstConfig) => void;