
// 1 - wall
// 2 - steel wall
// 3 - trees
// 4 - water
module.exports.getMap = function()
{
    return [
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,2,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,2,2,0,0,0,0],
        [0,0,0,0,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0],
        [0,0,0,0,2,2,0,0,0,0,0,0,3,3,0,0,2,2,2,2,2,2,0,0,0,0],
        [0,0,0,0,2,2,0,0,0,0,0,0,3,3,0,0,0,0,2,2,2,2,0,0,0,0],
        [0,0,2,2,0,0,0,0,0,0,3,3,2,2,0,0,0,0,0,0,2,2,0,0,0,0],
        [0,0,2,2,0,0,0,0,0,0,3,3,2,2,0,0,0,0,0,0,2,2,0,0,0,0],
        [0,0,0,0,0,0,0,0,3,3,2,2,2,2,0,0,0,0,0,0,2,2,2,2,0,0],
        [0,0,0,0,0,0,0,0,3,3,2,2,2,2,0,0,0,0,0,0,0,0,2,2,0,0],
        [0,0,2,2,0,0,3,3,2,2,2,2,2,2,0,0,2,2,0,0,0,0,0,0,0,0],
        [0,0,2,2,0,0,3,3,2,2,2,2,2,2,0,0,2,2,0,0,0,0,0,0,0,0],
        [0,0,0,2,0,0,2,2,2,2,0,0,0,0,0,0,2,2,2,2,0,0,0,0,0,0],
        [0,0,0,2,0,0,2,2,2,2,0,0,0,0,0,0,2,2,2,2,0,0,0,0,0,0],
        [2,0,0,0,0,0,0,0,2,2,0,0,2,2,2,2,2,2,0,0,0,0,0,2,0,0],
        [2,0,0,0,0,0,0,0,2,2,0,0,2,2,2,2,2,2,0,0,0,0,0,2,0,0],
        [0,0,0,2,2,2,0,0,0,0,0,0,2,2,2,2,3,3,0,0,0,0,2,2,0,0],
        [0,0,0,2,2,2,0,0,0,0,0,0,2,2,2,2,3,3,0,0,0,0,2,2,0,0],
        [0,0,2,2,0,0,0,0,0,0,0,0,2,2,3,3,0,0,0,0,2,2,2,2,0,0],
        [0,0,2,2,0,0,0,0,0,0,0,0,2,2,3,3,0,0,0,0,2,2,2,2,0,0],
        [0,0,2,2,2,2,2,2,0,0,0,0,3,3,0,0,0,0,2,2,0,0,0,0,0,0],
        [0,0,0,0,0,0,2,2,0,0,0,0,3,3,0,0,0,0,2,2,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,2,2],
        [0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,2,2,0,0,2,2,2,2],
        [0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
        [2,2,2,2,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0]
    ];
};

module.exports.getEnemies = function()
{
    return [1,1,1,2,2,2,2,3,3,3,3,3,3,1,1,1,1,1,1,1];
};
