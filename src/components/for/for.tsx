import React from "react";

export const For = <T,>({ items, children }: { items: Array<T>, children: (item: T, index: number) => any }
) => <React.Fragment>{items.map(children)}</React.Fragment>