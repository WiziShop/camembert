export class CamembertUtils {
    /**
     * Retrieve route parameters
     *
     * @param ControllerInstance
     * @param method
     * @returns {CamembertRouteRouteParameter[]}
     */
    static getRouteParameters(ControllerInstance, method) {
        const routeParams = [];
        const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
        const ARGUMENT_NAMES = /([^\s,]+)/g;
        function getParamNames(func) {
            const fnStr = func.toString().replace(STRIP_COMMENTS, '');
            let result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
            if (result === null)
                result = [];
            return result;
        }
        const parameters = getParamNames(method);
        const parameterTypes = Reflect.getMetadata('design:paramtypes', ControllerInstance, method.name);
        parameters.forEach((parameter, i) => {
            if (parameterTypes.hasOwnProperty(i)) {
                routeParams.push({
                    name: parameter,
                    type: parameterTypes[i]
                });
            }
        });
        return routeParams;
    }
}
//# sourceMappingURL=camembert-utils.js.map