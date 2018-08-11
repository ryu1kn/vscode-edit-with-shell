
const OS_KIND = {
    darwin: 'osx',
    linux: 'linux',
    win32: 'windows'
};
const DEFAULT_OS_KIND = OS_KIND.linux;

export default (platform: string) => OS_KIND[platform] || DEFAULT_OS_KIND;
