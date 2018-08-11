import Editor from '../adapters/editor';

export interface ExtensionCommand {
    execute(editor?: Editor): Promise<void>;
}
