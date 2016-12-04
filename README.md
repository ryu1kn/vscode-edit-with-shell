[![Build Status](https://travis-ci.org/ryu1kn/vscode-edit-with-shell.svg?branch=master)](https://travis-ci.org/ryu1kn/vscode-edit-with-shell) [![Code Climate](https://codeclimate.com/github/ryu1kn/vscode-edit-with-shell/badges/gpa.svg)](https://codeclimate.com/github/ryu1kn/vscode-edit-with-shell)

# Edit with Shell Command

Levarage your favourite shell commands to edit text.

## Features

* Edit selected text with shell command
* Insert shell command output into cursor position
* It records command history. You can edit and reuse past commands

![Edit with Shell Command](https://raw.githubusercontent.com/ryu1kn/vscode-edit-with-shell/master/images/animations/edit-with-shell.gif)

![Insert command output](https://raw.githubusercontent.com/ryu1kn/vscode-edit-with-shell/master/images/animations/insert-command-output.gif)

![Edit and reuse past commands](https://raw.githubusercontent.com/ryu1kn/vscode-edit-with-shell/master/images/animations/edit-and-run-command-history.gif)

## Commands

* `EditWithShell: Run command` (**Command ID:** `editWithShell.runCommand`)

    Show command history and let you select, modify & run a command

## Keyboard Shortcuts

You can quickly open a command input box by registering the extension command to your keyboard shortcut settings. For example:

```json
  { "key": "ctrl+r ctrl+r", "command": "editWithShell.runCommand",
                            "when": "editorTextFocus" }
```

## Request Features or Report Bugs

* https://github.com/ryu1kn/vscode-edit-with-shell/issues

## Changelog

* https://github.com/ryu1kn/vscode-edit-with-shell/blob/master/CHANGELOG.md
