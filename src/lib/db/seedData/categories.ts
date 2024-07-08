const Categories = (store: string, billboards: { uuid: string }[]) => {
    return [
        {
            storeUuid: store,
            billboardUuid: billboards[0].uuid,
            name: 'Puzzles',
            slug: 'puzzles',
            isSeeded: true,
        },
        {
            storeUuid: store,
            billboardUuid: billboards[1].uuid,
            name: 'Board Games',
            slug: 'board-games',
            isSeeded: true,
        },
        {
            storeUuid: store,
            billboardUuid: billboards[2].uuid,
            name: 'Robots',
            slug: 'robots',
            isSeeded: true,
        },
        {
            storeUuid: store,
            billboardUuid: billboards[3].uuid,
            name: 'Educational',
            slug: 'educational',
            isSeeded: true,
        },
    ]
}

export default Categories
