[![Build Status](https://travis-ci.org/ryu1kn/vscode-edit-with-shell.svg?branch=master)](https://travis-ci.org/ryu1kn/vscode-edit-with-shell) [![Code Climate](https://codeclimate.com/github/ryu1kn/vscode-edit-with-shell/badges/gpa.svg)](https://codeclimate.com/github/ryu1kn/vscode-edit-with-shell)

# Edit with Shell Command

Leverage your favourite shell commands to edit text.

## Features

* Edit the selected text by piping it through shell commands.
* Insert the output of shell commands at the cursor position.
* Records command history: you can edit and reuse past commands.
* Use the shell you like. For example, if you have Bash on Windows, you can specify Bash as your shell for this extension.

![Edit with Shell Command](https://raw.githubusercontent.com/ryu1kn/vscode-edit-with-shell/master/images/animations/public.gif)

![Insert command output](https://raw.githubusercontent.com/ryu1kn/vscode-edit-with-shell/master/images/animations/insert-command-output.gif)

![Edit and reuse past commands](https://raw.githubusercontent.com/ryu1kn/vscode-edit-with-shell/master/images/animations/edit-and-run-command-history.gif)

## Commands

* `EditWithShell: Run command` (**Command ID:** `editWithShell.runCommand`)

    Show command history and let you select, modify & run a command

* `EditWithShell: Clear Command History` (**Command ID:** `editWithShell.clearCommandHistory`)

    Clear command history

## Configurations

* `editWithShell.currentDirectoryKind` (default: `"currentFile"`)

    Current directory for shell commands. If the target directory is not available, HOME directory will be used. Possible values: `currentFile` or `workspaceRoot`
    
* `editWithShell.processEntireTextIfNoneSelected` (default: `false`)

    Pipe the entire text to the shell command if no text is selected

* `editWithShell.shell.linux` (default: `"/bin/sh"`)

    The path of the shell that this extension uses on Linux

* `editWithShell.shellArgs.linux` (default: `["-c"]`)

    Arguments to the shell to be used on Linux

* `editWithShell.shell.osx` (default: `"/bin/sh"`)

    The path of the shell that this extension uses on macOS

* `editWithShell.shellArgs.osx` (default: `["-c"]`)

    Arguments to the shell to be used on macOS

* `editWithShell.shell.windows` (default: `"cmd.exe"`)

    The path of the shell that this extension uses on Windows

* `editWithShell.shellArgs.windows` (default: `["/d", "/s", "/c"]`)

    Arguments to the shell to be used on Winows

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
