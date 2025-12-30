// export const calculateleetcodeScore = ({ easy, medium, hard }) => {
//     return easy * 200 + medium * 300 + hard * 400
// }

// export const calculategfgScore = ({ basic, easy, medium, hard }) => {
//     return basic * 100 + easy * 200 + medium * 300 + hard * 400
// }
// export const calculateCodeForcesScore = ({ solved, rating }) => {
//     let multiple = 100;
//     if (rating >= 1000) {
//         multiple = 300;
//     } else if (rating >= 600) {
//         multiple = 200;
//     }

//     return solved * multiple
// }





export const  calculateleetcodeScore = ({ easy, medium, hard }) => {
 
    const baseScore = easy * 100 + medium * 150 + hard * 200;
    return baseScore;
}


export const calculategfgScore = ({ basic, easy, medium, hard }) => {
    
    return basic * 100 + easy * 150 + medium * 200 + hard * 250;
}


export const calculateCodeForcesScore = ({ solved, rating }) => {
    
    const baseScore = solved * 200;

   
    const ratingBonus = rating >= 1050 ? baseScore * 0.1 : rating >= 600 ? baseScore * 0.05 : 0;

    return baseScore + ratingBonus;
}
