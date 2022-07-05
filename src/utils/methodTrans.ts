import * as $t from '@babel/types'
const $$ = $t.identifier

export function traverseMethod(path, astConfig) {
    if (path.isClassMethod()) {
        // 有注解的方法在注解相关的判断里处理,decorateTrans.ts
        if (!path.node.decorators && path.node.kind !== 'get') {
            astConfig.methods.push(
                $t.functionDeclaration(path.node.key, path.node.params, path.node.body, false, true)
            )
            astConfig.setupStatements.push(...astConfig.methods)
        }
    }
}
