import * as $t from '@babel/types'
const $$ = $t.identifier

export function traverseElementui(path, astConfig) {
    if (path.isThisExpression()) {
        const parentNode = path.parentPath.node
        const propertyName = parentNode.property.name
        if (propertyName === '$message') {
            astConfig.elementui.push('Message')
        }
    }
}