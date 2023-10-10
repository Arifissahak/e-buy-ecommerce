function displaySidebar (){
    let sideBar = document.getElementById('admin-sidebar')
    
    if(sideBar.style.display === 'flex'){
        sideBar.style.display = 'none'
    }else{
        sideBar.style.display = 'flex'
    }
}