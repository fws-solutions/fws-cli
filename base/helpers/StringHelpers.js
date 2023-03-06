export default class StringHelpers {
    static dashCaseToCamelCase(string) {
        return string.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
    }
}
