var sum = (result: number, element: number, index: number, array: number[]): number => {
    var value = (element !== undefined) ? element : 0;

    return result + parseInt(value.toString());
};

export function calculateSumFromProperty<TElement>(items: TElement[], property: (ofItem: TElement) => number){
    var result = items
        .map(property)
        .reduce(sum, 0);

    return isNaN(result) ? 0 : result;
};