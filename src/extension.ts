// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import parseCode from './generate';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "parse-to-v3" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('parse-to-v3.helloWorld', () => {
        // The code you place here will be executed every time your command is executed
        // Display a message box to the user
        vscode.window.showInformationMessage('Hello World from parse-to-v3!');
    });

	let parseToV3 = vscode.commands.registerCommand('parse-to-v3.parseToV3', () => {
        // 获取编辑器对象
        const editor = vscode.window.activeTextEditor;
        if(editor) {
            // 获取选中文本
            const doc = editor.document;
            const selection = editor.selection;
            const word = doc.getText(selection);
			console.log(word);
            editor.edit(eb => {
                const res = parseCode(word);
                // 文本替换
                eb.replace(selection, res.code);
            });
        }
    });

    context.subscriptions.push(disposable, parseToV3);
}

function textColorHandle(word: string) {
    let result = word;
    // 进行颜色值转换处理，并返回. 如果不是目标文本，原文返回
    return result;
}

// this method is called when your extension is deactivated
export function deactivate() {}
