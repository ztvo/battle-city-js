
// 1 - wall
// 2 - steel wall
// 3 - trees
// 4 - water
// 5 - ice
module.exports.getMap = function()
{
    return [
        [0,0,5,5,5,5,5,5,5,5,5,5,0,0,5,5,5,5,5,5,5,5,5,5,0,0],
        [0,0,5,5,5,5,5,5,5,5,5,5,0,0,5,5,5,5,5,5,5,5,5,5,0,0],
        [5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5],
        [5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5],
        [5,5,5,5,5,5,1,1,5,5,5,5,5,5,5,5,5,5,1,1,5,5,5,5,5,5],
        [5,5,5,5,5,5,1,1,5,5,5,5,5,5,5,5,5,5,1,1,5,5,5,5,5,5],
        [5,5,1,1,0,0,1,1,0,0,1,1,5,5,1,1,0,0,1,1,0,0,1,1,5,5],
        [5,5,1,1,0,0,1,1,0,0,1,1,5,5,1,1,0,0,1,1,0,0,1,1,5,5],
        [5,5,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,5,5],
        [5,5,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,5,5],
        [5,5,5,5,5,5,1,1,0,0,1,1,2,2,1,1,0,0,1,1,5,5,5,5,5,5],
        [5,5,5,5,5,5,1,1,1,1,1,1,2,2,1,1,1,1,1,1,5,5,5,5,5,5],
        [2,2,5,5,5,5,5,5,0,0,2,2,0,0,2,2,0,0,5,5,5,5,5,5,2,2],
        [2,2,5,5,5,5,5,5,0,0,0,0,0,0,0,0,0,0,5,5,5,5,5,5,2,2],
        [5,5,5,5,5,5,5,5,0,0,0,0,0,0,0,0,0,0,5,5,5,5,5,5,5,5],
        [5,5,5,5,5,5,5,5,0,0,1,1,0,0,1,1,0,0,5,5,5,5,5,5,5,5],
        [5,5,5,5,5,5,5,5,0,0,1,1,0,0,1,1,0,0,5,5,5,5,5,5,5,5],
        [5,5,5,5,5,5,5,5,0,0,1,1,0,0,1,1,0,0,5,5,5,5,5,5,5,5],
        [5,5,5,5,5,5,1,1,0,0,0,0,0,0,0,0,0,0,1,1,5,5,5,5,5,5],
        [5,5,5,5,5,5,1,1,0,0,0,0,1,1,0,0,0,0,1,1,5,5,5,5,5,5],
        [5,5,1,1,5,5,1,1,0,0,2,2,2,2,2,2,0,0,1,1,5,5,1,1,5,5],
        [5,5,1,1,5,5,1,1,0,0,0,0,0,0,0,0,0,0,1,1,5,5,1,1,5,5],
        [0,0,1,1,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,0,0,1,1,0,0],
        [0,0,1,1,1,1,1,1,0,0,0,1,1,1,1,0,0,0,1,1,1,1,1,1,0,0],
        [0,0,1,1,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,1,1,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0]
    ];
};

module.exports.getEnemies = function()
{
    return [3,3,1,1,2,2,2,2,4,4,4,4,1,1,2,2,4,4,2,2]; //todo
};
