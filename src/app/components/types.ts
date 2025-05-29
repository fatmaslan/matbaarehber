import {Category, Subcategory} from "../../../types";

export interface CategoryWithSubs extends Category {
    subcategories: Subcategory[];
}