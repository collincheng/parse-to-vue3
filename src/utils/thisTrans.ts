import * as $t from '@babel/types'
const $$ = $t.identifier

export function traverseThis(path, astConfig) {
    if (path.isThisExpression()) {
        const parentNode = path.parentPath.node
        const propertyName = parentNode.property.name
        if (astConfig.propsAttrs.some(propsAttr => propsAttr.key.name === propertyName)) {
            parentNode.object = $$('props')
        }
        if (propertyName === '$emit') {
            parentNode.object = $$('context')
        }
        if (propertyName === '$message') {
            path.parentPath.replaceWith(
                $t.expressionStatement($$('Message'))
            )
        }
    }
}