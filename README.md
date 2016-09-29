# Edit with Shell Command

Levarage your favourite shell commands to edit text.

## Features

* Edit selected text with shell command
* Insert shell command output into cursor position

![Edit with Shell Command](https://raw.githubusercontent.com/ryu1kn/vscode-edit-with-shell/master/images/animations/edit-with-shell.gif)

![Insert command output](https://raw.githubusercontent.com/ryu1kn/vscode-edit-with-shell/master/images/animations/insert-command-output.gif)

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

### 0.0.1: 29 Sep 2016

* Initial release of the extension
