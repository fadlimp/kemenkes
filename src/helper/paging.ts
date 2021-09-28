import { QueryBuilder } from "objection";

export const createPaging = async (model:QueryBuilder<any>, pagingConfig) => {
    const {page=1, pageSize=30} = pagingConfig;

    let q = model;

    q.page(page-1, pageSize);

    const data:any = await q;

    return {
        data: data.results,
        total_data: data.total
    };
};
