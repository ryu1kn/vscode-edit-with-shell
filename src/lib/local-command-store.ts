import { HistoryStore } from "./history-store";

import {ShellSettingsResolver} from './shell-settings-resolver';
import {Workspace as WorkspaceAdapter} from './adapters/workspace';
import * as fs from 'fs';
import * as vscode from 'vscode';
import * as Path from 'path';

export class LocalCommandStore extends HistoryStore {
    private readonly shellSettingsResolver: ShellSettingsResolver;
    // private readonly workspace: WorkspaceAdapter;

    constructor(workspace : WorkspaceAdapter) {
        super();
        // this.workspace = workspace;
        this.shellSettingsResolver = new ShellSettingsResolver(workspace, process.platform);
    }

    async getAll() {
        return new Promise<string[]>(require=>{

            const shellEnv = this.shellSettingsResolver.shellEnv();
            const pathSeparator = this.shellSettingsResolver.pathSeparator();

            const workdir = vscode.workspace.workspaceFolders ? vscode.workspace.getWorkspaceFolder(vscode.workspace.workspaceFolders[0].uri)?.uri?.fsPath || "": ""

            let envpath = shellEnv.PATH || shellEnv.Path;
            if(envpath) {
                let paths = envpath.split(pathSeparator);
                for(let path of paths){
                    let files = fs.readdirSync(Path.join(workdir, path));
                    files.forEach((file) => {
                        this.add(file);
                    });

                }
            }

            require(this.history)
        });
    }
}
