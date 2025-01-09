const DEFAULT_ITEMS = [
    {
        "id": "1",
        "name": "Basketball",
        "category": "Basketball"
    },
    {
        "id": "2",
        "name": "Soccer Ball",
        "category": "Soccer"
    },
    {
        "id": "3",
        "name": "Tennis Racket",
        "category": "Tennis"
    },
    {
        "id": "4",
        "name": "Volleyball",
        "category": "Volleyball"
    },
    {
        "id": "5",
        "name": "Stopwatch",
        "category": "Track"
    }
];

const DEFAULT_PLATEAUS = [
    {
        "id": "p1",
        "name": "Terrain de Basket-ball",
        "description": "Terrain de basket-ball transformable en terrain de volley-ball",
        "maxCapacity": 10,
        "allowedItems": [
            "1", "4", "5"
        ]
    },
    {
        "id": "p2",
        "name": "Terrain de soccer",
        "description": "Terrain de soccer extérieur",
        "maxCapacity": 22,
        "allowedItems": [
            "2", "5"
        ]
    },
    {
        "id": "p3",
        "name": "Terrain de tennis",
        "description": "Terrain de tennis illuminé",
        "maxCapacity": 4,
        "allowedItems": [
            "3", "5"
        ]
    }
];

module.exports = { DEFAULT_ITEMS, DEFAULT_PLATEAUS };