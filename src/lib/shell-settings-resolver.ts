import {EXTENSION_NAME} from './const';
import resolveOsKind from './resolve-os-kind';
import {Workspace} from './adapters/workspace';
import { ObjectMap } from './types/collection';
import * as path from 'path';

export class ShellSettingsResolver {
    constructor(private readonly workspaceAdapter: Workspace,
                private readonly platform: string) {}

    shellProgramme(): string {
        return this.workspaceAdapter.getConfig<string>(`${EXTENSION_NAME}.shell.${this.osKind}`);
    }

    shellArgs(): string[] {
        return this.workspaceAdapter.getConfig<string[]>(`${EXTENSION_NAME}.shellArgs.${this.osKind}`);
    }

    shellEnv(): ObjectMap<string> {
        return this.workspaceAdapter.getConfig<ObjectMap<string>>(`${EXTENSION_NAME}.shellEnv`);
    }

    pathSeparator(): string {
        return path.delimiter;
    }

    private get osKind() {
        return resolveOsKind(this.platform);
    }
}
