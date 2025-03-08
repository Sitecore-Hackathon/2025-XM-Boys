import { ComponentRendering } from "../../models/component";

export function filterPlaceholders(
    placeholderList: ComponentRendering[]
): ComponentRendering[] {
    let newList = [];
    for (const placeholder of placeholderList) {
        // Exclude experience editor placeholders from the list
        const ph = placeholder as any;
        if (ph.name != "code") {
            newList.push(placeholder);
        }
    }

    return newList;
}
