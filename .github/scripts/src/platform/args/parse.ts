export type ParsedArgs<T extends Array<string>> = {
    [K in T[number]]: string[]
}

export function parseArgs(argsList: string[]): ParsedArgs<['_']> & { [key: string]: string[] | undefined }
export function parseArgs<T extends Array<string>>(argsList: string[]): ParsedArgs<['_']> & ParsedArgs<T>
export function parseArgs<T extends Array<string>>(argsList: string[]): ParsedArgs<['_']> & ParsedArgs<T> {
    const args: ParsedArgs<['_']> = {
        _: [],
    }

    for (let i = 0; i < argsList.length; i++) {
        const completeSymbol = argsList[i]
        
        let dashes = 0
        if (completeSymbol.startsWith('--')) dashes = 2
        else if (completeSymbol.startsWith('-')) dashes = 1

        const strippedSymbol = completeSymbol.substring(dashes)

        if (dashes > 0) {
            if (!(strippedSymbol in args)) {
                args[strippedSymbol] = []
            }

            const nextSymbol = argsList[i+1]

            if (nextSymbol !== undefined && nextSymbol.startsWith('-')) {
                args[strippedSymbol].push('true')
            } else {
                args[strippedSymbol].push(nextSymbol)
                i++
            }
            continue
        }

        args._.push(strippedSymbol)
    }
    
    return args as ParsedArgs<['_']> & ParsedArgs<T>
}
