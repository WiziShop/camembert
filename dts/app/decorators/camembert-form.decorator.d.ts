import "reflect-metadata";
export declare const CamembertFormKey: symbol;
export declare function CamembertForm(middleware: (req, res, next, form: Object) => void): (target: Object) => void;
