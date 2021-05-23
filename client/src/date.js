let date = new Date();
export const showDay = ()=>{
    var options = {
        weekday: "long",
    };
  
    return date.toLocaleDateString("en", options)
 
}

