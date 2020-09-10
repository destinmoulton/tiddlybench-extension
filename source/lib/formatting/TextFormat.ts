import { IFormatMap } from "../../types";
const TEXT_FORMAT_MAP: IFormatMap = {
    LINE_BREAK: "\n",
};

export default function textformat(inputString: string): string {
    const formatKeys = Object.keys(TEXT_FORMAT_MAP);

    let newString = inputString;
    for (let key of formatKeys) {
        newString += newString.replaceAll(key, TEXT_FORMAT_MAP[key]);
    }
    return newString;
}
