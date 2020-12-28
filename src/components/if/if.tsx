import React from "react";

export const If = ({ condition, children }: { condition: boolean, children: any }) => <React.Fragment>{condition && children}</React.Fragment>
