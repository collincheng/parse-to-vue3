import * as $t from '@babel/types'
const $$ = $t.identifier

export function traverseRef(path, astConfig) {
    if (path.isClassProperty() && path.node.key.name === '$refs') {
        const typeAnnotation = path.node.typeAnnotation.typeAnnotation
        typeAnnotation.members.forEach(item => {
            const declaration = $t.variableDeclaration('const', [
                $t.variableDeclarator($$(item.key.name), {
                    ...$t.callExpression($$('ref'), []),
                    typeParameters: $t.tsTypeParameterInstantiation([
                        item.typeAnnotation.typeAnnotation
                    ])
                })
            ])
            astConfig.setupStatements.push(declaration)
        })
    }

    if (path.isClassProperty() && path.node.accessibility === 'private') {
        const node = $t.variableDeclaration('const', [
            $t.variableDeclarator($$(path.node.key.name), {
                ...$t.callExpression($$('ref'), [path.node.value])
            })
        ])
        astConfig.setupStatements.push(node)
    }

    if (path.isClassMethod() && path.node.kind === 'get') {
        console.log('get')
        const node = $t.variableDeclaration('const', [
            $t.variableDeclarator(
                path.node.key,
                $t.callExpression($$('computed'), [$t.arrowFunctionExpression([], path.node.body)])
            )
        ])
        console.log(node)

        astConfig.setupStatements.push(node)
    }
}
