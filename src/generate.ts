import generate from '@babel/generator';
import { AstConfig } from './type';
import * as $t from '@babel/types';
import * as astUtils from './utils/index';
import * as babel from '@babel/core';
const $$ = $t.identifier;
import typescript from '@babel/plugin-transform-typescript';
import decorators from '@babel/plugin-proposal-decorators';
import properties from '@babel/plugin-proposal-class-properties';

function getAstConfig(ast) {
    const astConfig: AstConfig = new AstConfig();
    babel.traverse(ast, {
        enter(path) {
            astUtils.traverseImport(path, astConfig);
            astUtils.traverseDecorate(path, astConfig);
            astUtils.traverseRef(path, astConfig);
            astUtils.traverseMethod(path, astConfig);
            astUtils.traverseElementui(path, astConfig);
        }
    });
    if (astConfig.propsAttrs.length) {
        astConfig.componentAttrs.push(
            $t.objectProperty($$('props'), $t.objectExpression(astConfig.propsAttrs))
        );
    }
    return astConfig;
}
function getResult(astConfig: AstConfig) {
    if (astConfig.elementui.length) {
        astConfig.importList.push(astUtils.generateImport(astConfig.elementui, 'd-element-ui'));
    }
    return $t.file(
        $t.program([
            ...astConfig.importList,
            $t.exportDefaultDeclaration(
                $t.callExpression($$('defineComponent'), [
                    $t.objectExpression([
                        ...astConfig.componentAttrs,
                        $t.objectMethod(
                            'method',
                            $$('setup'),
                            [$$('props'), $$('context')],
                            $t.blockStatement(astConfig.setupStatements)
                        )
                    ])
                ])
            )
        ])
    );
}
function generateCode(ast) {
    const astConfig = getAstConfig(ast);
    const resultAst = getResult(astConfig);
    babel.traverse(resultAst, {
        enter(path) {
            astUtils.traverseThis(path, astConfig);
        }
    });
    return resultAst;
}
export default function parseCode(code: string) {
    const ast = babel.parse(code, {
        plugins: [
            [typescript],
            [
                decorators,
                {
                    version: '2021-12',
                    decoratorsBeforeExport: true
                }
            ],
            [
                properties,
                {
                    loose: true
                }
            ]
        ]
    });
    const oldAst = JSON.parse(JSON.stringify(ast));
    const newAst = generateCode(ast);
    return {
        oldAst,
        ast: newAst,
        code: generate(newAst).code
    };
}