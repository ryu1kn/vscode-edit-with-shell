# Edit with Shell Command

Levarage shell commands to edit text.

## Features

* Insert shell command output into cursor position
* Replace selected text with shell command output
* Edit selected text with shell command

## Commands

* `EditWithShell: Run command` (**Command ID:** `editWithShell.runCommand`)

    Open an input box to enter shell command

## Keyboard Shortcuts

You can quickly open a command input box by registering the extension command to your keyboard shortcut settings. For example:

```json
  { "key": "ctrl+r ctrl+r", "command": "editWithShell.runCommand",
                            "when": "editorTextFocus" }
```

## Request Features or Report Bugs

* https://github.com/ryu1kn/vscode-edit-with-shell/issues

## Changelog

### 0.0.1: XX Sep 2016

* Initial release of the extension
