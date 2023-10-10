function swap(id){
    const main = document.getElementById('main')
    const child = document.getElementById(id)

   const temp = main.src 
   main.src = child.src 
   child.src = temp
    
}

