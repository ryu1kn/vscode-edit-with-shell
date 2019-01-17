# Change Log

All notable changes to "Edit with Shell Command" extension will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2019-01-17
### Added
- Support multi cursors. [#11](https://github.com/ryu1kn/vscode-edit-with-shell/issues/11)

## [1.1.0] - 2018-12-26
### Added
- Introduced **Quick Command**. You can quickly run a pre-registered shell command with a keyboard shortcut. [#7](https://github.com/ryu1kn/vscode-edit-with-shell/issues/7)

## [1.0.1] - 2018-09-12
### Fixed
- Fixed the problem that entire text is passed to a command when `editWithShell.processEntireTextIfNoneSelected` is set to `true`.
  [#6](https://github.com/ryu1kn/vscode-edit-with-shell/issues/6)

## [1.0.0] - 2018-05-12
### Added
- Introduced a configuration to pass the entire text to the shell command if no text is selected. [#5](https://github.com/ryu1kn/vscode-edit-with-shell/issues/5)

## [0.4.0] - 2018-04-02
### Added
- Introduced a command to clear command history. [#4](https://github.com/ryu1kn/vscode-edit-with-shell/issues/4)

## [0.3.0] - 2018-02-13
### Added
- Support non-default shells. `bash` on Windows is now possible. [#1](https://github.com/ryu1kn/vscode-edit-with-shell/issues/1)

## [0.2.2] - 2018-02-09
### Fixed
- Fixed the problem that error messages were not shown on shell command failure if they contain certain character sequences. [#2](https://github.com/ryu1kn/vscode-edit-with-shell/issues/2)

## [0.2.1] - 2017-09-14
### Fixed
- Fixed the link to the gif animation

## [0.2.0] - 2016-12-07
### Added
- Introduced a configuration for choosing the current directory of shell command execution

## [0.1.0] - 2016-12-04
### Added
- Support command history. Edit and reuse past commands

## [0.0.1] - 2016-09-29
### Added
- Initial release of the extension
