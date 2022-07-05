import * as $t from '@babel/types'
import { ObjectProperty } from '@babel/types'
const $$ = $t.identifier

// babel 中 联合类型太多了，path直接用any了，写起来方便点
export function traverseDecorate(path, astConfig) {
    if (path.isDecorator()) {
        // @Component
        const expression = path.node.expression
        const decorateName = expression.callee.name
        const propType = expression.arguments[0]
        if (decorateName == 'Component') {
            const nameItem = propType.properties.find(item => item.key.name === 'name')
            if (nameItem) {
                astConfig.componentAttrs.push(
                  $t.objectProperty(
                    $$('name'),
                    $t.stringLiteral(nameItem.value.value)
                ))
            }
        }
        // prop先写在属性里，而不是defineComponents的语法，后期再改
        if (decorateName == 'Prop') {
            const classProperty = path.parentPath
            const attrList: ObjectProperty[] = []
            let defaultNode
            if (propType.type === 'ObjectExpression') {
                defaultNode = propType.properties.find(i => i.key.name === 'default')
                attrList.push(
                    $t.objectProperty($$('type'),
                        $t.tsAsExpression($$('Object'),
                            $t.tSTypeReference($$('PropType'),
                                $t.tSTypeParameterInstantiation([
                                    classProperty.node.typeAnnotation.typeAnnotation
                                ])
                            )
                        )
                    )
                )
            } else {
                attrList.push(
                    $t.objectProperty($$('type'), propType)
                )
            }
            if(defaultNode) {
                attrList.push(defaultNode)
            }
            astConfig.propsAttrs.push(
                $t.objectProperty($$(classProperty.node.key.name),
                    $t.objectExpression(attrList)
                )
            )
        }
        if (decorateName == 'Watch') {
            const classMethodNode = path.parentPath.node
            const expression = $t.callExpression(
                $$('watch'),
                [
                    $$(propType.value),
                    $t.arrowFunctionExpression(classMethodNode.params, classMethodNode.body)
                ]
            )
            astConfig.setupStatements.push($t.expressionStatement(expression))
        }
    }
}