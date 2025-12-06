interface PrintInstance {
    (m?: string, v1?: any, v2?: any): void;
    data: any[];
    log(): void;
}

const createPrintInstance = (): PrintInstance => {
    let internalData: any[] = [];

    const callableFunction = (m?: string, v1?: any, v2?: any): void => {
        if (!v1 && !v2) {
            internalData.push({
                Message: m
            });
        } else if (v1 !== null && typeof v1 === 'object' && !v2) {
            internalData.push({
                Message: m,
                Value1: JSON.stringify(v1)
            });
        } else if (v1 !== null && typeof v1 === 'object' &&
            v2 !== null && typeof v2 === 'object') {
            internalData.push({
                Message: m,
                Value1: JSON.stringify(v1),
                Value2: JSON.stringify(v2)
            });
        } else if (!v2) {
            internalData.push({
                Message: m,
                Value1: v1
            });
        } else {
            internalData.push({
                Message: m,
                Value1: v1,
                Value2: v2
            });
        }
    }

    Object.defineProperty(callableFunction, 'data', {
        get() {
            return internalData;
        },
        set(newData: any[]) {
            internalData = newData;
        },
        enumerable: true,
        configurable: true
    });

    callableFunction.log = () => {
        if (internalData.length > 0) {
            console.table(internalData);
            internalData = []; // clear internal data after log() call
        } else {
            console.log("No information is currently loaded into the table.")
        }
    };

    return callableFunction as PrintInstance;
};

const Print = createPrintInstance();

export default Print;