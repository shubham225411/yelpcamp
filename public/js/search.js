let search=document.getElementById('search');
let search1=document.getElementById('search1');


search.addEventListener("input",(e)=>{
    console.log('submitting form');
    e.preventDefault();
    
    search.submit();
})

search1.addEventListener("input",(e)=>{
    console.log('submitting form');
    e.preventDefault();
    
    
})

