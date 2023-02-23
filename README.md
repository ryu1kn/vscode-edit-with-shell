[![Build Status](https://travis-ci.org/ryu1kn/vscode-edit-with-shell.svg?branch=master)](https://travis-ci.org/ryu1kn/vscode-edit-with-shell) [![Code Climate](https://codeclimate.com/github/ryu1kn/vscode-edit-with-shell/badges/gpa.svg)](https://codeclimate.com/github/ryu1kn/vscode-edit-with-shell)

# Edit with Shell Command

Leverage your favourite shell commands to edit text.

## Features

* Edit the selected text by piping it through shell commands.
  The same text is also available as an environment variable, `ES_SELECTED`.
* The path of the current file is available as an environment variable, `ES_FILEPATH`.
* Insert the output of shell commands at the cursor position.
* Records command history: you can edit and reuse past commands.
* Use the shell you like. For example, if you have Bash on Windows, you can specify Bash as your shell for this extension.
* Register up to 25 quick commands that can be invoked by keyboard shortcuts.
* Support multi cursors.

![Edit with Shell Command](https://raw.githubusercontent.com/ryu1kn/vscode-edit-with-shell/master/images/animations/public.gif)

![Insert command output](https://raw.githubusercontent.com/ryu1kn/vscode-edit-with-shell/master/images/animations/insert-command-output.gif)

![Edit and reuse past commands](https://raw.githubusercontent.com/ryu1kn/vscode-edit-with-shell/master/images/animations/edit-and-run-command-history.gif)

## Request Features or Report Bugs

Feature requests and bug reports are very welcome: https://github.com/ryu1kn/vscode-edit-with-shell/issues

A couple of requests from me when you raise an github issue.

* **Requesting a feature:** Please try to provide the context of why you want the feature. Such as, in what situation the feature could help you and how, or how the lack of the feature is causing an inconvenience to you. I can't think of introducing it until I understand how it helps you 🙂
* **Reporting a bug:** Please include environment information (OS name/version, the editor version). Also consider providing screenshots (or even videos) where appropriate. They are often very very helpful!

## Commands

* `EditWithShell: Run command` (**Command ID:** `editWithShell.runCommand`)

    Show command history and let you select, modify & run a command

* `EditWithShell: Clear Command History` (**Command ID:** `editWithShell.clearCommandHistory`)

    Clear command history

* `EditWithShell: Run quick command 1` (**Command ID:** `editWithShell.runQuickCommand1`)

    Run quick command 1. **You have quick commands up to 25**, i.e. `editWithShell.runQuickCommand25`

## Configurations

* `editWithShell.currentDirectoryKind` (default: `"currentFile"`)

    Current directory for shell commands. If the target directory is not available, HOME directory will be used. Possible values: `currentFile` or `workspaceRoot`

* `editWithShell.processEntireTextIfNoneSelected` (default: `false`)

    Pipe the entire text to the shell command if no text is selected (it can be overridden on a per command basis)

* `editWithShell.promptModifyCommand` (default: `true`)

    Display a prompt to modify the selected command

* `editWithShell.favoriteCommands` (default: `[]`)

    Commands listed by default in the history and activable by quick commands. Each element must have a property `command`. In order to be used as a quick command, the property `id` must be set. Also, it can optionally have the boolean property `processEntireTextIfNoneSelected` (it'll override the extension setting `editWithShell.processEntireTextIfNoneSelected`).

    ```
    "editWithShell.favoriteCommands": [
      {
        "command": "cut -d, -f3 | sort",
        "processEntireTextIfNoneSelected": true
      },
      {
        "id": "insert-melbourne-time",
        "command": "TZ=Australia/Melbourne date '+%Y-%m-%dT%H:%M:%S'"
      },
      ...
    ]
    ```

* `editWithShell.quickCommand1` (default: `""`)

    ID of a favorite command triggered with quick command 1. e.g. `"insert-melbourne-time"` of `favoriteCommands` config value example.

    **You have quick commands up to 25**, i.e. `editWithShell.quickCommand25`.

* `editWithShell.clearFavoriteCommands` (default: `true`)

    When clearing command history, clear also favorite commands

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

    * For PowerShell, you may set this to `"pwsh"`
    * For Bash on WSL (Windows Subsystem for Linux), you may set this to `"wsl"`

* `editWithShell.shellArgs.windows` (default: `["/d", "/s", "/c"]`)

    Arguments to the shell to be used on Winows

    * For PowerShell, you may set this to `["-NoLogo", "-NoProfile", "-Command"]`
    * For Bash on WSL (Windows Subsystem for Linux), you may set this to `["bash", "-c"]`

## Keyboard Shortcuts

You can quickly open a command input box by registering the extension command to your keyboard shortcut settings. For example:

```
  { "key": "ctrl+r ctrl+r", "command": "editWithShell.runCommand",
                            "when": "editorTextFocus && !editorReadonly" },
  { "key": "ctrl+r ctrl+1", "command": "editWithShell.runQuickCommand1",
                            "when": "editorTextFocus && !editorReadonly" },
```

## Changelog

* https://github.com/ryu1kn/vscode-edit-with-shell/blob/master/CHANGELOG.md
